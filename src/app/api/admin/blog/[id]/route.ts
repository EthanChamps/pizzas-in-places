import { sql } from '@/lib/db';
import { requireAdmin, authErrorResponse } from '@/lib/auth';
import { blogPostSchema } from '@/lib/validations';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single post by ID - Admin only
export async function GET(request: Request, { params }: RouteParams) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) {
    return authErrorResponse(auth.error, auth.status);
  }

  try {
    const { id } = await params;

    const result = await sql`
      SELECT * FROM blog_posts WHERE id = ${id}
    `;

    if (result.length === 0) {
      return Response.json({ error: 'Post not found' }, { status: 404 });
    }

    return Response.json({ post: result[0] });
  } catch (error) {
    console.error('Error fetching post:', error);
    return Response.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

// PUT update post - Admin only
export async function PUT(request: Request, { params }: RouteParams) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) {
    return authErrorResponse(auth.error, auth.status);
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const validation = blogPostSchema.safeParse(body);

    if (!validation.success) {
      return Response.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const {
      slug, title, excerpt, content, featured_image_url,
      reading_time, tags, is_published, published_at, seo_title, seo_description
    } = validation.data;

    // If publishing now without a published_at date, set it
    const finalPublishedAt = is_published && !published_at
      ? new Date().toISOString()
      : published_at;

    const result = await sql`
      UPDATE blog_posts
      SET
        slug = ${slug},
        title = ${title},
        excerpt = ${excerpt},
        content = ${JSON.stringify(content)},
        featured_image_url = ${featured_image_url || null},
        reading_time = ${reading_time || 5},
        tags = ${tags || []},
        is_published = ${is_published || false},
        published_at = ${finalPublishedAt || null},
        seo_title = ${seo_title || null},
        seo_description = ${seo_description || null},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, slug, updated_at
    `;

    if (result.length === 0) {
      return Response.json({ error: 'Post not found' }, { status: 404 });
    }

    return Response.json({ success: true, post: result[0] });
  } catch (error) {
    console.error('Error updating post:', error);
    if (error instanceof Error && error.message.includes('unique')) {
      return Response.json({ error: 'A post with this slug already exists' }, { status: 409 });
    }
    return Response.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE post - Admin only
export async function DELETE(request: Request, { params }: RouteParams) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) {
    return authErrorResponse(auth.error, auth.status);
  }

  try {
    const { id } = await params;

    const result = await sql`
      DELETE FROM blog_posts WHERE id = ${id}
      RETURNING id
    `;

    if (result.length === 0) {
      return Response.json({ error: 'Post not found' }, { status: 404 });
    }

    return Response.json({ success: true, deleted: id });
  } catch (error) {
    console.error('Error deleting post:', error);
    return Response.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
