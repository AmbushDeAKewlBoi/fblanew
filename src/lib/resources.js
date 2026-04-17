// Shared labels and small helpers for resource metadata.
// Used by ResourceCard, ResourceDetail, MyUploads, AdminDashboard.

export const RESOURCE_TYPE_LABELS = {
  presentation: 'Presentation',
  roleplay: 'Roleplay',
  questions: 'Questions',
  study_guide: 'Study Guide',
  other: 'Other',
};

export const RESOURCE_TYPE_LABELS_LONG = {
  ...RESOURCE_TYPE_LABELS,
  roleplay: 'Roleplay Script',
  questions: 'Practice Questions',
};

export function labelForType(type, long = false) {
  const src = long ? RESOURCE_TYPE_LABELS_LONG : RESOURCE_TYPE_LABELS;
  return src[type] || src.other;
}
