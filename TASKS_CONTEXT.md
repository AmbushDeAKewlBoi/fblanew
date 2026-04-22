# Atlas FBLA Project Context And Task List

## What this project is

This repo is a React + Vite app for an FBLA platform called Atlas. The intended product is a resource-sharing and networking app for FBLA students and advisors.

The clearest product/feature spec is:

- `fbla-platform-mvp-spec.md`

The current codebase already has:

- Google auth via Firebase Auth
- Firestore reads/writes for users and resources
- Supabase Storage uploads for resource files
- A fully designed front end with most major routes present

The current app is a hybrid:

- Some flows are live against Firebase/Supabase
- A lot of user-facing content still runs on mock arrays and `localStorage`

## Mock data inventory

### Primary mock data files

- `src/data/mockUsers.js`
  - Seed chapter data
  - Seed user data
  - Helpers like `getUserById`, `getChapterById`, `getUsersByChapter`
  - Current contents: 3 chapters, 8 users

- `src/data/mockResources.js`
  - Main fallback resource dataset
  - Resource type options
  - Visibility level options
  - Helpers like `getRecentResources`, `getPopularResources`
  - Current contents: 25 resources

- `src/data/mockEvents.js`
  - Full FBLA event directory used by events pages and upload dropdowns
  - Event category list
  - Helper `getEventBySlug`

- `src/data/mockSocial.js`
  - Social profiles derived from mock users
  - Feed posts
  - Default connection requests, notifications, threads
  - Post categories
  - Current contents: 7 profiles, 4 posts, seeded notifications/threads

- `src/data/mockCommunity.js`
  - Landing/dashboard marketing stats
  - Study circle cards
  - Current contents: 3 study circles, 4 campus signals

- `src/data/mockLeaderboard.js`
  - Seed leaderboard structures
  - Not the main source of leaderboard rendering anymore, but still useful context

### Where mock data is currently used

- `src/hooks/useResources.js`
  - Reads Firestore `resources`
  - Falls back to `RESOURCES` from `mockResources.js` if Firestore is empty/fails

- `src/context/SocialContext.jsx`
  - Entire social system is seeded from `mockSocial.js`
  - Then persisted per-user in `localStorage`

- `src/context/AuthContext.jsx`
  - Imports `CHAPTERS` from `mockUsers.js`
  - Auth is real, but chapter/user shaping still assumes mock-like defaults in several places

- `src/pages/Landing.jsx`
  - Uses `CAMPUS_SIGNALS` and `STUDY_CIRCLES`

- `src/pages/Dashboard.jsx`
  - Uses `STUDY_CIRCLES`

- `src/pages/Events.jsx`
  - Uses `FBLA_EVENTS` and `EVENT_CATEGORIES`

- `src/pages/EventDetail.jsx`
  - Uses `getEventBySlug`

- `src/pages/Upload.jsx`
  - Uses `FBLA_EVENTS`, `RESOURCE_TYPES`, `VISIBILITY_LEVELS`

- `src/pages/Leaderboard.jsx`
  - Uses `CHAPTERS` to aggregate chapter/region/state stats

- `src/pages/ResourceDetail.jsx`
  - Uses `getUserById` from mock users for uploader display

- `src/components/ResourceCard.jsx`
  - Uses `getUserById` and `getChapterById` from mock users

- `src/components/social/PostComposer.jsx`
  - Uses `SOCIAL_POST_CATEGORIES`

## Current architecture status

### Real / partially real

- Auth
  - `src/context/AuthContext.jsx`
  - Google sign-in is wired to Firebase Auth
  - User docs are read/written in Firestore

- Resource upload
  - `src/pages/Upload.jsx`
  - File uploads go to Supabase Storage
  - Resource metadata is written to Firestore

- Resource listing
  - `src/hooks/useResources.js`
  - Firestore is the first source
  - Mock resources are the fallback source

### Still demo / local-only

- Feed, connections, messages, notifications, profile activity
  - Entirely powered by `SocialContext`
  - No backend persistence
  - Stored in `localStorage`

- Some resource interactions
  - `src/components/ResourceCard.jsx` upvote/download buttons only change local component state
  - They do not persist to Firestore

- Some moderation/resource management actions
  - `src/pages/AdminDashboard.jsx` hide/delete actions are local state only
  - `src/pages/MyUploads.jsx` delete action is local state only

- Student chapter-key signup
  - `src/pages/SignupStudent.jsx`
  - Key validation is hardcoded demo logic

- Advisor signup
  - `src/pages/SignupAdvisor.jsx`
  - New advisors are forced onto `chapterId: 1`
  - Chapter creation is not actually modeled in Firestore

## Social product model that should be tracked explicitly

These points were not called out clearly enough in the first draft of this file, but they matter because they change the data model and trust/safety design.

