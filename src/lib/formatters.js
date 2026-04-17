// Shared formatters used across pages and components.
// Keep this module small and dependency-free so it can be imported anywhere.

export function formatFileSize(bytes) {
  if (bytes == null) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Short relative time, e.g. "2h", "5d", "3mo"
export function timeAgoShort(input) {
  const date = input instanceof Date ? input : new Date(input);
  const seconds = Math.max(1, Math.floor((Date.now() - date.getTime()) / 1000));
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  if (months > 0) return `${months}mo`;
  if (weeks > 0) return `${weeks}w`;
  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return 'now';
}

// Verbose relative time, e.g. "2 hours ago"
export function timeAgo(input) {
  const t = timeAgoShort(input);
  if (t === 'now') return 'just now';
  return `${t} ago`;
}

// "Apr 16, 3:45 PM"
export function formatDateTime(input) {
  return new Date(input).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

// "April 16, 2026"
export function formatDateLong(input) {
  return new Date(input).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Two-letter initials: "Sarah Mitchell" -> "SM"
export function initials(name) {
  if (!name) return '?';
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
