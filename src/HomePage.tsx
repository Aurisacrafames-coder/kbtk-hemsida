import { useEffect, useState } from 'react';

type AktuelltItem = {
  title: string;
  text: string;
  link?: {
    label: string;
    href: string;
  };
  startDate?: string;
  endDate?: string;
};

type AktuelltFile = {
  items: AktuelltItem[];
};

const MAX_AKTUELLT = 3;
const checkinBaseUrl =
  import.meta.env.VITE_CHECKIN_URL ?? 'https://kbtk-checkin.vercel.app';

const defaultAktuelltItems: AktuelltItem[] = [
  {
    title: 'Provträning för nya spelare',
    text: 'Klubben erbjuder en provträning för dig som vill testa pingis innan du bestämmer dig.',
    link: {
      label: 'styrelsen@kungalvsbtk.se',
      href: 'mailto:styrelsen@kungalvsbtk.se',
    },
  },
];

function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isAktuelltActive(item: AktuelltItem, today: string) {
  if (item.startDate && today < item.startDate) {
    return false;
  }
  if (item.endDate && today > item.endDate) {
    return false;
  }
  return true;
}

function getActiveAktuellt(items: AktuelltItem[]) {
  const today = getLocalDateString();
  return items.filter((item) => isAktuelltActive(item, today)).slice(0, MAX_AKTUELLT);
}

function parseAktuelltFile(data: AktuelltFile | AktuelltItem): AktuelltItem[] {
  if ('items' in data && Array.isArray(data.items)) {
    return data.items;
  }

  if ('title' in data) {
    return [data];
  }

  return defaultAktuelltItems;
}

const trainingGroups = [
  'Nybörjare 7-10 år',
  'Nybörjare 11-14 år',
  'Motionärer',
  'Föräldramedlemskap',
  'Övriga spelare',
];

const series = [
  {
    name: 'Division 1',
    href: 'https://www.profixio.com/fx/serieoppsett.php?t=SBTF_SERIE_AVD27187&k=LS27187&p=1',
  },
  {
    name: 'Division 2',
    href: 'https://www.profixio.com/fx/serieoppsett.php?t=SBTF_SERIE_AVD27167&k=LS27167&p=1',
  },
  {
    name: 'Division 3',
    href: 'https://www.profixio.com/fx/serieoppsett.php?t=SBTF_SERIE_AVD27189&k=LS27189&p=1',
  },
  {
    name: 'Division 4',
    href: 'https://www.profixio.com/fx/serieoppsett.php?t=SBTF_SERIE_AVD27376&k=LS27376&p=1',
  },
  {
    name: 'Division 6',
    href: 'https://www.profixio.com/fx/serieoppsett.php?t=SBTF_SERIE_AVD16684&k=LS16684&p=1',
  },
];

const quickLinks = [
  { label: 'Licensanmälan', href: '/form/licens' },
  { label: 'Tävlingsanmälan', href: '/form/tavling' },
  { label: 'Dörraccess', href: '/form/doraccess' },
];

const sponsors = [
  {
    name: 'Ställets Rör',
    shortName: 'SR',
    href: 'http://www.stalletsror.se/',
    color: '#123b63',
  },
  {
    name: 'HusmanHagberg',
    shortName: 'HH',
    href: 'https://www.husmanhagberg.se/',
    color: '#14213d',
  },
  {
    name: 'BOKAB',
    shortName: 'B',
    href: 'https://www.bokab.nu/',
    color: '#0f5132',
  },
  {
    name: 'Erik Olsson',
    shortName: 'EO',
    href: 'https://www.erikolsson.se/',
    color: '#1f2937',
  },
  {
    name: 'Kungälv Energi',
    shortName: 'KE',
    href: 'https://www.kungalvenergi.se/',
    color: '#0b5d98',
  },
];

const seasonFees = [
  { group: 'Nybörjare', training: 1000, membership: 350, license: 'Vid behov', total: 1350 },
  { group: 'Motionsgrupp', training: 1150, membership: 350, license: 'Vid behov', total: 1500 },
  { group: 'Grupp D', training: 1000, membership: 350, license: 'Vid behov', total: 1350 },
  { group: 'Grupp C', training: 1250, membership: 350, license: 'Vid behov', total: 1600 },
  { group: 'Grupp B', training: 1650, membership: 350, license: 'Vid behov', total: 2000 },
  { group: 'Grupp A', training: 1800, membership: 350, license: 'A-licens ingår', total: 2800 },
];

