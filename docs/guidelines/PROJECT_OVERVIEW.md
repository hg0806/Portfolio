# Portfolio Project - Development Guidelines

## Project Overview
Behance-style portfolio website with built-in CMS functionality. Users can upload files and manage content directly from the frontend with flexible grid layouts and dual navigation.

## Technology Stack

### Core Framework
- **Next.js 15** (App Router with React Server Components)
- **React 19** (Enhanced server components and actions)
- **TypeScript** (Type safety throughout)
- **Tailwind CSS** (Utility-first styling)

### Frontend Libraries
- **react-player** - Video embeds (YouTube/Vimeo)
- **framer-motion** - Animations and transitions
- **react-dropzone** - File upload UI
- **TipTap** or **Lexical** - Rich text editor

### Backend & Storage
- **PostgreSQL** (Vercel Postgres or Supabase)
- **Prisma** - Type-safe ORM
- **NextAuth** - Authentication (OAuth + email)
- **File Storage** - `/public/uploads` (local) → Cloud storage migration ready

## Project Architecture

### Directory Structure
```
portfolio/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Auth-protected routes (admin)
│   │   ├── (public)/           # Public routes (portfolio views)
│   │   └── api/                # API routes
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── admin/              # Admin-only components
│   │   └── content/            # Content display components
│   ├── lib/                    # Utility functions, configs
│   └── types/                  # TypeScript type definitions
├── prisma/
│   └── schema.prisma           # Database schema
├── public/
│   └── uploads/                # User-uploaded files
└── docs/
    └── guidelines/             # Development documentation
```

### Route Groups
- `(auth)` - Protected admin routes requiring authentication
- `(public)` - Public portfolio views accessible to everyone

## Key Features

### 1. Flexible Grid Layout
- Admin sets grid width per content item (1-4 columns)
- Responsive: 4 → 3 → 2 → 1 columns on smaller screens
- Masonry-style flow (Pinterest/Behance)

### 2. Dual Navigation
- **Content-First View**: `/videos/long` - All long-form videos
- **Activity-First View**: `/activities/[slug]` - Activity with related content
- Same content appears in both views

### 3. Content Management
- **Upload Flow**: Admin login → Dashboard → Upload → Set properties → Publish
- **Types**: Videos (long/short), Instagram embeds, Card news, Posters, Images
- **Properties**: Title, description, tags, grid size, activity links

### 4. Activity Management
- Create activities with rich text descriptions
- Link multiple content items to activities
- Timeline/story-style presentation
- Tags and date-based organization

## Database Schema

### Core Models
- **User** - Authentication and role management
- **Content** - Portfolio items (videos, images, embeds)
- **Activity** - Project/event descriptions
- **ActivityContent** - Many-to-many relation between activities and content

### Content Types
```typescript
enum ContentType {
  LONG_VIDEO    // Long-form videos
  SHORT_VIDEO   // Short-form videos
  INSTAGRAM     // Instagram embeds
  CARD_NEWS     // Card news designs
  POSTER        // Poster designs
  IMAGE         // General images
}
```

## Development Workflow

### Local Development
1. Install dependencies: `npm install`
2. Set up environment variables in `.env.local`
3. Initialize database: `npx prisma migrate dev`
4. Run dev server: `npm run dev` (uses Turbopack)

### Environment Variables Required
```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-random-secret"

# OAuth (optional)
GITHUB_ID=""
GITHUB_SECRET=""
```

