# FBLA Resource Hub - MVP Technical Specification

## Project Overview

A tiered resource-sharing platform for FBLA students and advisors to upload, discover, and utilize competitive event study materials with school/region/state-level visibility controls. Built to encourage community contribution while respecting competitive advantage through granular access permissions.

---

## 1. Core Value Proposition

**Problem**: FBLA students waste time recreating study materials that already exist, and competitive resources rarely get shared beyond individual schools due to lack of controlled distribution.

**Solution**: A centralized platform where students can share resources (presentations, roleplay scripts, practice questions, study guides) with configurable visibility tiers — contributing to their school's reputation while maintaining competitive edge at higher levels.

**Key Differentiators**:
- Hierarchical visibility (School → Region → State → Public)
- Chapter-key authentication system (advisor-controlled access)
- Event-based organization matching FBLA's competitive structure
- Anonymous uploading with optional public attribution
- Community-driven quality signals (upvotes, download counts)
- School/region leaderboards for contribution tracking

---

## 2. User Personas

### Advisor (Chapter Key Holder)
**Goals**: Facilitate resource sharing within chapter, monitor student contributions, maintain quality control

**Pain Points**: Students hoard materials, can't track what's being shared externally, no way to build chapter reputation

**Features Needed**: Chapter key management, moderation dashboard, usage analytics, student activity monitoring

### Student (Resource Consumer)
**Goals**: Find high-quality study materials for competitive events, prepare efficiently, discover what's worked for others

**Pain Points**: Googling yields generic results, no central repository, unclear what materials are actually helpful

**Features Needed**: Advanced search/filtering, quality indicators (upvotes), tag-based discovery, download tracking

### Student (Resource Contributor)
**Goals**: Help teammates/region, build personal/school reputation, share successful strategies without losing competitive advantage

**Pain Points**: Afraid of over-sharing, unclear who benefits from contributions, no recognition for effort

**Features Needed**: Granular visibility controls, contribution stats, optional anonymity, leaderboard recognition

---

## 3. Information Architecture

```
/ (Landing Page - Public)
│
├── /signup/advisor (Advisor Registration)
├── /signup/student (Student Registration)
├── /login (Unified Login)
│
├── /dashboard (Post-Login Home)
│   ├── Feed: Recent uploads from accessible tiers
│   ├── Quick stats: Your uploads, downloads, upvotes received
│   └── Recommended: Popular resources in your region/state
│
├── /events (Event Directory)
│   ├── /events/management-information-systems
│   ├── /events/business-law
│   ├── /events/marketing
│   ├── /events/intro-to-business
│   ├── ... (all 60+ FBLA events)
│   └── Each event page contains:
│       ├── Resource grid (filtered by user's access tier)
│       ├── Search bar with filters (type, tags, visibility)
│       ├── Sort controls (recent, popular, most downloaded)
│       └── "Upload for this event" CTA
│
├── /upload (Resource Upload Form)
│   ├── Event selection (dropdown)
│   ├── Resource type (presentation, roleplay, questions, guide, other)
│   ├── Title, description, tags
│   ├── Visibility tier selector
│   ├── File upload (drag-drop + browse)
│   └── Attribution toggle (anonymous vs. public name)
│
├── /resource/:id (Resource Detail Page)
│   ├── Metadata display (title, description, tags, event)
│   ├── Uploader info (anonymous or named)
│   ├── Upload date, visibility tier, file size
│   ├── Upvote button (if not own resource)
│   ├── Download button (access-gated)
│   └── Related resources (same event + tags)
│
├── /leaderboard (Contribution Rankings)
│   ├── Tabs: Schools, Regions, States
│   ├── Metrics: Total uploads, total upvotes, total downloads
│   ├── Time filters: This month, All time
│   └── Click school → see their public uploads
│
├── /my-uploads (User's Uploaded Resources)
│   ├── Table view with edit/delete actions
│   ├── Stats per resource (views, downloads, upvotes)
│   └── Visibility change option
│
├── /admin (Advisor Dashboard - Advisor-Only)
│   ├── Chapter key display + regenerate button
│   ├── Student roster (users who joined via key)
│   ├── Chapter uploads (all resources from chapter students)
│   ├── Moderation queue (flagged content)
│   ├── Delete/hide controls for chapter resources
│   └── Analytics: Chapter contribution stats
│
└── /search (Global Search Results)
    ├── Query input with autocomplete
    ├── Filters: Event, Type, Visibility, Tags
    ├── Sort: Relevance, Recent, Popular
    └── Results grid with access-gated previews
```

---

## 4. Data Models

### 4.1 Chapters Table
```sql
chapters:
  id                    INTEGER PRIMARY KEY AUTOINCREMENT
  name                  TEXT NOT NULL                    -- "Independence High School"
  region                TEXT NOT NULL                    -- "Shenandoah"
  state                 TEXT NOT NULL                    -- "Virginia"
  advisor_name          TEXT NOT NULL
  advisor_email         TEXT UNIQUE NOT NULL
  master_key            TEXT UNIQUE NOT NULL             -- Hashed chapter key
  created_at            DATETIME DEFAULT CURRENT_TIMESTAMP
  updated_at            DATETIME DEFAULT CURRENT_TIMESTAMP

UNIQUE INDEX idx_chapter_name_state ON chapters(name, state)
INDEX idx_region_state ON chapters(region, state)
```

**Business Rules**:
- Chapter names must be unique within a state
- Advisor email becomes login credential
- Master key is bcrypt-hashed, never stored plaintext
- Region/state values controlled by predefined list (Virginia regions, US states)

### 4.2 Users Table
```sql
users:
  id                    INTEGER PRIMARY KEY AUTOINCREMENT
  name                  TEXT NOT NULL
  email                 TEXT UNIQUE NOT NULL
  password_hash         TEXT NOT NULL                    -- bcrypt
  chapter_id            INTEGER NOT NULL                 -- FK to chapters.id
  is_advisor            BOOLEAN DEFAULT 0
  created_at            DATETIME DEFAULT CURRENT_TIMESTAMP
  last_login            DATETIME
  
FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
INDEX idx_chapter_users ON users(chapter_id)
INDEX idx_email ON users(email)
```

**Business Rules**:
- Student accounts auto-inherit chapter's region/state
- Email must be unique across platform
- Advisors created separately (is_advisor = 1, no chapter_id initially)
- Soft delete for advisors (preserve uploaded resources)

### 4.3 Resources Table
```sql
resources:
  id                    INTEGER PRIMARY KEY AUTOINCREMENT
  title                 TEXT NOT NULL
  description           TEXT
  event                 TEXT NOT NULL                    -- "Management Information Systems"
  resource_type         TEXT NOT NULL                    -- "presentation" | "roleplay" | "questions" | "study_guide" | "other"
  tags                  TEXT                             -- JSON array: ["databases", "SQL", "normalization"]
  visibility_level      TEXT NOT NULL                    -- "school" | "region" | "state" | "public"
  uploader_id           INTEGER NOT NULL                 -- FK to users.id
  chapter_id            INTEGER NOT NULL                 -- Which school posted it
  file_path             TEXT NOT NULL                    -- "/uploads/{id}/{filename}"
  file_size_bytes       INTEGER NOT NULL
  file_extension        TEXT NOT NULL                    -- ".pdf", ".pptx", ".png"
  is_anonymous          BOOLEAN DEFAULT 1                -- Hide uploader name
  upvote_count          INTEGER DEFAULT 0
  download_count        INTEGER DEFAULT 0
  view_count            INTEGER DEFAULT 0
  is_hidden             BOOLEAN DEFAULT 0                -- Advisor moderation
  created_at            DATETIME DEFAULT CURRENT_TIMESTAMP
  updated_at            DATETIME DEFAULT CURRENT_TIMESTAMP

FOREIGN KEY (uploader_id) REFERENCES users(id) ON DELETE SET NULL
FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
INDEX idx_event_visibility ON resources(event, visibility_level)
INDEX idx_chapter_resources ON resources(chapter_id)
INDEX idx_uploader_resources ON resources(uploader_id)
INDEX idx_created_at ON resources(created_at DESC)
```

