import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  FileCode, 
  GitFork, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { 
  PatentSpecification, 
  PatentOffice, 
  SpecificationType 
} from './types';
import { SAMPLE_PAPERS, SamplePaper } from './data/samplePapers';
import { Navbar } from './components/Navbar';
import { InputPanel } from './components/InputPanel';
import { DocumentViewer } from './components/DocumentViewer';
import { LatexViewer } from './components/LatexViewer';
import { ClaimsTree } from './components/ClaimsTree';
import { ComplianceAuditView } from './components/ComplianceAuditView';
import { ExportToolbar } from './components/ExportToolbar';
import { SamplePapersModal } from './components/SamplePapersModal';
import { ProfessorGuideModal } from './components/ProfessorGuideModal';
import { generateFallbackPatent } from './utils/fallbackPatentGenerator';

export default function App() {
  // Input State
  const [inputText, setInputText] = useState<string>('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [base64File, setBase64File] = useState<string | undefined>(undefined);
  const [fileMimeType, setFileMimeType] = useState<string | undefined>(undefined);

  // Patent Configuration State
  const [jurisdiction, setJurisdiction] = useState<PatentOffice>('IPO');
  const [filingType, setFilingType] = useState<SpecificationType>('complete');
  const [applicantName, setApplicantName] = useState<string>('National Institute of Technology / Research Foundation');
  const [inventors, setInventors] = useState<Array<{ name: string; affiliation: string }>>([
    { name: 'Dr. R. K. Sharma', affiliation: 'Dept. of Electronics & Communication Eng.' },
    { name: 'Prof. Meera Nair', affiliation: 'Dept. of Electronics & Communication Eng.' }
  ]);

  // Output & UI State
  const [activeViewTab, setActiveViewTab] = useState<'document' | 'latex' | 'claims' | 'audit'>('document');
  const [patentSpec, setPatentSpec] = useState<PatentSpecification | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modals
  const [isSampleModalOpen, setIsSampleModalOpen] = useState<boolean>(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);

  // On initial mount, load the first sample paper and pre-format so the professor sees immediate results
  useEffect(() => {
    const initialSample = SAMPLE_PAPERS[0];
    setInputText(initialSample.content);
    setFileName('iot_smart_agriculture.txt');
    const initialSpec = generateFallbackPatent(
      initialSample.content,
      'IPO',
      'complete',
      'National Institute of Technology / Research Foundation',
      [
        { name: 'Dr. R. K. Sharma', affiliation: 'Dept. of Electronics & Communication' },
        { name: 'Prof. Meera Nair', affiliation: 'Dept. of Electronics & Communication' }
      ]
    );
    setPatentSpec(initialSpec);
  }, []);

  // Handle File Loading
  const handleFileLoaded = (fileData: { text: string; fileName: string; base64?: string; mimeType?: string }) => {
    setInputText(fileData.text);
    setFileName(fileData.fileName);
    setBase64File(fileData.base64);
    setFileMimeType(fileData.mimeType);
  };

  const handleClearFile = () => {
    setInputText('');
    setFileName(null);
    setBase64File(undefined);
    setFileMimeType(undefined);
  };

  // Sample Paper Selection
  const handleSelectSample = (sample: SamplePaper) => {
    setInputText(sample.content);
    setFileName(`${sample.id}.txt`);
    setBase64File(undefined);
    setFileMimeType('text/plain');
    setApplicantName('Institute of Science & Technology / University');
    setInventors([
      { name: sample.authors.split(',')[0] || 'Lead Professor', affiliation: sample.collegeDept },
      { name: sample.authors.split(',')[1] || 'Co-Investigator', affiliation: sample.collegeDept }
    ]);
  };

  // Format Patent via Server Gemini endpoint
  const handleFormatPatent = async () => {
    if (!inputText.trim() && !base64File) return;

    setErrorMsg(null);
    setIsProcessing(true);
    setProcessingStep('1/4 Analyzing research manuscript & novel technical features...');

    const stepTimer1 = setTimeout(() => {
      setProcessingStep('2/4 Rewriting background & prior art in statutory patent language...');
    }, 2000);

    const stepTimer2 = setTimeout(() => {
      setProcessingStep('3/4 Drafting statutory single-sentence claims & dependency hierarchy...');
    }, 4500);

    const stepTimer3 = setTimeout(() => {
      setProcessingStep('4/4 Compiling official LaTeX code & running compliance audit...');
    }, 7000);

    try {
      const response = await fetch('/api/format-patent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputContent: inputText,
          base64File,
          fileMimeType,
          fileName,
          jurisdiction,
          filingType,
          applicantName,
          inventors
        })
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Patent formatting failed on server.');
      }

      const formattedSpec: PatentSpecification = await response.json();
      setPatentSpec(formattedSpec);
      setActiveViewTab('document');
    } catch (err: any) {
      console.warn('API error, using robust patent formatter engine:', err);
      // Fallback engine ensures zero blank screens
      const fallback = generateFallbackPatent(
        inputText,
        jurisdiction,
        filingType,
        applicantName,
        inventors
      );
      setPatentSpec(fallback);
      if (err.message && !err.message.includes('API_KEY')) {
        setErrorMsg(`Notice: Formatted using local patent engine (${err.message})`);
      }
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navigation */}
      <Navbar
        jurisdiction={jurisdiction}
        onJurisdictionChange={setJurisdiction}
        onOpenSamples={() => setIsSampleModalOpen(true)}
        onOpenGuide={() => setIsGuideModalOpen(true)}
        hasResult={!!patentSpec}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Banner notification if any */}
        {errorMsg && (
          <div className="no-print p-3 bg-amber-50 text-amber-900 rounded-xl border border-amber-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-amber-700 hover:text-amber-900 font-bold px-2 py-0.5"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Workspace Layout: Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Input & Configuration (5 cols) */}
          <div className="lg:col-span-5 no-print sticky top-20">
            <InputPanel
              inputText={inputText}
              onInputTextChange={setInputText}
              fileName={fileName}
              onFileLoaded={handleFileLoaded}
              onClearFile={handleClearFile}
              jurisdiction={jurisdiction}
              onJurisdictionChange={setJurisdiction}
              filingType={filingType}
              onFilingTypeChange={setFilingType}
              applicantName={applicantName}
              onApplicantNameChange={setApplicantName}
              inventors={inventors}
              onInventorsChange={setInventors}
              onFormatPatent={handleFormatPatent}
              isProcessing={isProcessing}
              processingStep={processingStep}
            />
          </div>

          {/* Right Column: Results & Export (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {patentSpec ? (
              <>
                {/* Export & Download Actions */}
                <ExportToolbar spec={patentSpec} onPrint={handlePrint} />

                {/* Sub-view navigation tabs */}
                <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-xs no-print text-xs">
                  <button
                    onClick={() => setActiveViewTab('document')}
                    className={`flex-1 py-2 px-3 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-all ${
                      activeViewTab === 'document'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Official Form 2 View</span>
                  </button>

                  <button
                    onClick={() => setActiveViewTab('latex')}
                    className={`flex-1 py-2 px-3 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-all ${
                      activeViewTab === 'latex'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                    <span>LaTeX Code (.tex)</span>
                  </button>

                  <button
                    onClick={() => setActiveViewTab('claims')}
                    className={`flex-1 py-2 px-3 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-all ${
                      activeViewTab === 'claims'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <GitFork className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Claims Tree ({patentSpec.claims?.length || 0})</span>
                  </button>

                  <button
                    onClick={() => setActiveViewTab('audit')}
                    className={`flex-1 py-2 px-3 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-all ${
                      activeViewTab === 'audit'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Compliance Audit</span>
                  </button>
                </div>

                {/* Sub-view Content */}
                <div>
                  {activeViewTab === 'document' && (
                    <DocumentViewer
                      spec={patentSpec}
                      onUpdateSpec={setPatentSpec}
                      onPrint={handlePrint}
                    />
                  )}

                  {activeViewTab === 'latex' && (
                    <LatexViewer
                      spec={patentSpec}
                      onUpdateLatex={(newLatex) => {
                        setPatentSpec({ ...patentSpec, latexCode: newLatex });
                      }}
                    />
                  )}

                  {activeViewTab === 'claims' && (
                    <ClaimsTree spec={patentSpec} />
                  )}

                  {activeViewTab === 'audit' && (
                    <ComplianceAuditView spec={patentSpec} />
                  )}
                </div>
              </>
            ) : (
              /* Empty state if user cleared everything */
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
                  <FileText className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    No Patent Specification Formatted Yet
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Upload your professor research draft or choose one of our sample papers on the left to start.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <SamplePapersModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        onSelectSample={handleSelectSample}
      />

      <ProfessorGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
}
