import { format, addDays, startOfWeek, endOfWeek, isSameDay, parseISO } from 'date-fns';

// Format date to display format (e.g., "May 15, 2023")
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMMM d, yyyy');
};

// Format to ISO date string (YYYY-MM-DD)
export const toISODateString = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

// Format time
export const formatTime = (timeString: string): string => {
  return timeString;
};

// Get a week range for weekly meal planning
export const getWeekRange = (date: Date) => {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Start week on Monday
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return { start, end };
};

// Generate weekdays for the week containing the given date
export const getWeekdays = (date: Date) => {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  
  return Array.from({ length: 7 }).map((_, i) => {
    const day = addDays(weekStart, i);
    return {
      date: day,
      dayName: format(day, 'EEE'),
      dayNumber: format(day, 'd'),
      isToday: isSameDay(day, new Date()),
      formattedDate: format(day, 'yyyy-MM-dd')
    };
  });
};

// Check if a date is today
export const isToday = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isSameDay(dateObj, new Date());
};

// Format time from 24h to 12h format
export const formatTimeDisplay = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};
