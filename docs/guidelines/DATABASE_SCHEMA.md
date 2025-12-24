# Database Schema Documentation

## Overview
This document describes the database schema for the Portfolio project using Prisma ORM with PostgreSQL.

## Entity Relationship Diagram

```
┌─────────────┐
│    User     │
├─────────────┤
│ id (PK)     │──┐
│ email       │  │
│ name        │  │
│ role        │  │
│ createdAt   │  │
└─────────────┘  │
                 │
                 │ (1:N)
                 │
                 ├──────────────────┐
                 │                  │
                 ▼                  ▼
         ┌─────────────┐    ┌─────────────┐
         │   Content   │    │  Activity   │
         ├─────────────┤    ├─────────────┤
         │ id (PK)     │    │ id (PK)     │
         │ type        │    │ title       │
         │ title       │    │ slug        │
         │ description │    │ description │
         │ embedUrl    │    │ date        │
         │ filePath    │    │ tags        │
         │ thumbnail   │    │ featured    │
         │ tags        │    │ userId (FK) │
         │ gridSize    │    │ createdAt   │
         │ order       │    │ updatedAt   │
         │ published   │    └─────────────┘
         │ userId (FK) │            │
         │ createdAt   │            │
         │ updatedAt   │            │ (M:N)
         └─────────────┘            │
                 │                  │
                 │                  │
                 └────────┬─────────┘
                          │
                          ▼
                ┌──────────────────┐
                │ ActivityContent  │
                ├──────────────────┤
                │ activityId (FK)  │
                │ contentId (FK)   │
                │ order            │
                └──────────────────┘
```

## Models

### User
Represents authenticated users with different roles (admin, user).

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      String   @default("user")
  createdAt DateTime @default(now())

  contents   Content[]
  activities Activity[]
}
```

**Fields:**
- `id` - Unique identifier (CUID)
- `email` - User's email address (unique)
- `name` - User's display name (optional)
- `role` - User role: "admin" or "user" (default: "user")
- `createdAt` - Account creation timestamp

**Relationships:**
- One user → Many contents
- One user → Many activities

**Usage:**
- Authentication via NextAuth
- Admin users can create/edit content
- Regular users can only view published content

---

### Content
Portfolio items including videos, images, and embeds.

```prisma
model Content {
  id          String   @id @default(cuid())
  type        ContentType
  title       String
  description String?

  // For embeds (YouTube, Instagram, etc.)
  embedUrl    String?

  // For uploaded files
  filePath    String?
  thumbnailPath String?

  // Organization
  tags        String[]
  gridSize    Int       @default(1)
  order       Int       @default(0)
  published   Boolean   @default(true)

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  userId      String
  user        User      @relation(fields: [userId], references: [id])

  activities  ActivityContent[]
}

