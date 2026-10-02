export type PatentOffice = 'IPO' | 'USPTO' | 'PCT' | 'EPO';
export type SpecificationType = 'complete' | 'provisional';

export interface PatentMetadata {
  title: string;
  inventors: Array<{
    name: string;
    nationality?: string;
    address?: string;
    affiliation?: string;
  }>;
  applicant: {
    name: string;
    nationality?: string;
    address?: string;
  };
  filingType: SpecificationType;
  jurisdiction: PatentOffice;
  internationalClassification?: string; // e.g. IPC code G06F 17/00
}

export interface PatentDrawing {
  figNumber: string; // "FIG. 1"
  description: string; // "illustrates an overall block diagram of the system..."
  referenceNumerals: Array<{
    numeral: string; // "100"
    element: string; // "sensing module"
  }>;
}

export interface PatentClaim {
  number: number;
  type: 'independent' | 'dependent';
  dependsOn?: number; // e.g. 1
  category: 'system' | 'method' | 'apparatus' | 'composition';
  text: string;
}

export interface PatentSpecification {
  metadata: PatentMetadata;
  title: string;
  preamble: string;
  fieldOfInvention: string;
  backgroundOfInvention: string;
  priorArtLimitations: string[];
  objectsOfInvention: string[];
  summaryOfInvention: string;
  briefDescriptionOfDrawings: PatentDrawing[];
  detailedDescription: {
    paragraphs: Array<{
      id: string; // "[0001]"
      text: string;
    }>;
  };
  claims: PatentClaim[];
  abstract: {
    text: string;
    wordCount: number;
  };
  latexCode: string;
  academicIssuesFixed: string[]; // e.g. "Converted 5 academic paper citations to background prior art", "Replaced 'in this paper' phrases"
}

export interface ComplianceIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  section: 'title' | 'abstract' | 'claims' | 'description' | 'drawings' | 'general';
  message: string;
  suggestion?: string;
}

export interface ComplianceReport {
  score: number; // 0-100
  status: 'passed' | 'review_recommended' | 'critical_issues';
  issues: ComplianceIssue[];
  metrics: {
    abstractWords: number;
    claimCount: number;
    independentClaimCount: number;
    dependentClaimCount: number;
    paragraphCount: number;
    drawingsReferenced: number;
  };
}
