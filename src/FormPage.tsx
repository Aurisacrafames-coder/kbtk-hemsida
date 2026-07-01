import { useState, type FormEvent, type ReactNode } from 'react';
import {
  FORM_SLUG_LABELS,
  FORM_SLUG_TYPES,
  HALL_BOOKING_SLOTS,
  LICENSE_OPTIONS,
  MEMBERSHIP_FEE_SEK,
  TRIAL_GROUP_FEE_INFO,
  TRIAL_GROUP_OPTIONS,
  getTrialMembershipTotal,
  submitSiteForm,
  type FormSlug,
} from './lib/forms';
import { validateSwedishPersonalId } from './lib/personal-id';
import { buildSwishMessage } from './lib/swish';
import { SwishPaymentPanel } from './SwishPaymentPanel';

type FormPageProps = {
  slug: FormSlug;
};

type FormShellProps = {
  title: string;
  intro: ReactNode;
  children: ReactNode;
};

function FormShell({ title, intro, children }: FormShellProps) {
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

function useSiteForm(formType: string) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
    buildPayload: (formData: FormData) => Record<string, unknown>,
  ) {
    event.preventDefault();
    setPending(true);
    setError('');
    try {
      const formData = new FormData(event.currentTarget);
      await submitSiteForm({
        form_type: formType,
        ...buildPayload(formData),
      });
      setSuccess(true);
      event.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte skicka formuläret.');
    } finally {
      setPending(false);
    }
  }

  return { pending, error, success, handleSubmit };
}

