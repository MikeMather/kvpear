import { format } from 'date-fns';

export const simpleTimestamp = (date: Date | string): string => {
  if (typeof date === 'string') date = new Date(date);
  return format(date, 'd MMM, yyyy')
}