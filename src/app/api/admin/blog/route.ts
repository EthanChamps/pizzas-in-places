import { NextRequest } from 'next/server';
import { sql } from '@/lib/db';
import { requireAdmin, authErrorResponse } from '@/lib/auth';
import { blogPostSchema, paginationSchema } from '@/lib/validations';

// GET all posts (including drafts) - Admin only
export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) {
    return authErrorResponse(auth.error, auth.status);
  }

  try {
    const { searchParams } = new URL(request.url);
    const params = paginationSchema.safeParse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
    });

    const page = params.success ? params.data.page : 1;
    const limit = params.success ? params.data.limit : 20;
    const offset = (page - 1) * limit;

    // Get all posts including drafts
    const posts = await sql`
      SELECT
        id, slug, title, excerpt, featured_image_url, reading_time, tags,
        is_published, published_at, created_at, updated_at
      FROM blog_posts
      ORDER BY updated_at DESC, created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    const countResult = await sql`SELECT COUNT(*) as total FROM blog_posts`;
    const total = Number(countResult[0]?.total || 0);

    return Response.json({
      posts,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return Response.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// POST create new post - Admin only
export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) {
    return authErrorResponse(auth.error, auth.status);
  }

  try {
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
      INSERT INTO blog_posts (
        slug, title, excerpt, content, featured_image_url,
        reading_time, tags, is_published, published_at, seo_title, seo_description
      )
      VALUES (
        ${slug}, ${title}, ${excerpt}, ${JSON.stringify(content)}, ${featured_image_url || null},
        ${reading_time || 5}, ${tags || []}, ${is_published || false}, ${finalPublishedAt || null},
        ${seo_title || null}, ${seo_description || null}
      )
      RETURNING id, slug, created_at
    `;

    return Response.json({ success: true, post: result[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    // Check for unique constraint violation
    if (error instanceof Error && error.message.includes('unique')) {
      return Response.json({ error: 'A post with this slug already exists' }, { status: 409 });
    }
    return Response.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
