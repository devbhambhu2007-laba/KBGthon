import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Layout({ children }) {
  return (
    <>
      <nav className="bg-surface border-b border-outline-variant sticky top-0 z-50 w-full flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 mx-auto">
        <div className="flex items-center gap-lg cursor-pointer max-w-[1440px]">
          <span className="text-headline-md font-headline-md text-primary tracking-tight">AMR Clinical Portal</span>
        </div>
        
        <div className="hidden md:flex items-center gap-lg h-full">
          {[
            { path: '/', label: 'Home' },
            { path: '/assessment', label: 'Assessment' },
            { path: '/learn', label: 'Learn' }
          ].map(item => (
            <NavLink 
              key={item.path}
              to={item.path} 
              className={({isActive}) => `
                font-medium hover:text-primary transition-colors hover:scale-95 duration-150 text-label-md font-label-md
                ${isActive ? 'text-primary border-b-2 border-primary pb-1 font-bold' : 'text-on-surface-variant'}
              `}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-sm">
          <button className="hidden lg:flex text-label-md font-label-md text-secondary border border-secondary px-4 py-2 rounded hover:bg-secondary-fixed-dim transition-colors cursor-pointer">
            Emergency Guidelines
          </button>
          <button className="text-label-md font-label-md bg-primary text-on-primary px-4 py-2 rounded hover:bg-primary-container transition-colors shadow-sm cursor-pointer">
            Sign In
          </button>
        </div>
      </nav>

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
