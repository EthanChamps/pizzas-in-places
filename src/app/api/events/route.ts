import { sql } from '@/lib/db';
import { eventBookingSchema, sanitizeHtml } from '@/lib/validations';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    // Rate limiting
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`events:${clientIp}`, RATE_LIMITS.events);

    if (!rateLimit.allowed) {
      return Response.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    // Parse and validate body
    const body = await request.json();
    const validation = eventBookingSchema.safeParse(body);

    if (!validation.success) {
      return Response.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, event_type, event_date, location, guest_count, notes } = validation.data;

    // Sanitize text inputs
    const sanitizedName = sanitizeHtml(name);
    const sanitizedLocation = sanitizeHtml(location);
    const sanitizedNotes = notes ? sanitizeHtml(notes) : null;

    // Insert into database
    const result = await sql`
      INSERT INTO event_bookings (
        event_type, event_date, location, guest_count,
        name, email, notes, status
      )
      VALUES (
        ${event_type}, ${event_date}, ${sanitizedLocation}, ${guest_count},
        ${sanitizedName}, ${email}, ${sanitizedNotes}, 'new'
      )
      RETURNING id, created_at
    `;

    return Response.json(
      {
        success: true,
        message: 'Your booking enquiry has been received. We will be in touch within 24 hours.',
        id: result[0].id,
      },
      {
        status: 201,
        headers: {
          'X-RateLimit-Remaining': String(rateLimit.remaining),
        },
      }
    );
  } catch (error) {
    console.error('Error submitting event booking:', error);
    return Response.json(
      { error: 'Failed to submit booking enquiry. Please try again.' },
      { status: 500 }
    );
  }
}
