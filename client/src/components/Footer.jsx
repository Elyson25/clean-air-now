import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-slate-200 py-6 px-6 md:px-12 mt-auto box-border">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="text-center md:text-left">
          <span className="text-sm font-bold text-slate-900 tracking-tight block">
            Clean Air Now
          </span>
          <p className="text-xs text-slate-400 mt-0.5">
            © {new Date().getFullYear()} Monitoring ecosystems, protecting urban air spheres.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs">
          <span className="text-slate-400 font-medium cursor-default">Sensors Registry</span>
          <Link to="/community-guidelines" className="text-slate-500 font-medium hover:text-slate-900 transition-colors no-underline">
            Community Guidelines
          </Link>
          <Link to="/privacy-policy" className="text-slate-500 font-medium hover:text-slate-900 transition-colors no-underline">
            Privacy Policy
          </Link>
          <span className="text-emerald-600 font-bold flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            API Live
          </span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