### Direct messages are a moderation/safety feature, not just a chat feature

- `src/pages/Messages.jsx`
- `src/context/SocialContext.jsx`
- Right now DMs are private-looking UI only, stored in local state/localStorage
- There is no advisor/teacher visibility, safety review path, audit log, or policy layer

What needs to be decided and then implemented:

- Whether advisors/teachers can view student DMs by default, by chapter scope, or only after a report/escalation
- Whether students should be told clearly that chapter advisors can review messages
- Whether advisor access is full surveillance, limited moderation access, or report-triggered review only
- Whether DM retention, deletion, and audit logs are required
- Whether messages can include attachments/links and how those are moderated

This is a product and policy issue first, then a technical issue.

### Posts are closer to LinkedIn-style professional/community posting

- `src/pages/Feed.jsx`
- `src/components/social/PostComposer.jsx`
- `src/components/social/PostCard.jsx`
- Current feed already behaves more like professional/community posting than casual chat
- But it is still only a local mock system

Expected product shape:

- Public or scoped professional-style posts
- Comments and likes/reactions
- Profile-centered activity/history
- Chapter/event/professional-interest discovery
- Potential moderation/reporting workflow for posts/comments

### The relationship graph may need to be follow-based, not just connection-based

- `src/pages/Connections.jsx`
- `src/pages/Profile.jsx`
- `src/context/SocialContext.jsx`
- Current social graph is connection-request based, more like mutual connections
- There is no true follower/following model right now

If you want an Instagram-like follow model, that changes the backend design:

- One-way follow edges instead of only mutual connection requests
- Separate follower and following counts
- Feed ranking/filtering based on followed accounts
- Optional private accounts or approval for student safety
- Different permissions for messaging followers vs. anyone vs. mutuals

It is also possible the app needs both:

- `follow` for lightweight content discovery
- `connect` for stronger professional/network relationships

## Missing requirements that should now be treated as explicit

- DM safety/moderation policy for advisors/teachers
- Auditability and retention rules for student messages
- Clear user-facing disclosure if advisor message review is allowed
- Reporting/blocking/muting tools for social interactions
- Decision on whether the social graph is:
  - mutual connections only
  - one-way follows only
  - or both follows + connections
- Definition of post visibility:
  - chapter-only
  - region/state/public
  - or all authenticated users

## Remaining work

### Highest priority functional gaps

- Replace hardcoded student chapter-key validation
  - `src/pages/SignupStudent.jsx`
  - Right now keys are accepted by pattern or a few demo values, not by real backend chapter records

- Implement real chapter creation / advisor onboarding
  - `src/pages/SignupAdvisor.jsx`
  - Every advisor currently gets `chapterId: 1`
  - There is no real chapter creation flow or uniqueness check

- Remove mock user/chapter dependency from resource cards and detail pages
  - `src/components/ResourceCard.jsx`
  - `src/pages/ResourceDetail.jsx`
  - Live Firestore resources can reference uploaders/chapters that are not in `mockUsers.js`

- Make resource actions persist
  - Upvote and download should consistently update Firestore
  - `ResourceDetail` does this partially
  - `ResourceCard` does not

- Implement real delete/hide/edit flows for resources
  - `src/pages/MyUploads.jsx`
  - `src/pages/AdminDashboard.jsx`
  - Current behavior only removes items in local UI state

- Enforce real visibility/access control
  - Current UI shows visibility labels, but there is not a full permission layer matching the spec
  - Need chapter/region/state/public gating in reads and UI

### Important product gaps versus the spec

- Advisor moderation queue is missing
  - The spec mentions flagged content/moderation queue
  - Admin page currently only shows chapter resources + students

- Upload validation is incomplete
  - Spec calls for file-size and extension validation
  - `Upload.jsx` has accepted extensions in the input, but no full validation or 25MB enforcement

- No true analytics model
  - Spec describes download tracking, views, upvotes, and leaderboard metrics
  - Current counts are minimal and inconsistent

- Search is only client-side over current arrays
  - `src/pages/Search.jsx`
  - No backend search/indexing
  - Search does not really cover chapters/events in a robust way

- Leaderboard time filter is cosmetic
  - `src/pages/Leaderboard.jsx`
  - `This Month` vs `All Time` does not currently change the dataset

- My uploads is missing edit capability
  - Spec mentions edit/delete/visibility change
  - Current page supports open + local delete only

- Admin regenerate chapter key button is not implemented
  - `src/pages/AdminDashboard.jsx`

### Social/networking backend work

- Move social data off `localStorage`
  - `src/context/SocialContext.jsx`
  - Posts, connections, notifications, and messages need real collections/tables

- Add backend-backed connection graph
  - Requests, accepted connections, and pending state are currently local-only

