import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/profile - Get profile
export async function GET() {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    let query = supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // If user is logged in, get their profile; otherwise get any public profile
    if (user) {
      query = supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
    }

    const { data, error } = await query;

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
      console.error('Error fetching profile:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: data || null });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// POST /api/profile - Upsert profile
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
      name,
      title,
      bio,
      thumbnailVideo,
      email,
      phone,
      website,
      linkedin,
      github,
      skills,
      experience,
      education,
      layout,
    } = body;

    // Upsert profile
    const { data, error } = await supabase
      .from('profiles')
      .upsert(
        {
          user_id: user.id,
          name: name || null,
          title: title || null,
          bio: bio || null,
          thumbnail_video: thumbnailVideo || null,
          email: email || null,
          phone: phone || null,
          website: website || null,
          linkedin: linkedin || null,
          github: github || null,
          skills: skills || null,
          experience: experience || null,
          education: education || null,
          layout: layout || null,
        },
        {
          onConflict: 'user_id',
        }
      )
      .select()
      .single();

    if (error) {
      console.error('Error upserting profile:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to save profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error upserting profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save profile' },
      { status: 500 }
    );
  }
}
