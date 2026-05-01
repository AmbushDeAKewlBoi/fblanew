const fs = require('fs');
const path = require('path');

// NOTE: You will need to install @google/genai or similar SDK, or just use the REST API.
// Run: npm install @google/genai

const { GoogleGenAI } = require('@google/genai');

// NOTE: Set your API key here or in an environment variable before running
// process.env.GEMINI_API_KEY = "YOUR_API_KEY";
const ai = new GoogleGenAI({});

async function generateMissingQuestions() {
  const existingPath = path.join(__dirname, '../src/data/existingQuestions.json');
  const existingQuestions = JSON.parse(fs.readFileSync(existingPath, 'utf8'));
  
  const eventInfoPath = path.join(__dirname, '../src/data/eventInfo.js');
  const eventInfoRaw = fs.readFileSync(eventInfoPath, 'utf8');
  
  // Extract EVENT_INFO object from JS file safely
  const eventInfoStr = eventInfoRaw.replace(/export const EVENT_INFO = /g, 'return ').replace(/export function.*/s, '');
  const EVENT_INFO = new Function(eventInfoStr)();

  const finalQuestions = { ...existingQuestions };

  const TARGET_PER_DIFF = 100;
  
  console.log('Calculating remaining deficits...');

  for (const slug of Object.keys(existingQuestions)) {
    const data = existingQuestions[slug];
    const studyGuideText = EVENT_INFO[slug] ? EVENT_INFO[slug].fullText : "General business concepts.";
    const eventParams = EVENT_INFO[slug] || {};

    for (const difficulty of ['easy', 'medium', 'hard']) {
      const BATCH_SIZE = 25;
      
      while (data[difficulty].length < TARGET_PER_DIFF) {
        const currentCount = data[difficulty].length;
        const deficit = TARGET_PER_DIFF - currentCount;
        const toGenerate = Math.min(deficit, BATCH_SIZE);

        console.log(`[${slug}] missing ${deficit} ${difficulty} questions. Generating batch of ${toGenerate}...`);
        
        // --- API INTEGRATION ---
        
        const prompt = `You are an expert FBLA test writer for the event: ${eventParams.name || slug}.
Please generate exactly ${toGenerate} multiple-choice questions of ${difficulty.toUpperCase()} difficulty level.
Base your questions strictly on this study guide content: 
"""
${studyGuideText.substring(0, 5000)}
"""

Return your response ONLY as a JSON array of objects, with no markdown formatting. Each object must have:
- "question": string
- "options": array of 4 strings
- "answerIndex": integer 0-3
- "explanation": string`;

        try {
          const response = await ai.models.generateContent({
             model: 'gemini-2.5-flash',
             contents: prompt,
             config: {
                responseMimeType: "application/json",
             }
          });

          // Standardize JSON format 
          let rawText = response.text;
          const generatedQsRaw = JSON.parse(rawText);
          const generatedQs = Array.isArray(generatedQsRaw) ? generatedQsRaw : (generatedQsRaw.questions || Object.values(generatedQsRaw)[0] || []);
          
          if (!generatedQs || generatedQs.length === 0) {
              console.log(`[${slug}] ${difficulty}: API returned 0 questions. Retrying...`);
              continue; // try again
          }

          // Truncate if it generated too many
          const validQs = generatedQs.slice(0, deficit);

          finalQuestions[slug][difficulty].push(...validQs);
          console.log(`[${slug}] ${difficulty}: Successfully added ${validQs.length} questions.`);

          // Save progressively to prevent data loss on crash
          fs.writeFileSync(existingPath, JSON.stringify(finalQuestions, null, 2));

        } catch (error) {
          console.error(`[${slug}] Error generating ${difficulty} questions:`, error.message);
          if (error.message.includes('429') || error.message.includes('Quota') || error.message.includes('RESOURCE_EXHAUSTED')) {
             console.log('Daily quota likely exhausted. Sleeping for 1 hour before next attempt...');
             await new Promise(r => setTimeout(r, 3600000)); // 1 hour
          } else {
             console.log('Network/Timeout error. Waiting 35 seconds before retrying...');
             await new Promise(r => setTimeout(r, 35000));
          }
        }
      }
    }
  }

  console.log('Generation complete!');
}

generateMissingQuestions();