function TrialSignupForm() {
  const { pending, error, success, handleSubmit } = useSiteForm(FORM_SLUG_TYPES['borja-spela']);
  const [parentMembership, setParentMembership] = useState(false);
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');

  const groupFeeInfo =
    TRIAL_GROUP_FEE_INFO[group as (typeof TRIAL_GROUP_OPTIONS)[number]] ?? null;
  const membershipTotal = group ? getTrialMembershipTotal(group) : null;
  const membershipSwishMessage = buildSwishMessage({
    purpose: 'Medlemsavgift och träning',
    name,
    detail: group || undefined,
  });

  if (success) {
    return (
      <FormShell
        title="Tack för din anmälan"
        intro={<p>Vi har tagit emot ditt intresse och återkommer så snart vi kan.</p>}
      >
        <a className="button primary" href="/">
          Till startsidan
        </a>
      </FormShell>
    );
  }

  return (
    <FormShell
      title="Börja spela"
      intro={
        <p>
          Anmäl intresse till provträning. Om du vill fortsätta efteråt swishar du medlems- och
          träningsavgiften till klubben senast inom en vecka. Därefter registrerar klubben dig och
          du får en inchecknings-tagg i hallen.
        </p>
      }
    >
      <form
        className="site-form"
        onSubmit={(event) =>
          void handleSubmit(event, (formData) => {
            const personalId = validateSwedishPersonalId(
              String(formData.get('personal_id_date') ?? ''),
              String(formData.get('personal_id_suffix') ?? ''),
            );
            if (!personalId.ok) {
              throw new Error(personalId.message);
            }

            return {
              group: formData.get('group'),
              name: formData.get('name'),
              email: formData.get('email'),
              phone: formData.get('phone'),
              personal_id_date: personalId.normalizedDate,
              personal_id_suffix: personalId.normalizedSuffix,
              experience: formData.get('experience'),
              parent_membership: formData.get('parent_membership') === 'on',
              parent_swish_confirmed: formData.get('parent_swish_confirmed') === 'on',
              continue_intent_confirmed: formData.get('continue_intent_confirmed') === 'on',
            };
          })
        }
      >
        <label>
          Välj grupp att provträna i
          <select
            name="group"
            required
            defaultValue=""
            onChange={(event) => setGroup(event.target.value)}
          >
            <option value="" disabled>
              Välj grupp
            </option>
            {TRIAL_GROUP_OPTIONS.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </label>

        <label>
          Namn
          <input
            name="name"
            required
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>

        <label>
          Mejladress
          <input name="email" type="email" required autoComplete="email" />
        </label>

        <label>
          Telefonnummer
          <input name="phone" type="tel" required autoComplete="tel" />
        </label>

        <label>
          Personnummer (ååååmmdd)
          <input
            name="personal_id_date"
            inputMode="numeric"
            pattern="[0-9]{8}"
            maxLength={8}
            required
            placeholder="19900101"
          />
        </label>

        <label>
          Personnummer (fyra siffror)
          <input
            name="personal_id_suffix"
            inputMode="numeric"
            pattern="[0-9]{4}"
            maxLength={4}
            required
            placeholder="1234"
          />
        </label>
        <p className="form-hint">Vi kontrollerar att datum och kontrollsiffra är giltiga.</p>

        <label>
          Tidigare erfarenhet
          <textarea
            name="experience"
            rows={4}
            placeholder="Hjälp oss placera dig i rätt grupp."
          />
        </label>

        <label className="checkbox-row">
          <input
            type="checkbox"
            name="parent_membership"
            checked={parentMembership}
            onChange={(event) => setParentMembership(event.target.checked)}
          />
          <span>
            Jag är förälder till ett barn i KBTK och vill ha föräldramedlemskap (350 kr/säsong).
          </span>
        </label>

        {group && groupFeeInfo ? (
          <SwishPaymentPanel
            purpose="Medlemsavgift och träning"
            amount={membershipTotal}
            feeBreakdown={[
              { label: 'Medlemsavgift', amountSek: MEMBERSHIP_FEE_SEK },
              ...(groupFeeInfo.trainingFeeSek !== null
                ? [
                    {
                      label: `Träningsavgift (${groupFeeInfo.trainingLabel})`,
                      amountSek: groupFeeInfo.trainingFeeSek,
                    },
                  ]
                : []),
            ]}
            feeNote={groupFeeInfo.trainingNote}
            message={membershipSwishMessage}
            timing="after_trial"
            checkboxName="continue_intent_confirmed"
            checkboxLabel="Jag förstår att jag swishar medlems- och träningsavgiften inom en vecka om jag vill fortsätta efter provträningen."
          />
        ) : (
          <p className="form-hint">
            Välj grupp ovan för att se avgifter och Swish-instruktioner.
          </p>
        )}

        {parentMembership ? (
          <SwishPaymentPanel
            purpose="Föräldramedlemskap"
            amount={MEMBERSHIP_FEE_SEK}
            message={buildSwishMessage({
              purpose: 'Föräldramedlemskap',
              name,
            })}
            checkboxName="parent_swish_confirmed"
            checkboxLabel={`Jag har swishat ${MEMBERSHIP_FEE_SEK.toLocaleString('sv-SE')} kr för föräldramedlemskap innan jag skickar in.`}
          />
        ) : null}

        {error ? <p className="form-error">{error}</p> : null}
        <button className="button primary" type="submit" disabled={pending}>
          {pending ? 'Skickar…' : 'Skicka in'}
        </button>
      </form>
    </FormShell>
  );
}

function LicenseForm() {
  const { pending, error, success, handleSubmit } = useSiteForm(FORM_SLUG_TYPES.licens);
  const [fee, setFee] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [licenseLabel, setLicenseLabel] = useState('');

  if (success) {
    return (
      <FormShell title="Tack!" intro={<p>Licensanmälan är mottagen.</p>}>
        <a className="button primary" href="/">
          Till startsidan
        </a>
      </FormShell>
    );
  }

  return (
    <FormShell
      title="Licensanmälan"
      intro={
        <p>
          Fyll i uppgifterna, swisha licensavgiften till klubben och skicka sedan in formuläret.
        </p>
      }
    >
      <form
        className="site-form"
        onSubmit={(event) =>
          void handleSubmit(event, (formData) => ({
            name: formData.get('name'),
            email: formData.get('email'),
            license_type: formData.get('license_type'),
            swish_confirmed: formData.get('swish_confirmed') === 'on',
          }))
        }
      >
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
          Välj licens
          <select
            name="license_type"
            required
            defaultValue=""
            onChange={(event) => {
              const option = LICENSE_OPTIONS.find((item) => item.value === event.target.value);
              setFee(option?.fee ?? null);
              setLicenseLabel(option?.label ?? '');
            }}
          >
            <option value="" disabled>
              Välj licens
            </option>
            {LICENSE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} ({option.fee} kr)
              </option>
            ))}
          </select>
        </label>
        {fee ? (
          <SwishPaymentPanel
            purpose="Licens"
            amount={fee}
            message={buildSwishMessage({
              purpose: 'Licens',
              name,
              detail: licenseLabel || undefined,
            })}
            checkboxName="swish_confirmed"
            checkboxLabel={`Jag har swishat ${fee.toLocaleString('sv-SE')} kr för licensen innan jag skickar in.`}
          />
        ) : (
          <p className="form-hint">Välj licens ovan för att se belopp och Swish-instruktioner.</p>
        )}
        {error ? <p className="form-error">{error}</p> : null}
        <button className="button primary" type="submit" disabled={pending}>
          {pending ? 'Skickar…' : 'Skicka in'}
        </button>
      </form>
    </FormShell>
  );
}