**Business Rules**:
- Tags stored as JSON array, max 10 tags per resource
- File extensions validated against allowlist (.pdf, .pptx, .ppt, .docx, .png, .jpg, .txt)
- Max file size: 25MB
- Visibility levels inherit upward (school users see school + region + state + public)
- is_hidden = 1 removes from public listings but preserves record
- Uploader deletion sets uploader_id to NULL but keeps resource

### 4.4 Upvotes Table
```sql
upvotes:
  id                    INTEGER PRIMARY KEY AUTOINCREMENT
  user_id               INTEGER NOT NULL                 -- FK to users.id
  resource_id           INTEGER NOT NULL                 -- FK to resources.id
  created_at            DATETIME DEFAULT CURRENT_TIMESTAMP

FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE
UNIQUE INDEX idx_user_resource_upvote ON upvotes(user_id, resource_id)
INDEX idx_resource_upvotes ON upvotes(resource_id)
```

**Business Rules**:
- One upvote per user per resource (enforced by unique constraint)
- Upvoting your own resource is blocked at application level
- Deleting resource cascades to upvotes
- Upvote count cached in resources.upvote_count for performance

### 4.5 Downloads Table (Analytics)
```sql
downloads:
  id                    INTEGER PRIMARY KEY AUTOINCREMENT
  user_id               INTEGER NOT NULL
  resource_id           INTEGER NOT NULL
  downloaded_at         DATETIME DEFAULT CURRENT_TIMESTAMP

FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE
INDEX idx_resource_downloads ON downloads(resource_id)
INDEX idx_user_downloads ON downloads(user_id)
```

**Business Rules**:
- Tracks every download for analytics (not unique constraint — same user can re-download)
- Download count cached in resources.download_count
- Used for "trending" calculations and leaderboard metrics

---

## 5. Authentication & Authorization

### 5.1 Advisor Registration Flow
1. Navigate to `/signup/advisor`
2. Form fields:
   - Full name
   - Email (must not exist in system)
   - Password (min 8 chars, must include number + letter)
   - School name (text input with autocomplete from existing chapters)
   - Region (dropdown: Shenandoah, Northern, Central, etc.)
   - State (dropdown: Virginia, Maryland, etc.)
3. Backend validation:
   - Email uniqueness check
   - Password strength validation
   - Generate unique master_key (format: `{STATE}-{REGION_CODE}-{RANDOM_8}`)
   - Hash password with bcrypt (cost factor 12)
   - Insert into chapters + users tables
4. Response:
   - Display master key in modal (copy-to-clipboard button)
   - Email master key to advisor_email
   - Warning: "Save this key — students need it to join"
5. Redirect to `/admin` dashboard

### 5.2 Student Registration Flow
1. Navigate to `/signup/student`
2. Form fields:
   - Full name
   - Email (must not exist in system)
   - Password (min 8 chars, must include number + letter)
   - Chapter key (text input, validated on blur)
3. Frontend validation:
   - On chapter key input, ping `/api/validate-key` endpoint
   - Display chapter name if valid, error if invalid
4. Backend validation:
   - Look up chapter by master_key hash
   - If not found, return 400 error
   - Check email uniqueness
   - Hash password with bcrypt
   - Insert into users table with chapter_id from key lookup
5. Response:
   - Auto-login (generate JWT)
   - Redirect to `/dashboard` with welcome toast

### 5.3 Login Flow
1. Navigate to `/login`
2. Single form for both advisors + students:
   - Email
   - Password
3. Backend:
   - Query users table by email
   - Compare password hash with bcrypt
   - If match, generate JWT with payload:
     ```json
     {
       "user_id": 42,
       "chapter_id": 7,
       "is_advisor": false,
       "region": "Shenandoah",
       "state": "Virginia",
       "exp": <24h from now>
     }
     ```
4. Frontend:
   - Store JWT in localStorage
   - Include in Authorization header for all API calls
   - Redirect to `/dashboard`

### 5.4 Access Control Rules

**Public pages** (no auth required):
- Landing page, event directory (public resources only), resource detail pages for public resources

**Student pages** (requires valid JWT):
- Dashboard, upload, my-uploads, full event listings (filtered by access tier), search, leaderboard

**Advisor pages** (requires is_advisor = true in JWT):
- All student pages + `/admin` dashboard, moderation tools, key regeneration

**Resource visibility logic** (server-side enforcement):
```python
def can_access_resource(user, resource):
    if resource.visibility_level == "public":
        return True
    if resource.visibility_level == "state" and user.state == resource.chapter.state:
        return True
    if resource.visibility_level == "region" and user.region == resource.chapter.region:
        return True
    if resource.visibility_level == "school" and user.chapter_id == resource.chapter_id:
        return True
    return False
```

**File download enforcement**:
- `/api/resources/:id/download` checks `can_access_resource()` before serving file
- Logs download to downloads table
- Increments resource.download_count
- Returns 403 if access denied

---

## 6. Core Features - Detailed Specifications

### 6.1 Resource Upload

**Endpoint**: `POST /api/resources`

**Request (multipart/form-data)**:
```json
{
  "title": "MIS Database Normalization Cheatsheet",
  "description": "Covers 1NF-BCNF with examples from past tests",
  "event": "Management Information Systems",
  "resource_type": "study_guide",
  "tags": ["databases", "normalization", "SQL"],
  "visibility_level": "region",
  "is_anonymous": true,
  "file": <binary>
}
```

**Validation**:
- Title: 3-200 chars, required
- Description: 0-2000 chars, optional
- Event: Must match predefined FBLA event list
- Resource type: Must be in ["presentation", "roleplay", "questions", "study_guide", "other"]
- Tags: Array of strings, max 10 tags, each tag max 30 chars
- Visibility level: Must be in ["school", "region", "state", "public"]
- File: Max 25MB, allowed extensions [.pdf, .pptx, .ppt, .docx, .doc, .png, .jpg, .jpeg, .txt]

**Processing**:
1. Validate all fields
2. Generate unique resource ID
3. Create directory `/uploads/{resource_id}/`
4. Save file as `/uploads/{resource_id}/{sanitized_filename}`
5. Calculate file size in bytes
6. Extract file extension
7. Insert record into resources table with uploader_id from JWT
8. Return resource object with ID

**Frontend**:
- Drag-and-drop file upload zone (react-dropzone or similar)
- Tag input with autocomplete (suggest common tags)
- Event dropdown with search filter
- Visibility tier selector with icon + description:
  - 🏫 School only: "Only Independence High School students"
  - 📍 Region: "All Shenandoah region schools"
  - 🗺️ State: "All Virginia FBLA chapters"
  - 🌎 Public: "Everyone on the platform"
- Real-time character count for title/description
- File size indicator during upload
- Progress bar for large files
- Success modal with link to resource page

### 6.2 Event Pages

**Endpoint**: `GET /api/events/:event_slug/resources`

**Query Params**:
- `type`: Filter by resource_type (multi-select)
- `tags`: Filter by tags (comma-separated)
- `visibility`: Filter by visibility_level (multi-select)
- `sort`: recent | popular | downloads (default: recent)
- `page`: Pagination (default: 1)
- `limit`: Results per page (default: 20)

