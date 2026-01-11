import { NextRequest } from 'next/server';
import { sql } from '@/lib/db';
import { requireAdmin, authErrorResponse } from '@/lib/auth';
import { locationSchema, paginationSchema } from '@/lib/validations';

// GET all locations - Admin only
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
    const limit = params.success ? params.data.limit : 50;
    const offset = (page - 1) * limit;

    // Option to filter by date range
    const fromDate = searchParams.get('from');
    const toDate = searchParams.get('to');

    let locations;
    if (fromDate && toDate) {
      locations = await sql`
        SELECT * FROM locations
        WHERE date >= ${fromDate} AND date <= ${toDate}
        ORDER BY date ASC, start_time ASC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else {
      locations = await sql`
        SELECT * FROM locations
        ORDER BY date ASC, start_time ASC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    const countResult = await sql`SELECT COUNT(*) as total FROM locations`;
    const total = Number(countResult[0]?.total || 0);

    return Response.json({
      locations,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Error fetching locations:', error);
    return Response.json({ error: 'Failed to fetch locations' }, { status: 500 });
  }
}

// POST create new location - Admin only
export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) {
    return authErrorResponse(auth.error, auth.status);
  }

  try {
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
      INSERT INTO locations (
        name, description, date, start_time, end_time,
        latitude, longitude, what3words, is_active
      )
      VALUES (
        ${name}, ${description || null}, ${date}, ${start_time}, ${end_time},
        ${latitude}, ${longitude}, ${what3words || null}, ${is_active ?? true}
      )
      RETURNING id, name, date, created_at
    `;

    return Response.json({ success: true, location: result[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating location:', error);
    return Response.json({ error: 'Failed to create location' }, { status: 500 });
  }
}
