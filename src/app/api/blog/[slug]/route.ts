import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;

    if (!slug) {
      return Response.json({ error: 'Slug is required' }, { status: 400 });
    }

    // Only return published posts for public API
    const result = await sql`
      SELECT
        id, slug, title, excerpt, content, featured_image_url, reading_time, tags,
        published_at, seo_title, seo_description, created_at
      FROM blog_posts
      WHERE slug = ${slug} AND is_published = true
    `;

    if (result.length === 0) {
      return Response.json({ error: 'Post not found' }, { status: 404 });
    }

    const post = result[0];

    // Get previous and next posts for navigation
    const [prevPost] = await sql`
      SELECT slug, title
      FROM blog_posts
      WHERE is_published = true
        AND (published_at < ${post.published_at} OR (published_at = ${post.published_at} AND created_at < ${post.created_at}))
      ORDER BY published_at DESC NULLS LAST, created_at DESC
      LIMIT 1
    `;

    const [nextPost] = await sql`
      SELECT slug, title
      FROM blog_posts
      WHERE is_published = true
        AND (published_at > ${post.published_at} OR (published_at = ${post.published_at} AND created_at > ${post.created_at}))
      ORDER BY published_at ASC NULLS LAST, created_at ASC
      LIMIT 1
    `;

    return Response.json({
      post,
      navigation: {
        previous: prevPost || null,
        next: nextPost || null,
      },
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return Response.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}
