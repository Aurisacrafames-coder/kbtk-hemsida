import { useEffect, useMemo, useState } from 'react';
import {
  fetchCompetitionCalendar,
  filterUpcomingEvents,
  formatCalendarDateRange,
  getCalendarCategories,
  getCalendarDayParts,
  groupEventsByMonth,
  type CalendarEvent,
  type CompetitionCalendarFile,
} from './lib/competition-calendar';

const INITIAL_VISIBLE = 12;

function CalendarEventRow({ event }: { event: CalendarEvent }) {
  const { day, weekday } = getCalendarDayParts(event.start);
  const dateLabel = formatCalendarDateRange(event.start, event.end);
  const meta = [event.place, event.organizer].filter(Boolean).join(' · ');

  return (
    <article className="calendar-event">
      <div className="calendar-event-date" aria-hidden="true">
        <span className="calendar-event-weekday">{weekday}</span>
        <span className="calendar-event-day">{day}</span>
      </div>
      <div className="calendar-event-body">
        <div className="calendar-event-top">
          <span className="calendar-event-category">{event.category}</span>
          <time dateTime={event.start}>{dateLabel}</time>
        </div>
        <h4>{event.title}</h4>
        {meta ? <p>{meta}</p> : null}
      </div>
    </article>
  );
}

export function CompetitionCalendar() {
  const [calendar, setCalendar] = useState<CompetitionCalendarFile | null>(null);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('Alla');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void fetchCompetitionCalendar()
      .then((data) => {
        if (!cancelled) {
          setCalendar(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Kunde inte ladda tävlingskalendern.');
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const upcoming = useMemo(
    () => (calendar ? filterUpcomingEvents(calendar.events) : []),
    [calendar],
  );

  const categories = useMemo(() => getCalendarCategories(upcoming), [upcoming]);

  const filtered = useMemo(() => {
    if (category === 'Alla') {
      return upcoming;
    }
    return upcoming.filter((event) => event.category === category);
  }, [upcoming, category]);

  const visible = showAll ? filtered : filtered.slice(0, INITIAL_VISIBLE);
  const monthGroups = useMemo(() => groupEventsByMonth(visible), [visible]);
  const hiddenCount = filtered.length - visible.length;

  return (
    <section className="section calendar-section" id="tavlingskalender" aria-labelledby="calendar-heading">
      <div className="section-heading">
        <p className="eyebrow">Tävlingskalender</p>
        <h2 id="calendar-heading">Kommande tävlingar {calendar?.seasonLabel ?? ''}</h2>
        <p>
          En översikt av nationella och regionala tävlingar under säsongen. Anmäl dig via
          tävlingsanmälan när klubben öppnar anmälan till en specifik tävling.
        </p>
      </div>

      {error ? <p className="calendar-status">{error}</p> : null}
      {!error && !calendar ? <p className="calendar-status">Laddar kalender…</p> : null}

      {calendar ? (
        <>
          <div className="calendar-toolbar">
            <div className="calendar-filters" role="group" aria-label="Filtrera tävlingstyp">
              <button
                type="button"
                className={category === 'Alla' ? 'is-active' : undefined}
                onClick={() => {
                  setCategory('Alla');
                  setShowAll(false);
                }}
              >
                Alla
              </button>
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={category === item ? 'is-active' : undefined}
                  onClick={() => {
                    setCategory(item);
                    setShowAll(false);
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
            <p className="calendar-meta">
              {filtered.length} kommande
              {calendar.updated ? ` · uppdaterad ${calendar.updated}` : ''}
            </p>
          </div>

          {monthGroups.length === 0 ? (
            <p className="calendar-status">Inga kommande tävlingar i vald kategori.</p>
          ) : (
            <div className="calendar-months">
              {monthGroups.map((group) => (
                <div key={group.key} className="calendar-month">
                  <h3>{group.label}</h3>
                  <div className="calendar-event-list">
                    {group.events.map((event) => (
                      <CalendarEventRow
                        key={`${event.start}-${event.title}-${event.place}`}
                        event={event}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="calendar-actions">
            {hiddenCount > 0 ? (
              <button type="button" className="calendar-more" onClick={() => setShowAll(true)}>
                Visa {hiddenCount} till
              </button>
            ) : null}
            {showAll && filtered.length > INITIAL_VISIBLE ? (
              <button type="button" className="calendar-more" onClick={() => setShowAll(false)}>
                Visa färre
              </button>
            ) : null}
            <a
              className="text-link"
              href={calendar.sourceUrl}
              rel="noreferrer"
              target="_blank"
            >
              Öppna hela kalendern i Google Sheets
            </a>
            <a className="text-link" href="/form/tavling">
              Till tävlingsanmälan
            </a>
          </div>
        </>
      ) : null}
    </section>
  );
}
