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
  { label: 'Licensanmälan', href: 'https://kungalvsbtk.se/tavling/licens-anmalan/' },
  { label: 'Tävlingsanmälan', href: 'https://kungalvsbtk.se/tavling/tavlingsanmalan/' },
  { label: 'Dörraccess', href: 'https://kungalvsbtk.se/ansok-om-access-till-dorren/' },
  { label: 'Spela som gäst', href: 'https://kungalvsbtk.se/spela-som-gast/' },
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

const checkinScheduleUrl = 'https://kbtk-checkin.vercel.app/schema';
const checkinScheduleEmbedUrl = 'https://kbtk-checkin.vercel.app/schema/embed';

const visitorPaths = [
  {
    title: 'Jag vill börja spela',
    text: 'Provträning, grupper, avgifter och hur du anmäler intresse.',
    href: '#borja-spela',
    cta: 'Till börja spela',
  },
  {
    title: 'Jag är redan medlem',
    text: 'Hitta träningstider, hallinformation, Swish och kontaktvägar.',
    href: '#traning',
    cta: 'Se medlemsinfo',
  },
  {
    title: 'Jag vill tävla',
    text: 'Licens, tävlingsanmälan, serier och Profixio-länkar samlat.',
    href: '#serier',
    cta: 'Till tävling',
  },
  {
    title: 'Jag är förälder',
    text: 'Vilken grupp passar, vad kostar det och vem kontaktar jag?',
    href: '#fragor',
    cta: 'Läs vanliga frågor',
  },
  {
    title: 'Jag vill besöka hallen',
    text: 'Adress, karta, gästspel och information om dörraccess.',
    href: '#kontakt',
    cta: 'Hitta hit',
  },
];

const faqs = [
  {
    question: 'När tränar min grupp?',
    answer:
      'Aktuella tider samlas under Träningstider. Om du är osäker på grupp eller nivå är det bäst att kontakta styrelsen.',
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
      'Efter provträningen betalar du medlems- och träningsavgift om du vill fortsätta. Swishnumret är 123 260 3272.',
  },
  {
    question: 'Hur får jag access till hallen?',
    answer:
      'Använd länken för dörraccess under tävlings- och medlemslänkar, eller kontakta styrelsen om du är osäker.',
  },
  {
    question: 'Hur anmäler jag mig till tävling?',
    answer:
      'Under Tävling finns länkar för licensanmälan, tävlingsanmälan och seriestatus. Där hittar du rätt väg vidare.',
  },
];

const clubLogo = '/kbtk-club-logo.webp?v=3';

function App() {
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
    <>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Till startsidan">
          <img
            className="brand-logo"
            src={clubLogo}
            alt="Kungälvs Bordtennisklubb"
          />
          <span>
            <strong>Kungälvs BTK</strong>
            <small>Vi älskar pingis</small>
          </span>
        </a>

        <nav className="main-nav" aria-label="Huvudmeny">
          <a href="#top">Hem</a>
          <a href="#traning">Träningstider</a>
          <a href="#fragor">FAQ</a>
          <a href="#kontakt">Kontakt</a>
        </nav>
      </header>

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
            <h2>Testa pingis med en provträning.</h2>
            <p>
              Anmäl intresse så hjälper klubben dig till rätt grupp. Efter
              provträningen betalas medlems- och träningsavgift om du vill
              fortsätta.
            </p>
            <div className="info-box">
              <strong>Swish:</strong> 123 260 3272
              <span>Betala senast en vecka efter provträningen om du fortsätter.</span>
            </div>
          </div>

          <div className="panel">
            <h3>Grupper</h3>
            <ul className="check-list">
              {trainingGroups.map((group) => (
                <li key={group}>{group}</li>
              ))}
            </ul>
            <a className="text-link" href="mailto:styrelsen@kungalvsbtk.se">
              Anmäl intresse via mejl
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
            <div className="social-links" aria-label="Sociala medier">
              <a href="https://www.facebook.com/KungalvsBTK">Facebook</a>
              <a href="https://www.instagram.com/kungalvsbtk/">Instagram</a>
              <a href="https://www.youtube.com/@kungalvsbtk/">YouTube</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span>Kungälvs Bordtennisklubb</span>
        <span>Vi älskar pingis</span>
      </footer>
    </>
  );
}

export default App;
