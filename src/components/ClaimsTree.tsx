import React, { useState } from 'react';
import { GitFork, CheckCircle, AlertTriangle, XCircle, Info, Copy, Check } from 'lucide-react';
import { PatentClaim, PatentSpecification } from '../types';

interface ClaimsTreeProps {
  spec: PatentSpecification;
}

export const ClaimsTree: React.FC<ClaimsTreeProps> = ({ spec }) => {
  const [copiedClaim, setCopiedClaim] = useState<number | null>(null);

  const claims = spec.claims || [];

  const handleCopy = (claim: PatentClaim) => {
    navigator.clipboard.writeText(`${claim.number}. ${claim.text}`);
    setCopiedClaim(claim.number);
    setTimeout(() => setCopiedClaim(null), 2000);
  };

  // Inspect each claim's single-sentence rule & punctuation
  const inspectClaim = (claim: PatentClaim) => {
    const textWithoutDecimals = claim.text.replace(/\d+\.\d+/g, 'XX');
    const periodCount = (textWithoutDecimals.match(/\./g) || []).length;
    const endsWithPeriod = claim.text.trim().endsWith('.');
    const hasSemicolons = claim.text.includes(';');

    const passesSingleSentence = periodCount === 1 && endsWithPeriod;

    return {
      periodCount,
      endsWithPeriod,
      passesSingleSentence,
      hasSemicolons
    };
  };

  const independentClaims = claims.filter(c => c.type === 'independent');
  const dependentClaims = claims.filter(c => c.type === 'dependent');

  return (
    <div className="space-y-4">
      {/* Claims Overview Header */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <GitFork className="w-4 h-4 text-indigo-600" />
            <span>Statutory Claims Architecture</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            The legal boundary of patent protection. Evaluates claim hierarchy, single-sentence rule, and statutory antecedents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
            <span className="font-bold">{independentClaims.length}</span> Independent
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-medium">
            <span className="font-bold">{dependentClaims.length}</span> Dependent
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold">
            Total: {claims.length}
          </div>
        </div>
      </div>

      {/* Claims List with Compliance Badges */}
      <div className="space-y-3">
        {claims.map((claim) => {
          const inspection = inspectClaim(claim);

          return (
            <div
              key={claim.number}
              className={`p-4 rounded-xl border transition-all ${
                claim.type === 'independent'
                  ? 'bg-white border-slate-300 shadow-xs ring-1 ring-slate-900/5'
                  : 'bg-slate-50/70 border-slate-200 ml-4 sm:ml-8'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center">
                    {claim.number}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                    claim.type === 'independent'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                  }`}>
                    {claim.type === 'independent' ? 'Independent Claim' : `Dependent on Claim ${claim.dependsOn || 1}`}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 uppercase">
                    [{claim.category}]
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Single-Sentence Rule Status */}
                  {inspection.passesSingleSentence ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle className="w-3 h-3" />
                      <span>Single-Sentence Valid</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      <XCircle className="w-3 h-3" />
                      <span>{inspection.periodCount} Periods Detected</span>
                    </span>
                  )}

                  <button
                    onClick={() => handleCopy(claim)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors"
                    title="Copy claim"
                  >
                    {copiedClaim === claim.number ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Claim text */}
              <p className="text-slate-800 text-xs sm:text-sm leading-relaxed text-justify font-serif pl-8">
                {claim.text}
              </p>
            </div>
          );
        })}
      </div>

      {/* Claim Writing Law Advice for Professors */}
      <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/80 text-xs text-amber-950 space-y-1.5">
        <h4 className="font-bold flex items-center gap-1.5">
          <Info className="w-4 h-4 text-amber-700" />
          <span>Why Patent Examiners Reject College Paper Claims:</span>
        </h4>
        <p className="text-amber-900 leading-relaxed">
          In academia, professors write descriptive paragraphs with multiple sentences and periods. In patent law, a claim is a single statutory sentence defining legal ownership. If an examiner finds an intermediate period inside a claim, it receives an immediate statutory objection under Section 10(4)(c) of the Indian Patents Act or 35 U.S.C. 112 in the US.
        </p>
      </div>
    </div>
  );
};