const clubInfoRows = [
  { label: 'Bildad', value: '1970-09-01' },
  { label: 'Föreningsnummer', value: '6013-06' },
  { label: 'Postadress', value: 'Brushanestigen 3, 442 49 Kungälv' },
  { label: 'Besöksadress', value: 'Brushanestigen 3, 442 49 Kungälv' },
  { label: 'Sommartid', value: 'Stängt juni–augusti' },
  {
    label: 'Telefon',
    value: '076-111 65 10',
    href: 'tel:+46761116510',
  },
  {
    label: 'E-post',
    value: 'styrelsen@kungalvsbtk.se',
    href: 'mailto:styrelsen@kungalvsbtk.se',
  },
  {
    label: 'Hemsida',
    value: 'www.kungalvsbtk.se',
    href: 'https://kungalvsbtk.se/',
  },
  { label: 'Bankgiro', value: '479-3915' },
  { label: 'Swish', value: '123 260 3272' },
  { label: 'Organisationsnummer', value: '802421-9860' },
  {
    label: 'Stadgar',
    value: 'Stadgar 2024',
    href: 'https://kungalvsbtk.se/wp-content/uploads/2026/01/KBTK-stadgar-2024.pdf',
  },
];

const checkinScheduleUrl = `${checkinBaseUrl}/schema`;
const checkinScheduleEmbedUrl = `${checkinBaseUrl}/schema/embed`;

const visitorPaths = [
  {
    title: 'Börja spela',
    text: 'Kom igång som ny spelare, prova på eller spela som gäst.',
    topics: ['Prova på', 'Gästspel', 'Anmäl intresse'],
    href: '#borja-spela',
    cta: 'Till börja spela',
  },
  {
    title: 'Tävling/Serie',
    text: 'Serier, licens och anmälan till tävling.',
    topics: ['Seriestatus', 'Licens', 'Tävlingsanmälan'],
    href: '#serier',
    cta: 'Till tävling',
  },
  {
    title: 'Klubbinfo',
    text: 'Om klubben, hallen och hur du når oss.',
    topics: ['Om KBTK', 'Hallen', 'Kontakt'],
    href: '#klubbinfo',
    cta: 'Läs klubbinfo',
  },
  {
    title: 'Vanliga frågor',
    text: 'Svar på det som oftast dyker upp.',
    topics: ['Träningstider', 'Grupper', 'Dörraccess'],
    href: '#fragor',
    cta: 'Läs FAQ',
  },
  {
    title: 'Avgifter',
    text: 'Medlems- och träningsavgifter samt betalning.',
    topics: ['Medlemsavgift', 'Träningsavgift', 'Swish'],
    href: '#avgifter',
    cta: 'Se avgifter',
  },
];

const faqs = [
  {
    question: 'När tränar min grupp?',
    answer:
      'Aktuella tider finns under Träningstider. Om du är osäker på grupp eller nivå är det bäst att kontakta styrelsen.',
    link: { label: 'Se träningstider', href: '#traning' },
  },
  {
    question: 'Vilken grupp passar mitt barn?',
    answer:
      'Klubben försöker matcha spelare efter ålder, nivå, gruppstorlek och kompisar. Börja med en provträning så hjälper vi er rätt.',
  },
  {
    question: 'Hur anmäler jag mig till provträning?',
    answer:
      'Skicka intresse via mejl till styrelsen@kungalvsbtk.se med namn, ålder, kontaktuppgifter och eventuell tidigare erfarenhet.',
  },
  {
    question: 'Vad kostar det och hur betalar jag?',
    answer:
      'Medlemsavgiften är 350 kr per säsong. Träningsavgiften varierar per grupp (1 000–1 800 kr för höst/vår). Betala via Swish 123 260 3272 eller enligt faktura från klubben.',
    link: { label: 'Se alla avgifter', href: '#avgifter' },
  },
  {
    question: 'Hur får jag access till hallen?',
    answer:
      'Ansök om dörraccess via formuläret på hemsidan, eller kontakta styrelsen om du är osäker.',
    link: { label: 'Ansök om dörraccess', href: '/form/doraccess' },
  },
  {
    question: 'Hur anmäler jag mig till tävling?',
    answer:
      'Under Tävling finns länkar för licensanmälan, tävlingsanmälan och seriestatus. Där hittar du rätt väg vidare.',
  },
];

const clubLogo = '/kbtk-club-logo.webp?v=3';