**Response**:
```json
{
  "event": {
    "name": "Management Information Systems",
    "slug": "management-information-systems",
    "description": "Design, implementation, and management of information systems"
  },
  "resources": [
    {
      "id": 42,
      "title": "MIS Database Normalization Cheatsheet",
      "description": "Covers 1NF-BCNF...",
      "resource_type": "study_guide",
      "tags": ["databases", "normalization", "SQL"],
      "visibility_level": "region",
      "uploader": {
        "name": "Anonymous",  // or actual name if is_anonymous = false
        "chapter": "Independence High School",
        "region": "Shenandoah"
      },
      "file_extension": ".pdf",
      "file_size_bytes": 1458372,
      "upvote_count": 47,
      "download_count": 203,
      "created_at": "2025-03-15T14:23:00Z",
      "user_has_upvoted": false  // based on JWT user_id
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 4,
    "total_results": 73
  }
}
```

**Frontend Layout**:
```
┌─────────────────────────────────────────────────────┐
│  Event: Management Information Systems              │
│  📊 73 resources available at your access level     │
└─────────────────────────────────────────────────────┘

┌─ Filters ────────────────────┐  ┌─ Sort ──────────┐
│ Type:                         │  │ ○ Most Recent   │
│ ☑ Presentations               │  │ ● Most Popular  │
│ ☑ Roleplay Scripts            │  │ ○ Most Downloads│
│ ☐ Practice Questions          │  └─────────────────┘
│ ☑ Study Guides                │
│                               │
│ Tags: [SQL] [databases] [X]   │
│ + Add tag                     │
│                               │
│ Visibility:                   │
│ ☑ School  ☑ Region            │
│ ☑ State   ☑ Public            │
└───────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ 📄 MIS Database Normalization Cheatsheet            │
│ Anonymous • Independence HS • Shenandoah • 3/15/25  │
│ Covers 1NF-BCNF with examples from past tests       │
│ 🏷️ databases, normalization, SQL                    │
│ 👍 47 upvotes  •  ⬇ 203 downloads  •  PDF • 1.4 MB  │
│ [👍 Upvote] [⬇ Download]                            │
└─────────────────────────────────────────────────────┘

[Load More]
```

**Design Principles**:
- Card-based layout (similar to Reddit posts)
- Clear visibility indicators (colored badges: school=blue, region=green, state=orange, public=gray)
- Upvote button changes to filled state if user has upvoted
- Download button tracks click → logs to analytics
- Hover state on cards shows preview tooltip
- Mobile-responsive grid (1 column on phone, 2 on tablet, 3 on desktop)

### 6.3 Search & Discovery

**Endpoint**: `GET /api/search`

**Query Params**:
- `q`: Search query (searches title, description, tags)
- `event`: Filter by specific event
- `type`: Filter by resource_type
- `visibility`: Filter by visibility_level
- `tags`: Filter by tags (comma-separated)
- `sort`: relevance | recent | popular
- `page`: Pagination

**Search Algorithm** (SQLite FTS5):
```sql
-- Index creation
CREATE VIRTUAL TABLE resources_fts USING fts5(
  title, 
  description, 
  tags, 
  content=resources, 
  content_rowid=id
);

-- Search query with rank boosting
SELECT 
  r.*,
  bm25(resources_fts) as rank
FROM resources r
JOIN resources_fts fts ON fts.rowid = r.id
WHERE resources_fts MATCH :query
  AND {visibility_filter}
  AND {event_filter}
  AND {type_filter}
ORDER BY rank DESC
```

**Frontend**:
- Global search bar in header (always visible)
- Autocomplete suggestions as user types (debounced 300ms)
- Search results page with same filter sidebar as event pages
- Highlight matching terms in title/description
- "Did you mean?" suggestions for typos
- Recent searches saved in localStorage

### 6.4 Upvoting System

**Endpoint**: `POST /api/resources/:id/upvote`

**Request**: Empty body (user_id from JWT)

**Response**:
```json
{
  "success": true,
  "new_upvote_count": 48,
  "user_has_upvoted": true
}
```

**Business Logic**:
```python
def upvote_resource(user_id, resource_id):
    # Check if already upvoted
    existing = Upvote.query.filter_by(
        user_id=user_id, 
        resource_id=resource_id
    ).first()
    
    if existing:
        # Remove upvote (toggle)
        db.session.delete(existing)
        Resource.query.filter_by(id=resource_id).update({
            'upvote_count': Resource.upvote_count - 1
        })
    else:
        # Add upvote
        new_upvote = Upvote(user_id=user_id, resource_id=resource_id)
        db.session.add(new_upvote)
        Resource.query.filter_by(id=resource_id).update({
            'upvote_count': Resource.upvote_count + 1
        })
    
    db.session.commit()
    return Resource.query.get(resource_id)
```

**Frontend**:
- Upvote button shows count
- Animates on click (bounce effect)
- Changes color when upvoted (gray → orange)
- Optimistic UI update (don't wait for server response)
- Revert if server returns error

### 6.5 Leaderboard

**Endpoint**: `GET /api/leaderboard`

**Query Params**:
- `type`: schools | regions | states
- `metric`: uploads | upvotes | downloads
- `timeframe`: month | all-time

**Response** (schools leaderboard):
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "chapter": {
        "id": 7,
        "name": "Independence High School",
        "region": "Shenandoah",
        "state": "Virginia"
      },
      "metrics": {
        "total_uploads": 47,
        "total_upvotes": 892,
        "total_downloads": 3401
      },
      "is_user_chapter": true  // based on JWT
    },
    {
      "rank": 2,
      "chapter": {
        "id": 12,
        "name": "Broad Run High School",
        "region": "Shenandoah",
        "state": "Virginia"
      },
      "metrics": {
        "total_uploads": 39,
        "total_upvotes": 654,
        "total_downloads": 2817
      },
      "is_user_chapter": false
    }
  ]
}
```

**SQL Query** (schools example):
```sql
SELECT 
  c.id,
  c.name,
  c.region,
  c.state,
  COUNT(DISTINCT r.id) as total_uploads,
  COALESCE(SUM(r.upvote_count), 0) as total_upvotes,
  COALESCE(SUM(r.download_count), 0) as total_downloads,
  ROW_NUMBER() OVER (ORDER BY COUNT(DISTINCT r.id) DESC) as rank
FROM chapters c
LEFT JOIN users u ON u.chapter_id = c.id
LEFT JOIN resources r ON r.uploader_id = u.id
WHERE r.created_at >= :timeframe_start  -- filter by month if needed
GROUP BY c.id
ORDER BY total_uploads DESC  -- or total_upvotes, total_downloads
LIMIT 100
```

**Frontend**:
```
┌─────────────────────────────────────────────────────┐
│  🏆 Leaderboard                                     │
│  [Schools] [Regions] [States]                       │
│  Metric: [Uploads ▼] [Upvotes] [Downloads]          │
│  Time: [This Month] [All Time]                      │
└─────────────────────────────────────────────────────┘

 #  School                        Region       Uploads  Upvotes  Downloads
─────────────────────────────────────────────────────────────────────────────
🥇  Independence HS               Shenandoah      47      892      3,401  ⭐
🥈  Broad Run HS                  Shenandoah      39      654      2,817
🥉  Riverside HS                  Northern        31      501      2,104
 4  Stone Bridge HS               Northern        28      487      1,923
 5  Potomac Falls HS              Shenandoah      24      412      1,654