enum ContentType {
  LONG_VIDEO
  SHORT_VIDEO
  INSTAGRAM
  CARD_NEWS
  POSTER
  IMAGE
}
```

**Fields:**
- `id` - Unique identifier (CUID)
- `type` - Content type (see ContentType enum)
- `title` - Display title
- `description` - Optional description text
- `embedUrl` - URL for embedded content (YouTube, Instagram, etc.)
- `filePath` - Path to uploaded file (relative to /public)
- `thumbnailPath` - Path to thumbnail image (for videos)
- `tags` - Array of tag strings for categorization
- `gridSize` - Grid width in columns (1-4)
- `order` - Display order in grids
- `published` - Visibility status (false = draft)
- `userId` - Owner's user ID (foreign key)

**Relationships:**
- Many contents → One user
- Many contents → Many activities (via ActivityContent)

**Content Types:**
1. **LONG_VIDEO** - Long-form videos (>1 min)
2. **SHORT_VIDEO** - Short-form videos (<1 min)
3. **INSTAGRAM** - Instagram post embeds
4. **CARD_NEWS** - Card news designs (images)
5. **POSTER** - Poster designs (images)
6. **IMAGE** - General images

**Grid Sizes:**
- `1` - 1 column (25% width on desktop)
- `2` - 2 columns (50% width on desktop)
- `3` - 3 columns (75% width on desktop)
- `4` - 4 columns (100% width, full row)

---

### Activity
Projects or events that group related content items.

```prisma
model Activity {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String   // Rich text / MDX
  date        DateTime
  tags        String[]
  featured    Boolean  @default(false)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  userId      String
  user        User     @relation(fields: [userId], references: [id])

  contents    ActivityContent[]
}
```

**Fields:**
- `id` - Unique identifier (CUID)
- `title` - Activity title
- `slug` - URL-friendly identifier (unique, e.g., "summer-campaign-2024")
- `description` - Rich text content (supports markdown/MDX)
- `date` - Activity date (for timeline ordering)
- `tags` - Array of tag strings for categorization
- `featured` - Whether to highlight this activity
- `userId` - Creator's user ID (foreign key)

**Relationships:**
- Many activities → One user
- Many activities → Many contents (via ActivityContent)

**Slug Generation:**
- Auto-generated from title (e.g., "My Project" → "my-project")
- Must be unique across all activities
- Used in URL: `/activities/my-project`

---

### ActivityContent
Junction table for many-to-many relationship between Activities and Content.

```prisma
model ActivityContent {
  activityId  String
  contentId   String
  order       Int      @default(0)

  activity    Activity @relation(fields: [activityId], references: [id], onDelete: Cascade)
  content     Content  @relation(fields: [contentId], references: [id], onDelete: Cascade)

  @@id([activityId, contentId])
}
```

**Fields:**
- `activityId` - Activity ID (foreign key)
- `contentId` - Content ID (foreign key)
- `order` - Display order within the activity

**Composite Primary Key:**
- `[activityId, contentId]` - Ensures unique relationship

**Cascade Deletion:**
- When Activity is deleted → All ActivityContent records are deleted
- When Content is deleted → All ActivityContent records are deleted

**Usage:**
- Links content items to activities
- Allows same content to appear in multiple activities
- Controls display order of content within activities

---

## Query Examples

### Get all published content with user info
```typescript
const contents = await prisma.content.findMany({
  where: { published: true },
  include: {
    user: {
      select: { name: true, email: true }
    }
  },
  orderBy: { createdAt: 'desc' }
});
```

### Get content by type with pagination
```typescript
const videos = await prisma.content.findMany({
  where: {
    type: { in: ['LONG_VIDEO', 'SHORT_VIDEO'] },
    published: true
  },
  skip: (page - 1) * 20,
  take: 20,
  orderBy: { order: 'asc' }
});
```

### Get activity with related content
```typescript
const activity = await prisma.activity.findUnique({
  where: { slug: 'my-project' },
  include: {
    contents: {
      include: {
        content: true
      },
      orderBy: { order: 'asc' }
    },
    user: {
      select: { name: true }
    }
  }
});
```

### Create content with activity link
```typescript
const content = await prisma.content.create({
  data: {
    type: 'LONG_VIDEO',
    title: 'My Video',
    embedUrl: 'https://youtube.com/watch?v=...',
    tags: ['tutorial', 'design'],
    gridSize: 2,
    published: true,
    userId: user.id,
    activities: {
      create: {
        activityId: activity.id,
        order: 0
      }
    }
  }
});
```

### Search content by tags
```typescript
const taggedContent = await prisma.content.findMany({
  where: {
    published: true,
    tags: {
      hasSome: ['featured', 'tutorial'] // Match any of these tags
    }
  }
});
```

### Get featured activities
```typescript
const featuredActivities = await prisma.activity.findMany({
  where: { featured: true },
  include: {
    contents: {
      take: 3, // First 3 content items
      include: { content: true }
    }
  },
  orderBy: { date: 'desc' }
});
```

## Indexes

### Recommended Indexes (to be added)
```prisma
// Add to Content model
@@index([published, type])
@@index([userId])
@@index([createdAt])

// Add to Activity model
@@index([featured])
@@index([date])
@@index([userId])
```

**Benefits:**
- Faster filtering by published status and type
- Improved user content queries
- Efficient date-based sorting
- Quick featured content lookup

## Migration Commands

### Create migration
```bash
npx prisma migrate dev --name <migration-name>
```

Examples:
```bash
npx prisma migrate dev --name init
npx prisma migrate dev --name add_thumbnail_field
npx prisma migrate dev --name add_activity_featured
```

### Generate Prisma Client
```bash
npx prisma generate
```

### Reset database (development only)
```bash
npx prisma migrate reset
```

### View database in browser
```bash
npx prisma studio
```

## Data Validation

### Content Type Validation
```typescript
const validTypes = [
  'LONG_VIDEO',
  'SHORT_VIDEO',
  'INSTAGRAM',
  'CARD_NEWS',
  'POSTER',
  'IMAGE'
] as const;

function isValidContentType(type: string): type is ContentType {
  return validTypes.includes(type as ContentType);
}
```

### Grid Size Validation
```typescript
function isValidGridSize(size: number): size is 1 | 2 | 3 | 4 {
  return size >= 1 && size <= 4;
}
```

### Slug Generation
```typescript
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
```

## Seed Data (Development)

### Example seed script
```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin'
    }
  });

  // Create sample content
  const content = await prisma.content.create({
    data: {
      type: 'LONG_VIDEO',
      title: 'Sample Video',
      embedUrl: 'https://youtube.com/watch?v=example',
      tags: ['sample', 'demo'],
      gridSize: 2,
      published: true,
      userId: admin.id
    }
  });

  // Create sample activity
  const activity = await prisma.activity.create({
    data: {
      title: 'Sample Project',
      slug: 'sample-project',
      description: 'A sample project for demonstration',
      date: new Date(),
      tags: ['demo'],
      featured: true,
      userId: admin.id,
      contents: {
        create: {
          contentId: content.id,
          order: 0
        }
      }
    }
  });

  console.log({ admin, content, activity });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Run seed script
```bash
npx prisma db seed
```

Add to package.json:
```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

---

**Last Updated**: 2024-12-24
