import React from 'react';
import { FileText, BookOpen, Sparkles, Scale, Info } from 'lucide-react';
import { PatentOffice } from '../types';

interface NavbarProps {
  jurisdiction: PatentOffice;
  onJurisdictionChange: (jurisdiction: PatentOffice) => void;
  onOpenSamples: () => void;
  onOpenGuide: () => void;
  hasResult: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  jurisdiction,
  onJurisdictionChange,
  onOpenSamples,
  onOpenGuide,
  hasResult
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-md">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-bold text-slate-900 tracking-tight">
                  PatentSpec
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-50 text-amber-800 border border-amber-200">
                  Academic to Patent
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Official Patent Office Specification & LaTeX Compiler for College Professors
              </p>
            </div>
          </div>

          {/* Center / Right controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Sample Selector */}
            <button
              onClick={onOpenSamples}
              id="btn-sample-papers"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Load example professor papers"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-600" />
              <span>Sample Papers</span>
            </button>

            {/* Professor Patent Guide */}
            <button
              onClick={onOpenGuide}
              id="btn-professor-guide"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Info className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Patent Format Guide</span>
            </button>

            <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

            {/* Jurisdiction Selector */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              {(['IPO', 'USPTO', 'PCT', 'EPO'] as PatentOffice[]).map((office) => (
                <button
                  key={office}
                  onClick={() => onJurisdictionChange(office)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                    jurisdiction === office
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title={`${office} Patent Format`}
                >
                  {office === 'IPO' ? 'IPO (Form 2)' : office}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