function HomePage() {
  const [aktuelltItems, setAktuelltItems] = useState<AktuelltItem[]>(
    getActiveAktuellt(defaultAktuelltItems),
  );

  useEffect(() => {
    async function loadAktuellt() {
      try {
        const response = await fetch(`${checkinBaseUrl}/api/public/aktuellt`);
        if (!response.ok) {
          throw new Error('Kunde inte ladda aktuellt från check-in');
        }
        const data = (await response.json()) as { items?: AktuelltItem[] };
        if (Array.isArray(data.items)) {
          setAktuelltItems(data.items.slice(0, MAX_AKTUELLT));
          return;
        }
      } catch {
        // Fallback till lokal fil om check-in inte svarar.
      }

      try {
        const response = await fetch('/aktuellt.json');
        if (!response.ok) {
          throw new Error('Kunde inte ladda aktuellt.json');
        }
        const data = (await response.json()) as AktuelltFile | AktuelltItem;
        setAktuelltItems(getActiveAktuellt(parseAktuelltFile(data)));
      } catch {
        setAktuelltItems(getActiveAktuellt(defaultAktuelltItems));
      }
    }

    void loadAktuellt();
  }, []);

  return (
      <main id="top">
        <section className="section path-section" aria-labelledby="paths-title">
          <div className="section-heading">
            <h2 className="path-heading" id="paths-title">
              Hitta rätt snabbt
            </h2>
            <p>
              Välj det som passar dig bäst så kommer du direkt till rätt
              information utan att behöva leta i menyer.
            </p>
          </div>

          <div className="path-grid">
            {visitorPaths.map((path) => (
              <a className="path-card" href={path.href} key={path.title}>
                <h3>{path.title}</h3>
                <p>{path.text}</p>
                <ul className="path-topics">
                  {path.topics.map((topic) => (
                    <li key={topic}>{topic}</li>
                  ))}
                </ul>
                <span>{path.cta}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="hero section">
          <div className="hero-content">
            <p className="eyebrow">Kungälvs Bordtennisklubb</p>
            <h1>Pingis, gemenskap och utveckling i Kungälv.</h1>
            <p className="hero-copy">
              Välkommen till KBTK. Här tränar barn, ungdomar, vuxna och motionärer
              i KBTK-hallen med fokus på spelglädje, trygghet och laganda.
            </p>
            <div className="button-row">
              <a className="button primary" href="#borja-spela">
                Börja spela
              </a>
              <a className="button secondary" href="#traning">
                Se träningstider
              </a>
            </div>
          </div>

          <aside className="hero-card" aria-label="Snabb information">
            <img
              className="club-logo-card"
              src={clubLogo}
              alt=""
            />
            <span className="card-label">Aktuellt</span>
            {aktuelltItems.length === 0 ? (
              <p className="aktuellt-empty">
                Inget aktuellt just nu. Hör av dig till styrelsen om du har frågor.
              </p>
            ) : (
              <div className="aktuellt-list">
                {aktuelltItems.map((item) => (
                  <article className="aktuellt-item" key={item.title}>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                    {item.link ? (
                      <a href={item.link.href}>{item.link.label}</a>
                    ) : null}
                  </article>
                ))}
              </div>
            )}
          </aside>
        </section>

        <section className="section split" id="borja-spela">
          <div>
            <p className="eyebrow">Börja spela</p>
            <h2>Prova på, spela som gäst eller bli medlem.</h2>
            <p>
              Ny i klubben? Börja med en provträning så hjälper vi dig till rätt
              grupp. Vill du bara testa en kväll kan du spela som gäst. Efter
              provträningen betalar du medlems- och träningsavgift om du vill
              fortsätta — se <a href="#avgifter">Avgifter</a> för mer info.
            </p>
            <div className="quick-links">
              <a href="/form/borja-spela">Anmäl intresse</a>
              <a href="https://kungalvsbtk.se/spela-som-gast/">Spela som gäst</a>
            </div>
          </div>

          <div className="panel">
            <h3>Grupper</h3>
            <ul className="check-list">
              {trainingGroups.map((group) => (
                <li key={group}>{group}</li>
              ))}
            </ul>
            <a className="text-link" href="/form/borja-spela">
              Anmäl intresse via formulär
            </a>
          </div>
        </section>

        <section className="section schedule-section" id="traning">
          <div className="section-heading">
            <p className="eyebrow">Träning</p>
            <h2>Träningstider</h2>
            <p>
              Aktuellt gruppschema hämtas från KBTK Check-in. Om schemat inte
              visas kan du öppna det i en egen flik.
            </p>
          </div>

          <div className="schedule-embed">
            <iframe
              src={checkinScheduleEmbedUrl}
              title="KBTK träningsschema"
              loading="lazy"
            />
          </div>

          <div className="schedule-actions">
            <a className="button primary" href={checkinScheduleUrl}>
              Öppna hela schemat
            </a>
          </div>

          <div className="schedule-grid compact">
            <article className="schedule-card">
              <h3>KBTK-hallen</h3>
              <p>Brushanestigen 3, 442 49 Kungälv</p>
              <a href="https://maps.app.goo.gl/m25uwm9upuVWwbq98">Öppna i Google Maps</a>
            </article>
            <article className="schedule-card featured">
              <h3>Träningsgrupper</h3>
              <p>
                Vi eftersträvar jämn spelstandard, lagom stora grupper och att
                kompisar kan spela tillsammans.
              </p>
            </article>
            <article className="schedule-card">
              <h3>Säsong</h3>
              <p>
                Nuvarande information på klubbsidan anger att nya anmälningar tas
                emot inför kommande säsong.
              </p>
            </article>
          </div>
        </section>

        <section className="section split reverse" id="serier">
          <div className="panel dark-panel">
            <h3>Seriestatus</h3>
            <div className="link-grid">
              {series.map((item) => (
                <a key={item.name} href={item.href}>
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow">Tävling</p>
            <h2>Snabbt vidare till serier och anmälningar.</h2>
            <p>
              Samla tävlingsflödet på ett ställe så att spelare och föräldrar
              snabbt hittar rätt länkar.
            </p>
            <div className="quick-links">
              {quickLinks.map((item) => (
                <a key={item.label} href={item.href}>
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="section club-info-section" id="klubbinfo">
          <div className="section-heading">
            <p className="eyebrow">Klubbinfo</p>
            <h2>Fakta om Kungälvs Bordtennisklubb</h2>
            <p>
              Kontaktuppgifter, adress och övrig information om klubben.
            </p>
          </div>

          <div className="club-info-layout">
            <div className="club-info-table-wrap">
              <table className="club-info-table">
                <tbody>
                  {clubInfoRows.map((row) => (
                    <tr key={row.label}>
                      <th scope="row">{row.label}</th>
                      <td>
                        {row.href ? (
                          <a href={row.href} rel={row.href.endsWith('.pdf') ? 'noreferrer' : undefined} target={row.href.endsWith('.pdf') ? '_blank' : undefined}>
                            {row.value}
                          </a>
                        ) : (
                          row.value
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <aside className="club-info-aside">
              <img className="club-logo-card" src={clubLogo} alt="KBTK logotyp" />
              <a className="text-link" href="https://maps.app.goo.gl/m25uwm9upuVWwbq98">
                Öppna hallen i Google Maps
              </a>
              <div className="quick-links">
                <a href="#sponsorer">Våra sponsorer</a>
                <a href="#kontakt">Kontakta styrelsen</a>
                <a href="/form/boka-hall">Boka KBTK-hallen</a>
              </div>
            </aside>
          </div>
        </section>

        <section className="section fee-section" id="avgifter">
          <div className="section-heading">
            <p className="eyebrow">Avgifter</p>
            <h2>Medlems- och träningsavgifter</h2>
            <p>
              Träningsavgifterna gäller hela säsongen höst/vår (september–maj). Avgifterna
              faktureras vid höstsäsongens början — inga återbetalningar sker vid avslutat
              spel under säsongen, t.ex. om man bara spelar höstterminen.
            </p>
          </div>

          <p className="fee-season-label">Säsong 2025–2026</p>

          <div className="fee-table-wrap">
            <table className="fee-table">
              <thead>
                <tr>
                  <th scope="col">Grupp</th>
                  <th scope="col">Träningsavgift</th>
                  <th scope="col">Medlemsavgift</th>
                  <th scope="col">Licens</th>
                  <th scope="col">Totalt</th>
                </tr>
              </thead>
              <tbody>
                {seasonFees.map((row) => (
                  <tr key={row.group}>
                    <th scope="row">{row.group}</th>
                    <td>{row.training.toLocaleString('sv-SE')} kr</td>
                    <td>{row.membership.toLocaleString('sv-SE')} kr</td>
                    <td>{row.license}</td>
                    <td>{row.total.toLocaleString('sv-SE')} kr</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="fee-footnote">
            Börjar man på vårsäsongen kan träningsavgiften halveras i pingisskolan. Grupper
            startar i regel på hösten. Nya avgifter för kommande säsong publiceras innan
            höststart.
          </p>

          <div className="fee-grid">
            <article className="fee-card">
              <h3>Föräldramedlemskap</h3>
              <p>
                För föräldrar som vill vara i hallen med sitt barn under fria tider:{' '}
                <strong>350 kr per säsong</strong> (sept–maj).
              </p>
            </article>

            <article className="fee-card">
              <h3>Sommarträning</h3>
              <p>
                Gäller juni–augusti: <strong>350 kr</strong> för alla medlemmar.
              </p>
            </article>

            <article className="fee-card">
              <h3>Gästspel</h3>
              <p>
                <strong>50 kr per person och tillfälle.</strong> Anmäl gäst i förväg och
                swisha till 123 260 3272.
              </p>
              <a className="text-link" href="https://kungalvsbtk.se/spela-som-gast/">
                Anmäl gästspel
              </a>
            </article>

            <article className="fee-card">
              <h3>Tävlingsavgift</h3>
              <p>
                Betalas via Swish innan tävling. Anmäl dig på tävlingsanmälan efter
                betalning.
              </p>
              <a className="text-link" href="/form/tavling">
                Till tävlingsanmälan
              </a>
            </article>

            <article className="fee-card">
              <h3>Faktura</h3>
              <p>
                Fakturor för träningsavgift skickas via e-post i första eller andra veckan
                av oktober varje säsong.
              </p>
              <a className="text-link" href="mailto:kassor@kungalvsbtk.se">
                kassor@kungalvsbtk.se
              </a>
            </article>

            <article className="fee-card featured">
              <h3>Betalning</h3>
              <div className="info-box">
                <strong>Swish:</strong> 123 260 3272
                <span>Ange namn och grupp i meddelandet.</span>
              </div>
              <p>
                <strong>Bankgiro:</strong> 479-3915
                <br />
                <strong>Friskvårdsbidrag:</strong> via Epassi
              </p>
              <p>
                Efter provträning: swisha senast inom en vecka om du vill fortsätta. Vill
                du inte fortsätta, meddela styrelsen inom en vecka så slipper du faktura.
              </p>
            </article>
          </div>
        </section>

        <section className="section sponsors-section" id="sponsorer" aria-labelledby="sponsors-title">
          <div className="section-heading">
            <p className="eyebrow">Sponsorer</p>
            <h2 id="sponsors-title">Tack till våra sponsorer</h2>
          </div>
          <div className="sponsor-grid">
            {sponsors.map((sponsor) => (
              <a
                className="sponsor-card"
                href={sponsor.href}
                key={sponsor.name}
                rel="noreferrer"
                target="_blank"
              >
                <span className="sponsor-logo" style={{ background: sponsor.color }}>
                  <span className="sponsor-logo-badge">{sponsor.shortName}</span>
                  <strong>{sponsor.name}</strong>
                </span>
                <span>{sponsor.name}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="section faq-section" id="fragor" aria-labelledby="faq-title">
          <div className="section-heading">
            <p className="eyebrow">Vanliga frågor</p>
            <h2 id="faq-title">Snabba svar för medlemmar och föräldrar</h2>
            <p>
              Här samlar vi frågorna som oftast dyker upp när någon ska börja,
              fortsätta träna eller tävla med klubben.
            </p>
          </div>

          <div className="faq-list">
            {faqs.map((faq) => (
              <details key={faq.question} className="faq-item">
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
                {faq.link ? (
                  <a className="text-link" href={faq.link.href}>
                    {faq.link.label}
                  </a>
                ) : null}
              </details>
            ))}
          </div>
        </section>

        <section className="section contact-section" id="kontakt">
          <div>
            <p className="eyebrow">Kontakt</p>
            <h2>Prata med Kungälvs BTK</h2>
            <p>
              Har du frågor om träning, medlemskap, tävling eller hallen? Hör av
              dig till styrelsen så hjälper vi dig vidare.
            </p>
          </div>
          <div className="contact-card">
            <a href="mailto:styrelsen@kungalvsbtk.se">styrelsen@kungalvsbtk.se</a>
            <a className="button secondary contact-form-link" href="/form/kontakt">
              Skicka meddelande
            </a>
            <div className="social-links" aria-label="Sociala medier">
              <a href="https://www.facebook.com/KungalvsBTK">Facebook</a>
              <a href="https://www.instagram.com/kungalvsbtk/">Instagram</a>
              <a href="https://www.youtube.com/@kungalvsbtk/">YouTube</a>
            </div>
          </div>
        </section>
      </main>
  );
}

export default HomePage;
