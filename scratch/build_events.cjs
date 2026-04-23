const fs = require('fs');
const path = require('path');

const rawDataPath = path.join(__dirname, '../src/data/eventInfoRaw.json');
const mockEventsPath = path.join(__dirname, '../src/data/mockEvents.js');
const eventInfoPath = path.join(__dirname, '../src/data/eventInfo.js');

const rawData = JSON.parse(fs.readFileSync(rawDataPath, 'utf-8'));

// A set of fallback icons mapping keywords
const iconMap = {
  'accounting': 'calculator',
  'finance': 'landmark',
  'business': 'briefcase',
  'communication': 'mail',
  'technology': 'cpu',
  'programming': 'code',
  'design': 'palette',
  'marketing': 'target',
  'management': 'users',
  'leadership': 'crown',
  'speaking': 'mic',
  'health': 'heart-pulse',
  'security': 'shield',
  'data': 'database',
  'economics': 'trending-up',
};

function getIcon(name) {
  const lowerName = name.toLowerCase();
  for (const [key, icon] of Object.entries(iconMap)) {
    if (lowerName.includes(key)) return icon;
  }
  return 'file-text';
}

function getCategory(name) {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('marketing') || lowerName.includes('sales') || lowerName.includes('advertising')) return 'Marketing';
  if (lowerName.includes('tech') || lowerName.includes('program') || lowerName.includes('design') || lowerName.includes('cyber') || lowerName.includes('data') || lowerName.includes('network') || lowerName.includes('computer')) return 'Technology';
  if (lowerName.includes('financ') || lowerName.includes('account') || lowerName.includes('econom') || lowerName.includes('invest')) return 'Finance';
  if (lowerName.includes('speak') || lowerName.includes('communicat') || lowerName.includes('journalism') || lowerName.includes('interview')) return 'Communication';
  if (lowerName.includes('lead') || lowerName.includes('parliament')) return 'Leadership';
  return 'Business';
}

