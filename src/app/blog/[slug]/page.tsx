import { notFound } from 'next/navigation';
import { getPosts, getPostBySlug, getAllPostSlugs } from '@/lib/blog';
import type { Metadata } from 'next';
import BlogMeta from '@/components/blog/BlogMeta';
import BlogImage from '@/components/blog/BlogImage';
import Link from 'next/link';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for the page
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return {};
  }
  return {
    title: `${post.title} | Pizzas in Places`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      images: post.image ? [{ url: post.image }] : [],
    },
  };
}

// Generate static paths for all posts
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map(slug => ({ slug }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const posts = await getPosts();
  const postIndex = posts.findIndex(p => p.slug === slug);

  if (!post) {
    notFound();
  }

  const prevPost = postIndex > 0 ? posts[postIndex - 1] : null;
  const nextPost = postIndex < posts.length - 1 ? posts[postIndex + 1] : null;

  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-24">
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <article>
          <header className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-6xl text-neutral-900 mb-6">
              {post.title}
            </h1>
            <BlogMeta date={post.date} readingTime={post.readingTime} tags={post.tags} />
          </header>

          {post.image && (
            <BlogImage src={post.image} alt={post.title} />
          )}

          <div className="prose prose-lg lg:prose-xl max-w-none mx-auto font-sans text-neutral-800 leading-relaxed">
            {post.content.map((item, index) => {
              switch (item.type) {
                case 'paragraph':
                  return <p key={index}>{item.text}</p>;
                case 'image':
                  return item.src && item.alt ? (
                    <BlogImage key={index} src={item.src} alt={item.alt} caption={item.caption} />
                  ) : null;
                default:
                  return null;
              }
            })}
          </div>
        </article>

        {/* Navigation */}
        <nav className="mt-16 md:mt-24 pt-8 border-t border-neutral-200 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {prevPost && (
              <Link href={`/blog/${prevPost.slug}`} className="block">
                <p className="font-sans text-sm text-neutral-500 mb-2">Older Post</p>
                <span className="font-serif text-xl text-neutral-900 hover:text-neutral-700 transition-colors">
                  {prevPost.title}
                </span>
              </Link>
            )}
          </div>
          <div className="md:text-right">
            {nextPost && (
              <Link href={`/blog/${nextPost.slug}`} className="block">
                <p className="font-sans text-sm text-neutral-500 mb-2">Newer Post</p>
                <span className="font-serif text-xl text-neutral-900 hover:text-neutral-700 transition-colors">
                  {nextPost.title}
                </span>
              </Link>
            )}
          </div>
        </nav>

        <div className="text-center mt-16">
            <Link href="/blog" className="font-sans text-sm text-neutral-900 hover:text-neutral-600 transition-colors link-underline">
              Back to Journal
            </Link>
        </div>

      </div>
    </main>
  );
}