...
```

**Design Notes**:
- User's chapter highlighted with ⭐ indicator
- Medal emojis for top 3
- Clickable rows → navigate to chapter's public uploads
- Sticky header with tab/metric controls
- Regions leaderboard aggregates all chapters in a region
- States leaderboard aggregates all chapters in a state

### 6.6 Advisor Moderation Dashboard

**Endpoint**: `GET /api/admin/chapter-resources`

**Authorization**: Requires is_advisor = true in JWT

**Response**:
```json
{
  "chapter": {
    "name": "Independence High School",
    "master_key": "VA-SHEN-X7K9M4P2",  // displayed for copying
    "student_count": 23
  },
  "resources": [
    {
      "id": 42,
      "title": "MIS Database Cheatsheet",
      "uploader": {
        "id": 18,
        "name": "Lalith Kumar"
      },
      "event": "Management Information Systems",
      "visibility_level": "region",
      "upvote_count": 47,
      "download_count": 203,
      "created_at": "2025-03-15T14:23:00Z",
      "is_hidden": false
    }
  ],
  "students": [
    {
      "id": 18,
      "name": "Lalith Kumar",
      "email": "lalith@indy.lcps.org",
      "upload_count": 3,
      "joined_at": "2025-02-01T10:00:00Z"
    }
  ]
}
```

**Actions**:
- Hide resource: `PATCH /api/admin/resources/:id/hide` (sets is_hidden = true)
- Delete resource: `DELETE /api/admin/resources/:id` (hard delete)
- Regenerate key: `POST /api/admin/regenerate-key` (generates new master_key, emails advisor)
- View student details: Click row → modal with all student's uploads

**Frontend**:
```
┌─────────────────────────────────────────────────────┐
│  Admin Dashboard - Independence High School         │
│  Chapter Key: VA-SHEN-X7K9M4P2  [📋 Copy] [🔄 Regen]│
│  23 students • 47 total uploads • 892 total upvotes │
└─────────────────────────────────────────────────────┘

[Resources] [Students] [Analytics]

Resources (47):
┌─────────────────────────────────────────────────────┐
│ MIS Database Cheatsheet                             │
│ Uploaded by: Lalith Kumar • 3/15/25                 │
│ Region-level • 47👍 • 203⬇ • study_guide            │
│ [👁️ View] [🚫 Hide] [🗑️ Delete]                    │
└─────────────────────────────────────────────────────┘
```

---

## 7. Frontend Design System

### 7.1 Design Philosophy

**Inspiration**: Reddit's information density + Notion's clean hierarchy + Discord's community feel

**Core Principles**:
- **Information density**: Show metadata inline, minimize clicks to discover
- **Visual hierarchy**: Clear distinction between primary actions (upload, download) and secondary (upvote, share)
- **Accessibility**: WCAG AA contrast ratios, keyboard navigation, screen reader support
- **Performance**: Lazy load images, virtualized lists, optimistic UI updates
- **Trust signals**: Verified chapter badges, upvote counts, download stats

### 7.2 Color Palette

**Light Mode** (default):
```css
--background: #ffffff
--surface: #f8f9fa
--surface-hover: #e9ecef
--border: #dee2e6
--text-primary: #212529
--text-secondary: #6c757d
--text-tertiary: #adb5bd

--primary: #0d6efd        /* Call-to-action buttons */
--primary-hover: #0b5ed7
--success: #28a745        /* Upvote active, success states */
--warning: #ffc107        /* Region visibility tier */
--danger: #dc3545         /* Delete, hide actions */
--info: #17a2b8           /* School visibility tier */
```

**Dark Mode** (toggle in settings):
```css
--background: #1a1a1b
--surface: #272729
--surface-hover: #343536
--border: #474748
--text-primary: #d7dadc
--text-secondary: #818384
--text-tertiary: #5a5a5b

--primary: #0079d3
--primary-hover: #0060a8
--success: #46d160
--warning: #ffa500
--danger: #f74140
--info: #00a8e8
```

### 7.3 Typography

**Font Stack**:
```css
--font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", 
             "Noto Sans", Helvetica, Arial, sans-serif;
--font-mono: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", 
             Consolas, monospace;
```

**Type Scale**:
```css
--text-xs: 0.75rem    /* 12px - Metadata, timestamps */
--text-sm: 0.875rem   /* 14px - Body text, descriptions */
--text-base: 1rem     /* 16px - Card titles, buttons */
--text-lg: 1.125rem   /* 18px - Page headings */
--text-xl: 1.25rem    /* 20px - Section titles */
--text-2xl: 1.5rem    /* 24px - Hero text */
--text-3xl: 2rem      /* 32px - Landing page headlines */
```

**Weights**:
- Regular (400): Body text, descriptions
- Medium (500): Buttons, labels, metadata
- Semibold (600): Card titles, headings
- Bold (700): Page titles, leaderboard ranks

### 7.4 Component Library

#### Resource Card
```jsx
<div className="resource-card">
  <div className="card-header">
    <span className="resource-type-badge">study_guide</span>
    <span className="visibility-badge visibility-region">Region</span>
  </div>
  
  <h3 className="card-title">MIS Database Normalization Cheatsheet</h3>
  
  <p className="card-description">
    Covers 1NF-BCNF with examples from past competitive tests
  </p>
  
  <div className="card-tags">
    <span className="tag">databases</span>
    <span className="tag">normalization</span>
    <span className="tag">SQL</span>
  </div>
  
  <div className="card-metadata">
    <span className="uploader">
      <UserIcon /> Anonymous • Independence HS
    </span>
    <span className="timestamp">
      <ClockIcon /> 3 days ago
    </span>
  </div>
  
  <div className="card-stats">
    <span className="stat">
      <UpvoteIcon /> 47
    </span>
    <span className="stat">
      <DownloadIcon /> 203
    </span>
    <span className="stat">
      <FileIcon /> PDF • 1.4 MB
    </span>
  </div>
  
  <div className="card-actions">
    <button className="upvote-btn">
      <ThumbsUpIcon /> Upvote
    </button>
    <button className="download-btn primary">
      <DownloadIcon /> Download
    </button>
  </div>
</div>
```

**Styles**:
```css
.resource-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px;
  transition: all 0.2s ease;
}

