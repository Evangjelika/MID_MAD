import { format, formatDistanceToNow, differenceInDays, isToday, isPast } from 'date-fns';

export const formatDate = (date: Date): string => {
  return format(date, 'MMM dd, yyyy');
};

export const formatDateTime = (date: Date): string => {
  return format(date, 'MMM dd, yyyy HH:mm');
};

export const getRelativeTime = (date: Date): string => {
  return formatDistanceToNow(date, { addSuffix: true });
};

export const getDaysUntil = (date: Date): number => {
  return differenceInDays(date, new Date());
};

export const isTodayDate = (date: Date): boolean => {
  return isToday(date);
};

export const isPastDate = (date: Date): boolean => {
  return isPast(date);
};
