import os
import asyncio
from dotenv import load_dotenv
from .models import ExplanationResponse
from .safety_filter import filter_output

SYSTEM_PROMPT = """You generate a short, plain-language explanation of antimicrobial resistance risk for a general audience.
You will be given: a risk score, a list of triggered risk reasons, and a paraphrased public-health guideline snippet for each reason.
Rules:
- Under 100 words.
- Do not diagnose any illness as bacterial or viral.
- Do not name or suggest any antibiotic, drug, or dosage.
- Do not give any treatment instruction.
- Always end with: "Please consult a registered medical practitioner."
- Explain only why the reported behavior is associated with antimicrobial resistance, based on the provided guideline snippet."""

STRICTER_FALLBACK_PROMPT = SYSTEM_PROMPT + "\nCRITICAL: You must not mention any medication name, dosage, or diagnostic statement under any circumstances. Respond ONLY about behavioral risk factors."

STATIC_FALLBACK = "Based on the assessment, your antibiotic usage patterns may contribute to antimicrobial resistance risk. Please consult a registered medical practitioner for personalized guidance."
DISCLAIMER = "This application is not a diagnostic tool. It cannot identify bacterial infection or prescribe treatment. Always consult a registered medical practitioner."


def _build_user_prompt(score, category, reasons, snippets):
    """Build the user prompt from assessment data."""
    user_prompt = f"Risk Score: {score}/10 ({category} Risk)\nTriggered Risk Factors:\n"
    for r in reasons:
        user_prompt += f"- {r.description} (+{r.weight} pts)\n"
    user_prompt += "\nRelevant WHO/CDC/ICMR Guidelines:\n"
    for ref_id, snippet in snippets.items():
        user_prompt += f"[{ref_id}]: {snippet}\n"
    return user_prompt


async def _try_gemini(user_prompt, system_prompt):
    """Try generating with Gemini API."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None
    
    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        
        for attempt in range(2):
            try:
                response = client.models.generate_content(
                    model='gemini-2.0-flash-lite',
                    contents=user_prompt,
                    config=genai.types.GenerateContentConfig(
                        system_instruction=system_prompt,
                    )
                )
                return response.text
            except Exception as e:
                if '429' in str(e) or 'RESOURCE_EXHAUSTED' in str(e):
                    if attempt == 0:
                        print(f"DEBUG [Gemini]: Rate limited, retrying in 5s...")
                        await asyncio.sleep(5)
                        continue
                raise e
    except Exception as e:
        print(f"DEBUG [Gemini]: Failed - {e}")
    return None


async def _try_groq(user_prompt, system_prompt):
    """Try generating with Groq API (free tier, very generous limits)."""
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return None
    
    try:
        from groq import Groq
        client = Groq(api_key=api_key)
        
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.3,
            max_tokens=200
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"DEBUG [Groq]: Failed - {e}")
    return None


async def _generate_with_provider(user_prompt, system_prompt):
    """Try Gemini first, then Groq as fallback."""
    # Try Gemini
    result = await _try_gemini(user_prompt, system_prompt)
    if result:
        print("DEBUG: Generated via Gemini")
        return result
    
    # Try Groq
    result = await _try_groq(user_prompt, system_prompt)
    if result:
        print("DEBUG: Generated via Groq")
        return result
    
    return None


async def generate_explanation(score: float, category: str, reasons: list, snippets: dict) -> ExplanationResponse:
    user_prompt = _build_user_prompt(score, category, reasons, snippets)

    try:
        # Attempt 1: Primary prompt
        explanation_text = await _generate_with_provider(user_prompt, SYSTEM_PROMPT)
        
        if explanation_text:
            filtered_text = filter_output(explanation_text)
            if filtered_text:
                return ExplanationResponse(explanation=filtered_text, disclaimer=DISCLAIMER, filtered=False)
            print("DEBUG: First output failed safety filter, retrying with stricter prompt")
        
        # Attempt 2: Stricter prompt
        retry_text = await _generate_with_provider(user_prompt, STRICTER_FALLBACK_PROMPT)
        
        if retry_text:
            filtered_retry = filter_output(retry_text)
            if filtered_retry:
                return ExplanationResponse(explanation=filtered_retry, disclaimer=DISCLAIMER, filtered=False)
            print("DEBUG: Second output also failed safety filter")
        
        print("DEBUG: All LLM attempts failed. Returning static fallback.")
        return ExplanationResponse(explanation=STATIC_FALLBACK, disclaimer=DISCLAIMER, filtered=True)

    except Exception as e:
        print(f"DEBUG: Exception: {e}")
        return ExplanationResponse(explanation=STATIC_FALLBACK, disclaimer=DISCLAIMER, filtered=True)
