import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
// @ts-ignore
import mammoth from 'mammoth';
import { generatePatentLatex } from './src/utils/latexGenerator';
import { PatentSpecification } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Lazy initialization for Google GenAI
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set. Requests will fail if Gemini is called.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Extract text from uploaded document (DOCX, TXT, etc.)
app.post('/api/extract-doc', async (req: Request, res: Response) => {
  try {
    const { base64Data, mimeType, fileName } = req.body;
    if (!base64Data) {
      return res.status(400).json({ error: 'No file data provided' });
    }

    const buffer = Buffer.from(base64Data, 'base64');

    // Handle DOCX files with mammoth
    if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName?.endsWith('.docx')
    ) {
      const result = await mammoth.extractRawText({ buffer });
      return res.json({ text: result.value });
    }

    // Handle plain text / markdown / latex files
    if (
      mimeType?.startsWith('text/') ||
      fileName?.endsWith('.txt') ||
      fileName?.endsWith('.md') ||
      fileName?.endsWith('.tex')
    ) {
      return res.json({ text: buffer.toString('utf-8') });
    }

    // If it's a PDF, we can use Gemini 3.8 Flash to extract structured text directly
    if (mimeType === 'application/pdf' || fileName?.endsWith('.pdf')) {
      const ai = getGenAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: 'application/pdf',
                data: base64Data,
              },
            },
            {
              text: 'Extract the full text and sections of this academic/technical document cleanly into markdown, preserving title, authors, abstract, headings, mathematical relationships, and figure captions.',
            },
          ],
        },
      });
      return res.json({ text: response.text || '' });
    }

    // Fallback utf-8
    return res.json({ text: buffer.toString('utf-8') });
  } catch (error: any) {
    console.error('Extraction error:', error);
    res.status(500).json({ error: error.message || 'Failed to extract text from document' });
  }
});

