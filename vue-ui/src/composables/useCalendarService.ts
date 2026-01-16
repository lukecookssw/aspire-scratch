import { useDateService } from "./useDateService";

export interface Day {
  date: number | null;
  color: string | null;
  isEmpty: boolean;
  isCurrentMonth: boolean;
  isOverflow: boolean;
}

export interface CalendarData {
  monthName: string;
  year: number;
  month: number;
  days: Day[];
}

export function useCalendarService() {
  const dateService = useDateService();

  const getCalendarData = (year: number, month: number): CalendarData => {
    const dateInfo = dateService.getDateInfo(year, month);
    return buildCalendarDays(dateInfo, year, month);
  };

  const buildCalendarDays = (
    dateInfo: { 
      year: number; 
      month: number; 
      monthName: string; 
      daysInMonth: number; 
      firstDayOfWeek: number;
    },
    year: number,
    month: number
  ): CalendarData => {
    const days: Day[] = [];

    // Get previous month info for overflow days
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const prevMonthInfo = dateService.getDateInfo(prevYear, prevMonth);

    // Add previous month's overflow days
    const prevMonthDaysToShow = dateInfo.firstDayOfWeek;
    for (let i = prevMonthDaysToShow - 1; i >= 0; i--) {
      const dayNumber = prevMonthInfo.daysInMonth - i;
      days.push({
        date: dayNumber,
        color: null,
        isEmpty: false,
        isCurrentMonth: false,
        isOverflow: true,
      });
    }

    // Add actual days of the current month
    for (let day = 1; day <= dateInfo.daysInMonth; day++) {
      days.push({
        date: day,
        color: null,
        isEmpty: false,
        isCurrentMonth: true,
        isOverflow: false,
      });
    }

    // Add next month's overflow days to fill the remaining cells
    // Calendar should show complete weeks (7 days per row)
    const totalCells = Math.ceil(days.length / 7) * 7;
    const remainingCells = totalCells - days.length;
    
    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        date: day,
        color: null,
        isEmpty: false,
        isCurrentMonth: false,
        isOverflow: true,
      });
    }

    return {
      monthName: dateInfo.monthName,
      year: dateInfo.year,
      month: dateInfo.month,
      days,
    };
  };

  return {
    getCalendarData,
  };
}
