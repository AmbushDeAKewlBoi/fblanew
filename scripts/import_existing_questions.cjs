const fs = require('fs');
const vm = require('vm');
const path = require('path');

// 1. Load combined_question_bank.js
const bankPath = path.join(__dirname, '../scratch/fblahelper/combined_question_bank.js');
const content = fs.readFileSync(bankPath, 'utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(content, sandbox);
const bank = sandbox.window.COMBINED_QUESTION_BANK;

// 2. Load mockEvents.js
const mockEventsPath = path.join(__dirname, '../src/data/mockEvents.js');
const mockEventsStr = fs.readFileSync(mockEventsPath, 'utf8');
const fblaEventsCode = mockEventsStr
  .replace(/export const FBLA_EVENTS/g, 'var FBLA_EVENTS')
  .replace(/export const EVENT_CATEGORIES/g, 'var EVENT_CATEGORIES')
  .replace(/export function.*/s, '');
eval(fblaEventsCode);

const tests = FBLA_EVENTS.filter(e => e.testCategory === 'Objective Test');

const formatStr = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '');

const existingQuestions = {};

for (const e of tests) {
  const norm = formatStr(e.name);
  let matchedKey = null;

  // Exact or near-exact match
  for (const bk in bank.banks) {
    if (formatStr(bk) === norm) {
      matchedKey = bk;
      break;
    }
  }

  // Fuzzy match
  if (!matchedKey) {
     for (const bk in bank.banks) {
       if (formatStr(bk).includes(norm) || norm.includes(formatStr(bk))) {
           // careful with 'accounting' matching 'advanced accounting'
           if (norm === 'accounting' && formatStr(bk) === 'advancedaccounting') continue;
           if (norm === 'marketing' && formatStr(bk).includes('marketing')) continue; // Marketing vs Intro to Marketing
           matchedKey = bk;
           break;
       }
     }
  }

  // Handle some manual edge cases
  if (!matchedKey) {
     if (norm === 'datascienceandai') matchedKey = 'Data Science & AI';
     if (norm === 'introductiontoparliamentaryprocedure') matchedKey = 'Introduction to Parli Pro';
     if (norm === 'introductiontoretailandmerchandising') matchedKey = 'Retail Management'; // fallback if they don't have intro
     // other missing ones might just be empty
  }

  const questions = matchedKey && bank.banks[matchedKey] ? bank.banks[matchedKey] : [];
  
  if (questions.length === 0) {
      existingQuestions[e.slug] = { easy: [], medium: [], hard: [] };
      continue;
  }

  // Deduplicate exactly identical questions
  const uniqueQuestions = [];
  const seen = new Set();
  for (const q of questions) {
      if (!q.q || typeof q.q !== 'string') continue;
      const qText = q.q.trim();
      if (!seen.has(qText)) {
          seen.add(qText);
          uniqueQuestions.push(q);
      }
  }

  // 3. Sort by difficulty heuristic (length of text)
  uniqueQuestions.sort((a, b) => {
      const aLen = a.q.length + (a.options ? a.options.join('').length : 0);
      const bLen = b.q.length + (b.options ? b.options.join('').length : 0);
      return aLen - bLen;
  });

  // 4. Divide into 3 buckets
  const total = uniqueQuestions.length;
  const bucketSize = Math.ceil(total / 3);
  
  const easy = uniqueQuestions.slice(0, bucketSize);
  const medium = uniqueQuestions.slice(bucketSize, bucketSize * 2);
  const hard = uniqueQuestions.slice(bucketSize * 2);

  // Map to a cleaner format
  const cleanFormat = (qArr) => qArr.map(q => ({
      question: q.q,
      options: q.options || [],
      answerIndex: q.answer || 0,
      explanation: q.explain || ''
  }));

  existingQuestions[e.slug] = {
      easy: cleanFormat(easy),
      medium: cleanFormat(medium),
      hard: cleanFormat(hard)
  };
}

const outputPath = path.join(__dirname, '../src/data/existingQuestions.json');
fs.writeFileSync(outputPath, JSON.stringify(existingQuestions, null, 2));

console.log('Successfully sorted and written existing questions to src/data/existingQuestions.json');
console.log('Summary of available questions:');
let totalAvailable = 0;
for (const [slug, data] of Object.entries(existingQuestions)) {
   const c = data.easy.length + data.medium.length + data.hard.length;
   totalAvailable += c;
   console.log(`${slug}: ${data.easy.length} easy, ${data.medium.length} medium, ${data.hard.length} hard (Total: ${c})`);
}
console.log(`\nGrand Total: ${totalAvailable} questions extracted.`);
