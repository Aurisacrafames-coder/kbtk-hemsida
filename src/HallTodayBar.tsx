import { useEffect, useState } from 'react';
import { fetchPublicHallToday, type PublicHallToday } from './lib/hall-today';

const REFRESH_MS = 3 * 60 * 1000;

export function HallTodayBar() {
  const [hallToday, setHallToday] = useState<PublicHallToday | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchPublicHallToday();
        if (!cancelled) {
          setHallToday(data);
          setHidden(false);
        }
      } catch {
        if (!cancelled) {
          setHidden(true);
        }
      }
    }

    void load();
    const intervalId = window.setInterval(() => void load(), REFRESH_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);

  if (hidden) {
    return null;
  }

  const sessions = hallToday?.sessions ?? [];

  return (
    <aside className="hall-today-bar" aria-label="Hallen idag">
      <div className="hall-today-schedule" aria-label="Dagens träningspass">
        {hallToday && sessions.length === 0 ? (
          <a className="hall-today-empty" href="/#traning">
            Inga aktiva pass idag
          </a>
        ) : (
          sessions.map((session) => (
            <a
              key={`${session.group_name}-${session.time_label}`}
              className="hall-today-session"
              href="/#traning"
              title={`${session.group_name} ${session.time_label}`}
            >
              <span className="hall-today-session-group">{session.group_name}</span>
              <span className="hall-today-session-time">{session.time_label}</span>
            </a>
          ))
        )}
        {!hallToday ? <span className="hall-today-loading">Laddar dagens schema…</span> : null}
      </div>
    </aside>
  );
}
