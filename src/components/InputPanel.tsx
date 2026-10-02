import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Sparkles, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Users, 
  Building2, 
  ChevronDown, 
  ChevronUp,
  FileCode,
  FileSpreadsheet
} from 'lucide-react';
import { PatentOffice, SpecificationType } from '../types';
import { SAMPLE_PAPERS } from '../data/samplePapers';

interface InputPanelProps {
  inputText: string;
  onInputTextChange: (text: string) => void;
  fileName: string | null;
  onFileLoaded: (fileData: { text: string; fileName: string; base64?: string; mimeType?: string }) => void;
  onClearFile: () => void;
  jurisdiction: PatentOffice;
  onJurisdictionChange: (jurisdiction: PatentOffice) => void;
  filingType: SpecificationType;
  onFilingTypeChange: (type: SpecificationType) => void;
  applicantName: string;
  onApplicantNameChange: (name: string) => void;
  inventors: Array<{ name: string; affiliation: string }>;
  onInventorsChange: (inventors: Array<{ name: string; affiliation: string }>) => void;
  onFormatPatent: () => void;
  isProcessing: boolean;
  processingStep: string;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  inputText,
  onInputTextChange,
  fileName,
  onFileLoaded,
  onClearFile,
  jurisdiction,
  onJurisdictionChange,
  filingType,
  onFilingTypeChange,
  applicantName,
  onApplicantNameChange,
  inventors,
  onInventorsChange,
  onFormatPatent,
  isProcessing,
  processingStep
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [showMetadata, setShowMetadata] = useState<boolean>(false);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [extracting, setExtracting] = useState<boolean>(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;

  const handleFileChange = async (file: File) => {
    setExtractError(null);
    setExtracting(true);

    try {
      // If it's a plain text, markdown, or tex file, read directly client-side
      if (file.name.endsWith('.txt') || file.name.endsWith('.md') || file.name.endsWith('.tex')) {
        const text = await file.text();
        onFileLoaded({ text, fileName: file.name });
        setExtracting(false);
        return;
      }

      // If it's DOCX or PDF, convert to base64 and send to server for extraction
      const reader = new FileReader();
      reader.onload = async () => {
        const result = reader.result as string;
        const base64Data = result.split(',')[1];
        
        try {
          const res = await fetch('/api/extract-doc', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              base64Data,
              mimeType: file.type || 'application/octet-stream',
              fileName: file.name
            })
          });

          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || 'Failed to extract text from document');
          }

