import { sql } from './db';

export interface ScheduleLocation {
  day: string;
  location: string;
  startTime: string;
  endTime: string;
  date: string;
  latitude: number;
  longitude: number;
  what3words: string;
}

export interface ScheduleException {
  date: string;
  type: 'not-trading' | 'private-event';
  description?: string;
}

// Database row type
interface LocationRow {
  id: string;
  name: string;
  description: string | null;
  date: string;
  start_time: string;
  end_time: string;
  latitude: number;
  longitude: number;
  what3words: string | null;
  is_active: boolean;
}

// Transform database row to ScheduleLocation interface
function rowToScheduleLocation(row: LocationRow): ScheduleLocation {
  const dateObj = new Date(row.date);
  return {
    day: dateObj.toLocaleDateString('en-GB', { weekday: 'long' }),
    location: row.name,
    startTime: row.start_time.slice(0, 5), // "18:00:00" -> "18:00"
    endTime: row.end_time.slice(0, 5),
    date: dateObj.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    what3words: row.what3words || '',
  };
}

// Get schedule for a specific date from database
export async function getScheduleForDate(date: Date): Promise<ScheduleLocation | null> {
  try {
    const dateString = date.toISOString().split('T')[0];

    const rows = await sql`
      SELECT id, name, description, date, start_time, end_time,
             latitude, longitude, what3words, is_active
      FROM locations
      WHERE date = ${dateString} AND is_active = true
      LIMIT 1
    `;

    if (rows.length === 0) {
      return null;
    }

    return rowToScheduleLocation(rows[0] as LocationRow);
  } catch (error) {
    console.error('Error fetching schedule for date:', error);
    return null;
  }
}

// Get today's location
export async function getTodayLocation(): Promise<ScheduleLocation | null> {
  return getScheduleForDate(new Date());
}

// Get two weeks of schedule (14 days from today)
export async function getTwoWeekSchedule(): Promise<ScheduleLocation[]> {
  try {
    const today = new Date();
    const twoWeeksLater = new Date(today);
    twoWeeksLater.setDate(today.getDate() + 14);

    const todayStr = today.toISOString().split('T')[0];
    const twoWeeksStr = twoWeeksLater.toISOString().split('T')[0];

    const rows = await sql`
      SELECT id, name, description, date, start_time, end_time,
             latitude, longitude, what3words, is_active
      FROM locations
      WHERE date >= ${todayStr}
        AND date < ${twoWeeksStr}
        AND is_active = true
      ORDER BY date ASC, start_time ASC
    `;

    return (rows as LocationRow[]).map(rowToScheduleLocation);
  } catch (error) {
    console.error('Error fetching two week schedule:', error);
    return [];
  }
}

// Get schedule exceptions (kept for compatibility, now always empty from DB perspective)
export function getScheduleExceptions(): ScheduleException[] {
  // Exceptions are now handled by is_active flag in locations table
  return [];
}

// ========================================
// SEED DATA - Week A/B rotation schedule
// Used for initial database population
// ========================================

export const WEEK_A_SCHEDULE = [
  { day: 'Monday', location: 'Chipping Campden Village Green', startTime: '18:00', endTime: '21:00', latitude: 52.0485, longitude: -1.7821, what3words: '///rooks.puzzle.stuff' },
  { day: 'Tuesday', location: 'Bourton-on-the-Water High Street', startTime: '18:00', endTime: '21:00', latitude: 51.8842, longitude: -1.7589, what3words: '///drive.crisp.dignity' },
  { day: 'Wednesday', location: 'Stow-on-the-Wold Market Square', startTime: '18:00', endTime: '21:00', latitude: 51.9291, longitude: -1.7223, what3words: '///unzip.pigtails.impeached' },
  { day: 'Thursday', location: 'Moreton-in-Marsh Fire Station Car Park', startTime: '18:00', endTime: '21:00', latitude: 51.9900, longitude: -1.7011, what3words: '///shocks.outfitter.producers' },
  { day: 'Friday', location: 'Winchcombe Abbey Grounds', startTime: '18:00', endTime: '21:00', latitude: 51.9548, longitude: -1.9685, what3words: '///football.spindles.flickers' },
  { day: 'Saturday', location: 'Cirencester Market Place', startTime: '18:00', endTime: '21:00', latitude: 51.7183, longitude: -1.9683, what3words: '///maker.spenders.reheat' },
  { day: 'Sunday', location: 'Broadway Village Green', startTime: '18:00', endTime: '21:00', latitude: 52.0366, longitude: -1.8548, what3words: '///fools.supply.bleaker' },
];

export const WEEK_B_SCHEDULE = [
  { day: 'Monday', location: 'Tetbury Market House', startTime: '18:00', endTime: '21:00', latitude: 51.6370, longitude: -2.1585, what3words: '///slams.hiding.unframed' },
  { day: 'Tuesday', location: 'Painswick Village Centre', startTime: '18:00', endTime: '21:00', latitude: 51.7850, longitude: -2.1950, what3words: '///pilots.massaged.pigtails' },
  { day: 'Wednesday', location: 'Chipping Norton Market Square', startTime: '18:00', endTime: '21:00', latitude: 51.9423, longitude: -1.5458, what3words: '///fended.paving.perused' },
  { day: 'Thursday', location: 'Burford High Street', startTime: '18:00', endTime: '21:00', latitude: 51.8080, longitude: -1.6370, what3words: '///defer.blatantly.situates' },
  { day: 'Friday', location: 'Woodstock Market Street', startTime: '18:00', endTime: '21:00', latitude: 51.8480, longitude: -1.3530, what3words: '///repaid.inquest.chuck' },
  { day: 'Saturday', location: 'Charlbury Station Car Park', startTime: '18:00', endTime: '21:00', latitude: 51.8730, longitude: -1.4820, what3words: '///reheat.remodel.skylights' },
  { day: 'Sunday', location: 'Fairford Market Place', startTime: '18:00', endTime: '21:00', latitude: 51.7080, longitude: -1.7850, what3words: '///doted.enchanted.prowling' },
];

// Helper to determine if a date falls in Week A or Week B
function getWeekNumber(date: Date): number {
  const start = new Date(2024, 0, 1);
  const diff = date.getTime() - start.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.floor(diff / oneWeek);
}

export function isWeekA(date: Date): boolean {
  return getWeekNumber(date) % 2 === 0;
}

// Generate location entries for seeding (3 months ahead)
export function generateScheduleSeeds(monthsAhead: number = 3): Array<{
  name: string;
  date: string;
  start_time: string;
  end_time: string;
  latitude: number;
  longitude: number;
  what3words: string;
}> {
  const seeds: Array<{
    name: string;
    date: string;
    start_time: string;
    end_time: string;
    latitude: number;
    longitude: number;
    what3words: string;
  }> = [];

  const today = new Date();
  const endDate = new Date(today);
  endDate.setMonth(endDate.getMonth() + monthsAhead);

  const current = new Date(today);
  while (current <= endDate) {
    const dayOfWeek = current.getDay(); // 0 = Sunday
    const scheduleIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Map to 0-6 (Mon-Sun)
    const schedule = isWeekA(current) ? WEEK_A_SCHEDULE : WEEK_B_SCHEDULE;
    const loc = schedule[scheduleIndex];

    seeds.push({
      name: loc.location,
      date: current.toISOString().split('T')[0],
      start_time: loc.startTime,
      end_time: loc.endTime,
      latitude: loc.latitude,
      longitude: loc.longitude,
      what3words: loc.what3words,
    });

    current.setDate(current.getDate() + 1);
  }

  return seeds;
}
