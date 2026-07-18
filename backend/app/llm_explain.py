import os
from google import genai
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

async def generate_explanation(score: float, category: str, reasons: list, snippets: dict) -> ExplanationResponse:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("DEBUG: API Key not found")
        return ExplanationResponse(explanation=STATIC_FALLBACK, disclaimer=DISCLAIMER, filtered=True)
    
    client = genai.Client(api_key=api_key)
    
    user_prompt = f"Risk Score: {score} ({category})\nReasons:\n"
    for r in reasons:
        user_prompt += f"- {r.description}\n"
    user_prompt += "\nGuidelines Snippets:\n"
    for ref_id, snippet in snippets.items():
        user_prompt += f"[{ref_id}]: {snippet}\n"

    try:
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=user_prompt,
            config=genai.types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
            )
        )
        explanation_text = response.text
        
        filtered_text = filter_output(explanation_text)
        if filtered_text:
            return ExplanationResponse(explanation=filtered_text, disclaimer=DISCLAIMER, filtered=False)
            
        print("DEBUG: First output filtered, retrying with stricter prompt")
        retry_response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=user_prompt,
            config=genai.types.GenerateContentConfig(
                system_instruction=STRICTER_FALLBACK_PROMPT,
            )
        )
        retry_explanation = retry_response.text
        filtered_retry_text = filter_output(retry_explanation)
        
        if filtered_retry_text:
            return ExplanationResponse(explanation=filtered_retry_text, disclaimer=DISCLAIMER, filtered=False)
            
        print("DEBUG: Second output also filtered. Returning static fallback.")
        return ExplanationResponse(explanation=STATIC_FALLBACK, disclaimer=DISCLAIMER, filtered=True)

    except Exception as e:
        print(f"DEBUG: Exception during API call: {e}")
        return ExplanationResponse(explanation=STATIC_FALLBACK, disclaimer=DISCLAIMER, filtered=True)
