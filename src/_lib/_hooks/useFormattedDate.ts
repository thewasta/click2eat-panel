import {format, toZonedTime} from 'date-fns-tz';

export const useFormattedDate = (dateString: string) => {
    const utcDate = new Date(dateString + 'Z');
    const zonedDate = toZonedTime(utcDate, Intl.DateTimeFormat().resolvedOptions().timeZone);
    return format(zonedDate, 'yyyy-MM-dd HH:mm:ss', {timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone});
};
