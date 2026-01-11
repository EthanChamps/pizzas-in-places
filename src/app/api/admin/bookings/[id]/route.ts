import { sql } from '@/lib/db';
import { requireAdmin, authErrorResponse } from '@/lib/auth';
import { bookingStatusSchema } from '@/lib/validations';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single booking - Admin only
export async function GET(request: Request, { params }: RouteParams) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) {
    return authErrorResponse(auth.error, auth.status);
  }

  try {
    const { id } = await params;

    const result = await sql`SELECT * FROM event_bookings WHERE id = ${id}`;

    if (result.length === 0) {
      return Response.json({ error: 'Booking not found' }, { status: 404 });
    }

    return Response.json({ booking: result[0] });
  } catch (error) {
    console.error('Error fetching booking:', error);
    return Response.json({ error: 'Failed to fetch booking' }, { status: 500 });
  }
}

// PATCH update booking status - Admin only
export async function PATCH(request: Request, { params }: RouteParams) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) {
    return authErrorResponse(auth.error, auth.status);
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const validation = bookingStatusSchema.safeParse(body);

    if (!validation.success) {
      return Response.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { status } = validation.data;

    const result = await sql`
      UPDATE event_bookings
      SET status = ${status}
      WHERE id = ${id}
      RETURNING id, status
    `;

    if (result.length === 0) {
      return Response.json({ error: 'Booking not found' }, { status: 404 });
    }

    return Response.json({ success: true, booking: result[0] });
  } catch (error) {
    console.error('Error updating booking:', error);
    return Response.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}