function CompetitionForm() {
  const { pending, error, success, handleSubmit } = useSiteForm(FORM_SLUG_TYPES.tavling);
  const [name, setName] = useState('');
  const [competition, setCompetition] = useState('');

  if (success) {
    return (
      <FormShell title="Tack!" intro={<p>Tävlingsanmälan är mottagen.</p>}>
        <a className="button primary" href="/">
          Till startsidan
        </a>
      </FormShell>
    );
  }

  return (
    <FormShell
      title="Tävlingsanmälan"
      intro={
        <p>
          Fyll i tävlingsuppgifterna, swisha avgiften till klubben och skicka sedan in anmälan.
          Klubben behandlar anmälan när betalningen syns på Swish.
        </p>
      }
    >
      <form
        className="site-form"
        onSubmit={(event) =>
          void handleSubmit(event, (formData) => ({
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            competition: formData.get('competition'),
            class_info: formData.get('class_info'),
            team_interest: formData.get('team_interest'),
            swish_amount: formData.get('swish_amount'),
            swish_confirmed: formData.get('swish_confirmed') === 'on',
          }))
        }
      >
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
          Tävling
          <input
            name="competition"
            required
            placeholder="T.ex. Bajen Cup höst"
            value={competition}
            onChange={(event) => setCompetition(event.target.value)}
          />
        </label>
        <label>
          Klass/dag
          <textarea name="class_info" rows={3} placeholder="Skriv klass och dag." />
        </label>
        <label>
          Lag-DM eller önskemål
          <textarea
            name="team_interest"
            rows={3}
            placeholder="Intresse för lagtävling eller spelpartner."
          />
        </label>
        <SwishPaymentPanel
          purpose="Tävlingsavgift"
          message={buildSwishMessage({
            purpose: 'Tävling',
            name,
            detail: competition || undefined,
          })}
          checkboxName="swish_confirmed"
          checkboxLabel="Jag har swishat tävlingsavgiften innan jag skickar in."
          requireAmountField
        />
        {error ? <p className="form-error">{error}</p> : null}
        <button className="button primary" type="submit" disabled={pending}>
          {pending ? 'Skickar…' : 'Skicka in'}
        </button>
      </form>
    </FormShell>
  );
}

