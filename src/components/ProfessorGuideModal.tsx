import React from 'react';
import { X, BookOpen, AlertCircle, CheckCircle2, Scale, FileText } from 'lucide-react';

interface ProfessorGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfessorGuideModal: React.FC<ProfessorGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-3xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Academic Paper vs. Patent Office Specification: Essential Guide
              </h3>
              <p className="text-xs text-slate-500">
                Why professors' papers get rejected by Patent Examiners and how PatentSpec solves it
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
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed">
          {/* Section 1: Major Differences Comparison Table */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900">
              Key Differences: Research Paper vs. Patent Office Specification
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 border-b border-slate-200 font-semibold">
                    <th className="p-2.5">Component</th>
                    <th className="p-2.5 text-red-700">Academic Paper (Rejected in Patent Office)</th>
                    <th className="p-2.5 text-emerald-700">Official Patent Office Format</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2.5 font-semibold">Title</td>
                    <td className="p-2.5 text-slate-600">Catchy, promotional ("A Novel Deep Approach...")</td>
                    <td className="p-2.5 text-slate-900 font-medium">Objective, technical ("AN INTELLIGENT SYSTEM AND METHOD FOR...")</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold">Literature Review</td>
                    <td className="p-2.5 text-slate-600">Citations [1], [2], names like "Patel et al. proposed"</td>
                    <td className="p-2.5 text-slate-900 font-medium">Prior Art Limitations: describes technical bottlenecks without citations</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold">Paragraphs</td>
                    <td className="p-2.5 text-slate-600">Standard prose, headings like "Methodology", "Results"</td>
                    <td className="p-2.5 text-slate-900 font-medium">Sequential paragraph numbers [0001], [0002] for examiner citations</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold">Claims</td>
                    <td className="p-2.5 text-slate-600">Non-existent or narrative summaries</td>
                    <td className="p-2.5 text-slate-900 font-medium">Statutory Single-Sentence claims ("1. A system comprising...;") defining monopoly</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold">Abstract</td>
                    <td className="p-2.5 text-slate-600">200-300 words describing study goals & future work</td>
                    <td className="p-2.5 text-slate-900 font-medium">Strictly under 150 words with drawing numerals in parentheses (100)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold">Drawings</td>
                    <td className="p-2.5 text-slate-600">Graphs, screenshots, decorative diagrams</td>
                    <td className="p-2.5 text-slate-900 font-medium">FIG. 1, FIG. 2 with assigned reference numerals (100, 102, 104)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Form 2 Indian Patent Office Rules */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Indian Patent Office (IPO) Form 2 Specifics:
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Must start with the statutory Preamble: <em>"The following specification particularly describes the invention and the manner in which it is to be performed."</em></li>
              <li>Must include distinct "Objects of the Invention" section highlighting principal and secondary utility.</li>
              <li>Claims must start on a fresh page with the statutory heading <strong>"WE CLAIM:"</strong>.</li>
            </ul>
          </div>

          {/* Section 3: The Single-Sentence Claim Rule */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2 text-amber-950">
            <h4 className="text-xs font-bold uppercase tracking-wide flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              <span>The Strict "Single-Sentence Rule" for Claims:</span>
            </h4>
            <p>
              In patent law worldwide, each claim must be a single grammatical sentence beginning with a capital letter and ending with a single terminating period (.). Sub-elements are separated by colons and semicolons (;). Any stray period inside the body of a claim results in an instant formal objection.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
