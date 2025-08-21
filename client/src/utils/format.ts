import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import updateLocale from 'dayjs/plugin/updateLocale';
import 'dayjs/locale/es';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(updateLocale);
dayjs.locale('es');
dayjs.updateLocale('es', {
  relativeTime: {
    future: 'en %s',
    past: 'hace %s',
    s: '1s',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: '1M',
    MM: '%dM',
    y: '1a',
    yy: '%da',
  },
});

export function formatDate(timestamp: string): string {
  const now = dayjs();
  const posted = dayjs(timestamp);

  const diffDays = now.diff(posted, 'day');
  const isThisYear = now.year() === posted.year();

  if (
    diffDays < 2 &&
    now.diff(posted, 'hour') < 24
  ) return posted.fromNow();

  if (isThisYear) return posted.format('D MMM');

  return posted.format('D MMM YYYY');
}

export function formatFullDate(timestamp: string): string {
  return dayjs(timestamp).format('h:mm A · D MMM. YYYY').replace('AM', 'a. m.').replace('PM', 'p. m.');
}

export function formatJoinedtDate(timestamp: string): string {
  const date = dayjs(timestamp);
  const month = date.format('MMMM');
  const year = date.format('YYYY');

  return `Se unió en ${month} de ${year}`;
}

const formatter = new Intl.NumberFormat('es', { notation: 'compact', maximumFractionDigits: 1 });

export function formatNumber(number: number) {
  return formatter.format(number);
}
