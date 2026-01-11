import { sql } from '@/lib/db';
import { contactSchema, sanitizeHtml } from '@/lib/validations';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    // Rate limiting
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`contact:${clientIp}`, RATE_LIMITS.contact);

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
    const validation = contactSchema.safeParse(body);

    if (!validation.success) {
      return Response.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, enquiry_type, message } = validation.data;

    // Sanitize text inputs
    const sanitizedName = sanitizeHtml(name);
    const sanitizedMessage = sanitizeHtml(message);

    // Insert into database
    const result = await sql`
      INSERT INTO contact_enquiries (name, email, enquiry_type, message, status)
      VALUES (${sanitizedName}, ${email}, ${enquiry_type}, ${sanitizedMessage}, 'new')
      RETURNING id, created_at
    `;

    return Response.json(
      {
        success: true,
        message: 'Your enquiry has been received. We will be in touch shortly.',
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
    console.error('Error submitting contact enquiry:', error);
    return Response.json(
      { error: 'Failed to submit enquiry. Please try again.' },
      { status: 500 }
    );
  }
}
