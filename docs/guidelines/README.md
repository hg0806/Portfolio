# Portfolio Project Guidelines

This directory contains comprehensive development guidelines for the Portfolio project. These documents are designed to help both human developers and AI coding assistants (Claude, Codex, etc.) understand the project structure, conventions, and best practices.

## 📚 Documentation Index

### [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)
**Purpose**: High-level project architecture and feature description
- Technology stack and rationale
- Key features and functionality
- Project structure and organization
- Development workflow
- Deployment strategy

**When to read**: Start here for overall project understanding

---

### [CODING_CONVENTIONS.md](./CODING_CONVENTIONS.md)
**Purpose**: Detailed coding standards and best practices
- TypeScript and React conventions
- Component structure patterns
- API route patterns
- Styling guidelines (Tailwind CSS)
- Error handling
- Performance optimization
- Git commit conventions

**When to read**: Before writing any code

---

### [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)
**Purpose**: Database structure and usage patterns
- Complete schema documentation
- Entity relationships
- Query examples
- Migration commands
- Data validation
- Seed data for development

**When to read**: Before working with database operations

---

## 🎯 Quick Start for AI Assistants

### Context Loading Priority
1. **First Time**: Read `PROJECT_OVERVIEW.md` for architecture understanding
2. **Writing Code**: Reference `CODING_CONVENTIONS.md` for patterns
3. **Database Work**: Consult `DATABASE_SCHEMA.md` for schema details

### Key Principles
- **Type Safety**: TypeScript strict mode, Prisma-generated types
- **Component Organization**: Server Components by default, Client Components for interactivity
- **API Patterns**: NextAuth for auth, Prisma for data, NextResponse for responses
- **Styling**: Tailwind CSS utility-first, mobile-first responsive design

### Common Tasks

#### Creating a New Page
```typescript
// src/app/(public)/new-page/page.tsx
export default async function NewPage() {
  const data = await fetchData();
  return <div>{/* ... */}</div>;
}
```

#### Creating an API Route
```typescript
// src/app/api/resource/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const data = await prisma.resource.findMany();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error message' },
      { status: 500 }
    );
  }
}
```

#### Creating a Component
```typescript
// src/components/ui/ComponentName.tsx
'use client'; // Only if interactive

interface ComponentProps {
  // props
}

export function ComponentName({ prop }: ComponentProps) {
  return <div>{/* ... */}</div>;
}
```

## 🏗️ Project Structure Reference

```
portfolio/
├── docs/
│   └── guidelines/           # This directory
│       ├── README.md         # This file
│       ├── PROJECT_OVERVIEW.md
│       ├── CODING_CONVENTIONS.md
│       └── DATABASE_SCHEMA.md
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/           # Protected admin routes
│   │   ├── (public)/         # Public portfolio routes
│   │   ├── api/              # API routes
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/
│   │   ├── ui/               # Reusable UI components
│   │   ├── admin/            # Admin-specific components
│   │   └── content/          # Content display components
│   ├── lib/                  # Utilities and configurations
│   │   ├── prisma.ts         # Prisma client
│   │   ├── auth.ts           # NextAuth config
│   │   └── utils.ts          # Helper functions
│   └── types/                # TypeScript type definitions
├── prisma/
│   └── schema.prisma         # Database schema
├── public/
│   └── uploads/              # User-uploaded files
└── [config files]            # next.config.ts, tailwind.config.ts, etc.
```

## 🔑 Key Technologies

### Framework
- **Next.js 15** - App Router, Server Components, Server Actions
- **React 19** - Enhanced server components and form handling
- **TypeScript** - Type safety throughout the application

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library

### Data & Auth
- **Prisma** - Type-safe ORM for PostgreSQL
- **NextAuth** - Authentication solution
- **PostgreSQL** - Relational database

### Content
- **react-player** - Video embeds (YouTube, Vimeo)
- **TipTap/Lexical** - Rich text editor
- **react-dropzone** - File upload UI

## 📋 Development Checklist

### Before Starting Development
- [ ] Read PROJECT_OVERVIEW.md
- [ ] Understand the database schema
- [ ] Review coding conventions
- [ ] Set up environment variables
- [ ] Run database migrations

### Before Committing Code
- [ ] Code follows conventions (see CODING_CONVENTIONS.md)
- [ ] TypeScript types are properly defined
- [ ] Components are properly categorized (ui/admin/content)
- [ ] API routes include error handling
- [ ] Responsive design works on mobile
- [ ] No console.log statements (use proper logging)

### Before Deployment
- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] File upload limits set
- [ ] Error boundaries in place
- [ ] Loading states implemented

## 🚀 Common Commands

### Development
```bash
npm run dev          # Start dev server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database
```bash
npx prisma migrate dev       # Create and apply migration
npx prisma generate          # Generate Prisma Client
npx prisma studio            # Open database browser
npx prisma db seed           # Seed database
```

### Type Checking
```bash
npx tsc --noEmit            # Check TypeScript types
```

## 🐛 Common Issues & Solutions

### Issue: Prisma Client out of sync
**Solution**: Run `npx prisma generate`

### Issue: Environment variables not loading
**Solution**:
1. Check `.env.local` exists
2. Restart dev server
3. Verify variable names start with `NEXT_PUBLIC_` for client-side access

### Issue: File upload fails
**Solution**:
1. Check `public/uploads` directory exists
2. Verify file size limits in `next.config.ts`
3. Check file type validation in upload API route

### Issue: Type errors in Prisma queries
**Solution**:
1. Run `npx prisma generate`
2. Restart TypeScript server in IDE
3. Check schema.prisma syntax

## 📖 Additional Resources

### Official Documentation
- [Next.js 15 Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth Docs](https://next-auth.js.org/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Learning Resources
- Next.js App Router examples
- React Server Components guide
- Prisma query examples
- Tailwind CSS playground

## 🤖 For AI Assistants

### Context Priorities
1. **Architecture First**: Always understand project structure before suggesting changes
2. **Follow Conventions**: Strictly adhere to patterns in CODING_CONVENTIONS.md
3. **Type Safety**: Use TypeScript types, avoid `any`
4. **Server Components**: Prefer Server Components, only use Client Components when needed
5. **Error Handling**: Always include try-catch in API routes
6. **Responsive Design**: Use Tailwind responsive classes (mobile-first)

### Code Generation Guidelines
- Generate complete, production-ready code (no TODOs or placeholders)
- Include proper TypeScript types
- Follow file naming conventions
- Add necessary imports
- Include error handling
- Add loading states for async operations
- Use Prisma-generated types for database operations

### When Suggesting Changes
- Reference specific files and line numbers
- Explain the rationale behind changes
- Consider impact on related files
- Suggest testing approach
- Mention any necessary migrations or config updates

---

**Last Updated**: 2024-12-24
**Project Version**: Initial Setup
**Documentation Maintained By**: Development Team

For questions or suggestions about these guidelines, please update this documentation or discuss with the team.