// Format Patent Specification from input text or document
app.post('/api/format-patent', async (req: Request, res: Response) => {
  try {
    const {
      inputContent,
      base64File,
      fileMimeType,
      fileName,
      jurisdiction = 'IPO',
      filingType = 'complete',
      applicantName = 'National Institute of Technology / Academic Institution',
      inventors = []
    } = req.body;

    if (!inputContent && !base64File) {
      return res.status(400).json({ error: 'Either input text or uploaded document file is required.' });
    }

    const ai = getGenAI();

    // Prepare content parts for Gemini
    const parts: any[] = [];

    // If PDF file is attached, attach as inlineData
    if (base64File && (fileMimeType === 'application/pdf' || fileName?.endsWith('.pdf'))) {
      parts.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: base64File,
        },
      });
    }

    // System instruction specifically tailored for College Professors converting research to Patents
    const systemPrompt = `You are a Senior Patent Attorney and Registered Patent Agent specializing in patent prosecution for university professors and academic research institutions.
Your task is to transform an unstructured academic research paper, manuscript draft, or lab report into an official, grant-ready Patent Specification compliant with the statutory requirements of the chosen patent office: ${jurisdiction} (Indian Patent Office Form 2 Complete Specification / USPTO 37 CFR 1.77 / PCT WIPO ST.10/C).

CRITICAL PATENT EXAMINATION RULES YOU MUST ENFORCE:
1. STRIP ACADEMIC COLLOQUIALISMS:
   - Ban words like "In this paper we propose", "Our research shows", "We have presented", "Future work".
   - Replace with objective statutory patent language: "In an embodiment of the present disclosure", "According to an aspect", "The present invention provides".
   - Do NOT include academic citations like [1], [2], or "Patel et al.". Convert them into generalized "Prior Art Limitations" (e.g. "Existing conventional systems rely on... which suffer from...").

2. TITLE OF INVENTION:
   - Must be precise, non-promotional, technical, and in UPPERCASE (e.g. "AN AUTONOMOUS IoT SENSOR SYSTEM AND METHOD FOR SUBSURFACE SOIL MONITORING").

3. STATUTORY SECTIONS TO PRODUCE:
   - PREAMBLE: Official preamble (e.g. for IPO: "The following specification particularly describes the invention and the manner in which it is to be performed.")
   - FIELD OF INVENTION: Technical domain classification.
   - BACKGROUND OF THE INVENTION: Clear articulation of unsolved problems in existing systems.
   - PRIOR ART LIMITATIONS: Specific technical bottlenecks.
   - OBJECTS OF THE INVENTION: Primary object and 3-5 distinct sub-objects.
   - SUMMARY OF THE INVENTION: Core inventive step and structural apparatus.
   - BRIEF DESCRIPTION OF DRAWINGS: Formal list of drawings (FIG. 1, FIG. 2...) synthesized from the paper's diagrams or architecture, including assigned reference numerals.
   - DETAILED DESCRIPTION OF PREFERRED EMBODIMENTS:
     - Each paragraph MUST have an official sequential ID like [0001], [0002], [0003]...
     - Assign reference numerals in the description matching drawings (e.g. system 100, probe body 102, sensing ring 104, microcontroller 106, wireless transceiver 108).
     - Include working examples and best mode of operation.
   - CLAIMS (MOST CRITICAL SECTION):
     - SINGLE-SENTENCE RULE: Every claim must be ONE grammatical sentence starting with a capital letter and ending with a single terminating period (.).
     - Independent Claim 1 (System / Apparatus): structured with preamble, open-ended transition ("comprising:"), and clear structural sub-components separated by semicolons (;).
     - Independent Claim (Method) or Dependent Claims (Claim 2 onwards): properly referencing antecedent claims (e.g. "2. The system as claimed in claim 1, wherein the sensing ring comprises...").
     - Strict antecedent basis: introduce elements as "a [element]" first, and subsequently reference as "the [element]" or "said [element]".
   - ABSTRACT:
     - MUST BE STRICTLY UNDER 150 WORDS (officially rejected if > 150 words).
     - MUST include key reference numerals in parentheses, e.g. "sensor assembly (102)".
   - ACADEMIC ISSUES FIXED:
     - Provide a bullet list of academic errors repaired (e.g. "Converted academic literature citations to prior art drawbacks", "Transformed paper methodology into 7 statutory claims", "Formatted abstract to 118 words with reference numerals").`;

    let userInstruction = `Format the following college research paper / draft manuscript into a complete ${jurisdiction} Patent Specification:\n\n`;

    if (inputContent) {
      userInstruction += `--- ACADEMIC PAPER CONTENT ---\n${inputContent}\n\n`;
    }

    userInstruction += `Target Jurisdiction: ${jurisdiction}\nFiling Type: ${filingType}\nApplicant: ${applicantName}\nInventors: ${JSON.stringify(inventors)}`;

    parts.push({ text: userInstruction });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Formal uppercase patent title' },
            preamble: { type: Type.STRING, description: 'Official statutory preamble' },
            fieldOfInvention: { type: Type.STRING, description: 'Field of the invention' },
            backgroundOfInvention: { type: Type.STRING, description: 'Background and problem statement' },
            priorArtLimitations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of specific prior art bottlenecks'
            },
            objectsOfInvention: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of primary and secondary objects'
            },
            summaryOfInvention: { type: Type.STRING, description: 'Summary of the invention' },
            briefDescriptionOfDrawings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  figNumber: { type: Type.STRING, description: 'e.g. FIG. 1' },
                  description: { type: Type.STRING, description: 'Figure description' },
                  referenceNumerals: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        numeral: { type: Type.STRING, description: 'e.g. 100' },
                        element: { type: Type.STRING, description: 'e.g. sensor probe' }
                      },
                      required: ['numeral', 'element']
                    }
                  }
                },
                required: ['figNumber', 'description', 'referenceNumerals']
              }
            },
            detailedDescription: {
              type: Type.OBJECT,
              properties: {
                paragraphs: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING, description: 'e.g. [0001]' },
                      text: { type: Type.STRING, description: 'Paragraph text' }
                    },
                    required: ['id', 'text']
                  }
                }
              },
              required: ['paragraphs']
            },
            claims: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  number: { type: Type.INTEGER },
                  type: { type: Type.STRING, description: 'independent or dependent' },
                  dependsOn: { type: Type.INTEGER },
                  category: { type: Type.STRING, description: 'system, method, apparatus, composition' },
                  text: { type: Type.STRING, description: 'Full claim text ending in single period' }
                },
                required: ['number', 'type', 'category', 'text']
              }
            },
            abstractText: { type: Type.STRING, description: 'Strictly under 150 words with reference numerals' },
            academicIssuesFixed: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Explanations of academic habits fixed into patent legal requirements'
            }
          },
          required: [
            'title',
            'preamble',
            'fieldOfInvention',
            'backgroundOfInvention',
            'summaryOfInvention',
            'detailedDescription',
            'claims',
            'abstractText',
            'academicIssuesFixed'
          ]
        }
      }
    });

    const parsedData = JSON.parse(response.text || '{}');

    // Build the complete PatentSpecification structure
    const abstractWords = (parsedData.abstractText || '').trim().split(/\s+/).filter(Boolean).length;

    const specification: PatentSpecification = {
      metadata: {
        title: parsedData.title,
        inventors: inventors.length > 0 ? inventors : [{ name: 'Inventor(s) as designated on record' }],
        applicant: {
          name: applicantName || 'College / University Research Foundation',
          nationality: jurisdiction === 'IPO' ? 'Indian' : 'United States',
          address: 'Campus Address on Record'
        },
        filingType: filingType as any,
        jurisdiction: jurisdiction as any,
        internationalClassification: 'G06F / H04L / A01G'
      },
      title: parsedData.title,
      preamble: parsedData.preamble,
      fieldOfInvention: parsedData.fieldOfInvention,
      backgroundOfInvention: parsedData.backgroundOfInvention,
      priorArtLimitations: parsedData.priorArtLimitations || [],
      objectsOfInvention: parsedData.objectsOfInvention || [],
      summaryOfInvention: parsedData.summaryOfInvention,
      briefDescriptionOfDrawings: parsedData.briefDescriptionOfDrawings || [],
      detailedDescription: parsedData.detailedDescription,
      claims: (parsedData.claims || []).map((c: any) => ({
        number: c.number,
        type: c.type,
        dependsOn: c.dependsOn,
        category: c.category || 'system',
        text: c.text
      })),
      abstract: {
        text: parsedData.abstractText,
        wordCount: abstractWords
      },
      latexCode: '', // will generate below
      academicIssuesFixed: parsedData.academicIssuesFixed || []
    };

    // Generate compliant LaTeX code
    specification.latexCode = generatePatentLatex(specification);

    res.json(specification);
  } catch (error: any) {
    console.error('Patent formatting error:', error);
    res.status(500).json({
      error: error.message || 'An error occurred while formatting the patent specification.'
    });
  }
});

// Start server
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PatentSpec Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
