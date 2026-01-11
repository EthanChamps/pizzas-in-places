import { z } from 'zod';

// Contact enquiry validation
export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  enquiry_type: z.enum(['general', 'private-hire', 'event', 'feedback']),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

export type ContactInput = z.infer<typeof contactSchema>;

// Event booking validation
export const eventBookingSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  event_type: z.enum(['wedding', 'corporate', 'party', 'other']),
  event_date: z.string().refine((date) => {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime()) && parsed > new Date();
  }, 'Event date must be in the future'),
  location: z.string().min(1, 'Location is required').max(200),
  guest_count: z.enum(['30-50', '50-75', '75-100', '100-150', '150-200', '200+']),
  notes: z.string().max(2000).optional(),
});

export type EventBookingInput = z.infer<typeof eventBookingSchema>;

// Blog post content item
export const postContentSchema = z.object({
  type: z.enum(['paragraph', 'image']),
  text: z.string().optional(),
  src: z.string().url().optional(),
  alt: z.string().optional(),
  caption: z.string().optional(),
});

// Blog post validation
export const blogPostSchema = z.object({
  slug: z.string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens'),
  title: z.string().min(1, 'Title is required').max(200),
  excerpt: z.string().min(1, 'Excerpt is required').max(500),
  content: z.array(postContentSchema).min(1, 'At least one content block required'),
  featured_image_url: z.string().url().optional().nullable(),
  reading_time: z.number().int().min(1).max(60).optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
  is_published: z.boolean().optional(),
  published_at: z.string().datetime().optional().nullable(),
  seo_title: z.string().max(70).optional().nullable(),
  seo_description: z.string().max(160).optional().nullable(),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;

// Location validation
export const locationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().max(500).optional().nullable(),
  date: z.string().refine((date) => !isNaN(new Date(date).getTime()), 'Invalid date'),
  start_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
  end_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  what3words: z.string().max(100).optional().nullable(),
  is_active: z.boolean().optional(),
});

export type LocationInput = z.infer<typeof locationSchema>;

// Pagination params
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// Status update schemas
export const contactStatusSchema = z.object({
  status: z.enum(['new', 'read', 'archived']),
});

export const bookingStatusSchema = z.object({
  status: z.enum(['new', 'replied', 'booked', 'declined']),
});

// HTML sanitization helper
export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
