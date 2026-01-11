import { sql } from '@/lib/db';
import { requireAdmin, authErrorResponse } from '@/lib/auth';
import { locationSchema } from '@/lib/validations';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single location - Admin only
export async function GET(request: Request, { params }: RouteParams) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) {
    return authErrorResponse(auth.error, auth.status);
  }

  try {
    const { id } = await params;

    const result = await sql`SELECT * FROM locations WHERE id = ${id}`;

    if (result.length === 0) {
      return Response.json({ error: 'Location not found' }, { status: 404 });
    }

    return Response.json({ location: result[0] });
  } catch (error) {
    console.error('Error fetching location:', error);
    return Response.json({ error: 'Failed to fetch location' }, { status: 500 });
  }
}

// PUT update location - Admin only
export async function PUT(request: Request, { params }: RouteParams) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) {
    return authErrorResponse(auth.error, auth.status);
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const validation = locationSchema.safeParse(body);

    if (!validation.success) {
      return Response.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const {
      name, description, date, start_time, end_time,
      latitude, longitude, what3words, is_active
    } = validation.data;

    const result = await sql`
      UPDATE locations
      SET
        name = ${name},
        description = ${description || null},
        date = ${date},
        start_time = ${start_time},
        end_time = ${end_time},
        latitude = ${latitude},
        longitude = ${longitude},
        what3words = ${what3words || null},
        is_active = ${is_active ?? true},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, name, date, updated_at
    `;

    if (result.length === 0) {
      return Response.json({ error: 'Location not found' }, { status: 404 });
    }

    return Response.json({ success: true, location: result[0] });
  } catch (error) {
    console.error('Error updating location:', error);
    return Response.json({ error: 'Failed to update location' }, { status: 500 });
  }
}

// DELETE location - Admin only
export async function DELETE(request: Request, { params }: RouteParams) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) {
    return authErrorResponse(auth.error, auth.status);
  }

  try {
    const { id } = await params;

    const result = await sql`
      DELETE FROM locations WHERE id = ${id}
      RETURNING id
    `;

    if (result.length === 0) {
      return Response.json({ error: 'Location not found' }, { status: 404 });
    }

    return Response.json({ success: true, deleted: id });
  } catch (error) {
    console.error('Error deleting location:', error);
    return Response.json({ error: 'Failed to delete location' }, { status: 500 });
  }
}
