import React, { useState } from 'react';
import { Copy, Check, Download, ExternalLink, Terminal, Sparkles, BookOpen } from 'lucide-react';
import { PatentSpecification } from '../types';
import { exportLatexFile } from '../utils/exportHelpers';

interface LatexViewerProps {
  spec: PatentSpecification;
  onUpdateLatex?: (newLatex: string) => void;
}

export const LatexViewer: React.FC<LatexViewerProps> = ({ spec, onUpdateLatex }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [editable, setEditable] = useState<boolean>(false);
  const [latexCode, setLatexCode] = useState<string>(spec.latexCode);

  const handleCopy = () => {
    navigator.clipboard.writeText(latexCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    exportLatexFile({ ...spec, latexCode });
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLatexCode(e.target.value);
    if (onUpdateLatex) {
      onUpdateLatex(e.target.value);
    }
  };

  const lines = latexCode.split('\n');

  return (
    <div className="space-y-4">
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-900 text-white rounded-xl shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs">
            TeX
          </div>
          <div>
            <div className="text-xs font-semibold flex items-center gap-1.5">
              <span>Official Patent LaTeX Source</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                {lines.length} lines
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Compile-ready for Overleaf, TeXLive, and MiKTeX with 1-inch margins & patent line numbers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setEditable(!editable)}
            className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
              editable
                ? 'bg-amber-400 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {editable ? 'Lock View' : 'Edit Source'}
          </button>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors font-medium"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy TeX</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .tex</span>
          </button>
        </div>
      </div>

      {/* Code Display or Editable Area */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-2 text-slate-300">patent_specification.tex</span>
          </div>
          <span>UTF-8 • LaTeX 2e</span>
        </div>

        {editable ? (
          <textarea
            value={latexCode}
            onChange={handleCodeChange}
            rows={28}
            className="w-full p-4 bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-emerald-500/50 resize-y"
            spellCheck={false}
          />
        ) : (
          <div className="p-4 overflow-x-auto max-h-[600px] overflow-y-auto">
            <pre className="font-mono text-xs text-slate-200 leading-relaxed">
              {lines.map((line, idx) => {
                const isComment = line.trim().startsWith('%');
                const isSection = line.trim().startsWith('\\section') || line.trim().startsWith('\\begin');
                const isItem = line.trim().startsWith('\\item');

                let lineClass = 'text-slate-300';
                if (isComment) lineClass = 'text-slate-500 italic';
                else if (isSection) lineClass = 'text-amber-400 font-bold';
                else if (isItem) lineClass = 'text-emerald-400';

                return (
                  <div key={idx} className="flex hover:bg-slate-900/60 py-0.5 px-1 rounded">
                    <span className="text-slate-600 select-none w-10 shrink-0 text-right pr-4">
                      {idx + 1}
                    </span>
                    <span className={lineClass}>{line}</span>
                  </div>
                );
              })}
            </pre>
          </div>
        )}
      </div>

      {/* Professor Tips for LaTeX Patent Compilation */}
      <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
        <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-slate-700" />
          <span>Quick Overleaf / TeX Compilation Guide for Professors:</span>
        </h4>
        <ul className="list-disc pl-5 space-y-1 text-slate-600">
          <li>
            <strong>Overleaf:</strong> Create a blank project, replace <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-900">main.tex</code> with this code, and click <strong>Recompile</strong>.
          </li>
          <li>
            <strong>Standard Margins:</strong> The <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-900">\usepackage[margin=25.4mm]&#123;geometry&#125;</code> package enforces the statutory 1-inch border required by IPO and USPTO examiners.
          </li>
          <li>
            <strong>Patent Line Numbers:</strong> Enabled via <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-900">\usepackage&#123;lineno&#125;</code> to allow examiners to refer to specific lines in their First Examination Report (FER).
          </li>
        </ul>
      </div>
    </div>
  );
};
