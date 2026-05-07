export const RESOURCE_TYPES = [
  { value: 'presentation', label: 'Presentation', icon: 'presentation' },
  { value: 'roleplay', label: 'Roleplay Script', icon: 'theater' },
  { value: 'questions', label: 'Practice Questions', icon: 'help-circle' },
  { value: 'study_guide', label: 'Study Guide', icon: 'book-open' },
  { value: 'other', label: 'Other', icon: 'file' },
];

export const VISIBILITY_LEVELS = [
  { value: 'school', label: 'Chapter Only', iconName: 'school', description: 'Only your chapter can see this' },
  { value: 'region', label: 'Regional', iconName: 'mapPin', description: 'All chapters in your region' },
  { value: 'state', label: 'State', iconName: 'map', description: 'All chapters in your state' },
  { value: 'public', label: 'Public', iconName: 'globe', description: 'Everyone on the platform' },
];