function cleanText(text, eventName) {
  // Remove the standard header/footers
  let cleaned = text.replace(/2025-2026 Competitive Events Guidelines/gi, '');
  cleaned = cleaned.replace(/© 2026 National Future Business Leaders of America, Inc.*?prior written permission./gis, '');
  
  // Extract a description (usually paragraph before Event Overview)
  const overviewRegex = new RegExp(`(${eventName.substring(0, 10)}[\\w\\s]* challenges competitors.*?)(?=Event Overview|Division)`, 'is');
  let descriptionMatch = cleaned.match(overviewRegex);
  let description = descriptionMatch ? descriptionMatch[1].trim() : "Review the comprehensive event guidelines and competencies below.";
  
  // Clean up excessive newlines
  cleaned = cleaned.replace(/\s*\n\s*/g, '\n').replace(/\n{3,}/g, '\n\n');
  
  // Try to parse Event Type and Category
  let typeMatch = cleaned.match(/Event Type\s*(Individual|Team|Individual or Team)/i);
  let categoryMatch = cleaned.match(/Event Category\s*(Objective Test|Presentation|Role Play|Production|Pre-judged)/i);

  // Extract only the relevant portion!
  let studyGuideMatch = cleaned.indexOf('Study Guide:');
  if (studyGuideMatch === -1) {
    studyGuideMatch = cleaned.indexOf('Knowledge Areas');
  }
  
  let finalFullText = cleaned;
  
  if (studyGuideMatch !== -1) {
    // Objective Test / Study Guide Event
    finalFullText = cleaned.substring(studyGuideMatch);
    const endOfGuideRegex = /(Rating Sheet|Expectation Item|Penalty Points|Event Administration|References for Knowledge Areas|Important FBLA Documents|Eligibility Requirements|Presentation Protocols|Staff Only: Penalty Points|Project Evaluation|Video Time|Role Play Presentation)$/im;
    
    // We want the FIRST match
    const matchEnd = finalFullText.match(/(Rating Sheet|Expectation Item|Penalty Points|Event Administration|References for Knowledge Areas|Important FBLA Documents|Eligibility Requirements|Presentation Protocols|Staff Only: Penalty Points|Project Evaluation|Video Time|Role Play Presentation)/i);
    if (matchEnd) {
      finalFullText = finalFullText.substring(0, matchEnd.index).trim();
    }
  } else {
    // Presentation / Role Play Event without a Study Guide
    let topicMatch = cleaned.indexOf('2025-2026 Topic');
    if (topicMatch === -1) {
      topicMatch = cleaned.search(/20\d\d-20\d\d Topic/i);
    }
    
    if (topicMatch !== -1) {
      finalFullText = cleaned.substring(topicMatch);
      // For these, we want to cut off right before "District/Region/Section" or administrative blocks
      const endOfTopicRegex = /(District\/Region\/Section|Required Competition Items|Important FBLA Documents|Eligibility Requirements)/i;
      const matchEnd = finalFullText.match(endOfTopicRegex);
      if (matchEnd) {
        finalFullText = finalFullText.substring(0, matchEnd.index).trim();
      }
    } else {
      // Just generic cleanup if neither topic nor study guide exists
      const endOfGenericRegex = /(Rating Sheet|Expectation Item|Penalty Points|Important FBLA Documents|Eligibility Requirements)/i;
      const matchEnd = finalFullText.match(endOfGenericRegex);
      // Only crop if it's found far enough down to not crop the whole thing
      if (matchEnd && matchEnd.index > 200) {
        finalFullText = finalFullText.substring(0, matchEnd.index).trim();
      }
    }
  }
  
  // Strip any remaining random footers or "Page X of Y" artifacts
  finalFullText = finalFullText.replace(/.*Page \d+ of \d+.*/gi, '');
  
  // Remove floating event names that were part of the PDF headers/footers
  // Remove floating event names that were part of the PDF headers/footers
  const strippedName = eventName.replace(/\s+/g, '').replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g, '\\$&');
  const fuzzyRegexString = strippedName.split('').join('\\s*');
  const fuzzyRegex = new RegExp(`^\\s*${fuzzyRegexString}\\s*$`, 'gim');
  finalFullText = finalFullText.replace(fuzzyRegex, '');

  // Clean up any double newlines made by stripping
  finalFullText = finalFullText.replace(/\n\s*\n/g, '\n\n').trim();

  return {
    description: description.replace(/\s+/g, ' '),
    type: typeMatch ? typeMatch[1].trim() : "Unknown",
    testCategory: categoryMatch ? categoryMatch[1].trim() : "Unknown",
    fullText: finalFullText
  };
}

const fblaEvents = [];
const eventInfoData = {};

let i = 0;
for (const [slug, data] of Object.entries(rawData)) {
  const { name, infoText } = data;
  
  const icon = getIcon(name);
  const category = getCategory(name);
  
  const parsedData = cleanText(infoText, name);
  eventInfoData[slug] = parsedData;

  fblaEvents.push({
    name,
    slug,
    category,
    testCategory: parsedData.testCategory,
    icon
  });
  
  i++;
}

fblaEvents.sort((a, b) => a.name.localeCompare(b.name));

const mockEventsContent = `export const FBLA_EVENTS = ${JSON.stringify(fblaEvents, null, 2)};

export const EVENT_CATEGORIES = [
  "All",
  "Business",
  "Finance",
  "Technology",
  "Communication",
  "Marketing",
  "Leadership",
];

export function getEventBySlug(slug) {
  return FBLA_EVENTS.find(e => e.slug === slug);
}
`;

const eventInfoContent = `export const EVENT_INFO = ${JSON.stringify(eventInfoData, null, 2)};
`;

fs.writeFileSync(mockEventsPath, mockEventsContent, 'utf-8');
console.log('Updated mockEvents.js');

fs.writeFileSync(eventInfoPath, eventInfoContent, 'utf-8');
console.log('Generated eventInfo.js');
