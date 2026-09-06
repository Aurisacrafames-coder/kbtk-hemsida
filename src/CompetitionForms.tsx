import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import {
  canSelectCompetitionClass,
  fetchPublishedCompetition,
  fetchPublishedCompetitions,
  formatClassesPerPassInfo,
  formatCompetitionDate,
  getCompetitionClassSelectionBlockReason,
  validateClassesPerPassLimit,
  type PublicCompetition,
  type PublicCompetitionRegistrations,
  type PublicCompetitionSummary,
} from './lib/competitions';
import { FORM_SLUG_TYPES, submitSiteForm } from './lib/forms';
import {
  formatYouthCompetitionDate,
  fetchYouthOpenCompetitions,
  type YouthOpenCompetition,
} from './lib/youth-open-competitions';
import { buildSwishMessage } from './lib/swish';
import { SwishPaymentPanel } from './SwishPaymentPanel';
import { CompetitionCalendar } from './CompetitionCalendar';

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
  const [youthCompetitions, setYouthCompetitions] = useState<YouthOpenCompetition[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void Promise.all([
      fetchPublishedCompetitions().then(setCompetitions),
      fetchYouthOpenCompetitions().then(setYouthCompetitions),
    ])
      .catch((err) => setError(err instanceof Error ? err.message : 'Kunde inte ladda tävlingar.'))
      .finally(() => setLoading(false));
  }, []);

  const hasClubCompetitions = competitions.length > 0;
  const hasYouthCompetitions = youthCompetitions.length > 0;
  const showEmpty = !loading && !error && !hasClubCompetitions && !hasYouthCompetitions;

  return (
    <FormShell
      title="Tävlingsanmälan"
      intro={
        <p>
          Välj en tävling att anmäla dig till. Klubbens tävlingar betalas via Swish här. Vissa
          ungdomstävlingar har egen extern anmälan och avgift enligt inbjudan.
        </p>
      }
    >
      {loading ? <p className="form-hint">Laddar tävlingar…</p> : null}
      {error ? <p className="form-error">{error}</p> : null}
      {showEmpty ? (
        <p className="form-hint">Det finns inga öppna tävlingar att anmäla sig till just nu.</p>
      ) : null}

      {hasYouthCompetitions ? (
        <div className="competition-list-block" id="ungdomstavlingar">
          <h2 className="competition-list-heading">Ungdomstävlingar med egen anmälan</h2>
          <p className="form-hint">
            Anmäl dig själv via länken. Avgift betalas på plats enligt inbjudan — inte via klubbens
            Swish-formulär.
          </p>
          <div className="competition-list">
            {youthCompetitions.map((item) => (
              <article key={item.id} className="competition-card competition-card-open">
                <div className="competition-card-top">
                  <span className="competition-card-badge">Egen anmälan</span>
                  <time dateTime={item.date}>{formatYouthCompetitionDate(item.date)}</time>
                </div>
                <h2>{item.title}</h2>
                <p className="competition-card-audience">{item.audience}</p>
                <p>{item.summary}</p>
                <p>
                  {item.place} · {item.feeNote}
                </p>
                <p>
                  <strong>{item.deadlineNote}</strong>
                </p>
                <ul className="competition-card-highlights">
                  {item.highlights.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <div className="competition-card-actions">
                  <a
                    className="button primary"
                    href={item.signupUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Anmäl dig här
                  </a>
                  {item.invitationPdf ? (
                    <a
                      className="text-link"
                      href={item.invitationPdf}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Läs inbjudan (PDF)
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : null}

      {hasClubCompetitions || loading || error ? (
        <div className="competition-list-block">
          {hasYouthCompetitions ? (
            <h2 className="competition-list-heading">Klubbens tävlingsanmälan</h2>
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
                  {item.registration_deadline ? (
                    <>
                      {' · '}
                      <strong>
                        Sista anmälan {formatCompetitionDate(item.registration_deadline)}
                      </strong>
                    </>
                  ) : null}
                </p>
                <span>{item.class_count} klasser att välja mellan</span>
              </a>
            ))}
          </div>
        </div>
      ) : null}

      <CompetitionCalendar embedded />
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
  const [selectionError, setSelectionError] = useState('');
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
    setSelectionError('');

    if (selectedClassIds.includes(classId)) {
      setSelectedClassIds((current) => current.filter((id) => id !== classId));
      return;
    }

    if (!competition || !canSelectCompetitionClass(competition, selectedClassIds, classId)) {
      setSelectionError(
        competition
          ? (getCompetitionClassSelectionBlockReason(competition, selectedClassIds, classId) ??
            'Du kan inte välja fler klasser för det här passet.')
          : 'Du kan inte välja fler klasser för det här passet.',
      );
      return;
    }

    setSelectedClassIds((current) => [...current, classId]);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!competition) return;

    const passLimit = validateClassesPerPassLimit(selectedClasses, competition.max_classes_per_pass);
    if (!passLimit.ok) {
      setSelectionError(passLimit.message);
      return;
    }

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

  const classesPerPassInfo = formatClassesPerPassInfo(competition);

  return (
    <FormShell
      title={competition.title}
      intro={
        <div>
          {competition.organizer ? <p>{competition.organizer}</p> : null}
          {competition.description ? <p>{competition.description}</p> : null}
          {classesPerPassInfo ? (
            <p>
              <strong>Klasser per pass:</strong> {classesPerPassInfo}
            </p>
          ) : null}
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
          {competition.classes.map((item) => {
            const isSelected = selectedClassIds.includes(item.id);
            const canSelect = isSelected || canSelectCompetitionClass(competition, selectedClassIds, item.id);
            const blockReason = isSelected
              ? null
              : getCompetitionClassSelectionBlockReason(competition, selectedClassIds, item.id);

            return (
              <label
                key={item.id}
                className={`checkbox-row competition-class-option${canSelect ? '' : ' competition-class-option--disabled'}`}
                title={blockReason ?? undefined}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  disabled={!canSelect}
                  onChange={() => toggleClass(item.id)}
                />
                <span>
                  {item.label} <strong>{item.fee_sek.toLocaleString('sv-SE')} kr</strong>
                  {blockReason ? <span className="form-hint"> {blockReason}</span> : null}
                </span>
              </label>
            );
          })}
        </fieldset>

        {selectionError ? <p className="form-error">{selectionError}</p> : null}

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
          Övrigt
          <textarea
            name="team_interest"
            rows={3}
            placeholder="Valfria kompletterande uppgifter till anmälan."
          />
        </label>

        {selectedClasses.length > 0 && totalAmount > 0 && name.trim() && swishMessage ? (
          <SwishPaymentPanel
            purpose={competition.title}
            amount={totalAmount}
            message={swishMessage}
            checkboxName="swish_confirmed"
            checkboxLabel={`Jag har swishat ${totalAmount.toLocaleString('sv-SE')} kr innan jag skickar in.`}
          />
        ) : (
          <p className="form-hint">
            {selectedClasses.length > 0 && totalAmount > 0
              ? name.trim()
                ? 'Kunde inte skapa Swish-meddelande. Kontrollera att namn är ifyllt.'
                : 'Fyll i namn ovan för att se Swish-instruktioner.'
              : 'Välj minst en klass för att se Swish-instruktioner.'}
          </p>
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
