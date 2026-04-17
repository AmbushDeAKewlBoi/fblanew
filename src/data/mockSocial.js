import { CHAPTERS, USERS } from './mockUsers';

const chapterById = Object.fromEntries(CHAPTERS.map((chapter) => [chapter.id, chapter]));

export const SOCIAL_PROFILES = USERS.filter((user) => !user.isAdvisor).map((user, index) => {
  const chapter = chapterById[user.chapterId];
  const profiles = [
    {
      headline: 'Intro to Business finalist building repeatable study systems for newer members.',
      bio: 'I like turning messy notes into chapter-wide prep kits and helping first-year members feel confident before regionals.',
      skills: ['intro to business', 'public speaking', 'study systems'],
      interests: ['chapter growth', 'peer mentoring', 'pitch practice'],
      goals: ['Find an accountability partner', 'Share stronger prep kits'],
      experience: 'Built a chapter resource binder used across 3 events.',
    },
    {
      headline: 'Accounting and database competitor who loves timed practice and clean feedback loops.',
      bio: 'Most of my week goes to accounting drills, database design prompts, and helping people break big topics into smaller wins.',
      skills: ['accounting', 'database design', 'practice questions'],
      interests: ['timed drills', 'peer review', 'competition strategy'],
      goals: ['Swap answer keys', 'Build a state-level study circle'],
      experience: 'Runs weekly timed sets for chapter members.',
    },
    {
      headline: 'Entrepreneurship competitor focused on pitch decks, sponsor outreach, and real presentation polish.',
      bio: 'I care a lot about how ideas are framed, how teams present under pressure, and how we practice like judges are already in the room.',
      skills: ['entrepreneurship', 'pitch decks', 'marketing'],
      interests: ['presentation coaching', 'business plans', 'branding'],
      goals: ['Find presentation partners', 'Trade deck feedback'],
      experience: 'Co-led a chapter pitch night before regionals.',
    },
    {
      headline: 'Public speaking competitor helping members get more confident in front of a room.',
      bio: 'I enjoy live feedback, speech drills, and helping people sound more natural and persuasive.',
      skills: ['public speaking', 'leadership', 'event coaching'],
      interests: ['speech critique', 'confidence building', 'chapter workshops'],
      goals: ['Coach younger members', 'Build speaking circles'],
      experience: 'Hosted warm-up sessions before district competition.',
    },
    {
      headline: 'Hospitality and event planning competitor organizing chapter prep nights that actually stay useful.',
      bio: 'I am into planning systems, better collaboration, and making sure students show up with materials that help the team improve.',
      skills: ['hospitality', 'event planning', 'chapter operations'],
      interests: ['prep logistics', 'resource swaps', 'member onboarding'],
      goals: ['Meet more chapter officers', 'Coordinate resource nights'],
      experience: 'Planned a multi-school prep exchange.',
    },
    {
      headline: 'Graphic design and UX competitor turning projects into portfolios that look polished and thoughtful.',
      bio: 'I spend a lot of time on layout, presentation flow, and making creative work easier for judges and teammates to understand.',
      skills: ['graphic design', 'ux design', 'portfolio reviews'],
      interests: ['visual storytelling', 'portfolio building', 'creative critique'],
      goals: ['Trade portfolio reviews', 'Meet more design competitors'],
      experience: 'Reviewed portfolios for chapter teammates before state submission.',
    },
    {
      headline: 'Roleplay-focused competitor who likes fast reps, sharper objections, and cleaner delivery.',
      bio: 'I like pressure-testing roleplays until answers feel natural and persuasive rather than memorized.',
      skills: ['roleplay', 'business communication', 'sales presentation'],
      interests: ['mock judging', 'roleplay drills', 'feedback loops'],
      goals: ['Find weekly roleplay partners', 'Run cross-chapter mock rounds'],
      experience: 'Set up a chapter roleplay rotation schedule.',
    },
  ];

  return {
    id: String(user.id),
    userId: user.id,
    name: user.name,
    chapterId: user.chapterId,
    chapterName: chapter.name,
    region: chapter.region,
    state: chapter.state,
    school: chapter.name,
    year: ['Sophomore', 'Junior', 'Senior'][index % 3],
    ...profiles[index],
  };
});

