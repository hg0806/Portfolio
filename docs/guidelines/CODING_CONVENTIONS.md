# Coding Conventions

## File and Folder Structure

### Naming Conventions
- **Components**: PascalCase (`GridLayout.tsx`, `ContentCard.tsx`)
- **Utilities/Hooks**: camelCase (`useAuth.ts`, `formatDate.ts`)
- **API Routes**: Use folder structure with `route.ts` (`/api/content/route.ts`)
- **Types**: PascalCase for type names (`ContentType`, `ActivityData`)

### Folder Organization
```
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── ui/                 # Generic reusable UI components
│   ├── admin/              # Admin-specific components
│   └── content/            # Content display components
├── lib/                    # Utilities, helpers, configs
├── types/                  # TypeScript type definitions
└── hooks/                  # Custom React hooks (if needed)
```

## TypeScript Guidelines

### Type Safety
- **Always use TypeScript strict mode**
- **Avoid `any` type** - Use `unknown` if type is truly unknown
- **Define explicit return types** for functions
- **Use Prisma-generated types** for database models

### Type Definitions
```typescript
// ✅ Good: Explicit types
interface ContentCardProps {
  content: Content;
  onClick?: () => void;
}

export function ContentCard({ content, onClick }: ContentCardProps) {
  // ...
}

// ❌ Bad: Implicit any
export function ContentCard({ content, onClick }) {
  // ...
}
```

### Type Organization
```typescript
// types/index.ts
export type { Content, Activity, User } from '@prisma/client';

export interface ContentFormData {
  title: string;
  description?: string;
  type: ContentType;
  gridSize: 1 | 2 | 3 | 4;
  tags: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

## React Components

### Component Structure
```typescript
// 1. Imports (external, internal, types)
import { useState } from 'react';
import { Content } from '@prisma/client';
import { cn } from '@/lib/utils';

// 2. Type definitions
interface ComponentProps {
  // ...
}

// 3. Component definition
export function Component({ prop1, prop2 }: ComponentProps) {
  // 4. Hooks
  const [state, setState] = useState();

  // 5. Event handlers
  const handleClick = () => {
    // ...
  };

  // 6. Render
  return (
    <div>
      {/* ... */}
    </div>
  );
}
```

### Server vs Client Components
```typescript
// Server Component (default in App Router)
// No 'use client' directive
export default async function Page() {
  const data = await fetchData(); // Can use async/await
  return <div>{data}</div>;
}

// Client Component (interactive UI)
'use client';

import { useState } from 'react';

export function InteractiveComponent() {
  const [state, setState] = useState();
  return <button onClick={() => setState(...)}>Click</button>;
}
```

### Component Naming
- **Export default** for page components
- **Named exports** for reusable components
- **Co-locate** related components in same folder

## Styling Guidelines

### Tailwind CSS Usage
```typescript
// ✅ Good: Use utility classes
<div className="flex items-center gap-4 p-4 rounded-lg bg-white shadow">
  {/* ... */}
</div>

// ✅ Good: Use cn() for conditional classes
<div className={cn(
  "base classes",
  condition && "conditional classes",
  variant === 'primary' && "primary-specific classes"
)}>
  {/* ... */}
</div>

// ❌ Bad: Inline styles (avoid unless necessary)
<div style={{ display: 'flex', gap: '1rem' }}>
  {/* ... */}
</div>
```

### Responsive Design
```typescript
// Mobile-first approach
<div className="
  w-full                    // Mobile: full width
  md:w-1/2                  // Tablet: half width
  lg:w-1/3                  // Desktop: one-third width
  grid grid-cols-1          // Mobile: 1 column
  md:grid-cols-2            // Tablet: 2 columns
  lg:grid-cols-4            // Desktop: 4 columns
">
  {/* ... */}
</div>
```

### Custom Utilities
```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## API Routes

### Route Handler Structure
```typescript
// app/api/content/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// GET /api/content
export async function GET(request: Request) {
  try {
    const contents = await prisma.content.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: contents });
  } catch (error) {
    console.error('Error fetching contents:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contents' },
      { status: 500 }
    );
  }
}

// POST /api/content
export async function POST(request: Request) {
  try {
    // 1. Authenticate user
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Validate input
    const body = await request.json();
    // ... validation logic

    // 3. Create resource
    const content = await prisma.content.create({
      data: {
        ...body,
        userId: session.user.id,
      },
    });

    // 4. Return success
    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    console.error('Error creating content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create content' },
      { status: 500 }
    );
  }
}
```

### Error Handling
```typescript
// ✅ Good: Structured error responses
return NextResponse.json(
  {
    success: false,
    error: 'User-friendly error message',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  },
  { status: 500 }
);

// ❌ Bad: Exposing internal errors
return NextResponse.json({ error: error.toString() }, { status: 500 });
```

## Database Operations (Prisma)

### Query Patterns
```typescript
// ✅ Good: Include related data
const content = await prisma.content.findUnique({
  where: { id },
  include: {
    user: { select: { name: true, email: true } },
    activities: { include: { activity: true } },
  },
});

// ✅ Good: Pagination
const contents = await prisma.content.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
  orderBy: { createdAt: 'desc' },
});

// ✅ Good: Filtering
const filteredContents = await prisma.content.findMany({
  where: {
    AND: [
      { published: true },
      { type: { in: ['LONG_VIDEO', 'SHORT_VIDEO'] } },
      { tags: { hasSome: ['featured'] } },
    ],
  },
});
```

