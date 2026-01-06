export interface ScheduleLocation {
  day: string;
  location: string;
  time: string;
  date: string;
}

export interface ScheduleException {
  date: string;
  type: 'not-trading' | 'private-event';
  description?: string;
}

const WEEK_A_SCHEDULE: Omit<ScheduleLocation, 'date'>[] = [
  { day: 'Monday', location: 'Chipping Campden Village Green', time: '6:00 PM - 9:00 PM' },
  { day: 'Tuesday', location: 'Bourton-on-the-Water High Street', time: '6:00 PM - 9:00 PM' },
  { day: 'Wednesday', location: 'Stow-on-the-Wold Market Square', time: '6:00 PM - 9:00 PM' },
  { day: 'Thursday', location: 'Moreton-in-Marsh Fire Station Car Park', time: '6:00 PM - 9:00 PM' },
  { day: 'Friday', location: 'Winchcombe Abbey Grounds', time: '6:00 PM - 9:00 PM' },
  { day: 'Saturday', location: 'Cirencester Market Place', time: '6:00 PM - 9:00 PM' },
  { day: 'Sunday', location: 'Broadway Village Green', time: '6:00 PM - 9:00 PM' },
];

const WEEK_B_SCHEDULE: Omit<ScheduleLocation, 'date'>[] = [
  { day: 'Monday', location: 'Tetbury Market House', time: '6:00 PM - 9:00 PM' },
  { day: 'Tuesday', location: 'Painswick Village Centre', time: '6:00 PM - 9:00 PM' },
  { day: 'Wednesday', location: 'Chipping Norton Market Square', time: '6:00 PM - 9:00 PM' },
  { day: 'Thursday', location: 'Burford High Street', time: '6:00 PM - 9:00 PM' },
  { day: 'Friday', location: 'Woodstock Market Street', time: '6:00 PM - 9:00 PM' },
  { day: 'Saturday', location: 'Charlbury Station Car Park', time: '6:00 PM - 9:00 PM' },
  { day: 'Sunday', location: 'Fairford Market Place', time: '6:00 PM - 9:00 PM' },
];

function getScheduleExceptionsFromStorage(): ScheduleException[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('schedule-exceptions');
    return saved ? JSON.parse(saved) : [];
  }
  return [];
}

function getWeekNumber(date: Date): number {
  const start = new Date(2024, 0, 1); // Start from January 1, 2024
  const diff = date.getTime() - start.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.floor(diff / oneWeek);
}

function isWeekA(date: Date): boolean {
  return getWeekNumber(date) % 2 === 0;
}

export function getScheduleForDate(date: Date): ScheduleLocation | null {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Check for exceptions first
  const dateString = date.toISOString().split('T')[0];
  const exceptions = getScheduleExceptionsFromStorage();
  const exception = exceptions.find(ex => ex.date === dateString);
  if (exception) {
    return null; // Not trading due to exception
  }

  const schedule = isWeekA(date) ? WEEK_A_SCHEDULE : WEEK_B_SCHEDULE;
  const daySchedule = schedule[dayOfWeek === 0 ? 6 : dayOfWeek - 1]; // Adjust Sunday index

  if (!daySchedule) return null;

  return {
    ...daySchedule,
    date: date.toLocaleDateString('en-GB', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  };
}

export function getTodayLocation(): ScheduleLocation | null {
  return getScheduleForDate(new Date());
}

export function getTwoWeekSchedule(): ScheduleLocation[] {
  const today = new Date();
  const schedule: ScheduleLocation[] = [];

  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const location = getScheduleForDate(date);
    if (location) {
      schedule.push(location);
    }
  }

  return schedule;
}

export function getScheduleExceptions(): ScheduleException[] {
  return getScheduleExceptionsFromStorage();
}