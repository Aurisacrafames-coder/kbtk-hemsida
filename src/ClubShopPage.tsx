import { useMemo, useState, type FormEvent } from 'react';
import {
  availableJerseyNumbers,
  CLUB_CLOTHES_EMAIL,
  EQUIPMENT_LINKS,
  JERSEY_NUMBER_ASSIGNMENTS,
} from './lib/club-shop';
import { FORM_SLUG_TYPES, submitSiteForm } from './lib/forms';

function sortJerseyNumber(a: string, b: string) {
  return Number.parseInt(a, 10) - Number.parseInt(b, 10);
}

function JerseyNumberForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const freeNumbers = useMemo(() => availableJerseyNumbers(), []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError('');

    try {
      const formData = new FormData(event.currentTarget);
      const name = String(formData.get('name') ?? '').trim();
      const email = String(formData.get('email') ?? '').trim();
      const number = String(formData.get('number') ?? '').trim();

      if (!name || !email || !number) {
        throw new Error('Fyll i namn, e-post och nummer.');
      }

      await submitSiteForm({
        form_type: FORM_SLUG_TYPES.kontakt,
        name,
        email,
        subject: 'Matchtröja — nummeransökan',
        message: `Ansökan om nummer ${number} på matchtröja.\n\nNamn: ${name}\nE-post: ${email}`,
      });

      setSuccess(true);
      event.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte skicka ansökan.');
    } finally {
      setPending(false);
    }
  }

  if (success) {
    return (
      <div className="form-panel club-shop-form-success">
        <p>Tack! Vi har tagit emot din ansökan om matchtröjnummer och återkommer så snart vi kan.</p>
        <button type="button" className="button secondary" onClick={() => setSuccess(false)}>
          Skicka en till ansökan
        </button>
      </div>
    );
  }

  return (
    <form className="site-form" onSubmit={(event) => void handleSubmit(event)}>
      <label>
        Namn
        <input name="name" required autoComplete="name" />
      </label>
      <label>
        Mejladress
        <input name="email" type="email" required autoComplete="email" />
      </label>
      <label>
        Önskat nummer
        <select name="number" required defaultValue="">
          <option value="" disabled>
            Välj ledigt nummer (00–99)
          </option>
          {freeNumbers.map((number) => (
            <option key={number} value={number}>
              {number}
            </option>
          ))}
        </select>
      </label>
      <p className="form-hint">
        Kontrollera nummerlistan nedan innan du skickar in. Klubben bekräftar om numret kan
        reserveras.
      </p>
      {error ? <p className="form-error">{error}</p> : null}
      <button className="button primary" type="submit" disabled={pending}>
        {pending ? 'Skickar…' : 'Skicka ansökan'}
      </button>
    </form>
  );
}

function JerseyNumberRegistry() {
  const [query, setQuery] = useState('');
  const freeCount = useMemo(() => availableJerseyNumbers().length, []);

  const assignments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const sorted = [...JERSEY_NUMBER_ASSIGNMENTS].sort((a, b) =>
      sortJerseyNumber(a.number, b.number),
    );

    if (!normalizedQuery) {
      return sorted;
    }

    return sorted.filter(
      (row) =>
        row.number.includes(normalizedQuery) || row.owner.toLowerCase().includes(normalizedQuery),
    );
  }, [query]);

  return (
    <section className="panel club-shop-numbers-panel">
      <div className="club-shop-numbers-header">
        <div>
          <h2>Vem har vilket nummer?</h2>
          <p className="club-shop-intro">
            {JERSEY_NUMBER_ASSIGNMENTS.length} upptagna · {freeCount} lediga (00–99)
          </p>
        </div>
        <label className="club-shop-search">
          <span className="sr-only">Sök nummer eller namn</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Sök nummer eller namn…"
            autoComplete="off"
          />
        </label>
      </div>

      {assignments.length === 0 ? (
        <p className="club-shop-empty">Inga nummer matchar sökningen.</p>
      ) : (
        <ul className="jersey-number-grid">
          {assignments.map((row) => (
            <li key={row.number}>
              <article className="jersey-number-card">
                <span className="jersey-number-badge">{row.number}</span>
                <span className="jersey-number-owner">{row.owner}</span>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function ClubShopPage() {
  return (
    <main className="section form-page club-shop-page">
      <a className="text-link form-back" href="/">
        Tillbaka till startsidan
      </a>

      <div className="section-heading">
        <p className="eyebrow">Klubben</p>
        <h1>Klubbköp</h1>
        <p>
          Klubbkläder, matchtröjnummer och länkar till utrustning. Beställ kläder via vår leverantör
          och ansök om nummer på matchtröja här.
        </p>
      </div>

      <section className="panel club-shop-panel">
        <h2>Klubbkläder</h2>
        <ul className="check-list">
          <li>
            Välj kläder i{' '}
            <a href="/klubbkop/Klubbklader.pdf" target="_blank" rel="noreferrer">
              klubbkatalogen (PDF)
            </a>
          </li>
          <li>
            Skicka mail till{' '}
            <a href={`mailto:${CLUB_CLOTHES_EMAIL}`}>{CLUB_CLOTHES_EMAIL}</a> med produkt, storlek och
            antal. Alla plagg finns i herr, dam och junior.
          </li>
          <li>Skicka även kontaktuppgifter: namn, adress, telefon och e-post.</li>
        </ul>
      </section>

      <section className="panel club-shop-panel">
        <h2>Ansök om nummer på matchtröja</h2>
        <p className="club-shop-intro">
          Välj ett ledigt nummer mellan 00 och 99. Ansökan skickas till klubben via
          kontaktformuläret.
        </p>
        <JerseyNumberForm />
      </section>

      <JerseyNumberRegistry />

      <section className="panel club-shop-panel">
        <h2>Köp utrustning</h2>
        <p className="club-shop-intro">
          Partnerbutiker med klubbrabatter och bra sortiment för bordtennis.
        </p>
        <ul className="equipment-grid">
          {EQUIPMENT_LINKS.map((link) => (
            <li key={link.href}>
              <article
                className={`equipment-card${'note' in link && link.note?.includes('rabatt') ? ' featured' : ''}`}
              >
                <h3>{link.name}</h3>
                {'note' in link && link.note ? (
                  <p className="equipment-note">
                    {link.note.includes('rabatt') ? (
                      <>
                        Klubbrabatt 30% — kod{' '}
                        <strong className="equipment-code">
                          {link.note.replace(/^30% rabattkod:\s*/i, '')}
                        </strong>
                      </>
                    ) : (
                      link.note
                    )}
                  </p>
                ) : (
                  <p className="equipment-note">Bordtennisutrustning online.</p>
                )}
                <a
                  className={`button equipment-link${'note' in link && link.note?.includes('rabatt') ? ' secondary' : ' primary'}`}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  Besök butik
                </a>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
