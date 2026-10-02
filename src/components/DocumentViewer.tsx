import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Edit3, 
  Eye, 
  Layers, 
  Tag, 
  Printer, 
  FileText,
  HelpCircle,
  Hash
} from 'lucide-react';
import { PatentSpecification, PatentClaim } from '../types';

interface DocumentViewerProps {
  spec: PatentSpecification;
  onUpdateSpec: (updated: PatentSpecification) => void;
  onPrint: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  spec,
  onUpdateSpec,
  onPrint
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [highlightNumerals, setHighlightNumerals] = useState<boolean>(true);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const jurisdiction = spec.metadata?.jurisdiction || 'IPO';
  const isIPO = jurisdiction === 'IPO';
  const isUSPTO = jurisdiction === 'USPTO';

  const copyToClipboard = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // Helper to highlight drawing reference numerals like 100, 102, 104 in text
  const renderTextWithNumerals = (text: string) => {
    if (!highlightNumerals) return text;

    // Matches numbers enclosed like 100, 102, or (100) or [100]
    const parts = text.split(/(\b\d{3,4}\b|\(\d{3,4}\))/g);
    return parts.map((part, i) => {
      if (/^(\b\d{3,4}\b|\(\d{3,4}\))$/.test(part)) {
        return (
          <span
            key={i}
            className="inline-block px-1 py-0.5 mx-0.5 text-xs font-mono font-medium rounded bg-indigo-50 text-indigo-700 border border-indigo-200"
            title="Drawing Reference Numeral"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-white rounded-xl border border-slate-200 no-print text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800">
            {jurisdiction === 'IPO' ? 'IPO Form 2 Complete Specification' : `${jurisdiction} Specification`}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
            {spec.claims?.length || 0} Claims
          </span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
            {spec.detailedDescription?.paragraphs?.length || 0} Paragraphs
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Reference numerals highlight toggle */}
          <button
            onClick={() => setHighlightNumerals(!highlightNumerals)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors ${
              highlightNumerals
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-medium'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title="Toggle highlighting of drawing reference numerals (e.g. 100, 102)"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Highlight Numerals</span>
          </button>

          {/* Quick print */}
          <button
            onClick={onPrint}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
            title="Print or Save as Official PDF (1-inch margins)"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Print / PDF</span>
          </button>

          {/* Quick Copy Full Form 2 */}
          <button
            onClick={() => copyToClipboard(JSON.stringify(spec, null, 2), 'all')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors"
          >
            {copiedSection === 'all' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied Full</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Specification</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Official Patent Sheet Simulation */}
      <div className="patent-paper p-8 sm:p-12 rounded-xl text-slate-900 font-serif leading-relaxed text-sm space-y-8 max-w-4xl mx-auto">
        {/* IPO FORM 2 FORMAL HEADER */}
        {isIPO && (
          <div className="border-b-2 border-slate-900 pb-6 text-center space-y-2">
            <div className="font-bold text-base tracking-wider uppercase">FORM 2</div>
            <div className="font-bold text-sm tracking-wide uppercase">THE PATENTS ACT, 1970</div>
            <div className="text-xs uppercase text-slate-600">(39 of 1970) & THE PATENTS RULES, 2003</div>
            <div className="pt-2 font-bold text-lg uppercase tracking-wide">
              {spec.metadata?.filingType === 'provisional' ? 'PROVISIONAL SPECIFICATION' : 'COMPLETE SPECIFICATION'}
            </div>
            <div className="text-xs italic text-slate-500">(See section 10 and rule 13)</div>
          </div>
        )}

        {/* USPTO HEADER */}
        {isUSPTO && (
          <div className="border-b-2 border-slate-900 pb-4 text-center space-y-2">
            <div className="font-bold text-xs uppercase tracking-widest text-slate-500">
              UNITED STATES PATENT AND TRADEMARK OFFICE
            </div>
            <div className="font-bold text-base uppercase">
              PATENT SPECIFICATION (37 CFR § 1.77)
            </div>
          </div>
        )}

        {/* 1. TITLE OF THE INVENTION */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-700">
              {isIPO ? '1. TITLE OF THE INVENTION' : 'TITLE OF THE INVENTION'}
            </h3>
            <button
              onClick={() => copyToClipboard(spec.title, 'title')}
              className="no-print text-slate-400 hover:text-slate-600 p-1"
              title="Copy title"
            >
              {copiedSection === 'title' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="font-bold text-base sm:text-lg text-slate-950 uppercase tracking-tight">
            {spec.title}
          </div>
        </section>

        {/* 2. APPLICANT & INVENTOR DETAILS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-slate-50/80 rounded-lg border border-slate-200 font-sans text-xs">
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wide mb-1">
              {isIPO ? '2. APPLICANT(S)' : 'APPLICANT'}
            </h4>
            <div className="space-y-0.5 text-slate-700">
              <div><span className="font-semibold text-slate-900">Name:</span> {spec.metadata?.applicant?.name}</div>
              <div><span className="font-semibold text-slate-900">Nationality:</span> {spec.metadata?.applicant?.nationality || 'Indian'}</div>
              <div><span className="font-semibold text-slate-900">Address:</span> {spec.metadata?.applicant?.address || 'As on Record'}</div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wide mb-1">
              {isIPO ? '3. INVENTOR(S)' : 'INVENTORS'}
            </h4>
            <div className="space-y-1 text-slate-700">
              {spec.metadata?.inventors?.map((inv, idx) => (
                <div key={idx}>
                  <span className="font-semibold text-slate-900">{inv.name}</span>
                  {inv.affiliation && <span className="text-slate-500"> — {inv.affiliation}</span>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. PREAMBLE */}
        <section className="space-y-1.5">
          <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-700">
            {isIPO ? '4. PREAMBLE TO THE DESCRIPTION' : 'PREAMBLE'}
          </h3>
          <p className="italic text-slate-700 text-sm">
            {spec.preamble || 'The following specification particularly describes the invention and the manner in which it is to be performed.'}
          </p>
        </section>

        <hr className="border-slate-300" />

        {/* FIELD OF THE INVENTION */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-900">
              FIELD OF THE INVENTION
            </h3>
            <button
              onClick={() => copyToClipboard(spec.fieldOfInvention, 'field')}
              className="no-print text-slate-400 hover:text-slate-600 p-1"
            >
              {copiedSection === 'field' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <p className="text-slate-800 text-justify">
            {spec.fieldOfInvention}
          </p>
        </section>

        {/* BACKGROUND OF THE INVENTION */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-900">
              BACKGROUND OF THE INVENTION AND PRIOR ART
            </h3>
            <button
              onClick={() => copyToClipboard(spec.backgroundOfInvention, 'bg')}
              className="no-print text-slate-400 hover:text-slate-600 p-1"
            >
              {copiedSection === 'bg' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <p className="text-slate-800 text-justify">
            {spec.backgroundOfInvention}
          </p>

          {spec.priorArtLimitations && spec.priorArtLimitations.length > 0 && (
            <div className="mt-3 space-y-1 pl-4 border-l-2 border-slate-200">
              <p className="font-sans text-xs font-semibold text-slate-700">
                Technical Drawbacks in the Existing State of the Art:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                {spec.priorArtLimitations.map((lim, idx) => (
                  <li key={idx}>{lim}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* OBJECTS OF THE INVENTION */}
        {spec.objectsOfInvention && spec.objectsOfInvention.length > 0 && (
          <section className="space-y-2">
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-900">
              OBJECTS OF THE INVENTION
            </h3>
            <p className="text-slate-800">
              The primary and secondary objectives of the present disclosure are summarized below:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-slate-800">
              {spec.objectsOfInvention.map((obj, idx) => (
                <li key={idx}>{obj}</li>
              ))}
            </ul>
          </section>
        )}

        {/* SUMMARY OF THE INVENTION */}
        <section className="space-y-2">
          <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-900">
            SUMMARY OF THE INVENTION
          </h3>
          <p className="text-slate-800 text-justify">
            {spec.summaryOfInvention}
          </p>
        </section>

        {/* BRIEF DESCRIPTION OF DRAWINGS */}
        {spec.briefDescriptionOfDrawings && spec.briefDescriptionOfDrawings.length > 0 && (
          <section className="space-y-3">
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-900">
              BRIEF DESCRIPTION OF THE ACCOMPANYING DRAWINGS
            </h3>
            <p className="text-slate-700 text-xs italic font-sans">
              The invention will be better understood and objects other than those set forth above will become apparent when consideration is given to the following detailed description thereof in conjunction with the annexed drawings:
            </p>
            <div className="space-y-2 pl-4">
              {spec.briefDescriptionOfDrawings.map((draw, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="font-sans font-bold text-xs text-slate-900 whitespace-nowrap">
                    {draw.figNumber}:
                  </span>
                  <div className="text-slate-800 flex-1">
                    <span>{draw.description}</span>
                    {draw.referenceNumerals && draw.referenceNumerals.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {draw.referenceNumerals.map((rn, rIdx) => (
                          <span
                            key={rIdx}
                            className="inline-flex items-center text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700"
                          >
                            {rn.numeral}: {rn.element}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* DETAILED DESCRIPTION OF THE INVENTION */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-900">
              DETAILED DESCRIPTION OF THE INVENTION
            </h3>
            <span className="text-xs font-sans text-slate-400">
              Paragraph Numbers [0001]
            </span>
          </div>

          <div className="space-y-3">
            {spec.detailedDescription?.paragraphs?.map((para, idx) => (
              <div key={idx} className="flex items-start gap-3 text-justify">
                <span className="patent-lineno text-xs font-bold shrink-0 mt-0.5 w-12 text-slate-400">
                  {para.id}
                </span>
                <p className="text-slate-800 flex-1 leading-relaxed">
                  {renderTextWithNumerals(para.text)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* PAGE BREAK BEFORE CLAIMS (Statutory Rule) */}
        <div className="page-break-before pt-6 border-t-2 border-slate-900"></div>

        {/* CLAIMS SECTION */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-slate-900">
                {isUSPTO ? 'WHAT IS CLAIMED IS:' : 'WE CLAIM:'}
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-sans font-medium">
                {spec.claims?.length} Statutory Claims
              </span>
            </div>
            <button
              onClick={() => {
                const claimsText = spec.claims.map(c => `${c.number}. ${c.text}`).join('\n\n');
                copyToClipboard(claimsText, 'claims');
              }}
              className="no-print text-xs font-sans flex items-center gap-1 text-slate-600 hover:text-slate-900 p-1.5 rounded bg-slate-100 hover:bg-slate-200"
            >
              {copiedSection === 'claims' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Claims Only</span>
            </button>
          </div>

          <p className="text-xs font-sans italic text-slate-500">
            (Note: Every claim adheres to the Single-Sentence Rule, ending with a single terminating period.)
          </p>

          <div className="space-y-4">
            {spec.claims?.map((claim: PatentClaim) => (
              <div
                key={claim.number}
                className={`p-3 rounded-lg border text-justify transition-colors ${
                  claim.type === 'independent'
                    ? 'bg-amber-50/40 border-amber-200/70'
                    : 'bg-white border-slate-200 ml-4 sm:ml-6'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center shrink-0">
                    <span className="font-sans font-bold text-xs px-2 py-0.5 rounded bg-slate-900 text-white">
                      {claim.number}
                    </span>
                    <span className="text-[10px] font-sans font-medium mt-1 uppercase text-slate-500">
                      {claim.type === 'independent' ? 'Indep.' : `Dep. ${claim.dependsOn || ''}`}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-900 leading-relaxed text-sm">
                      {claim.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PAGE BREAK BEFORE ABSTRACT */}
        <div className="page-break-before pt-6 border-t-2 border-slate-900"></div>

        {/* ABSTRACT SECTION */}
        <section className="space-y-3">
          <div className="text-center space-y-1">
            <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-slate-900">
              ABSTRACT
            </h3>
            <div className="font-bold text-xs uppercase text-slate-700">
              {spec.title}
            </div>
            <div className="text-xs font-sans text-slate-500">
              Word Count: <span className="font-semibold text-slate-800">{spec.abstract?.wordCount || 0}</span> / 150 words max
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-justify text-slate-800 leading-relaxed">
            {renderTextWithNumerals(spec.abstract?.text || '')}
          </div>

          <div className="text-center text-xs font-sans italic text-slate-500">
            [Number of Drawing Figures accompanying Abstract: {spec.briefDescriptionOfDrawings?.length || 1}]
          </div>
        </section>
      </div>
    </div>
  );
};
