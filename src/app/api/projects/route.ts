import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/projects - List projects
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const published = searchParams.get('published');
    const slug = searchParams.get('slug');

    let query = supabase
      .from('projects')
      .select(`
        *,
        pages!pages_project_id_fkey(
          id,
          title,
          icon,
          order
        )
      `)
      .order('featured', { ascending: false })
      .order('order', { ascending: true })
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    if (featured !== null) {
      query = query.eq('featured', featured === 'true');
    }

    if (published !== null) {
      query = query.eq('published', published === 'true');
    } else {
      // Default: only show published
      query = query.eq('published', true);
    }

    if (slug) {
      query = query.eq('slug', slug);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching projects:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch projects' },
        { status: 500 }
      );
    }

    // Filter pages to only root pages (parent_id = null)
    const projectsWithRootPages = data?.map((project) => ({
      ...project,
      pages: project.pages?.filter((page: any) => !page.parent_id) || [],
    }));

    return NextResponse.json({ success: true, data: projectsWithRootPages });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create project
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Check auth
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      slug,
      description,
      category,
      thumbnailPath,
      coverImage,
      icon,
      tags,
      featured,
      order,
      published,
    } = body;

    if (!title || !category) {
      return NextResponse.json(
        { error: 'Title and category are required' },
        { status: 400 }
      );
    }

    // Auto-generate slug
    const projectSlug =
      slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Check uniqueness
    const { data: existing } = await supabase
      .from('projects')
      .select('id')
      .eq('slug', projectSlug)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        title,
        slug: projectSlug,
        description: description || null,
        category,
        thumbnail_path: thumbnailPath || null,
        cover_image: coverImage || null,
        icon: icon || null,
        tags: tags || [],
        featured: featured ?? false,
        order: order ?? 0,
        published: published ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create project' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