.resource-card:hover {
  border-color: var(--primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.resource-type-badge {
  background: var(--info);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
}

.visibility-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: var(--text-xs);
  font-weight: 600;
}

.visibility-school { background: #e3f2fd; color: #1976d2; }
.visibility-region { background: #e8f5e9; color: #388e3c; }
.visibility-state { background: #fff3e0; color: #f57c00; }
.visibility-public { background: #f5f5f5; color: #616161; }

.card-title {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
  line-height: 1.4;
}

.card-description {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: 12px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.tag {
  background: var(--surface-hover);
  color: var(--text-secondary);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: var(--text-xs);
  font-weight: 500;
}

.tag:hover {
  background: var(--primary);
  color: white;
  cursor: pointer;
}

.card-metadata {
  display: flex;
  gap: 16px;
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  margin-bottom: 12px;
}

.card-stats {
  display: flex;
  gap: 16px;
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.upvote-btn, .download-btn {
  flex: 1;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: var(--text-sm);
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upvote-btn {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-secondary);
}

.upvote-btn:hover {
  border-color: var(--success);
  color: var(--success);
}

.upvote-btn.upvoted {
  background: var(--success);
  border-color: var(--success);
  color: white;
}

.download-btn.primary {
  background: var(--primary);
  border: 1px solid var(--primary);
  color: white;
}

.download-btn.primary:hover {
  background: var(--primary-hover);
}
```

#### Filter Sidebar
```jsx
<aside className="filter-sidebar">
  <div className="filter-section">
    <h4 className="filter-heading">Resource Type</h4>
    <label className="checkbox-label">
      <input type="checkbox" checked />
      <span>Presentations</span>
      <span className="count">23</span>
    </label>
    <label className="checkbox-label">
      <input type="checkbox" checked />
      <span>Roleplay Scripts</span>
      <span className="count">18</span>
    </label>
    {/* More types */}
  </div>
  
  <div className="filter-section">
    <h4 className="filter-heading">Tags</h4>
    <input 
      type="text" 
      placeholder="Search tags..." 
      className="tag-search"
    />
    <div className="tag-chips">
      <span className="tag-chip active">databases</span>
      <span className="tag-chip">SQL</span>
      <span className="tag-chip">normalization</span>
    </div>
  </div>
  
  <div className="filter-section">
    <h4 className="filter-heading">Visibility</h4>
    {/* Visibility checkboxes */}
  </div>
  
  <button className="reset-filters">Clear All Filters</button>
</aside>
```

**Styles**:
```css
.filter-sidebar {
  background: var(--surface);
  border-right: 1px solid var(--border);
  padding: 24px;
  width: 280px;
  height: 100vh;
  overflow-y: auto;
  position: sticky;
  top: 0;
}

.filter-section {
  margin-bottom: 32px;
}

.filter-heading {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  padding: 8px 0;
  cursor: pointer;
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.checkbox-label input[type="checkbox"] {
  margin-right: 10px;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checkbox-label .count {
  margin-left: auto;
  color: var(--text-tertiary);
  font-size: var(--text-xs);
}

.tag-search {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: var(--text-sm);
  margin-bottom: 12px;
}

.tag-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-chip {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: var(--text-xs);
  font-weight: 500;
  background: var(--surface-hover);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag-chip:hover {
  background: var(--primary);
  color: white;
}

.tag-chip.active {
  background: var(--primary);
  color: white;
}

.reset-filters {
  width: 100%;
  padding: 10px;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
}

.reset-filters:hover {
  background: var(--surface-hover);
}
```

#### Navigation Bar
```jsx
<nav className="navbar">
  <div className="nav-left">
    <a href="/" className="logo">
      <BookIcon />
      <span>FBLA Hub</span>
    </a>
    
    <div className="search-bar">
      <SearchIcon />
      <input 
        type="text" 
        placeholder="Search resources, tags, events..."
      />
    </div>
  </div>
  
  <div className="nav-right">
    <a href="/events" className="nav-link">Events</a>
    <a href="/leaderboard" className="nav-link">Leaderboard</a>
    <button className="upload-btn">
      <PlusIcon />
      Upload
    </button>
    <div className="user-menu">
      <img src="/avatar.png" className="avatar" />
      <ChevronDownIcon />
    </div>
  </div>
</nav>
```

**Styles**:
```css
.navbar {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--primary);
  text-decoration: none;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 8px 16px;
  flex: 1;
  max-width: 500px;
}

.search-bar input {
  border: none;
  background: transparent;
  font-size: var(--text-sm);
  color: var(--text-primary);
  width: 100%;
  outline: none;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-link {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background: var(--surface-hover);
  color: var(--text-primary);
}

.upload-btn {
  background: var(--primary);
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: var(--text-sm);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-btn:hover {
  background: var(--primary-hover);
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-menu:hover {
  background: var(--surface-hover);
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}
```

### 7.5 Responsive Breakpoints

```css
/* Mobile-first approach */
/* Base styles (mobile): 320px+ */

@media (min-width: 640px) {
  /* Tablet: 640px+ */
  .resource-card {
    /* Adjust card layout */
  }
}

@media (min-width: 1024px) {
  /* Desktop: 1024px+ */
  .filter-sidebar {
    display: block; /* Show sidebar */
  }
  
  .main-content {
    display: grid;
    grid-template-columns: 280px 1fr;
  }
}

@media (min-width: 1280px) {
  /* Large desktop: 1280px+ */
  .resource-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

**Mobile Adaptations**:
- Filter sidebar becomes bottom sheet modal (slide up from bottom)
- Search bar moves to top (full-width)
- Navigation collapses to hamburger menu
- Card actions stack vertically
- Leaderboard table becomes cards

### 7.6 Loading States & Skeletons

**Resource Card Skeleton**:
```jsx
<div className="skeleton-card">
  <div className="skeleton-header">
    <div className="skeleton-badge"></div>
    <div className="skeleton-badge"></div>
  </div>
  <div className="skeleton-title"></div>
  <div className="skeleton-description"></div>
  <div className="skeleton-description short"></div>
  <div className="skeleton-tags">
    <div className="skeleton-tag"></div>
    <div className="skeleton-tag"></div>
    <div className="skeleton-tag"></div>
  </div>
  <div className="skeleton-stats">
    <div className="skeleton-stat"></div>
    <div className="skeleton-stat"></div>
  </div>
</div>
```

**Styles with shimmer animation**:
```css
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.skeleton-card,
.skeleton-title,
.skeleton-description,
.skeleton-badge,
.skeleton-tag,
.skeleton-stat {
  background: linear-gradient(
    90deg, 
    var(--surface) 25%, 
    var(--surface-hover) 50%, 
    var(--surface) 75%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
  border-radius: 4px;
}

.skeleton-card {
  padding: 16px;
  border: 1px solid var(--border);
  border-radius: 8px;
}

.skeleton-title {
  height: 20px;
  width: 70%;
  margin-bottom: 12px;
}

.skeleton-description {
  height: 14px;
  width: 100%;
  margin-bottom: 8px;
}

.skeleton-description.short {
  width: 60%;
}
```

---

## 8. Backend Architecture

### 8.1 Tech Stack

**Framework**: Flask (Python 3.11+)
- Flask-SQLAlchemy (ORM)
- Flask-JWT-Extended (JWT auth)
- Flask-CORS (cross-origin support)
- Flask-Migrate (database migrations)

**Database**: SQLite (development) → PostgreSQL (production)

**File Storage**: Local filesystem (`/uploads/`) → AWS S3 (production)

**API Structure**: RESTful JSON API

### 8.2 Project Structure

```
backend/
├── app/
│   ├── __init__.py           # Flask app factory
│   ├── models/
│   │   ├── __init__.py
│   │   ├── chapter.py        # Chapter model
│   │   ├── user.py           # User model
│   │   ├── resource.py       # Resource model
│   │   ├── upvote.py         # Upvote model
│   │   └── download.py       # Download model
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py           # /api/auth/* endpoints
│   │   ├── resources.py      # /api/resources/* endpoints
│   │   ├── events.py         # /api/events/* endpoints
│   │   ├── search.py         # /api/search endpoint
│   │   ├── leaderboard.py    # /api/leaderboard endpoint
│   │   └── admin.py          # /api/admin/* endpoints
│   ├── utils/
│   │   ├── validators.py     # Input validation
│   │   ├── file_handler.py   # File upload/download logic
│   │   └── access_control.py # Permission checking
│   └── config.py             # Configuration
├── migrations/               # Alembic migrations
├── uploads/                  # Local file storage (dev)
├── requirements.txt
└── run.py                    # Entry point
```

### 8.3 Key Endpoints

#### Authentication Endpoints

**POST /api/auth/signup/advisor**
```python
@auth_bp.route('/signup/advisor', methods=['POST'])
def signup_advisor():
    data = request.get_json()
    
    # Validate input
    required = ['name', 'email', 'password', 'school_name', 'region', 'state']
    if not all(k in data for k in required):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Check email uniqueness
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 409
    
    # Generate chapter key
    key = generate_chapter_key(data['state'], data['region'])
    
    # Hash password
    password_hash = bcrypt.hashpw(
        data['password'].encode('utf-8'), 
        bcrypt.gensalt()
    )
    
    # Create chapter
    chapter = Chapter(
        name=data['school_name'],
        region=data['region'],
        state=data['state'],
        advisor_name=data['name'],
        advisor_email=data['email'],
        master_key=bcrypt.hashpw(key.encode('utf-8'), bcrypt.gensalt())
    )
    db.session.add(chapter)
    db.session.flush()
    
    # Create advisor user
    advisor = User(
        name=data['name'],
        email=data['email'],
        password_hash=password_hash,
        chapter_id=chapter.id,
        is_advisor=True
    )
    db.session.add(advisor)
    db.session.commit()
    
    # Send email with key
    send_key_email(data['email'], key, chapter.name)
    
    return jsonify({
        'message': 'Advisor registered successfully',
        'chapter_key': key  # Only shown once
    }), 201
```

**POST /api/auth/signup/student**
```python
@auth_bp.route('/signup/student', methods=['POST'])
def signup_student():
    data = request.get_json()
    
    required = ['name', 'email', 'password', 'chapter_key']
    if not all(k in data for k in required):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Find chapter by key
    chapters = Chapter.query.all()
    chapter = None
    for c in chapters:
        if bcrypt.checkpw(data['chapter_key'].encode('utf-8'), c.master_key):
            chapter = c
            break
    
    if not chapter:
        return jsonify({'error': 'Invalid chapter key'}), 401
    
    # Check email uniqueness
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 409
    
    # Hash password
    password_hash = bcrypt.hashpw(
        data['password'].encode('utf-8'), 
        bcrypt.gensalt()
    )
    
    # Create user
    user = User(
        name=data['name'],
        email=data['email'],
        password_hash=password_hash,
        chapter_id=chapter.id,
        is_advisor=False
    )
    db.session.add(user)
    db.session.commit()
    
    # Generate JWT
    access_token = create_access_token(
        identity=user.id,
        additional_claims={
            'chapter_id': chapter.id,
            'region': chapter.region,
            'state': chapter.state,
            'is_advisor': False
        }
    )
    
    return jsonify({
        'access_token': access_token,
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'chapter': chapter.name
        }
    }), 201
```

**POST /api/auth/login**
```python
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password required'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not bcrypt.checkpw(
        data['password'].encode('utf-8'), 
        user.password_hash
    ):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    chapter = Chapter.query.get(user.chapter_id)
    
    access_token = create_access_token(
        identity=user.id,
        additional_claims={
            'chapter_id': chapter.id,
            'region': chapter.region,
            'state': chapter.state,
            'is_advisor': user.is_advisor
        }
    )
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.session.commit()
    
    return jsonify({
        'access_token': access_token,
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'chapter': chapter.name,
            'is_advisor': user.is_advisor
        }
    }), 200
```

#### Resource Endpoints

**POST /api/resources**
```python
@resources_bp.route('/', methods=['POST'])
@jwt_required()
def create_resource():
    current_user = get_jwt_identity()
    claims = get_jwt()
    
    # Parse multipart form data
    title = request.form.get('title')
    description = request.form.get('description', '')
    event = request.form.get('event')
    resource_type = request.form.get('resource_type')
    tags = json.loads(request.form.get('tags', '[]'))
    visibility_level = request.form.get('visibility_level')
    is_anonymous = request.form.get('is_anonymous', 'true') == 'true'
    file = request.files.get('file')
    
    # Validate
    if not all([title, event, resource_type, visibility_level, file]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    if len(title) < 3 or len(title) > 200:
        return jsonify({'error': 'Title must be 3-200 characters'}), 400
    
    if event not in FBLA_EVENTS:
        return jsonify({'error': 'Invalid event'}), 400
    
    if resource_type not in ['presentation', 'roleplay', 'questions', 'study_guide', 'other']:
        return jsonify({'error': 'Invalid resource type'}), 400
    
    if visibility_level not in ['school', 'region', 'state', 'public']:
        return jsonify({'error': 'Invalid visibility level'}), 400
    
    # Validate file
    file_ext = os.path.splitext(file.filename)[1].lower()
    allowed_exts = ['.pdf', '.pptx', '.ppt', '.docx', '.doc', '.png', '.jpg', '.jpeg', '.txt']
    if file_ext not in allowed_exts:
        return jsonify({'error': 'File type not allowed'}), 400
    
    if file.content_length > 25 * 1024 * 1024:  # 25MB
        return jsonify({'error': 'File too large (max 25MB)'}), 400
    
    # Create resource record
    resource = Resource(
        title=title,
        description=description,
        event=event,
        resource_type=resource_type,
        tags=json.dumps(tags),
        visibility_level=visibility_level,
        uploader_id=current_user,
        chapter_id=claims['chapter_id'],
        is_anonymous=is_anonymous,
        file_extension=file_ext,
        file_size_bytes=0  # Will update after save
    )
    db.session.add(resource)
    db.session.flush()  # Get resource.id
    
    # Save file
    upload_dir = os.path.join('uploads', str(resource.id))
    os.makedirs(upload_dir, exist_ok=True)
    
    filename = secure_filename(file.filename)
    filepath = os.path.join(upload_dir, filename)
    file.save(filepath)
    
    # Update file info
    resource.file_path = filepath
    resource.file_size_bytes = os.path.getsize(filepath)
    db.session.commit()
    
    return jsonify({
        'id': resource.id,
        'title': resource.title,
        'message': 'Resource uploaded successfully'
    }), 201
```

**GET /api/events/:event_slug/resources**
```python
@events_bp.route('/<event_slug>/resources', methods=['GET'])
@jwt_required()
def get_event_resources(event_slug):
    claims = get_jwt()
    
    # Validate event
    event_name = slug_to_event_name(event_slug)
    if not event_name:
        return jsonify({'error': 'Event not found'}), 404
    
    # Parse query params
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 20))
    sort = request.args.get('sort', 'recent')
    type_filter = request.args.getlist('type')
    tags_filter = request.args.getlist('tags')
    visibility_filter = request.args.getlist('visibility')
    
    # Build query with access control
    query = Resource.query.filter_by(event=event_name, is_hidden=False)
    
    # Apply visibility filter
    visibility_conditions = []
    
    if 'public' in visibility_filter or not visibility_filter:
        visibility_conditions.append(Resource.visibility_level == 'public')
    
    if 'state' in visibility_filter or not visibility_filter:
        visibility_conditions.append(
            db.and_(
                Resource.visibility_level == 'state',
                Chapter.state == claims['state']
            )
        )
    
    if 'region' in visibility_filter or not visibility_filter:
        visibility_conditions.append(
            db.and_(
                Resource.visibility_level == 'region',
                Chapter.region == claims['region']
            )
        )
    
    if 'school' in visibility_filter or not visibility_filter:
        visibility_conditions.append(
            db.and_(
                Resource.visibility_level == 'school',
                Resource.chapter_id == claims['chapter_id']
            )
        )
    
    query = query.join(Chapter).filter(db.or_(*visibility_conditions))
    
    # Apply type filter
    if type_filter:
        query = query.filter(Resource.resource_type.in_(type_filter))
    
    # Apply tags filter
    if tags_filter:
        # SQL JSON search (SQLite JSON1 extension)
        for tag in tags_filter:
            query = query.filter(Resource.tags.contains(f'"{tag}"'))
    
    # Apply sorting
    if sort == 'recent':
        query = query.order_by(Resource.created_at.desc())
    elif sort == 'popular':
        query = query.order_by(Resource.upvote_count.desc())
    elif sort == 'downloads':
        query = query.order_by(Resource.download_count.desc())
    
    # Paginate
    total = query.count()
    resources = query.offset((page - 1) * limit).limit(limit).all()
    
    # Format response
    current_user_id = get_jwt_identity()
    results = []
    for r in resources:
        # Check if user has upvoted
        user_upvoted = Upvote.query.filter_by(
            user_id=current_user_id,
            resource_id=r.id
        ).first() is not None
        
        results.append({
            'id': r.id,
            'title': r.title,
            'description': r.description,
            'resource_type': r.resource_type,
            'tags': json.loads(r.tags),
            'visibility_level': r.visibility_level,
            'uploader': {
                'name': 'Anonymous' if r.is_anonymous else r.uploader.name,
                'chapter': r.chapter.name,
                'region': r.chapter.region
            },
            'file_extension': r.file_extension,
            'file_size_bytes': r.file_size_bytes,
            'upvote_count': r.upvote_count,
            'download_count': r.download_count,
            'created_at': r.created_at.isoformat(),
            'user_has_upvoted': user_upvoted
        })
    
    return jsonify({
        'event': {
            'name': event_name,
            'slug': event_slug
        },
        'resources': results,
        'pagination': {
            'current_page': page,
            'total_pages': (total + limit - 1) // limit,
            'total_results': total
        }
    }), 200
```

**GET /api/resources/:id/download**
```python
@resources_bp.route('/<int:id>/download', methods=['GET'])
@jwt_required()
def download_resource(id):
    current_user = get_jwt_identity()
    claims = get_jwt()
    
    resource = Resource.query.get(id)
    if not resource:
        return jsonify({'error': 'Resource not found'}), 404
    
    # Check access
    if not can_access_resource(claims, resource):
        return jsonify({'error': 'Access denied'}), 403
    
    # Log download
    download = Download(
        user_id=current_user,
        resource_id=resource.id
    )
    db.session.add(download)
    
    # Increment download count
    resource.download_count += 1
    db.session.commit()
    
    # Serve file
    return send_file(
        resource.file_path,
        as_attachment=True,
        download_name=f"{resource.title}{resource.file_extension}"
    )
```

**POST /api/resources/:id/upvote**
```python
@resources_bp.route('/<int:id>/upvote', methods=['POST'])
@jwt_required()
def upvote_resource(id):
    current_user = get_jwt_identity()
    
    resource = Resource.query.get(id)
    if not resource:
        return jsonify({'error': 'Resource not found'}), 404
    
    # Can't upvote own resource
    if resource.uploader_id == current_user:
        return jsonify({'error': 'Cannot upvote own resource'}), 400
    
    # Check if already upvoted
    existing = Upvote.query.filter_by(
        user_id=current_user,
        resource_id=id
    ).first()
    
    if existing:
        # Remove upvote (toggle)
        db.session.delete(existing)
        resource.upvote_count -= 1
        user_has_upvoted = False
    else:
        # Add upvote
        upvote = Upvote(user_id=current_user, resource_id=id)
        db.session.add(upvote)
        resource.upvote_count += 1
        user_has_upvoted = True
    
    db.session.commit()
    
    return jsonify({
        'success': True,
        'new_upvote_count': resource.upvote_count,
        'user_has_upvoted': user_has_upvoted
    }), 200
```

#### Leaderboard Endpoint

**GET /api/leaderboard**
```python
@leaderboard_bp.route('/', methods=['GET'])
@jwt_required()
def get_leaderboard():
    claims = get_jwt()
    
    type_param = request.args.get('type', 'schools')
    metric = request.args.get('metric', 'uploads')
    timeframe = request.args.get('timeframe', 'all-time')
    
    # Build date filter
    date_filter = None
    if timeframe == 'month':
        date_filter = datetime.utcnow() - timedelta(days=30)
    
    if type_param == 'schools':
        # School leaderboard
        query = db.session.query(
            Chapter.id,
            Chapter.name,
            Chapter.region,
            Chapter.state,
            func.count(distinct(Resource.id)).label('total_uploads'),
            func.coalesce(func.sum(Resource.upvote_count), 0).label('total_upvotes'),
            func.coalesce(func.sum(Resource.download_count), 0).label('total_downloads')
        ).outerjoin(User, User.chapter_id == Chapter.id) \
         .outerjoin(Resource, Resource.uploader_id == User.id)
        
        if date_filter:
            query = query.filter(Resource.created_at >= date_filter)
        
        query = query.group_by(Chapter.id)
        
        # Sort by metric
        if metric == 'uploads':
            query = query.order_by(desc('total_uploads'))
        elif metric == 'upvotes':
            query = query.order_by(desc('total_upvotes'))
        elif metric == 'downloads':
            query = query.order_by(desc('total_downloads'))
        
        results = query.limit(100).all()
        
        leaderboard = []
        for idx, row in enumerate(results, 1):
            leaderboard.append({
                'rank': idx,
                'chapter': {
                    'id': row.id,
                    'name': row.name,
                    'region': row.region,
                    'state': row.state
                },
                'metrics': {
                    'total_uploads': row.total_uploads,
                    'total_upvotes': row.total_upvotes,
                    'total_downloads': row.total_downloads
                },
                'is_user_chapter': row.id == claims['chapter_id']
            })
        
        return jsonify({'leaderboard': leaderboard}), 200
    
    elif type_param == 'regions':
        # Region leaderboard (aggregate chapters by region)
        query = db.session.query(
            Chapter.region,
            Chapter.state,
            func.count(distinct(Resource.id)).label('total_uploads'),
            func.coalesce(func.sum(Resource.upvote_count), 0).label('total_upvotes'),
            func.coalesce(func.sum(Resource.download_count), 0).label('total_downloads')
        ).outerjoin(User, User.chapter_id == Chapter.id) \
         .outerjoin(Resource, Resource.uploader_id == User.id)
        
        if date_filter:
            query = query.filter(Resource.created_at >= date_filter)
        
        query = query.group_by(Chapter.region, Chapter.state)
        
        if metric == 'uploads':
            query = query.order_by(desc('total_uploads'))
        elif metric == 'upvotes':
            query = query.order_by(desc('total_upvotes'))
        elif metric == 'downloads':
            query = query.order_by(desc('total_downloads'))
        
        results = query.limit(50).all()
        
        leaderboard = []
        for idx, row in enumerate(results, 1):
            leaderboard.append({
                'rank': idx,
                'region': {
                    'name': row.region,
                    'state': row.state
                },
                'metrics': {
                    'total_uploads': row.total_uploads,
                    'total_upvotes': row.total_upvotes,
                    'total_downloads': row.total_downloads
                },
                'is_user_region': row.region == claims['region']
            })
        
        return jsonify({'leaderboard': leaderboard}), 200
    
    # Similar logic for states...
```

---

## 9. Development Roadmap

### Phase 1: Core MVP (Weeks 1-2)

**Week 1: Backend Foundation**
- [ ] Set up Flask project structure
- [ ] Design and implement database schema
- [ ] Build authentication endpoints (signup, login)
- [ ] Implement chapter key generation/validation
- [ ] Create resource upload endpoint with file handling
- [ ] Build access control logic (visibility filtering)

**Week 2: Frontend Basics**
- [ ] Set up React project with routing
- [ ] Design and implement component library
- [ ] Build authentication pages (signup/login forms)
- [ ] Create dashboard layout with navigation
- [ ] Implement resource upload form
- [ ] Build event directory page

### Phase 2: Core Features (Weeks 3-4)

**Week 3: Resource Discovery**
- [ ] Implement event resource listing with filters
- [ ] Build search endpoint with FTS5
- [ ] Create search results page
- [ ] Add tag filtering and autocomplete
- [ ] Implement resource detail page
- [ ] Add download tracking

**Week 4: Community Features**
- [ ] Build upvoting system
- [ ] Create leaderboard endpoint (schools/regions/states)
- [ ] Design and implement leaderboard page
- [ ] Add user profile page (my uploads)
- [ ] Implement advisor moderation dashboard
- [ ] Add chapter key regeneration

### Phase 3: Polish & Testing (Week 5)

- [ ] Add loading skeletons and error states
- [ ] Implement responsive mobile layouts
- [ ] Add dark mode toggle
- [ ] Write unit tests for critical paths
- [ ] Perform end-to-end testing
- [ ] Fix bugs and edge cases
- [ ] Optimize performance (lazy loading, pagination)

### Phase 4: Deployment Prep (Week 6)

- [ ] Set up production database (PostgreSQL)
- [ ] Configure AWS S3 for file storage
- [ ] Set up Cloudflare for domain/CDN
- [ ] Write deployment documentation
- [ ] Create advisor onboarding guide
- [ ] Prepare demo content (seed data)

---

## 10. Success Metrics

### User Engagement
- **Primary**: Monthly Active Users (MAU) per chapter
- **Secondary**: Average uploads per user, average downloads per resource

### Content Quality
- **Primary**: Percentage of resources with 5+ upvotes
- **Secondary**: Average upvote-to-download ratio (indicates usefulness)

### Community Growth
- **Primary**: Number of participating chapters
- **Secondary**: Percentage of chapters with 10+ uploads

### Platform Health
- **Primary**: Retention rate (users returning after 30 days)
- **Secondary**: Advisor satisfaction (survey-based)

**Target Metrics (6 months post-launch)**:
- 20+ Virginia chapters registered
- 500+ total resources uploaded
- 70%+ of resources at region/state level (not hoarded at school level)
- 40%+ monthly active user rate
- Average 15 downloads per resource

---

## 11. Future Enhancements (Post-MVP)

### Phase 2 Features
- **Email notifications**: Digest emails for new region/state resources
- **Resource versioning**: Allow uploaders to post updated versions
- **Collections/playlists**: Curated sets of resources (e.g., "Complete MIS Study Pack")
- **Comments/discussions**: Thread-based discussions on resource pages
- **Mobile apps**: Native iOS/Android apps
- **Advanced analytics**: For advisors (which events need more resources, download trends)

### Phase 3 Features
- **Collaborative editing**: Multiple authors for a single resource
- **Live study sessions**: Video chat integration for group study
- **Practice test generator**: AI-powered question generation from uploaded materials
- **Scholarship tie-in**: Reward top contributors with ScholarshipScholar credits
- **National expansion**: Scale beyond Virginia to all 50 states

---

## 12. Risk Mitigation

### Content Quality Risks
**Risk**: Low-quality or spam uploads degrade platform value
**Mitigation**: Advisor moderation tools, upvote-based ranking, community reporting

### Privacy Risks
**Risk**: Students accidentally upload files with personal info (grades, names)
**Mitigation**: Upload guidelines page, file scanning for common PII patterns, advisor review queue

### Scalability Risks
**Risk**: File storage costs balloon as platform grows
**Mitigation**: Implement file size caps, compress PDFs/images on upload, consider freemium model for unlimited uploads

### Adoption Risks
**Risk**: Not enough initial content to prove value
**Mitigation**: Seed platform with Lalith's existing materials, recruit 3-5 pilot schools pre-launch, incentivize early uploaders with leaderboard badges

### Security Risks
**Risk**: Chapter keys leaked, unauthorized access
**Mitigation**: Rate limiting on signup, email verification (post-MVP), advisor audit logs, key regeneration feature

---

## 13. Testing Plan

### Unit Tests
- Authentication: Signup validation, login failures, JWT claims
- Access control: Visibility filtering, cross-chapter access attempts
- File uploads: Extension validation, size limits, path traversal attacks
- Upvoting: Toggle logic, duplicate prevention, self-upvote blocking

### Integration Tests
- End-to-end flows: Signup → upload → search → download
- Cross-tier access: School user can access region resources, not other schools
- Moderation: Advisor hides resource → disappears from listings

### Manual Testing Checklist
- [ ] Mobile responsiveness (iOS Safari, Android Chrome)
- [ ] File download on different browsers (Chrome, Firefox, Safari)
- [ ] Search relevance quality (tag matches, title matches)
- [ ] Leaderboard accuracy (verify counts manually)
- [ ] Dark mode consistency (no white flashes)

---

## 14. Documentation Requirements

### For Developers
- **README.md**: Setup instructions, tech stack, architecture overview
- **API documentation**: Endpoint specs with example requests/responses
- **Database schema diagram**: Visual ERD with relationships
- **Deployment guide**: Environment setup, secrets management, migration steps

### For Users
- **Advisor guide**: How to register, distribute chapter key, moderate uploads
- **Student guide**: How to join, upload resources, search effectively
- **FAQ**: Common questions (visibility tiers, file formats, upvoting rules)

### For Stakeholders
- **Product roadmap**: Feature timeline, success metrics, growth projections
- **Demo script**: Step-by-step walkthrough for sponsor pitches
- **Case study**: Early adopter testimonials, usage statistics

---

## Appendix A: FBLA Events List

```python
FBLA_EVENTS = [
    "Accounting I",
    "Accounting II",
    "Advertising",
    "Agribusiness",
    "American Enterprise Project",
    "Banking & Financial Systems",
    "Business Calculations",
    "Business Communication",
    "Business Financial Plan",
    "Business Law",
    "Business Management",
    "Business Plan",
    "Client Service",
    "Coding & Programming",
    "Community Service Project",
    "Computer Applications",
    "Computer Game & Simulation Programming",
    "Computer Problem Solving",
    "Cyber Security",
    "Database Design & Applications",
    "Desktop Application Programming",
    "Digital Video Production",
    "E-Business",
    "Economics",
    "Emerging Business Issues",
    "Entrepreneurship",
    "Event Planning",
    "Future Business Leader",
    "Global Business",
    "Graphic Design",
    "Health Care Administration",
    "Hospitality & Event Management",
    "Human Resource Management",
    "Import/Export",
    "Insurance & Risk Management",
    "International Business",
    "Introduction to Business",
    "Introduction to Business Communication",
    "Introduction to Business Presentation",
    "Introduction to Event Planning",
    "Introduction to Financial Math",
    "Introduction to Information Technology",
    "Introduction to Parliamentary Procedure",
    "Introduction to Public Speaking",
    "Introduction to FBLA",
    "Job Interview",
    "Journalism",
    "Local Chapter Annual Business Report",
    "Management Decision Making",
    "Management Information Systems",
    "Marketing",
    "Mobile Application Development",
    "Network Design",
    "Networking Concepts",
    "Organizational Leadership",
    "Parliamentary Procedure",
    "Partnership with Business Project",
    "Personal Finance",
    "Political Science",
    "Public Service Announcement",
    "Public Speaking",
    "Publications Design",
    "Sales Presentation",
    "Securities & Investments",
    "Small Business Management",
    "Social Media Strategies",
    "Sports & Entertainment Management",
    "Sports Management & Marketing",
    "Spreadsheet Applications",
    "UX Design",
    "Web Site Development",
    "Word Processing"
]
```

---

## Appendix B: File Upload Security Checklist

- [ ] Validate file extension against allowlist (no .exe, .sh, .bat)
- [ ] Check MIME type matches extension (prevent disguised files)
- [ ] Scan for viruses with ClamAV (or cloud scanning service)
- [ ] Limit file size to 25MB max
- [ ] Sanitize filename (remove special chars, path traversal attempts)
- [ ] Store files outside web root (not publicly accessible)
- [ ] Generate random directory names (prevent enumeration)
- [ ] Set restrictive file permissions (644, not 777)
- [ ] Serve downloads through application logic (enforce access control)
- [ ] Log all upload attempts (for audit trail)

---

## Appendix C: Deployment Checklist

### Pre-Deployment
- [ ] Environment variables configured (.env file)
- [ ] Database migrations applied
- [ ] Static assets bundled (React build)
- [ ] HTTPS certificate obtained (Cloudflare SSL)
- [ ] Domain DNS configured (A/CNAME records)
- [ ] CORS origins whitelisted (production domain only)

### Deployment Steps
1. Push code to GitHub repository
2. SSH into production server (or use PaaS like Heroku/Railway)
3. Pull latest code: `git pull origin main`
4. Install dependencies: `pip install -r requirements.txt`, `npm install`
5. Run migrations: `flask db upgrade`
6. Build frontend: `npm run build`
7. Restart application: `systemctl restart fbla-hub`
8. Verify health check: `curl https://fblahub.com/api/health`

### Post-Deployment
- [ ] Smoke test critical paths (signup, login, upload)
- [ ] Monitor error logs for 24 hours
- [ ] Send announcement email to pilot schools
- [ ] Update status page (if applicable)

---

**Document Version**: 1.0  
**Last Updated**: April 14, 2026  
**Author**: Lalith Kumar  
**Project**: FBLA Resource Hub MVP  
**Target Launch**: June 2026 (before States competition)
