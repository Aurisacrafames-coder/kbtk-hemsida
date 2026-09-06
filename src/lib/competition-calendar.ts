export type CalendarEvent = {
  status: string;
  bLicense: string;
  category: string;
  title: string;
  start: string;
  end: string;
  place: string;
  organizer: string;
};

export type CompetitionCalendarFile = {
  seasonLabel: string;
  updated: string;
  sourceUrl: string;
  events: CalendarEvent[];
};

export type CalendarMonthGroup = {
  key: string;
  label: string;
  events: CalendarEvent[];
};

const monthFormatter = new Intl.DateTimeFormat('sv-SE', {
  month: 'long',
  year: 'numeric',
});

const dayFormatter = new Intl.DateTimeFormat('sv-SE', {
  day: 'numeric',
});

const weekdayFormatter = new Intl.DateTimeFormat('sv-SE', {
  weekday: 'short',
});

function parseIsoDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function toLocalIsoDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function capitalize(value: string) {
  if (!value) {
    return value;
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function formatCalendarDateRange(start: string, end: string) {
  const startDate = parseIsoDate(start);
  const endDate = parseIsoDate(end || start);
  if (!startDate) {
    return start;
  }

  if (!endDate || start === end || start === (end || start)) {
    return startDate.toLocaleDateString('sv-SE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  if (
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getFullYear() === endDate.getFullYear()
  ) {
    return `${dayFormatter.format(startDate)}–${endDate.toLocaleDateString('sv-SE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })}`;
  }

  return `${startDate.toLocaleDateString('sv-SE', {
    day: 'numeric',
    month: 'short',
  })} – ${endDate.toLocaleDateString('sv-SE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })}`;
}

export function getCalendarDayParts(start: string) {
  const date = parseIsoDate(start);
  if (!date) {
    return { day: start, weekday: '' };
  }

  return {
    day: dayFormatter.format(date),
    weekday: capitalize(weekdayFormatter.format(date)).replace('.', ''),
  };
}

export function isUpcomingOrOngoing(event: CalendarEvent, today = toLocalIsoDate()) {
  return (event.end || event.start) >= today;
}

export function filterUpcomingEvents(events: CalendarEvent[], today = toLocalIsoDate()) {
  return events
    .filter((event) => isUpcomingOrOngoing(event, today))
    .sort((a, b) => a.start.localeCompare(b.start) || a.title.localeCompare(b.title, 'sv'));
}

export function groupEventsByMonth(events: CalendarEvent[]): CalendarMonthGroup[] {
  const groups = new Map<string, CalendarMonthGroup>();

  for (const event of events) {
    const date = parseIsoDate(event.start);
    const key = date
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      : event.start.slice(0, 7);
    const label = date ? capitalize(monthFormatter.format(date)) : key;
    const existing = groups.get(key);
    if (existing) {
      existing.events.push(event);
    } else {
      groups.set(key, { key, label, events: [event] });
    }
  }

  return [...groups.values()];
}

export function getCalendarCategories(events: CalendarEvent[]) {
  return [...new Set(events.map((event) => event.category).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, 'sv'),
  );
}

export async function fetchCompetitionCalendar(): Promise<CompetitionCalendarFile> {
  const response = await fetch('/tavlingskalender.json');
  if (!response.ok) {
    throw new Error('Kunde inte ladda tävlingskalendern.');
  }

  const data = (await response.json()) as CompetitionCalendarFile;
  if (!Array.isArray(data.events)) {
    throw new Error('Tävlingskalendern har fel format.');
  }

  return {
    seasonLabel: data.seasonLabel || '2026/2027',
    updated: data.updated || '',
    sourceUrl:
      data.sourceUrl ||
      'https://docs.google.com/spreadsheets/d/1H_moTmmQl5o4uVBkiJLgao13aKbOCGg_/edit?usp=sharing',
    events: data.events.map((event) => ({
      status: event.status ?? '',
      bLicense: event.bLicense ?? '',
      category: event.category ?? '',
      title: event.title ?? '',
      start: event.start ?? '',
      end: event.end || event.start || '',
      place: event.place ?? '',
      organizer: event.organizer ?? '',
    })),
  };
}
