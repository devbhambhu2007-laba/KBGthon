import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Layout({ children }) {
  return (
    <>
      <header className="bg-surface border-b border-outline-variant sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto h-16">
          <div className="flex items-center gap-md">
            <NavLink to="/">
              <span className="text-headline-md font-headline-md text-primary tracking-tight cursor-pointer">AMR Clinical Portal</span>
            </NavLink>
          </div>
          
          <nav className="hidden md:flex items-center gap-lg h-full">
            <NavLink 
              to="/" 
              className={({isActive}) => `h-full flex items-center transition-colors ${isActive ? 'text-primary border-b-2 border-primary pb-1 font-bold pt-1' : 'text-on-surface-variant font-medium hover:text-primary pt-1'}`}
            >
              Home
            </NavLink>
            <NavLink 
              to="/assessment" 
              className={({isActive}) => `h-full flex items-center transition-colors ${isActive ? 'text-primary border-b-2 border-primary pb-1 font-bold pt-1' : 'text-on-surface-variant font-medium hover:text-primary pt-1'}`}
            >
              Assessment
            </NavLink>
            <NavLink 
              to="/learn" 
              className={({isActive}) => `h-full flex items-center transition-colors px-1 ${isActive ? 'text-primary border-b-2 border-primary pb-1 font-bold pt-1' : 'text-on-surface-variant font-medium hover:text-primary pt-1'}`}
            >
              Learn
            </NavLink>
          </nav>

          <div className="flex items-center gap-md">
            <button className="hidden md:inline-flex items-center justify-center border border-outline px-md py-sm rounded text-label-md font-label-md text-primary hover:bg-surface-container-low transition-colors scale-95 duration-150 cursor-pointer">
              Emergency Guidelines
            </button>
            <button className="inline-flex items-center justify-center bg-primary-container text-on-primary px-md py-sm rounded text-label-md font-label-md hover:bg-primary transition-colors scale-95 duration-150 cursor-pointer">
              Sign In
            </button>
            <button className="text-primary hover:text-primary transition-colors scale-95 duration-150 flex items-center justify-center cursor-pointer">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-[1440px] mx-auto">
        {children}
      </main>

      <footer className="bg-surface-container-low border-t border-outline-variant mt-auto">
        <div className="w-full py-xl px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter max-w-[1440px] mx-auto">
          <div className="flex flex-col gap-sm col-span-1 md:col-span-2 lg:col-span-1">
            <span className="text-label-md font-label-md font-bold text-primary mb-md block">AMR Clinical Portal</span>
            <p className="text-body-sm font-body-sm text-on-surface-variant">© 2024 AMR Awareness Initiative. Professional Clinical Resource.</p>
          </div>
          
          <div className="flex flex-col gap-sm">
            <a className="text-body-sm font-body-sm text-on-surface-variant hover:text-secondary transition-opacity duration-200" href="#">Medical Disclaimer</a>
            <a className="text-body-sm font-body-sm text-on-surface-variant hover:text-secondary transition-opacity duration-200" href="#">Privacy Policy</a>
          </div>
          
          <div className="flex flex-col gap-sm">
            <a className="text-body-sm font-body-sm text-on-surface-variant hover:text-secondary transition-opacity duration-200" href="#">Terms of Service</a>
            <a className="text-body-sm font-body-sm text-on-surface-variant hover:text-secondary transition-opacity duration-200" href="#">Contact Support</a>
          </div>
          
          <div className="flex flex-col gap-sm">
            <a className="text-body-sm font-body-sm text-on-surface-variant hover:text-secondary transition-opacity duration-200" href="#">WHO Guidelines</a>
          </div>
        </div>
      </footer>
    </>
  );
}
