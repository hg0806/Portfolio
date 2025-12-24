import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/pages - List pages for a project
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const projectId = searchParams.get('projectId');
    const parentId = searchParams.get('parentId');

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'projectId is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('pages')
      .select(`
        *,
        children:pages!pages_parent_id_fkey(*)
      `)
      .eq('project_id', projectId)
      .order('order', { ascending: true });

    if (parentId) {
      query = query.eq('parent_id', parentId);
    } else {
      query = query.is('parent_id', null);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching pages:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch pages' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}

// POST /api/pages - Create a new page
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Check auth
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, title, icon, parentId, blocks, order, published } = body;

    if (!projectId || !title) {
      return NextResponse.json(
        { error: 'projectId and title are required' },
        { status: 400 }
      );
    }

    // Verify project belongs to user
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found or unauthorized' },
        { status: 404 }
      );
    }

    const { data, error } = await supabase
      .from('pages')
      .insert({
        project_id: projectId,
        title,
        icon: icon || null,
        parent_id: parentId || null,
        blocks: blocks || null,
        order: order ?? 0,
        published: published ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating page:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create page' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create page' },
      { status: 500 }
    );
  }
}
