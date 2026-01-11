import Link from 'next/link';
import { getPosts } from '@/lib/blog';
import BlogMeta from '@/components/blog/BlogMeta';
import Image from 'next/image';

export const metadata = {
  title: 'Blog | Pizzas in Places',
  description: 'The story of our mobile pizza business, from renovating a horse trailer to serving fresh sourdough pizza.',
};

export default async function BlogIndexPage() {
  const posts = await getPosts();

  if (posts.length === 0) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] pt-24">
        <header className="text-center py-16 md:py-24 border-b border-neutral-200">
          <div className="max-w-3xl mx-auto px-6">
            <h1 className="font-serif text-4xl md:text-5xl text-neutral-900 mb-4">
              Our Journal
            </h1>
            <p className="font-sans text-lg text-neutral-600">
              Following the journey of our little pizza van, from a rusty horse trailer to a roaring wood-fired oven on wheels.
            </p>
          </div>
        </header>
        <section className="py-16 md:py-24 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-sans text-neutral-600">No posts yet. Check back soon!</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-24">
      <header className="text-center py-16 md:py-24 border-b border-neutral-200">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="font-serif text-4xl md:text-5xl text-neutral-900 mb-4">
            Our Journal
          </h1>
          <p className="font-sans text-lg text-neutral-600">
            Following the journey of our little pizza van, from a rusty horse trailer to a roaring wood-fired oven on wheels.
          </p>
        </div>
      </header>

      <section className="py-16 md:py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <ul className="space-y-16">
            {posts.map((post) => (
              <li key={post.slug}>
                <article>
                  {post.image && (
                    <Link href={`/blog/${post.slug}`}>
                      <div className="relative aspect-video mb-6 bg-neutral-100">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </Link>
                  )}
                  <header>
                    <h2 className="font-serif text-3xl text-neutral-900 mb-3">
                      <Link href={`/blog/${post.slug}`} className="hover:text-neutral-700 transition-colors">
                        {post.title}
                      </Link>
                    </h2>
                    <BlogMeta date={post.date} readingTime={post.readingTime} tags={post.tags} />
                  </header>
                  <div className="font-sans text-neutral-600 mt-4 leading-relaxed">
                    <p>{post.excerpt}</p>
                  </div>
                  <footer className="mt-4">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="font-sans text-sm text-neutral-900 hover:text-neutral-600 transition-colors link-underline"
                    >
                      Read more
                    </Link>
                  </footer>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
