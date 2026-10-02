import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  CheckCircle2, 
  Sparkles, 
  FileCheck, 
  Scale, 
  BookOpen, 
  Info 
} from 'lucide-react';
import { PatentSpecification, ComplianceReport } from '../types';
import { auditPatentSpecification } from '../utils/patentAuditor';

interface ComplianceAuditViewProps {
  spec: PatentSpecification;
}

export const ComplianceAuditView: React.FC<ComplianceAuditViewProps> = ({ spec }) => {
  const audit: ComplianceReport = auditPatentSpecification(spec);

  const errors = audit.issues.filter(i => i.type === 'error');
  const warnings = audit.issues.filter(i => i.type === 'warning');
  const infos = audit.issues.filter(i => i.type === 'info');

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 65) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-6">
      {/* Top Score & Summary Card */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-slate-900" />
              <h3 className="text-base font-bold text-slate-900">
                Patent Office Examination Compliance Audit
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Simulated statutory review against Indian Patent Office (IPO Form 2 / Complete Spec), USPTO 37 CFR, and PCT guidelines.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-xl border text-center ${getScoreColor(audit.score)}`}>
              <div className="text-2xl font-black">{audit.score}/100</div>
              <div className="text-[10px] font-bold uppercase tracking-wider">
                {audit.status === 'passed' ? 'Examination Ready' : 'Review Recommended'}
              </div>
            </div>
          </div>
        </div>

        {/* Audit Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-xs text-slate-500">Abstract Words</div>
            <div className="text-lg font-bold text-slate-900 flex items-baseline gap-1">
              <span>{audit.metrics.abstractWords}</span>
              <span className="text-xs text-slate-400 font-normal">/ 150 max</span>
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
              {audit.metrics.abstractWords <= 150 ? 'Compliant with IPO Rule 8' : 'Exceeds limit'}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-xs text-slate-500">Total Claims</div>
            <div className="text-lg font-bold text-slate-900">
              {audit.metrics.claimCount}
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              {audit.metrics.independentClaimCount} indep. + {audit.metrics.dependentClaimCount} dep.
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-xs text-slate-500">Numbered Paragraphs</div>
            <div className="text-lg font-bold text-slate-900">
              {audit.metrics.paragraphCount}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
              Standard [0001] Format
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-xs text-slate-500">Drawing Descriptions</div>
            <div className="text-lg font-bold text-slate-900">
              {audit.metrics.drawingsReferenced}
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              Accompanying figures
            </div>
          </div>
        </div>
      </div>

      {/* Academic Paper Habits Repaired */}
      {spec.academicIssuesFixed && spec.academicIssuesFixed.length > 0 && (
        <div className="p-5 bg-gradient-to-br from-indigo-50/70 to-slate-50 rounded-2xl border border-indigo-100 space-y-3">
          <div className="flex items-center gap-2 text-indigo-950 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Academic Paper Habits Successfully Repaired into Patent Law:</span>
          </div>
          <p className="text-xs text-indigo-900/80">
            Patent examiners routinely issue objections when research papers are pasted into patent forms. The formatter applied these critical transformations:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {spec.academicIssuesFixed.map((fix, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-lg border border-indigo-200/50 text-xs text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{fix}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Issues & Recommendations */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-900">
          Statutory Compliance Checklist ({audit.issues.length} Items)
        </h4>

        {audit.issues.length === 0 ? (
          <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h5 className="text-sm font-bold text-emerald-950">100% Statutory Compliance Passed</h5>
            <p className="text-xs text-emerald-800 max-w-md mx-auto">
              Your patent specification meets all structural criteria for Title, Preamble, Claims punctuation, Paragraph numbering, and Abstract word count.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {audit.issues.map((issue) => (
              <div
                key={issue.id}
                className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                  issue.type === 'error'
                    ? 'bg-red-50/70 border-red-200 text-red-950'
                    : issue.type === 'warning'
                    ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                    : 'bg-blue-50/60 border-blue-200 text-blue-950'
                }`}
              >
                {issue.type === 'error' && <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />}
                {issue.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />}
                {issue.type === 'info' && <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />}

                <div className="flex-1 text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold uppercase tracking-wide text-[10px] px-1.5 py-0.5 rounded bg-white/60">
                      {issue.section}
                    </span>
                    <span className="font-medium">{issue.message}</span>
                  </div>
                  {issue.suggestion && (
                    <div className="text-slate-600 pl-1 border-l-2 border-slate-300">
                      <strong>Recommendation:</strong> {issue.suggestion}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
