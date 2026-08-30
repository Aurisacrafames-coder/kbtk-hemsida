import { useMemo, useState, type FormEvent } from 'react';
import {
  availableJerseyNumbers,
  CLUB_CLOTHES_EMAIL,
  EQUIPMENT_LINKS,
  JERSEY_NUMBER_ASSIGNMENTS,
} from './lib/club-shop';
import { FORM_SLUG_TYPES, submitSiteForm } from './lib/forms';

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
        Kontrollera tabellen nedan innan du skickar in. Klubben bekräftar om numret kan reserveras.
      </p>
      {error ? <p className="form-error">{error}</p> : null}
      <button className="button primary" type="submit" disabled={pending}>
        {pending ? 'Skickar…' : 'Skicka ansökan'}
      </button>
    </form>
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
          <li>
            <a href="/klubbkop/matchprotokoll.pdf" target="_blank" rel="noreferrer">
              Matchprotokoll (14 matcher, PDF)
            </a>
          </li>
        </ul>
      </section>

      <section className="split club-shop-split">
        <div className="panel">
          <h2>Ansök om nummer på matchtröja</h2>
          <p className="club-shop-intro">
            Välj ett ledigt nummer mellan 00 och 99. Ansökan skickas till klubben via
            kontaktformuläret.
          </p>
          <JerseyNumberForm />
        </div>

        <div className="panel">
          <h2>Upptagna nummer</h2>
          <p className="club-shop-intro">Lista över nummer som redan är reserverade i klubben.</p>
          <div className="club-info-table-wrap club-shop-table-wrap">
            <table className="club-info-table club-shop-table">
              <thead>
                <tr>
                  <th scope="col">Nummer</th>
                  <th scope="col">Ägare</th>
                </tr>
              </thead>
              <tbody>
                {JERSEY_NUMBER_ASSIGNMENTS.map((row) => (
                  <tr key={row.number}>
                    <th scope="row">{row.number}</th>
                    <td>{row.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="panel club-shop-panel">
        <h2>Köp utrustning</h2>
        <ul className="equipment-link-list">
          {EQUIPMENT_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} target="_blank" rel="noreferrer">
                {link.name}
              </a>
              {'note' in link && link.note ? <p>{link.note}</p> : null}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
