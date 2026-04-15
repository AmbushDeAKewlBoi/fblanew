export const CHAPTERS = [
  {
    id: 1,
    name: "Independence High School",
    region: "Shenandoah",
    state: "Virginia",
    advisorName: "Mr. Thompson",
    advisorEmail: "thompson@indy.lcps.org",
    masterKey: "VA-SHEN-X7K9M4P2",
    studentCount: 0,
  },
  {
    id: 2,
    name: "Broad Run High School",
    region: "Shenandoah",
    state: "Virginia",
    advisorName: "Mrs. Garcia",
    advisorEmail: "garcia@broadrun.lcps.org",
    masterKey: "VA-SHEN-R3J6N8W1",
    studentCount: 0,
  },
  {
    id: 3,
    name: "Riverside High School",
    region: "Northern",
    state: "Virginia",
    advisorName: "Dr. Chen",
    advisorEmail: "chen@riverside.fcps.edu",
    masterKey: "VA-NRTH-T5Q2L7V9",
    studentCount: 0,
  },
];

export const USERS = [
  {
    id: 1,
    name: "Lalith Kumar",
    email: "lalith@indy.lcps.org",
    chapterId: 1,
    isAdvisor: true,
    uploadCount: 0,
    joinedAt: "2025-09-01T10:00:00Z",
  },
  {
    id: 2,
    name: "Sarah Mitchell",
    email: "smitchell@indy.lcps.org",
    chapterId: 1,
    isAdvisor: false,
    uploadCount: 0,
    joinedAt: "2025-09-15T14:30:00Z",
  },
  {
    id: 3,
    name: "David Park",
    email: "dpark@indy.lcps.org",
    chapterId: 1,
    isAdvisor: false,
    uploadCount: 0,
    joinedAt: "2025-10-02T09:00:00Z",
  },
  {
    id: 4,
    name: "Ananya Patel",
    email: "apatel@broadrun.lcps.org",
    chapterId: 2,
    isAdvisor: false,
    uploadCount: 0,
    joinedAt: "2025-09-10T11:00:00Z",
  },
  {
    id: 5,
    name: "Marcus Williams",
    email: "mwilliams@broadrun.lcps.org",
    chapterId: 2,
    isAdvisor: false,
    uploadCount: 0,
    joinedAt: "2025-09-20T16:00:00Z",
  },
  {
    id: 6,
    name: "Emily Rodriguez",
    email: "erodriguez@riverside.fcps.edu",
    chapterId: 3,
    isAdvisor: false,
    uploadCount: 0,
    joinedAt: "2025-09-05T08:30:00Z",
  },
  {
    id: 7,
    name: "James Liu",
    email: "jliu@riverside.fcps.edu",
    chapterId: 3,
    isAdvisor: false,
    uploadCount: 0,
    joinedAt: "2025-10-12T13:00:00Z",
  },
  {
    id: 8,
    name: "Priya Sharma",
    email: "psharma@indy.lcps.org",
    chapterId: 1,
    isAdvisor: false,
    uploadCount: 0,
    joinedAt: "2026-01-05T10:00:00Z",
  },
];

export const CURRENT_USER = USERS[0]; // Lalith Kumar

export function getUserById(id) {
  return USERS.find(u => u.id === id);
}

export function getChapterById(id) {
  return CHAPTERS.find(c => c.id === id);
}

export function getUsersByChapter(chapterId) {
  return USERS.filter(u => u.chapterId === chapterId);
}
