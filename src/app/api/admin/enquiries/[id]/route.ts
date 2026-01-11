import { sql } from '@/lib/db';
import { requireAdmin, authErrorResponse } from '@/lib/auth';
import { contactStatusSchema } from '@/lib/validations';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single enquiry - Admin only
export async function GET(request: Request, { params }: RouteParams) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) {
    return authErrorResponse(auth.error, auth.status);
  }

  try {
    const { id } = await params;

    const result = await sql`SELECT * FROM contact_enquiries WHERE id = ${id}`;

    if (result.length === 0) {
      return Response.json({ error: 'Enquiry not found' }, { status: 404 });
    }

    return Response.json({ enquiry: result[0] });
  } catch (error) {
    console.error('Error fetching enquiry:', error);
    return Response.json({ error: 'Failed to fetch enquiry' }, { status: 500 });
  }
}

// PATCH update enquiry status - Admin only
export async function PATCH(request: Request, { params }: RouteParams) {
  const auth = await requireAdmin(request);
  if (!auth.authenticated) {
    return authErrorResponse(auth.error, auth.status);
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const validation = contactStatusSchema.safeParse(body);

    if (!validation.success) {
      return Response.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { status } = validation.data;

    const result = await sql`
      UPDATE contact_enquiries
      SET status = ${status}
      WHERE id = ${id}
      RETURNING id, status
    `;

    if (result.length === 0) {
      return Response.json({ error: 'Enquiry not found' }, { status: 404 });
    }

    return Response.json({ success: true, enquiry: result[0] });
  } catch (error) {
    console.error('Error updating enquiry:', error);
    return Response.json({ error: 'Failed to update enquiry' }, { status: 500 });
  }
}
