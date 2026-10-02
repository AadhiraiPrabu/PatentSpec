import { PatentSpecification } from '../types';

export function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportLatexFile(spec: PatentSpecification) {
  const cleanTitle = (spec.title || 'patent_specification').toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 40);
  downloadFile(`${cleanTitle}_patent.tex`, spec.latexCode, 'application/x-latex');
}

export function exportWordDocument(spec: PatentSpecification) {
  const cleanTitle = (spec.title || 'patent_specification').toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 40);
  
  // Format as clean HTML that Microsoft Word / LibreOffice seamlessly opens as formatted .doc
  const htmlContent = `
<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<title>${spec.title}</title>
<style>
  @page {
    size: 21cm 29.7cm;
    margin: 2.54cm 2.54cm 2.54cm 2.54cm;
  }
  body {
    font-family: 'Times New Roman', serif;
    font-size: 12pt;
    line-height: 1.5;
    color: #000000;
  }
  h1 { font-size: 14pt; text-align: center; text-transform: uppercase; font-weight: bold; margin-bottom: 12pt; }
  h2 { font-size: 12pt; text-transform: uppercase; font-weight: bold; margin-top: 18pt; margin-bottom: 6pt; }
  p { margin-bottom: 10pt; text-align: justify; }
  .center { text-align: center; }
  .claim-item { margin-bottom: 12pt; text-indent: -1.5cm; padding-left: 1.5cm; }
  .paragraph-num { font-weight: bold; }
</style>
</head>
<body>
  <div class="center">
    <p><b>FORM 2</b><br>
    <b>THE PATENTS ACT, 1970 (39 of 1970)</b><br>
    &<br>
    <b>THE PATENTS RULES, 2003</b><br>
    <br>
    <b>COMPLETE SPECIFICATION</b><br>
    <i>(See section 10 and rule 13)</i></p>
  </div>

  <h2>1. TITLE OF THE INVENTION</h2>
  <p><b>${spec.title}</b></p>

  <h2>2. APPLICANT(S)</h2>
  <p><b>Name:</b> ${spec.metadata?.applicant?.name || 'Applicant'}<br>
  <b>Nationality:</b> ${spec.metadata?.applicant?.nationality || 'Indian'}<br>
  <b>Address:</b> ${spec.metadata?.applicant?.address || 'As on Record'}</p>

  <h2>3. INVENTOR(S)</h2>
  <p>${spec.metadata?.inventors?.map(i => `<b>${i.name}</b>${i.affiliation ? ` (${i.affiliation})` : ''}`).join('<br>') || 'As on Record'}</p>

  <h2>4. PREAMBLE TO THE DESCRIPTION</h2>
  <p><i>${spec.preamble}</i></p>
  <hr/>

  <h2>FIELD OF THE INVENTION</h2>
  <p>${spec.fieldOfInvention}</p>

  <h2>BACKGROUND OF THE INVENTION AND PRIOR ART</h2>
  <p>${spec.backgroundOfInvention}</p>
  ${spec.priorArtLimitations?.length ? `<ul>${spec.priorArtLimitations.map(l => `<li>${l}</li>`).join('')}</ul>` : ''}

  ${spec.objectsOfInvention?.length ? `
  <h2>OBJECTS OF THE INVENTION</h2>
  <ul>${spec.objectsOfInvention.map(o => `<li>${o}</li>`).join('')}</ul>
  ` : ''}

  <h2>SUMMARY OF THE INVENTION</h2>
  <p>${spec.summaryOfInvention}</p>

  ${spec.briefDescriptionOfDrawings?.length ? `
  <h2>BRIEF DESCRIPTION OF THE ACCOMPANYING DRAWINGS</h2>
  ${spec.briefDescriptionOfDrawings.map(d => `<p><b>${d.figNumber}:</b> ${d.description}</p>`).join('')}
  ` : ''}

  <h2>DETAILED DESCRIPTION OF THE INVENTION</h2>
  ${spec.detailedDescription?.paragraphs?.map(p => `<p><span class="paragraph-num">${p.id}</span> ${p.text}</p>`).join('') || ''}

  <br clear="all" style="page-break-before:always" />
  <h2>WE CLAIM:</h2>
  <ol>
    ${spec.claims?.map(c => `<li class="claim-item">${c.text}</li>`).join('') || ''}
  </ol>

  <br clear="all" style="page-break-before:always" />
  <div class="center">
    <h2>ABSTRACT</h2>
    <p><b>${spec.title}</b></p>
  </div>
  <p>${spec.abstract?.text || ''}</p>
</body>
</html>
`;

  downloadFile(`${cleanTitle}_patent.doc`, htmlContent, 'application/msword');
}

export function exportPlainText(spec: PatentSpecification) {
  const cleanTitle = (spec.title || 'patent_specification').toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 40);
  
  let txt = `================================================================================
PATENT SPECIFICATION - COMPLETE SPECIFICATION
Jurisdiction: ${spec.metadata?.jurisdiction || 'IPO'}
================================================================================

TITLE OF THE INVENTION:
${spec.title}

APPLICANT:
${spec.metadata?.applicant?.name || 'Applicant'}

INVENTOR(S):
${spec.metadata?.inventors?.map(i => i.name).join(', ') || ''}

PREAMBLE TO THE DESCRIPTION:
${spec.preamble}

--------------------------------------------------------------------------------
FIELD OF THE INVENTION:
${spec.fieldOfInvention}

--------------------------------------------------------------------------------
BACKGROUND OF THE INVENTION:
${spec.backgroundOfInvention}

Prior Art Deficiencies:
${spec.priorArtLimitations?.map((l, i) => `${i + 1}. ${l}`).join('\n') || ''}

--------------------------------------------------------------------------------
OBJECTS OF THE INVENTION:
${spec.objectsOfInvention?.map((o, i) => `${i + 1}. ${o}`).join('\n') || ''}

--------------------------------------------------------------------------------
SUMMARY OF THE INVENTION:
${spec.summaryOfInvention}

--------------------------------------------------------------------------------
BRIEF DESCRIPTION OF ACCOMPANYING DRAWINGS:
${spec.briefDescriptionOfDrawings?.map(d => `${d.figNumber}: ${d.description}`).join('\n') || ''}

--------------------------------------------------------------------------------
DETAILED DESCRIPTION OF THE INVENTION:
${spec.detailedDescription?.paragraphs?.map(p => `${p.id} ${p.text}`).join('\n\n') || ''}

================================================================================
CLAIMS:
${spec.claims?.map(c => `${c.number}. ${c.text}`).join('\n\n') || ''}

================================================================================
ABSTRACT:
${spec.abstract?.text || ''}
(Word Count: ${spec.abstract?.wordCount || 0} words)
`;

  downloadFile(`${cleanTitle}_patent.txt`, txt, 'text/plain');
}