### Transaction Safety
```typescript
// ✅ Good: Use transactions for related operations
await prisma.$transaction(async (tx) => {
  const activity = await tx.activity.create({
    data: { title, description, slug },
  });

  await tx.activityContent.createMany({
    data: contentIds.map((id) => ({
      activityId: activity.id,
      contentId: id,
    })),
  });
});
```

## Form Handling

### Server Actions (Preferred)
```typescript
// app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function createContent(formData: FormData) {
  const title = formData.get('title') as string;
  // ... validation

  const content = await prisma.content.create({
    data: { title, /* ... */ },
  });

  revalidatePath('/'); // Revalidate affected pages
  return { success: true, data: content };
}
```

### Client-Side Forms
```typescript
'use client';

import { useFormStatus } from 'react-dom';
import { createContent } from '@/app/actions';

export function ContentForm() {
  return (
    <form action={createContent}>
      <input name="title" required />
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending}>
      {pending ? 'Saving...' : 'Save'}
    </button>
  );
}
```

## Environment Variables

### Naming Convention
```env
# Database
DATABASE_URL="postgresql://..."

# Auth (Public - can expose to client with NEXT_PUBLIC_)
NEXT_PUBLIC_APP_URL="https://example.com"

# Auth (Private - server-only)
NEXTAUTH_SECRET="secret-key"
NEXTAUTH_URL="http://localhost:3000"

# OAuth
GITHUB_ID="github-client-id"
GITHUB_SECRET="github-client-secret"
```

### Type Safety
```typescript
// lib/env.ts
export const env = {
  database: {
    url: process.env.DATABASE_URL!,
  },
  auth: {
    secret: process.env.NEXTAUTH_SECRET!,
    url: process.env.NEXTAUTH_URL!,
  },
} as const;

// Validate required env vars at build time
if (!env.database.url) {
  throw new Error('DATABASE_URL is not defined');
}
```

## Comments and Documentation

### When to Comment
```typescript
// ✅ Good: Explain complex logic
// Calculate grid position based on previous items' sizes
// to avoid gaps in masonry layout
const position = calculateGridPosition(items, currentIndex);

// ✅ Good: Document non-obvious behavior
// NextAuth requires callback URL to be whitelisted
// in OAuth provider settings
const providers = [
  GithubProvider({
    clientId: env.GITHUB_ID,
    clientSecret: env.GITHUB_SECRET,
  }),
];

// ❌ Bad: Redundant comments
// Create a content
const content = await prisma.content.create({ ... });
```

### JSDoc for Complex Functions
```typescript
/**
 * Uploads file to storage and creates thumbnail for videos
 * @param file - File to upload (image or video)
 * @param userId - ID of user uploading the file
 * @returns Object containing file path and thumbnail path (if video)
 * @throws Error if file type is not supported
 */
export async function uploadFile(
  file: File,
  userId: string
): Promise<{ filePath: string; thumbnailPath?: string }> {
  // ...
}
```

## Error Handling

### Client-Side
```typescript
'use client';

export function Component() {
  const [error, setError] = useState<string | null>(null);

  const handleAction = async () => {
    try {
      setError(null);
      const result = await apiCall();
      if (!result.success) {
        throw new Error(result.error);
      }
      // Success handling
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <button onClick={handleAction}>Action</button>
    </>
  );
}
```

### Server-Side
```typescript
export async function GET(request: Request) {
  try {
    // Operation
  } catch (error) {
    // Log error for debugging
    console.error('Detailed error:', error);

    // Return user-friendly message
    return NextResponse.json(
      {
        success: false,
        error: 'Something went wrong. Please try again.'
      },
      { status: 500 }
    );
  }
}
```

## Testing Conventions

### File Naming
- Test files: `ComponentName.test.tsx`
- Co-locate tests with components: `components/ui/Button.test.tsx`

### Test Structure (Future)
```typescript
describe('ContentCard', () => {
  it('renders content title', () => {
    // Arrange
    const content = { title: 'Test', ... };

    // Act
    render(<ContentCard content={content} />);

    // Assert
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

## Git Commit Messages

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```
feat(content): add video upload functionality

Implemented drag-drop file upload for videos with
automatic thumbnail generation.

Closes #123

---

fix(grid): correct responsive column calculation

Fixed grid layout breaking on mobile devices by
adjusting Tailwind breakpoints.

---

docs(api): update API route documentation

Added examples for content CRUD endpoints.
```

## Performance Best Practices

### Image Optimization
```typescript
// ✅ Good: Use next/image
import Image from 'next/image';

<Image
  src="/uploads/image.jpg"
  alt="Description"
  width={500}
  height={300}
  className="rounded-lg"
  priority={false} // Lazy load by default
/>

// ❌ Bad: Regular img tag
<img src="/uploads/image.jpg" alt="Description" />
```

### Data Fetching
```typescript
// ✅ Good: Server Component data fetching
export default async function Page() {
  const contents = await prisma.content.findMany(); // Runs on server
  return <ContentGrid contents={contents} />;
}

// ✅ Good: Parallel data fetching
export default async function Page() {
  const [contents, activities] = await Promise.all([
    prisma.content.findMany(),
    prisma.activity.findMany(),
  ]);
  return <Dashboard contents={contents} activities={activities} />;
}
```

### Lazy Loading
```typescript
// ✅ Good: Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const RichEditor = dynamic(() => import('@/components/admin/RichEditor'), {
  loading: () => <p>Loading editor...</p>,
  ssr: false, // Disable SSR for client-only components
});
```

---

**Last Updated**: 2024-12-24
