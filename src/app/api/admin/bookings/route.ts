import { NextRequest } from 'next/server';
import { sql } from '@/lib/db';
import { requireAdmin, authErrorResponse } from '@/lib/auth';
import { paginationSchema } from '@/lib/validations';

// GET all event bookings - Admin only
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

    // Optional status filter
    const status = searchParams.get('status');

    let bookings;
    if (status) {
      bookings = await sql`
        SELECT * FROM event_bookings
        WHERE status = ${status}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else {
      bookings = await sql`
        SELECT * FROM event_bookings
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    const countResult = status
      ? await sql`SELECT COUNT(*) as total FROM event_bookings WHERE status = ${status}`
      : await sql`SELECT COUNT(*) as total FROM event_bookings`;

    const total = Number(countResult[0]?.total || 0);

    return Response.json({
      bookings,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return Response.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
