import React, { useState } from 'react';
import { 
  Download, 
  Printer, 
  Copy, 
  Check, 
  FileCode, 
  FileText, 
  Share2,
  FileCheck
} from 'lucide-react';
import { PatentSpecification } from '../types';
import { 
  exportLatexFile, 
  exportWordDocument, 
  exportPlainText 
} from '../utils/exportHelpers';

interface ExportToolbarProps {
  spec: PatentSpecification;
  onPrint: () => void;
}

export const ExportToolbar: React.FC<ExportToolbarProps> = ({ spec, onPrint }) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleCopyClaims = () => {
    const claimsText = (spec.claims || []).map(c => `${c.number}. ${c.text}`).join('\n\n');
    navigator.clipboard.writeText(claimsText);
    setCopiedType('claims');
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(spec.latexCode);
    setCopiedType('latex');
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 no-print">
      <div>
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
          <FileCheck className="w-4 h-4 text-emerald-600" />
          <span>Patent Office Submission & Export Formats</span>
        </h4>
        <p className="text-xs text-slate-500 mt-0.5">
          Download compile-ready LaTeX, Form 2 Word document, or print official examination PDF
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        {/* Download LaTeX */}
        <button
          onClick={() => exportLatexFile(spec)}
          id="btn-export-latex"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium transition-all shadow-xs"
          title="Download complete .tex file for Overleaf / TeXLive"
        >
          <FileCode className="w-3.5 h-3.5 text-emerald-400" />
          <span>Download LaTeX (.tex)</span>
        </button>

        {/* Download Word DOC */}
        <button
          onClick={() => exportWordDocument(spec)}
          id="btn-export-word"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-medium transition-colors"
          title="Download Microsoft Word .doc formatted specification"
        >
          <FileText className="w-3.5 h-3.5 text-blue-600" />
          <span>Download Word (.doc)</span>
        </button>

        {/* Download Plain Text */}
        <button
          onClick={() => exportPlainText(spec)}
          id="btn-export-txt"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium transition-colors"
          title="Download plain text .txt"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Plain Text (.txt)</span>
        </button>

        {/* Print / Save PDF */}
        <button
          onClick={onPrint}
          id="btn-print-pdf"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium transition-colors"
          title="Print or Save as Official PDF with 1-inch margins"
        >
          <Printer className="w-3.5 h-3.5 text-slate-600" />
          <span>Print / PDF</span>
        </button>

        {/* Copy Claims */}
        <button
          onClick={handleCopyClaims}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors"
        >
          {copiedType === 'claims' ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Claims Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Claims</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
