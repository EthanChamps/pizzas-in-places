import { NextRequest } from 'next/server';
import { sql } from '@/lib/db';
import { paginationSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // ISR: revalidate every 60 seconds

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = paginationSchema.safeParse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
    });

    const page = params.success ? params.data.page : 1;
    const limit = params.success ? params.data.limit : 20;
    const offset = (page - 1) * limit;

    // Get published posts only, sorted by published_at desc
    const posts = await sql`
      SELECT
        id, slug, title, excerpt, featured_image_url, reading_time, tags,
        published_at, created_at
      FROM blog_posts
      WHERE is_published = true
      ORDER BY published_at DESC NULLS LAST, created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    // Get total count for pagination
    const countResult = await sql`
      SELECT COUNT(*) as total FROM blog_posts WHERE is_published = true
    `;
    const total = Number(countResult[0]?.total || 0);

    return Response.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return Response.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}
