import { useEffect, useState } from 'react';
import {
  fetchAktuelltArticle,
  formatNewsDate,
  type AktuelltItem,
} from './lib/aktuellt';

type NewsArticlePageProps = {
  slug: string;
};

export default function NewsArticlePage({ slug }: NewsArticlePageProps) {
  const [item, setItem] = useState<AktuelltItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    void fetchAktuelltArticle(slug)
      .then(setItem)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Kunde inte ladda nyheten.'),
      )
      .finally(() => setLoading(false));
  }, [slug]);

  const dateLabel = formatNewsDate(item?.startDate);
  const body = item?.body?.trim() || item?.text || '';

  return (
    <main className="section form-page news-page news-article-page">
      <a className="text-link form-back" href="/nyheter">
        Alla nyheter
      </a>

      {loading ? <p className="form-hint">Laddar nyhet…</p> : null}
      {error ? (
        <>
          <p className="form-error">{error}</p>
          <a className="button secondary" href="/nyheter">
            Till nyhetslistan
          </a>
        </>
      ) : null}

      {!loading && !error && item ? (
        <article className="news-article">
          <div className="section-heading">
            <p className="eyebrow">{dateLabel ?? 'Aktuellt'}</p>
            <h1>{item.title}</h1>
          </div>
          <div className="news-article-body">
            {body.split(/\n\s*\n/).map((paragraph, index) => (
              <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph.trim()}</p>
            ))}
          </div>
          {item.link ? (
            <p className="news-article-cta">
              <a className="button primary" href={item.link.href}>
                {item.link.label}
              </a>
            </p>
          ) : null}
        </article>
      ) : null}
    </main>
  );
}
