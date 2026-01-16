export interface DateInfo {
  year: number;
  month: number;
  monthName: string;
  daysInMonth: number;
  firstDayOfWeek: number; // 0 = Monday, 6 = Sunday
}

const API_BASE_URL = import.meta.env.VITE_API_URL

export function useDateService() {
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const getDateInfo = (year: number, month: number): DateInfo => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    
    // Get day of week for first day (0 = Sunday, 1 = Monday, etc.)
    // Convert to Monday-based (0 = Monday, 6 = Sunday)
    let firstDayOfWeek = firstDayOfMonth.getDay();
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    return {
      year,
      month,
      monthName: monthNames[month]!,
      daysInMonth,
      firstDayOfWeek,
    };
  };

  const getCurrentDate = (): { year: number; month: number } => {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth(),
    };
  };

  return {
    getDateInfo,
    getCurrentDate,
  };
}
