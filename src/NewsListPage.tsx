import { useEffect, useState } from 'react';
import {
  fetchAktuelltArchive,
  formatNewsDate,
  newsArticlePath,
  type AktuelltItem,
} from './lib/aktuellt';

function NewsList({ items, emptyText }: { items: AktuelltItem[]; emptyText: string }) {
  if (items.length === 0) {
    return <p className="form-hint">{emptyText}</p>;
  }

  return (
    <div className="news-list">
      {items.map((item) => {
        const href = item.slug ? newsArticlePath(item.slug) : undefined;
        const dateLabel = formatNewsDate(item.startDate);
        return (
          <article className="panel news-card" key={item.slug ?? item.title}>
            {dateLabel ? <p className="eyebrow">{dateLabel}</p> : null}
            <h2>{href ? <a href={href}>{item.title}</a> : item.title}</h2>
            <p>{item.text}</p>
            {href ? (
              <a className="text-link" href={href}>
                Läs mer
              </a>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

export default function NewsListPage() {
  const [current, setCurrent] = useState<AktuelltItem[]>([]);
  const [past, setPast] = useState<AktuelltItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    void fetchAktuelltArchive()
      .then((data) => {
        setCurrent(data.current);
        setPast(data.past);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Kunde inte ladda nyheter.'),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="section form-page news-page">
      <a className="text-link form-back" href="/">
        Tillbaka till startsidan
      </a>

      <div className="section-heading">
        <p className="eyebrow">Aktuellt</p>
        <h1>Nyheter</h1>
        <p>Här samlas klubbens nyheter. Klicka för att läsa hela texten.</p>
      </div>

      {loading ? <p className="form-hint">Laddar nyheter…</p> : null}
      {error ? <p className="form-error">{error}</p> : null}

      {!loading && !error ? (
        <>
          <section className="news-section" aria-labelledby="news-current-title">
            <h2 id="news-current-title">Aktuella</h2>
            <NewsList items={current} emptyText="Inga aktuella nyheter just nu." />
          </section>

          <section className="news-section" aria-labelledby="news-past-title">
            <h2 id="news-past-title">Äldre nyheter</h2>
            <NewsList
              items={past}
              emptyText="Inga äldre nyheter sparade ännu. När en nyhet får slutdatum flyttas den hit."
            />
          </section>
        </>
      ) : null}
    </main>
  );
}
