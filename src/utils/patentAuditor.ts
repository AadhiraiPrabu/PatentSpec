import { ComplianceIssue, ComplianceReport, PatentSpecification } from '../types';

export function auditPatentSpecification(spec: PatentSpecification): ComplianceReport {
  const issues: ComplianceIssue[] = [];

  // 1. Abstract Inspection
  const abstractText = spec.abstract.text || '';
  const words = abstractText.trim().split(/\s+/).filter(Boolean);
  const abstractWordCount = words.length;

  if (abstractWordCount > 150) {
    issues.push({
      id: 'abs-wc-error',
      type: 'error',
      section: 'abstract',
      message: `Abstract exceeds statutory word limit (${abstractWordCount} words). Official patent guidelines (IPO Form 2, USPTO Rule 1.72, PCT Rule 8) strictly mandate maximum 150 words.`,
      suggestion: 'Trim non-essential details to keep the abstract strictly between 50 and 150 words.'
    });
  } else if (abstractWordCount < 40 && abstractWordCount > 0) {
    issues.push({
      id: 'abs-wc-warn',
      type: 'warning',
      section: 'abstract',
      message: `Abstract is relatively brief (${abstractWordCount} words). May lack sufficient technical disclosure for indexing.`,
      suggestion: 'Aim for 75 to 120 concise words outlining technical problem, core mechanism, and primary application.'
    });
  }

  // Check for reference numerals in parentheses in abstract (Mandatory in IPO & PCT)
  const hasNumeralInAbstract = /\(\d{2,4}\)/.test(abstractText);
  if (!hasNumeralInAbstract && spec.briefDescriptionOfDrawings.length > 0) {
    issues.push({
      id: 'abs-no-numerals',
      type: 'info',
      section: 'abstract',
      message: 'No drawing reference numerals in parentheses found in abstract. Indian Patent Office (IPO) and PCT recommend including main reference numerals in parentheses, e.g., (100).',
      suggestion: 'Add reference numerals like (100) or (102) after core elements in the abstract.'
    });
  }

  // 2. Academic Language & Slang Check
  const bannedAcademicPatterns = [
    { pattern: /\bin this paper\b/i, label: '"in this paper"' },
    { pattern: /\bwe propose\b/i, label: '"we propose"' },
    { pattern: /\bin our study\b/i, label: '"in our study"' },
    { pattern: /\bwe have presented\b/i, label: '"we have presented"' },
    { pattern: /\bour experimental results show\b/i, label: '"our experimental results show"' },
    { pattern: /\bfuture work\b/i, label: '"future work"' },
    { pattern: /\[\d{1,2}\]/, label: 'academic citation brackets like "[1]"' },
    { pattern: /\bet al\.\b/i, label: '"et al."' },
    { pattern: /\bIEEE\b/, label: 'citation reference "IEEE"' }
  ];

  // Inspect all paragraphs
  const allParagraphs = spec.detailedDescription.paragraphs.map(p => p.text).join(' ');
  const backgroundText = spec.backgroundOfInvention || '';
  const fullTextToScan = `${abstractText} ${backgroundText} ${allParagraphs}`;

  bannedAcademicPatterns.forEach((item, index) => {
    if (item.pattern.test(fullTextToScan)) {
      issues.push({
        id: `academic-lang-${index}`,
        type: 'warning',
        section: 'description',
        message: `Academic colloquialism detected: ${item.label}. Patent specifications must use neutral, objective statutory phrasing ("the present disclosure provides", "in an embodiment", etc.).`,
        suggestion: `Replace academic phrases with objective language such as "In one embodiment of the present disclosure..."`
      });
    }
  });

  // 3. Claims Examination (Crucial for Patent Examination)
  const claims = spec.claims || [];
  let independentCount = 0;
  let dependentCount = 0;

  if (claims.length === 0) {
    issues.push({
      id: 'claims-empty',
      type: 'error',
      section: 'claims',
      message: 'Complete Specification contains zero claims. An application cannot be granted or filed as a Complete Specification without statutory claims.',
      suggestion: 'Add at least one independent apparatus/system claim and corresponding dependent claims.'
    });
  }

  claims.forEach((claim, index) => {
    if (claim.type === 'independent') {
      independentCount++;
    } else {
      dependentCount++;
    }

    const text = claim.text.trim();

    // Single-sentence rule check: Claim should end with period, but not contain inner periods
    // We can remove decimal numbers like 1.5 or 0.2 before testing
    const textWithoutDecimals = text.replace(/\d+\.\d+/g, 'XX');
    const periods = (textWithoutDecimals.match(/\./g) || []).length;

    if (periods > 1) {
      issues.push({
        id: `claim-${claim.number}-multi-period`,
        type: 'error',
        section: 'claims',
        message: `Claim ${claim.number} violates the "Single-Sentence Rule". Patent law strictly mandates that each claim must be a single grammatical sentence ending in exactly one period. Found ${periods} periods.`,
        suggestion: `Replace intermediate periods in Claim ${claim.number} with semicolons (;) or commas (,).`
      });
    } else if (!text.endsWith('.')) {
      issues.push({
        id: `claim-${claim.number}-no-period`,
        type: 'warning',
        section: 'claims',
        message: `Claim ${claim.number} does not terminate with a period (.).`,
        suggestion: 'Add a period at the end of the claim statement.'
      });
    }

    // Transitional phrase check for independent claims
    if (claim.type === 'independent') {
      const hasTransition = /comprising:|includes:|consisting of:|characterized in that/i.test(text);
      if (!hasTransition) {
        issues.push({
          id: `claim-${claim.number}-trans-phrase`,
          type: 'info',
          section: 'claims',
          message: `Independent Claim ${claim.number} should typically include an open-ended transitional phrase such as "comprising:" or "characterized in that:".`,
          suggestion: 'Structure preamble followed by "comprising:" followed by indented sub-elements.'
        });
      }
    }

    // Dependent claim check: Must cite a valid antecedent claim
    if (claim.type === 'dependent') {
      const hasReference = /claimed in claim \d+|according to claim \d+|of claim \d+/i.test(text);
      if (!hasReference) {
        issues.push({
          id: `claim-${claim.number}-missing-parent`,
          type: 'error',
          section: 'claims',
          message: `Dependent Claim ${claim.number} does not explicitly reference a preceding claim (e.g. "as claimed in claim 1").`,
          suggestion: `Begin dependent claim with "The [system/method] as claimed in claim 1, wherein..."`
        });
      }
    }
  });

  // Check Title
  if (!spec.title || spec.title.length < 5) {
    issues.push({
      id: 'title-short',
      type: 'error',
      section: 'title',
      message: 'Invention Title is missing or too short.',
      suggestion: 'Provide a precise technical title between 10 and 15 words without personal names, abbreviations, or marketing adjectives.'
    });
  } else if (/revolutionary|novel|best|groundbreaking|cheap/i.test(spec.title)) {
    issues.push({
      id: 'title-marketing',
      type: 'warning',
      section: 'title',
      message: 'Title contains subjective/promotional words (e.g. "revolutionary", "best", "cheap"). Patent examiners reject non-technical adjectives.',
      suggestion: 'Use purely descriptive technical terminology (e.g. "SYSTEM AND METHOD FOR...").'
    });
  }

  // 4. Drawings reference check
  const drawingCount = spec.briefDescriptionOfDrawings?.length || 0;
  if (drawingCount === 0) {
    issues.push({
      id: 'drawings-missing',
      type: 'info',
      section: 'drawings',
      message: 'No accompanying drawing figures defined. While purely chemical or software methods can omit drawings, hardware and system inventions require figures for grant.',
      suggestion: 'Add Brief Description of Drawings (e.g. FIG. 1 - System Architecture, FIG. 2 - Flowchart).'
    });
  }

  // Calculate score
  let errorCount = issues.filter(i => i.type === 'error').length;
  let warnCount = issues.filter(i => i.type === 'warning').length;
  let infoCount = issues.filter(i => i.type === 'info').length;

  let deduction = (errorCount * 25) + (warnCount * 10) + (infoCount * 2);
  let score = Math.max(0, Math.min(100, 100 - deduction));

  let status: ComplianceReport['status'] = 'passed';
  if (errorCount > 0) {
    status = 'critical_issues';
  } else if (warnCount > 0) {
    status = 'review_recommended';
  }

  return {
    score,
    status,
    issues,
    metrics: {
      abstractWords: abstractWordCount,
      claimCount: claims.length,
      independentClaimCount: independentCount,
      dependentClaimCount: dependentCount,
      paragraphCount: spec.detailedDescription.paragraphs.length,
      drawingsReferenced: drawingCount
    }
  };
}
