import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // Revalidate every 5 minutes

export async function GET() {
  try {
    // Get upcoming active locations (today and future)
    const locations = await sql`
      SELECT
        id, name, description, date, start_time, end_time,
        latitude, longitude, what3words, is_active
      FROM locations
      WHERE is_active = true
        AND date >= CURRENT_DATE
      ORDER BY date ASC, start_time ASC
      LIMIT 30
    `;

    return Response.json({ locations });
  } catch (error) {
    console.error('Error fetching locations:', error);
    return Response.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}