- Decide whether connections should remain mutual-only or be replaced/augmented with follows
  - Current implementation is closer to connection requests
  - A follow model would require different collections, feed logic, and profile metrics

- Add backend-backed message threads
  - Current inbox is a UI/demo experience only

- Add advisor/teacher moderation access for DMs if that is a hard product requirement
  - This is not present at all right now
  - Needs explicit role rules, audit logging, disclosure copy, and UI for review/escalation

- Add reporting/blocking/muting for posts, profiles, and DMs
  - Current social layer has no safety tools

- Add backend-backed notifications
  - Current alerts are seeded demo objects plus local mutations

- Add backend-backed post/feed model
  - Current feed is local-only
  - Needs real posts, comments, likes, moderation state, and possibly visibility rules

## Page-by-page notes

### Landing

- `src/pages/Landing.jsx`
- Strong visual page
- Uses mock marketing stats and illustrative focus rows
- Good for presentation/demo, but content is not dynamic

### Dashboard

- `src/pages/Dashboard.jsx`
- Uses real/fallback resources plus mock study circles and social suggestions
- Trending is based on `viewCount`, but those counts are not meaningfully populated yet

### Feed / Connections / Messages / Notifications / Profile

- `src/pages/Feed.jsx`
- `src/pages/Connections.jsx`
- `src/pages/Messages.jsx`
- `src/pages/Notifications.jsx`
- `src/pages/Profile.jsx`
- These are polished UI routes, but the data layer is still entirely `SocialContext` + local storage
- Important nuance:
  - Feed already looks like a LinkedIn-style professional/community post surface
  - Connections are currently mutual-request based, not follow-based
  - Messages currently have no teacher/advisor moderation or surveillance layer

### Events / Event Detail / Search

- `src/pages/Events.jsx`
- `src/pages/EventDetail.jsx`
- `src/pages/Search.jsx`
- Event directory is driven by the mock FBLA event list
- Resource counts come from current resource data
- Search and filtering are all client-side

### Upload

- `src/pages/Upload.jsx`
- One of the more real pages in the app
- Actually uploads to storage and creates Firestore docs
- Still needs validation, better error handling, and consistent downstream integration

### Resource Detail

- `src/pages/ResourceDetail.jsx`
- Reads live/fallback resources
- Upvote/download update Firestore here
- Still depends on mock uploader lookup
- Related resources are client-side only

### My Uploads

- `src/pages/MyUploads.jsx`
- Uses real/fallback resources
- Stats are read from resource fields
- Delete is only local UI state

### Leaderboard

- `src/pages/Leaderboard.jsx`
- Calculates leaderboard from current resources + mock chapter metadata
- Time filter is not implemented
- Region/state grouping is client-side only

### Admin Dashboard

- `src/pages/AdminDashboard.jsx`
- Advisor gating is client-side via `user.isAdvisor`
- Student list comes from Firestore `users` filtered by `chapterId`
- Resource moderation actions are not persisted
- Regenerate key button is not wired

## Suggested implementation order

1. Finish the data model for chapters and users so advisor signup and student key signup become real.
2. Remove mock user/chapter lookups from resource UI and derive uploader/chapter data from Firestore.
3. Make resource mutations real everywhere: upvote, download, view count, edit, delete, hide.
4. Decide the social model clearly: posts, follows vs. connections, DM moderation rules, and advisor visibility.
5. Implement true visibility filtering for chapter/region/state/public resources.
6. Move social features from `localStorage` into backend collections.
7. Finish leaderboard/search/admin features against real data.

## Feed game plan: global feed + event-specific feed

This is the clearest next social feature to build because the UI foundation already exists.

### Goal

Build two posting surfaces:

- Global feed
  - General Atlas-wide posting for wins, asks, opportunities, and collaboration
- Event-specific feed
  - Per-event discussion stream where users can talk about a specific FBLA event
  - Example: Marketing feed, Accounting I feed, Database Design feed

### Resources we already have

We can reuse these immediately:

- `src/pages/Feed.jsx`
  - Already renders a composer + list of posts + suggestions sidebar

- `src/components/social/PostComposer.jsx`
  - Already handles post text + post category

- `src/components/social/PostCard.jsx`
  - Already handles display, likes, comments, and author info

- `src/context/SocialContext.jsx`
  - Already exposes:
    - `posts`
    - `createPost`
    - `toggleLikePost`
    - `addCommentToPost`
    - profile lookup helpers

- `src/pages/Profile.jsx`
  - Already renders profile-specific post history

- `src/data/mockEvents.js`
  - Gives us the canonical event list and event slugs

- `src/pages/Events.jsx` and `src/pages/EventDetail.jsx`
  - Already provide event discovery and event routes
  - `EventDetail` is a natural place to attach an event-specific discussion tab or section

### Biggest current limitation

The current post model has no concept of feed scope.