function DoorAccessForm() {
  const { pending, error, success, handleSubmit } = useSiteForm(FORM_SLUG_TYPES.doraccess);

  if (success) {
    return (
      <FormShell title="Tack!" intro={<p>Din ansökan om dörraccess är mottagen.</p>}>
        <a className="button primary" href="/">
          Till startsidan
        </a>
      </FormShell>
    );
  }

  return (
    <FormShell
      title="Ansök om dörraccess"
      intro={
        <p>
          För föräldrar till barn i träningsgrupp som behöver kunna öppna dörren själva, t.ex.
          under fria tider i hallen. Medlemmens inchecknings-tagg vid träning är något annat — läs
          mer under <a href="/#incheckning">check-in i hallen</a>.
        </p>
      }
    >
      <form
        className="site-form"
        onSubmit={(event) =>
          void handleSubmit(event, (formData) => ({
            parent_name: formData.get('parent_name'),
            child_name: formData.get('child_name'),
            group_info: formData.get('group_info'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            rules_accepted: formData.get('rules_accepted') === 'on',
          }))
        }
      >
        <label>
          Förälderns namn
          <input name="parent_name" required />
        </label>
        <label>
          Barnets namn
          <input name="child_name" required />
        </label>
        <label>
          Vilken grupp tränar barnet i?
          <textarea
            name="group_info"
            rows={3}
            required
            placeholder="T.ex. 10, 11, 12, 13, 14, D, C eller B."
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
        <label className="checkbox-row">
          <input type="checkbox" name="rules_accepted" required />
          <span>Jag försäkrar att uppgifterna stämmer och att jag följer klubbens regler.</span>
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <button className="button primary" type="submit" disabled={pending}>
          {pending ? 'Skickar…' : 'Skicka in'}
        </button>
      </form>
    </FormShell>
  );
}

function HallBookingForm() {
  const { pending, error, success, handleSubmit } = useSiteForm(FORM_SLUG_TYPES['boka-hall']);
  const [isMember, setIsMember] = useState(true);

  if (success) {
    return (
      <FormShell title="Tack!" intro={<p>Bokningsförfrågan är mottagen. Vi återkommer så snart vi kan.</p>}>
        <a className="button primary" href="/">
          Till startsidan
        </a>
      </FormShell>
    );
  }

  return (
    <FormShell
      title="Boka KBTK-hallen"
      intro={
        <p>
          Hallen kan bokas för pingisfest när ingen träning eller match är inplanerad. Tider:
          fre/lör 16:00–20:00. Swisha enligt prislista på klubbens sida efter bekräftelse.
        </p>
      }
    >
      <form
        className="site-form"
        onSubmit={(event) =>
          void handleSubmit(event, (formData) => ({
            first_name: formData.get('first_name'),
            last_name: formData.get('last_name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            booking_date: formData.get('booking_date'),
            time_slot: formData.get('time_slot'),
            is_member: formData.get('is_member') === 'on',
            guest_count: formData.get('guest_count'),
            member_reference: formData.get('member_reference'),
            details: formData.get('details'),
          }))
        }
      >
        <label>
          Datum
          <input name="booking_date" type="date" required />
        </label>
        <label>
          Tid
          <select name="time_slot" required defaultValue="">
            <option value="" disabled>
              Välj tid
            </option>
            {HALL_BOOKING_SLOTS.map((slot) => (
              <option key={slot.value} value={slot.value}>
                {slot.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Förnamn
          <input name="first_name" required />
        </label>
        <label>
          Efternamn
          <input name="last_name" required />
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
          Antal personer
          <input name="guest_count" type="number" min={1} required />
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            name="is_member"
            checked={isMember}
            onChange={(event) => setIsMember(event.target.checked)}
          />
          <span>Jag är medlem</span>
        </label>
        {!isMember ? (
          <label>
            Medlemsreferens (minst en medlem ska vara närvarande)
            <input name="member_reference" required />
          </label>
        ) : null}
        <label>
          Övrig info
          <textarea name="details" rows={4} />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <button className="button primary" type="submit" disabled={pending}>
          {pending ? 'Skickar…' : 'Skicka förfrågan'}
        </button>
      </form>
    </FormShell>
  );
}

function ContactForm() {
  const { pending, error, success, handleSubmit } = useSiteForm(FORM_SLUG_TYPES.kontakt);

  if (success) {
    return (
      <FormShell title="Tack!" intro={<p>Ditt meddelande är skickat. Vi återkommer så snart vi kan.</p>}>
        <a className="button primary" href="/">
          Till startsidan
        </a>
      </FormShell>
    );
  }

  return (
    <FormShell
      title="Kontakta oss"
      intro={<p>Skicka ett meddelande till klubben så återkommer vi.</p>}
    >
      <form
        className="site-form"
        onSubmit={(event) =>
          void handleSubmit(event, (formData) => ({
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
          }))
        }
      >
        <label>
          Namn
          <input name="name" required />
        </label>
        <label>
          Mejladress
          <input name="email" type="email" required />
        </label>
        <label>
          Ämne
          <input name="subject" required />
        </label>
        <label>
          Meddelande
          <textarea name="message" rows={6} required />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <button className="button primary" type="submit" disabled={pending}>
          {pending ? 'Skickar…' : 'Skicka meddelande'}
        </button>
      </form>
    </FormShell>
  );
}

export function FormPage({ slug }: FormPageProps) {
  switch (slug) {
    case 'borja-spela':
      return <TrialSignupForm />;
    case 'licens':
      return <LicenseForm />;
    case 'tavling':
      return <CompetitionForm />;
    case 'doraccess':
      return <DoorAccessForm />;
    case 'boka-hall':
      return <HallBookingForm />;
    case 'kontakt':
      return <ContactForm />;
    default:
      return null;
  }
}

export function FormPageTitle({ slug }: FormPageProps) {
  return FORM_SLUG_LABELS[slug];
}
