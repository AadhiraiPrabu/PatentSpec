import React from 'react';
import { X, BookOpen, ArrowRight, FileText, Check } from 'lucide-react';
import { SAMPLE_PAPERS, SamplePaper } from '../data/samplePapers';

interface SamplePapersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample: (sample: SamplePaper) => void;
}

export const SamplePapersModal: React.FC<SamplePapersModalProps> = ({
  isOpen,
  onClose,
  onSelectSample
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-3xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Load Example Professor Research Papers
              </h3>
              <p className="text-xs text-slate-500">
                Select a realistic academic paper draft to test the patent formatting engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <p className="text-xs text-slate-600">
            College professors frequently submit academic conference and journal papers when attempting to file a patent. Select one of these realistic drafts below:
          </p>

          <div className="grid grid-cols-1 gap-3">
            {SAMPLE_PAPERS.map((paper) => (
              <div
                key={paper.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer"
                onClick={() => {
                  onSelectSample(paper);
                  onClose();
                }}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {paper.domain}
                    </span>
                    <span className="text-xs text-slate-500">{paper.collegeDept}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {paper.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {paper.description}
                  </p>
                  <div className="text-[11px] text-slate-400">
                    <strong>Authors:</strong> {paper.authors}
                  </div>
                </div>

                <button
                  type="button"
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white group-hover:bg-indigo-600 transition-colors shadow-xs"
                >
                  <span>Load Paper</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