Current shape in `SocialContext.jsx`:

- `id`
- `authorId`
- `category`
- `createdAt`
- `content`
- `likes`
- `comments`

To support global and event-specific feeds, posts need more structure.

### Recommended post model

Add these fields to every post:

- `scopeType`
  - `global`
  - `event`

- `eventSlug`
  - `null` for global posts
  - event slug like `marketing`, `accounting-i`, `database-design` for event posts

- `eventName`
  - denormalized display value for easier rendering

- `visibility`
  - start simple with `authenticated`
  - later expand to `chapter`, `region`, `state`, `public` if needed

- `chapterId`
  - useful for filtering/moderation

- `authorNameSnapshot`
  - optional, but useful for resilience if profile loading changes

- `moderationStatus`
  - `active`, `hidden`, `flagged`, `removed`

### Recommended comment model

Each comment should eventually have:

- `id`
- `postId`
- `authorId`
- `content`
- `createdAt`
- `moderationStatus`

### Phase 1: get the product shape working locally

Use the current local social system first, but extend it cleanly.

Work to do:

- Update `PostComposer` so it can post either:
  - to the global feed
  - or to a chosen event feed

- Update `SocialContext.createPost` to accept:
  - `scopeType`
  - `eventSlug`
  - `eventName`

- Add selectors/helpers in `SocialContext`:
  - `getGlobalPosts()`
  - `getEventPosts(eventSlug)`

- Update `Feed.jsx` to become the global feed explicitly
  - title/subtitle should say global Atlas feed

- Add event feed UI inside `EventDetail.jsx`
  - easiest version: below the resources section or in a new section on the same page
  - better version later: tabs for `Resources` and `Discussion`

- Seed some mock event posts in `mockSocial.js`
  - so every event feed does not look empty during development

### Phase 2: backend shape

Once the local version feels right, move it to Firestore.

Recommended Firestore collections:

- `posts`
  - one document per post

- `postComments`
  - one document per comment
  - or nested subcollection under `posts/{postId}/comments`

- `postLikes`
  - optional separate collection if you want scalable like tracking
  - otherwise store user IDs carefully if the scale stays small

Recommended `posts` fields:

- `authorId`
- `authorChapterId`
- `scopeType`
- `eventSlug`
- `eventName`
- `category`
- `content`
- `visibility`
- `likeCount`
- `commentCount`
- `moderationStatus`
- `createdAt`
- `updatedAt`

### Phase 3: moderation and safety

Since this is student communication, feed work should include moderation planning early.

For posts and comments:

- advisor visibility over chapter-authored posts
- report post
- report comment
- hide/remove post
- hide/remove comment
- audit log of moderation actions

For event feeds specifically:

- event feeds should not become anonymous chaos
- default to attributed posts
- optionally allow anonymous resource uploads, but not anonymous discussion posts

### Recommended UX shape

#### Global feed

Purpose:

- chapter wins
- asking for help
- finding collaborators
- posting study opportunities
- sharing resource links

Composer:

- post category
- text
- optional event tag

Filters:

- latest
- following
- my chapter
- by category

#### Event-specific feed

Purpose:

- ask event questions
- compare prep strategies
- request roleplay partners
- discuss rubric-specific problems

Composer:

- pre-bound to current event
- should clearly say "Posting to Marketing" or similar

Filters:

- latest
- top this week
- unanswered / no comments yet

### Recommended build order for the feed feature

1. Extend the local post model with `scopeType`, `eventSlug`, and `eventName`.
2. Make `Feed.jsx` the explicit global feed.
3. Add an event discussion section to `EventDetail.jsx`.
4. Update `mockSocial.js` with seeded global and event-specific posts.
5. Refactor `SocialContext` with `getGlobalPosts` and `getEventPosts`.
6. Add UI filters for feed scope and event context.
7. Move post/comment persistence to Firestore.
8. Add moderation/reporting tools for posts and comments.

### Practical first implementation target

If the goal is fast progress with minimal risk, the first shippable milestone should be:

- Global feed works cleanly
- Event detail pages show a discussion feed for that event
- Users can create posts in both contexts
- Likes/comments work in both contexts
- Still local/mock-backed at first, but with the right final data shape

That gives a strong prototype without forcing the full backend migration on day one.

## Useful files to read first

- `fbla-platform-mvp-spec.md`
- `src/context/AuthContext.jsx`
- `src/context/SocialContext.jsx`
- `src/hooks/useResources.js`
- `src/pages/Upload.jsx`
- `src/pages/AdminDashboard.jsx`
- `src/pages/SignupStudent.jsx`
- `src/pages/SignupAdvisor.jsx`
- `src/components/ResourceCard.jsx`
- `src/pages/ResourceDetail.jsx`

## Verification

- `npm run build` passes as of April 19, 2026
