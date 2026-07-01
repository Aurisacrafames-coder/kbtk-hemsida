import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import {
  fetchPublishedCompetition,
  fetchPublishedCompetitions,
  formatCompetitionDate,
  type PublicCompetition,
  type PublicCompetitionRegistrations,
  type PublicCompetitionSummary,
} from './lib/competitions';
import { FORM_SLUG_TYPES, submitSiteForm } from './lib/forms';
import { buildSwishMessage } from './lib/swish';
import { SwishPaymentPanel } from './SwishPaymentPanel';

function FormShell({
  title,
  intro,
  children,
}: {
  title: string;
  intro: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="section form-page">
      <a className="text-link form-back" href="/">
        Tillbaka till startsidan
      </a>
      <div className="section-heading">
        <p className="eyebrow">Formulär</p>
        <h1>{title}</h1>
        <div className="form-intro">{intro}</div>
      </div>
      <div className="form-panel">{children}</div>
    </main>
  );
}

export function CompetitionListPage() {
  const [competitions, setCompetitions] = useState<PublicCompetitionSummary[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchPublishedCompetitions()
      .then(setCompetitions)
      .catch((err) => setError(err instanceof Error ? err.message : 'Kunde inte ladda tävlingar.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <FormShell
      title="Tävlingsanmälan"
      intro={
        <p>
          Välj en publicerad tävling för att anmäla dig och betala via Swish. Varje tävling har
          egna klasser och avgifter.
        </p>
      }
    >
      {loading ? <p className="form-hint">Laddar tävlingar…</p> : null}
      {error ? <p className="form-error">{error}</p> : null}
      {!loading && !error && competitions.length === 0 ? (
        <p className="form-hint">Det finns inga öppna tävlingar att anmäla sig till just nu.</p>
      ) : null}
      <div className="competition-list">
        {competitions.map((item) => (
          <a key={item.slug} className="competition-card" href={`/form/tavling/${item.slug}`}>
            <h2>{item.title}</h2>
            {item.organizer ? <p>{item.organizer}</p> : null}
            <p>
              {formatCompetitionDate(item.event_date)
                ? `Datum: ${formatCompetitionDate(item.event_date)}`
                : 'Datum meddelas'}
              {item.registration_deadline
                ? ` · Sista anmälan ${formatCompetitionDate(item.registration_deadline)}`
                : ''}
            </p>
            <span>{item.class_count} klasser att välja mellan</span>
          </a>
        ))}
      </div>
    </FormShell>
  );
}

function CompetitionRegistrationsPanel({
  registrations,
  classes,
}: {
  registrations: PublicCompetitionRegistrations;
  classes: PublicCompetition['classes'];
}) {
  const classBuckets = classes
    .map((competitionClass) => {
      const bucket = registrations.by_class.find((item) => item.class_id === competitionClass.id);
      return (
        bucket ?? {
          class_id: competitionClass.id,
          class_label: competitionClass.label,
          count: 0,
          names: [],
        }
      );
    })
    .filter((item) => item.count > 0);

  if (registrations.submission_count === 0) {
    return (
      <section className="competition-registrations" aria-labelledby="competition-registrations-title">
        <h3 id="competition-registrations-title">Anmälda</h3>
        <p className="form-hint">Inga anmälda ännu.</p>
      </section>
    );
  }

  return (
    <section className="competition-registrations" aria-labelledby="competition-registrations-title">
      <h3 id="competition-registrations-title">
        Anmälda ({registrations.submission_count})
      </h3>
      <p className="competition-registrations-lead">
        Namn visas offentligt per klass så att du ser vilka som redan är anmälda.
      </p>

      <div className="competition-registrations-grid">
        {classBuckets.map((bucket) => (
          <article key={bucket.class_id} className="competition-registrations-class">
            <h4>
              {bucket.class_label}{' '}
              <span>
                {bucket.count} anmäld{bucket.count === 1 ? '' : 'a'}
              </span>
            </h4>
            <ul>
              {bucket.names.map((name, index) => (
                <li key={`${bucket.class_id}-${index}-${name}`}>{name}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

export function CompetitionSignupPage({ slug }: { slug: string }) {
  const [competition, setCompetition] = useState<PublicCompetition | null>(null);
  const [registrations, setRegistrations] = useState<PublicCompetitionRegistrations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState('');
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);

  useEffect(() => {
    void fetchPublishedCompetition(slug)
      .then((data) => {
        setCompetition(data.competition);
        setRegistrations(data.registrations);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Kunde inte ladda tävlingen.'))
      .finally(() => setLoading(false));
  }, [slug]);

  const selectedClasses = useMemo(
    () => competition?.classes.filter((item) => selectedClassIds.includes(item.id)) ?? [],
    [competition, selectedClassIds],
  );

  const totalAmount = useMemo(
    () => selectedClasses.reduce((sum, item) => sum + item.fee_sek, 0),
    [selectedClasses],
  );

  const swishMessage = useMemo(() => {
    if (!competition) return '';
    return buildSwishMessage({
      purpose: competition.title,
      name,
      detail: selectedClasses.map((item) => item.label).join(', '),
    });
  }, [competition, name, selectedClasses]);

  function toggleClass(classId: string) {
    setSelectedClassIds((current) =>
      current.includes(classId) ? current.filter((id) => id !== classId) : [...current, classId],
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!competition) return;
    setPending(true);
    setSubmitError('');
    try {
      const formData = new FormData(event.currentTarget);
      await submitSiteForm({
        form_type: FORM_SLUG_TYPES.tavling,
        competition_slug: competition.slug,
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        selected_class_ids: selectedClassIds,
        team_interest: formData.get('team_interest'),
        swish_confirmed: formData.get('swish_confirmed') === 'on',
      });
      setSuccess(true);
      event.currentTarget.reset();
      setSelectedClassIds([]);
      setName('');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Kunde inte skicka formuläret.');
    } finally {
      setPending(false);
    }
  }

  if (success) {
    return (
      <FormShell title="Tack!" intro={<p>Tävlingsanmälan är mottagen.</p>}>
        <a className="button primary" href="/">
          Till startsidan
        </a>
      </FormShell>
    );
  }

  if (loading) {
    return (
      <FormShell title="Tävlingsanmälan" intro={<p>Laddar tävling…</p>}>
        <p className="form-hint">Ett ögonblick.</p>
      </FormShell>
    );
  }

  if (error || !competition) {
    return (
      <FormShell title="Tävlingsanmälan" intro={<p>Tävlingen kunde inte visas.</p>}>
        <p className="form-error">{error || 'Tävlingen hittades inte.'}</p>
        <a className="text-link" href="/form/tavling">
          Tillbaka till tävlingslistan
        </a>
      </FormShell>
    );
  }

  return (
    <FormShell
      title={competition.title}
      intro={
        <div>
          {competition.organizer ? <p>{competition.organizer}</p> : null}
          {competition.description ? <p>{competition.description}</p> : null}
          <p>
            Välj klasser, swisha totalbeloppet och skicka in anmälan. Klubben behandlar anmälan
            när betalningen syns på Swish.
          </p>
        </div>
      }
    >
      <a className="text-link form-back" href="/form/tavling">
        Till alla tävlingar
      </a>

      {registrations ? (
        <CompetitionRegistrationsPanel registrations={registrations} classes={competition.classes} />
      ) : null}

      <form className="site-form" onSubmit={(event) => void handleSubmit(event)}>
        <fieldset className="competition-class-picker">
          <legend>Välj klasser</legend>
          {competition.classes.map((item) => (
            <label key={item.id} className="checkbox-row competition-class-option">
              <input
                type="checkbox"
                checked={selectedClassIds.includes(item.id)}
                onChange={() => toggleClass(item.id)}
              />
              <span>
                {item.label} <strong>{item.fee_sek.toLocaleString('sv-SE')} kr</strong>
              </span>
            </label>
          ))}
        </fieldset>

        <p className="competition-total">
          Totalt att swisha:{' '}
          <strong>{totalAmount > 0 ? `${totalAmount.toLocaleString('sv-SE')} kr` : '—'}</strong>
        </p>

        <label>
          Namn
          <input
            name="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <label>
          Mejladress
          <input name="email" type="email" required />
        </label>
        <label>
          Telefonnummer
          <input name="phone" type="tel" required />
        </label>
        <label>
          Lag-DM eller önskemål
          <textarea
            name="team_interest"
            rows={3}
            placeholder="Intresse för lagtävling eller spelpartner."
          />
        </label>

        {selectedClasses.length > 0 && totalAmount > 0 ? (
          <SwishPaymentPanel
            purpose={competition.title}
            amount={totalAmount}
            message={swishMessage}
            checkboxName="swish_confirmed"
            checkboxLabel={`Jag har swishat ${totalAmount.toLocaleString('sv-SE')} kr innan jag skickar in.`}
          />
        ) : (
          <p className="form-hint">Välj minst en klass för att se Swish-instruktioner.</p>
        )}

        {submitError ? <p className="form-error">{submitError}</p> : null}
        <button
          className="button primary"
          type="submit"
          disabled={pending || selectedClasses.length === 0 || totalAmount < 1}
        >
          {pending ? 'Skickar…' : 'Skicka anmälan'}
        </button>
      </form>
    </FormShell>
  );
}
