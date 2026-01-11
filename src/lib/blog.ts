import { sql } from './db';

export interface PostContent {
  type: 'paragraph' | 'image';
  text?: string;
  src?: string;
  alt?: string;
  caption?: string;
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  readingTime: number;
  tags: string[];
  excerpt: string;
  image?: string;
  content: PostContent[];
}

// Database row type
interface BlogPostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: PostContent[];
  featured_image_url: string | null;
  reading_time: number;
  tags: string[];
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

// Transform database row to Post interface (maintains frontend compatibility)
function rowToPost(row: BlogPostRow): Post {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    image: row.featured_image_url || undefined,
    readingTime: row.reading_time,
    tags: row.tags || [],
    date: row.published_at
      ? new Date(row.published_at).toISOString().split('T')[0]
      : new Date(row.created_at).toISOString().split('T')[0],
  };
}

// Get all published posts sorted by date (newest first)
export async function getPosts(): Promise<Post[]> {
  try {
    const rows = await sql`
      SELECT id, slug, title, excerpt, content, featured_image_url,
             reading_time, tags, is_published, published_at, created_at
      FROM blog_posts
      WHERE is_published = true
      ORDER BY published_at DESC NULLS LAST, created_at DESC
    `;

    return (rows as BlogPostRow[]).map(rowToPost);
  } catch (error) {
    console.error('Error fetching posts from database:', error);
    return [];
  }
}

// Get a single post by slug (published only)
export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  try {
    const rows = await sql`
      SELECT id, slug, title, excerpt, content, featured_image_url,
             reading_time, tags, is_published, published_at, created_at
      FROM blog_posts
      WHERE slug = ${slug} AND is_published = true
    `;

    if (rows.length === 0) {
      return undefined;
    }

    return rowToPost(rows[0] as BlogPostRow);
  } catch (error) {
    console.error('Error fetching post from database:', error);
    return undefined;
  }
}

// Get all post slugs for static generation
export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const rows = await sql`
      SELECT slug FROM blog_posts WHERE is_published = true
    `;

    return (rows as Array<{ slug: string }>).map(row => row.slug);
  } catch (error) {
    console.error('Error fetching post slugs:', error);
    return [];
  }
}

// Static seed data - used for initial database seeding
export const SEED_POSTS = [
  {
    slug: 'the-journey-begins-finding-our-horse-trailer',
    title: 'The Journey Begins: Finding Our Horse Trailer',
    date: '2023-05-15',
    readingTime: 4,
    tags: ['Renovation', 'Build Update'],
    excerpt: 'It all started with a rusty horse trailer and a big idea. We share how we found the perfect trailer and the vision for its transformation.',
    image: 'https://images.unsplash.com/photo-1576595899232-bf34d36383dc?q=80&w=2070&auto=format&fit=crop',
    content: [
      { type: 'paragraph' as const, text: 'Every great project starts with a single step. For us, it was finding the right foundation for our mobile pizza dream. After weeks of searching, we found it: a vintage Rice horse trailer, full of character and potential, tucked away in a Cotswold barn.' },
      { type: 'image' as const, src: 'https://images.unsplash.com/photo-1621208643212-322144365113?q=80&w=2070&auto=format&fit=crop', alt: 'Old horse trailer in a field', caption: 'The trailer as we first found it – a little rough around the edges.' },
      { type: 'paragraph' as const, text: 'The vision was clear: transform this rustic shell into a state-of-the-art mobile kitchen, complete with a wood-fired oven, without losing its soul. The challenge was immense, but the excitement was even greater. This post marks the beginning of that journey.' },
    ],
  },
  {
    slug: 'from-rust-to-ready-the-renovation-part-one',
    title: 'From Rust to Ready: The Renovation (Part 1)',
    date: '2023-07-22',
    readingTime: 6,
    tags: ['Renovation'],
    excerpt: 'The hard work begins. Stripping back the old paint, treating the rust, and preparing the chassis for a new life on the road.',
    image: 'https://images.unsplash.com/photo-1466650514482-827033a8794c?q=80&w=2070&auto=format&fit=crop',
    content: [
      { type: 'paragraph' as const, text: "There's something incredibly satisfying about demolition. We started by stripping everything back to the bare metal frame. Years of paint, rust, and dirt had to go before we could even think about building." },
      { type: 'paragraph' as const, text: 'The chassis was surprisingly solid, but every inch needed attention. We used wire brushes, sanders, and a whole lot of elbow grease to get it clean. This was followed by a rust converter and several coats of durable, protective paint.' },
      { type: 'image' as const, src: 'https://images.unsplash.com/photo-1581822261290-991b38693d1b?q=80&w=2070&auto=format&fit=crop', alt: 'Welding sparks on a metal frame', caption: 'Reinforcing the frame was a crucial and time-consuming step.' },
      { type: 'paragraph' as const, text: 'With the foundation solid, we could start planning the interior layout and, most importantly, how to fit a half-tonne pizza oven into a space designed for a horse.' },
    ],
  },
  {
    slug: 'installing-the-heart-of-the-business-our-pizza-oven',
    title: 'Installing the Heart of the Business: Our Pizza Oven',
    date: '2023-09-05',
    readingTime: 5,
    tags: ['Build Update', 'Launch Prep'],
    excerpt: 'The most critical and nerve-wracking part of the build: lifting and securing our beautiful wood-fired oven into the trailer.',
    image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=2070&auto=format&fit=crop',
    content: [
      { type: 'paragraph' as const, text: "This was the day the project started to feel real. The pizza oven, the heart of our entire business, was finally ready to be installed. It's a beautiful, Italian-made oven that can reach temperatures of over 450°C." },
      { type: 'image' as const, src: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=2070&auto=format&fit=crop', alt: 'A brick pizza oven with flames inside.', caption: 'The first test fire. A magical moment.' },
      { type: 'paragraph' as const, text: 'Next up: plumbing, electrics, and fitting the custom-made oak countertops. The launch is getting closer.' },
    ],
  },
];
