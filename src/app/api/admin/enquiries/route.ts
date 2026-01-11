import { NextRequest } from 'next/server';
import { sql } from '@/lib/db';
import { requireAdmin, authErrorResponse } from '@/lib/auth';
import { paginationSchema } from '@/lib/validations';

// GET all contact enquiries - Admin only
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

    let enquiries;
    if (status) {
      enquiries = await sql`
        SELECT * FROM contact_enquiries
        WHERE status = ${status}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else {
      enquiries = await sql`
        SELECT * FROM contact_enquiries
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    const countResult = status
      ? await sql`SELECT COUNT(*) as total FROM contact_enquiries WHERE status = ${status}`
      : await sql`SELECT COUNT(*) as total FROM contact_enquiries`;

    const total = Number(countResult[0]?.total || 0);

    return Response.json({
      enquiries,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return Response.json({ error: 'Failed to fetch enquiries' }, { status: 500 });
  }
}