export const SOCIAL_POSTS = [
  {
    id: 'post-1',
    authorId: '2',
    category: 'study-win',
    createdAt: '2026-04-15T18:00:00Z',
    content: 'Built a tighter Intro to Business review sheet after region practice. If anyone wants it, I can post the framework and the quiz I used with our chapter.',
    likes: ['3', '4', '7'],
    comments: [
      { id: 'c-1', authorId: '4', content: 'Post it. We are rebuilding ours too.', createdAt: '2026-04-15T18:18:00Z' },
    ],
  },
  {
    id: 'post-2',
    authorId: '4',
    category: 'opportunity',
    createdAt: '2026-04-15T14:30:00Z',
    content: 'Looking for two people willing to review an entrepreneurship pitch deck tonight. I can return feedback on marketing visuals or structure.',
    likes: ['2', '5', '8'],
    comments: [
      { id: 'c-2', authorId: '5', content: 'I can review after 8 PM if you want speech feedback too.', createdAt: '2026-04-15T15:01:00Z' },
      { id: 'c-3', authorId: '8', content: 'Send it over. I want to see how you framed the sponsor ask.', createdAt: '2026-04-15T15:14:00Z' },
    ],
  },
  {
    id: 'post-3',
    authorId: '7',
    category: 'portfolio',
    createdAt: '2026-04-14T21:10:00Z',
    content: 'Quick reminder for design events: your explanation matters almost as much as your visuals. Judges move faster when your portfolio tells them what to look at.',
    likes: ['2', '3', '6'],
    comments: [],
  },
  {
    id: 'post-4',
    authorId: '8',
    category: 'practice',
    createdAt: '2026-04-14T16:45:00Z',
    content: 'Running roleplay reps tomorrow evening. If you want fast objection practice, reply and I will make a small rotation list.',
    likes: ['4', '5'],
    comments: [
      { id: 'c-4', authorId: '6', content: 'Count me in if there is room.', createdAt: '2026-04-14T17:05:00Z' },
    ],
  },
];

export const SOCIAL_DEFAULTS = {
  connectedProfileIds: ['2', '3'],
  incomingRequests: ['4', '7'],
  outgoingRequests: ['8'],
  notifications: [
    {
      id: 'notif-1',
      type: 'connection-request',
      actorId: '4',
      message: 'Ananya Patel wants to connect with you.',
      createdAt: '2026-04-16T09:10:00Z',
      read: false,
    },
    {
      id: 'notif-2',
      type: 'message',
      actorId: '3',
      message: 'David Park sent you a practice set in Messages.',
      createdAt: '2026-04-16T08:30:00Z',
      read: false,
    },
    {
      id: 'notif-3',
      type: 'comment',
      actorId: '7',
      message: 'James Liu commented on a post you are following.',
      createdAt: '2026-04-15T21:00:00Z',
      read: true,
    },
  ],
  threads: [
    {
      profileId: '3',
      messages: [
        { id: 'm-1', senderId: '3', text: 'I can send you the accounting drills after school.', createdAt: '2026-04-15T19:05:00Z' },
        { id: 'm-2', senderId: 'me', text: 'Send them. I want to compare with what our chapter uses.', createdAt: '2026-04-15T19:22:00Z' },
      ],
    },
    {
      profileId: '2',
      messages: [
        { id: 'm-3', senderId: '2', text: 'Want to compare practice questions for Intro to Business?', createdAt: '2026-04-14T17:10:00Z' },
      ],
    },
  ],
};

export const SOCIAL_POST_CATEGORIES = [
  { value: 'general', label: 'General update' },
  { value: 'study-win', label: 'Study win' },
  { value: 'opportunity', label: 'Looking for help' },
  { value: 'portfolio', label: 'Project or portfolio' },
  { value: 'practice', label: 'Practice session' },
];
