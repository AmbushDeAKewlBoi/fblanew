import { CHAPTERS } from './mockUsers';

export const SCHOOL_LEADERBOARD = [
  {
    rank: 1,
    chapter: CHAPTERS[0], // Independence HS
    metrics: { totalUploads: 0, totalUpvotes: 0, totalDownloads: 0 },
  },
  {
    rank: 2,
    chapter: CHAPTERS[1], // Broad Run HS
    metrics: { totalUploads: 0, totalUpvotes: 0, totalDownloads: 0 },
  },
  {
    rank: 3,
    chapter: CHAPTERS[2], // Riverside HS
    metrics: { totalUploads: 0, totalUpvotes: 0, totalDownloads: 0 },
  },
  {
    rank: 4,
    chapter: { id: 4, name: "Stone Bridge High School", region: "Northern", state: "Virginia" },
    metrics: { totalUploads: 0, totalUpvotes: 0, totalDownloads: 0 },
  },
  {
    rank: 5,
    chapter: { id: 5, name: "Potomac Falls High School", region: "Shenandoah", state: "Virginia" },
    metrics: { totalUploads: 0, totalUpvotes: 0, totalDownloads: 0 },
  },
  {
    rank: 6,
    chapter: { id: 6, name: "Woodgrove High School", region: "Shenandoah", state: "Virginia" },
    metrics: { totalUploads: 0, totalUpvotes: 0, totalDownloads: 0 },
  },
  {
    rank: 7,
    chapter: { id: 7, name: "Loudoun Valley High School", region: "Shenandoah", state: "Virginia" },
    metrics: { totalUploads: 0, totalUpvotes: 0, totalDownloads: 0 },
  },
  {
    rank: 8,
    chapter: { id: 8, name: "Tuscarora High School", region: "Northern", state: "Virginia" },
    metrics: { totalUploads: 0, totalUpvotes: 0, totalDownloads: 0 },
  },
  {
    rank: 9,
    chapter: { id: 9, name: "Rock Ridge High School", region: "Northern", state: "Virginia" },
    metrics: { totalUploads: 0, totalUpvotes: 0, totalDownloads: 0 },
  },
  {
    rank: 10,
    chapter: { id: 10, name: "Lightridge High School", region: "Northern", state: "Virginia" },
    metrics: { totalUploads: 0, totalUpvotes: 0, totalDownloads: 0 },
  },
];

export const REGION_LEADERBOARD = [
  {
    rank: 1,
    region: { name: "Shenandoah", state: "Virginia" },
    metrics: { totalUploads: 0, totalUpvotes: 0, totalDownloads: 0 },
  },
  {
    rank: 2,
    region: { name: "Northern", state: "Virginia" },
    metrics: { totalUploads: 0, totalUpvotes: 0, totalDownloads: 0 },
  },
  {
    rank: 3,
    region: { name: "Central", state: "Virginia" },
    metrics: { totalUploads: 0, totalUpvotes: 0, totalDownloads: 0 },
  },
  {
    rank: 4,
    region: { name: "Southwest", state: "Virginia" },
    metrics: { totalUploads: 0, totalUpvotes: 0, totalDownloads: 0 },
  },
  {
    rank: 5,
    region: { name: "Tidewater", state: "Virginia" },
    metrics: { totalUploads: 0, totalUpvotes: 0, totalDownloads: 0 },
  },
];

export const STATE_LEADERBOARD = [
  {
    rank: 1,
    state: { name: "Virginia" },
    metrics: { totalUploads: 0, totalUpvotes: 0, totalDownloads: 0 },
  },
  {
    rank: 2,
    state: { name: "Maryland" },
    metrics: { totalUploads: 0, totalUpvotes: 0, totalDownloads: 0 },
  },
  {
    rank: 3,
    state: { name: "North Carolina" },
    metrics: { totalUploads: 0, totalUpvotes: 0, totalDownloads: 0 },
  },
];