### Database Commands
- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma generate` - Generate Prisma Client
- `npx prisma studio` - Visual database browser

## API Routes Structure

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth handler

### Content Management
- `GET /api/content` - List all content
- `POST /api/content` - Create content
- `PUT /api/content/[id]` - Update content
- `DELETE /api/content/[id]` - Delete content

### Activity Management
- `GET /api/activities` - List activities
- `POST /api/activities` - Create activity
- `PUT /api/activities/[id]` - Update activity
- `DELETE /api/activities/[id]` - Delete activity

### File Upload
- `POST /api/upload` - Handle file uploads (images, videos)

## Component Architecture

### Reusable UI Components (`/components/ui`)
- **GridLayout** - Responsive masonry grid
- **ContentCard** - Preview card for content items
- **Lightbox** - Modal for detailed content view
- **FileUploader** - Drag-drop file upload interface
- **RichEditor** - Rich text editor wrapper

### Admin Components (`/components/admin`)
- **ContentForm** - Create/edit content
- **ActivityForm** - Create/edit activities
- **MediaManager** - Browse and manage uploaded files

### Content Display (`/components/content`)
- **VideoPlayer** - Embedded video player
- **ImageGallery** - Image grid display
- **ActivityTimeline** - Timeline layout for activities

## Styling Guidelines

### Tailwind CSS Conventions
- Use utility classes for styling
- Create custom components in `@layer components` for reusable patterns
- Responsive design: Mobile-first approach
- Dark mode support via CSS variables

### Grid System
```tsx
// Example grid sizes
gridSize === 1: "col-span-1"           // 1 column
gridSize === 2: "md:col-span-2"        // 2 columns
gridSize === 3: "lg:col-span-3"        // 3 columns
gridSize === 4: "lg:col-span-4"        // 4 columns (full width)
```

## Authentication & Authorization

### NextAuth Configuration
- Email/Password authentication
- OAuth providers (GitHub, Google)
- Role-based access control (admin vs user)

### Route Protection
- Middleware for auth-protected routes
- Admin role check for CMS access
- Public routes accessible without auth

## File Upload Strategy

### Current: Local Storage
- Files stored in `/public/uploads`
- Served directly by Next.js
- Simple for development and small-scale

### Future: Cloud Storage Migration
When ready to scale:
1. Choose provider (Cloudinary for media, S3 for general)
2. Update upload API to use cloud SDK
3. Migrate existing files with script
4. Update database paths to cloud URLs
5. Benefits: CDN, unlimited storage, optimized delivery

## Performance Optimization

### Next.js 15 Features
- **Turbopack** - Faster builds and HMR
- **React Server Components** - Reduced client JS
- **Partial Prerendering** - Faster initial loads
- **Enhanced Caching** - Better fetch and component caching

### Image Optimization
- Use `next/image` for automatic optimization
- Lazy loading for grid items
- Responsive image sizes
- WebP format where supported

### Code Splitting
- Route-based splitting (automatic)
- Dynamic imports for heavy components
- Lazy load admin components

## Testing Strategy

### Manual Testing Checklist
- [ ] Content CRUD operations
- [ ] File upload (various types/sizes)
- [ ] Authentication flow
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Grid layout responsiveness
- [ ] Activity-content linking

### Future Automated Testing
- Unit tests for utilities and helpers
- Integration tests for API routes
- E2E tests for critical user flows

## Deployment

### Vercel Deployment (Recommended)
1. Connect GitHub repository
2. Configure environment variables
3. Set up PostgreSQL database
4. Deploy with automatic CI/CD

### Environment Setup
- Production database connection
- NextAuth production URL
- OAuth production credentials
- File upload limits and validations

## Maintenance & Updates

### Regular Maintenance
- Update dependencies regularly
- Monitor database performance
- Clean up unused uploaded files
- Review and optimize slow queries

### Feature Extensions
- Cloud storage migration when needed
- Advanced search and filtering
- Content analytics and insights
- Multi-user collaboration features

## Coding Standards

### TypeScript
- Strict mode enabled
- Define types in `/src/types`
- Use Prisma-generated types where applicable
- Avoid `any` type

### File Naming
- Components: PascalCase (`GridLayout.tsx`)
- Utilities: camelCase (`formatDate.ts`)
- API routes: kebab-case (`route.ts` in folders)

### Code Organization
- One component per file
- Co-locate related utilities
- Keep components focused and single-purpose
- Extract reusable logic into hooks

## Security Considerations

### File Upload Security
- Validate file types (whitelist)
- Limit file sizes (10MB default)
- Sanitize filenames
- Store outside web root when possible

### Authentication Security
- Use secure session storage
- Implement CSRF protection (NextAuth handles)
- Validate user roles on API routes
- Secure environment variables

### Database Security
- Use parameterized queries (Prisma handles)
- Implement rate limiting on API routes
- Validate and sanitize all inputs
- Regular security audits

## Resources

### Documentation Links
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth Docs](https://next-auth.js.org/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Reference Projects
- Behance (inspiration for grid layout)
- Notion (inspiration for rich text editing)
- Pinterest (inspiration for masonry layout)

---

**Last Updated**: 2024-12-24
**Project Status**: Initial Setup Phase