          const data = await res.json();
          onFileLoaded({
            text: data.text || '',
            fileName: file.name,
            base64: base64Data,
            mimeType: file.type
          });
        } catch (err: any) {
          console.error(err);
          setExtractError(err.message || 'Error parsing file.');
        } finally {
          setExtracting(false);
        }
      };

      reader.onerror = () => {
        setExtractError('Failed to read file from disk');
        setExtracting(false);
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      setExtractError(err.message || 'Error processing file.');
      setExtracting(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const addInventor = () => {
    onInventorsChange([...inventors, { name: '', affiliation: applicantName }]);
  };

  const updateInventor = (index: number, field: 'name' | 'affiliation', val: string) => {
    const updated = [...inventors];
    updated[index][field] = val;
    onInventorsChange(updated);
  };

  const removeInventor = (index: number) => {
    onInventorsChange(inventors.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-full overflow-hidden">
      {/* Header bar of panel */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/70">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <span>Manuscript / Research Input</span>
              {fileName && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-normal">
                  {fileName}
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload your research draft or paste raw paper sections to transform into patent specifications
            </p>
          </div>

          {/* Mode switch */}
          <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-1 rounded-md transition-all font-medium ${
                activeTab === 'upload'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Upload File
            </button>
            <button
              onClick={() => setActiveTab('paste')}
              className={`px-3 py-1 rounded-md transition-all font-medium ${
                activeTab === 'paste'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Direct Paste ({wordCount} w)
            </button>
          </div>
        </div>

        {/* Quick Sample Selector Pills */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 text-xs shrink-0 font-medium">Quick Test:</span>
          {SAMPLE_PAPERS.map((paper) => (
            <button
              key={paper.id}
              onClick={() => {
                onFileLoaded({ text: paper.content, fileName: `${paper.id}.txt` });
                onApplicantNameChange('National Institute of Technology / Research Foundation');
                onInventorsChange([
                  { name: paper.authors.split(',')[0], affiliation: paper.collegeDept },
                  { name: paper.authors.split(',')[1] || 'Co-Inventor', affiliation: paper.collegeDept }
                ]);
              }}
              className="shrink-0 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 hover:border-slate-300 transition-colors"
            >
              {paper.domain.split('&')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Main input body */}
      <div className="p-4 flex-1 flex flex-col overflow-y-auto space-y-4">
        {activeTab === 'upload' ? (
          <div className="space-y-3">
            {/* Drag & Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                dragOver
                  ? 'border-indigo-500 bg-indigo-50/50'
                  : 'border-slate-300 hover:border-slate-400 bg-slate-50/40 hover:bg-slate-50'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.docx,.txt,.tex,.md"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
              />
              <div className="w-12 h-12 mx-auto rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800">
                {extracting ? 'Extracting document text...' : 'Drop your paper here or browse files'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Supports Word (.docx), PDF (.pdf), LaTeX (.tex), Markdown (.md), and plain text (.txt)
              </p>
              <div className="mt-3 flex justify-center items-center gap-2">
                <span className="text-[11px] px-2 py-0.5 rounded-sm bg-blue-50 text-blue-700 font-mono">.DOCX</span>
                <span className="text-[11px] px-2 py-0.5 rounded-sm bg-red-50 text-red-700 font-mono">.PDF</span>
                <span className="text-[11px] px-2 py-0.5 rounded-sm bg-emerald-50 text-emerald-700 font-mono">.TEX</span>
                <span className="text-[11px] px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 font-mono">.TXT</span>
              </div>
            </div>

            {extractError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-start gap-2 border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{extractError}</span>
              </div>
            )}

            {/* Extracted text preview & editor */}
            {inputText && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-medium text-slate-700">Document Text Preview ({wordCount} words)</span>
                  <button
                    onClick={onClearFile}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                </div>
                <textarea
                  value={inputText}
                  onChange={(e) => onInputTextChange(e.target.value)}
                  rows={8}
                  className="w-full text-xs font-mono p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 bg-white"
                  placeholder="Extracted manuscript text..."
                />
              </div>
            )}
          </div>
        ) : (
          /* Direct Paste View */
          <div className="flex-1 flex flex-col space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Paste manuscript text, methodology, and equations:</span>
              <button
                onClick={() => onInputTextChange('')}
                className="text-slate-400 hover:text-red-500 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear text</span>
              </button>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => onInputTextChange(e.target.value)}
              className="flex-1 min-h-[260px] w-full text-xs font-mono p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 bg-white resize-y"
              placeholder="Paste your paper's title, abstract, introduction, system architecture, methodology, algorithms, and experimental results here..."
            />
          </div>
        )}

        {/* Collapsible Metadata (College, Inventors, Type) */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowMetadata(!showMetadata)}
            className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left transition-colors"
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-600" />
              <span className="text-xs font-semibold text-slate-800">
                Patent Metadata & Inventor Details
              </span>
              <span className="text-[11px] text-slate-500">
                ({inventors.length} inventor{inventors.length === 1 ? '' : 's'})
              </span>
            </div>
            {showMetadata ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {showMetadata && (
            <div className="p-4 space-y-4 bg-white text-xs border-t border-slate-200">
              {/* Filing Type & Jurisdiction */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Target Patent Office:
                  </label>
                  <select
                    value={jurisdiction}
                    onChange={(e) => onJurisdictionChange(e.target.value as PatentOffice)}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  >
                    <option value="IPO">Indian Patent Office (IPO Form 2)</option>
                    <option value="USPTO">USPTO (37 CFR 1.77 Standard)</option>
                    <option value="PCT">PCT / WIPO (International Application)</option>
                    <option value="EPO">European Patent Office (EPO)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Filing Specification Type:
                  </label>
                  <select
                    value={filingType}
                    onChange={(e) => onFilingTypeChange(e.target.value as SpecificationType)}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  >
                    <option value="complete">Complete Specification (Full Claims + Desc)</option>
                    <option value="provisional">Provisional Specification (Priority Date)</option>
                  </select>
                </div>
              </div>

              {/* Applicant Name */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Applicant (University / College / Institute):
                </label>
                <input
                  type="text"
                  value={applicantName}
                  onChange={(e) => onApplicantNameChange(e.target.value)}
                  placeholder="e.g. National Institute of Technology / Anna University"
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              {/* Inventors list */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-700 font-medium">
                    Professors / Inventors:
                  </label>
                  <button
                    type="button"
                    onClick={addInventor}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    + Add Inventor
                  </button>
                </div>
                {inventors.map((inv, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={inv.name}
                      onChange={(e) => updateInventor(idx, 'name', e.target.value)}
                      placeholder="Professor / Researcher Name"
                      className="flex-1 p-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={inv.affiliation}
                      onChange={(e) => updateInventor(idx, 'affiliation', e.target.value)}
                      placeholder="Department / Affiliation"
                      className="flex-1 p-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
                    />
                    {inventors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInventor(idx)}
                        className="text-slate-400 hover:text-red-500 p-1"
                        title="Remove inventor"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <button
          onClick={onFormatPatent}
          disabled={isProcessing || !inputText.trim()}
          id="btn-format-patent"
          className={`w-full py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
            isProcessing || !inputText.trim()
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/10 cursor-pointer active:scale-[0.99]'
          }`}
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{processingStep || 'Formatting into Official Patent Specification...'}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Format into {jurisdiction} Patent Specification & LaTeX</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
