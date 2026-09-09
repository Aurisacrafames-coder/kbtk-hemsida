import { useEffect, useState } from 'react';
import {
  fetchPublishedCompetitions,
  formatCompetitionDate,
  type PublicCompetitionSummary,
} from './lib/competitions';
import { FAQ_ENTRIES } from './lib/faq-knowledge';
import { fetchPublicSignupGroups, type PublicSignupGroup } from './lib/signup-groups';
import { SignupGroupInfoPanel } from './SignupGroupInfoPanel';
import {
  fetchYouthOpenCompetitions,
  formatYouthCompetitionDate,
  type YouthOpenCompetition,
} from './lib/youth-open-competitions';
import {
  fetchAktuelltHomepage,
  newsArticlePath,
  type AktuelltItem,
} from './lib/aktuellt';

const checkinBaseUrl =
  import.meta.env.VITE_CHECKIN_URL ?? 'https://kbtk-checkin.vercel.app';

const defaultAktuelltItems: AktuelltItem[] = [
  {
    slug: 'provtraning-for-nya-spelare',
    title: 'Provträning för nya spelare',
    text: 'Klubben erbjuder en provträning för dig som vill testa pingis innan du bestämmer dig.',
    link: {
      label: 'Anmäl intresse',
      href: '/form/borja-spela',
    },
  },
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

const seasonFees: Array<{
  group: string;
  training: number;
  membership: number | '—';
  license: string;
  total: number;
  addon?: boolean;
}> = [
  { group: 'Pingisskola/Nybörjare', training: 1300, membership: 350, license: 'Vid behov', total: 1650 },
  { group: 'Motionsgrupp', training: 1500, membership: 350, license: 'Vid behov', total: 1850 },
  { group: 'Grupp E', training: 1500, membership: 350, license: 'Vid behov', total: 1850 },
  { group: 'Grupp D', training: 1700, membership: 350, license: 'Vid behov', total: 2050 },
  { group: 'Grupp C', training: 1700, membership: 350, license: 'Vid behov', total: 2050 },
  { group: 'Grupp B', training: 2000, membership: 350, license: 'Vid behov', total: 2350 },
  { group: 'Grupp A', training: 2250, membership: 350, license: 'A-licens ingår', total: 3350 },
  {
    group: 'Utvecklingsgrupp',
    training: 500,
    membership: '—',
    license: '—',
    total: 500,
    addon: true,
  },
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
    label: 'Kontakt',
    value: 'Kontaktformulär',
    href: '/form/kontakt',
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
    value: 'Stadgar 2024 (PDF)',
    href: '/stadgar/KBTK-stadgar-2024.pdf',
  },
];

const checkinScheduleEmbedUrl = `${checkinBaseUrl}/schema/embed`;

const visitorPaths = [
  {
    title: 'Börja spela',
    text: 'Provträning och väg in i klubben.',
    href: '#borja-spela',
    cta: 'Kom igång',
  },
  {
    title: 'Träningstider',
    text: 'När varje grupp tränar i hallen.',
    href: '#traning',
    cta: 'Se schema',
  },
  {
    title: 'Tävling',
    text: 'Serier, licens och anmälan.',
    href: '#serier',
    cta: 'Till tävling',
  },
  {
    title: 'Avgifter',
    text: 'Medlemsavgift, träning och Swish.',
    href: '#avgifter',
    cta: 'Se priser',
  },
];

const paraFocusAreas = [
  {
    title: 'Rekrytering',
    text: 'Vi skapar vägar in så fler med funktionsnedsättning kan hitta till pingisen och känna sig välkomna från första stunden.',
  },
  {
    title: 'Utveckling',
    text: 'Varje individ ska få rätt stöd, träning och möjligheter att växa — i sin egen takt och utifrån sina förutsättningar.',
  },
  {
    title: 'Långsiktig hållbarhet',
    text: 'Med tydliga strukturer, rutiner och verktyg underlättar vi för spelare, föräldrar och ledare över tid.',
  },
];

const faqs = FAQ_ENTRIES.map((entry) => ({
  question: entry.question,
  answer: entry.answer,
  link: entry.link,
}));

const clubLogo = '/kbtk-logo.png';

function HomePage() {
  const [aktuelltItems, setAktuelltItems] = useState<AktuelltItem[]>(defaultAktuelltItems);
  const [competitions, setCompetitions] = useState<PublicCompetitionSummary[]>([]);
  const [competitionsError, setCompetitionsError] = useState('');
  const [signupGroups, setSignupGroups] = useState<PublicSignupGroup[]>([]);
  const [youthCompetitions, setYouthCompetitions] = useState<YouthOpenCompetition[]>([]);
  const hasOpenCompetitions = competitions.length > 0 || youthCompetitions.length > 0;

  useEffect(() => {
    void fetchPublicSignupGroups().then(setSignupGroups);
  }, []);

  useEffect(() => {
    void fetchYouthOpenCompetitions().then(setYouthCompetitions);
  }, []);

  useEffect(() => {
    void fetchAktuelltHomepage()
      .then((items) => {
        if (items.length > 0) setAktuelltItems(items);
      })
      .catch(() => {
        // Keep default teaser if check-in is unavailable.
      });
  }, []);

  useEffect(() => {
    void fetchPublishedCompetitions()
      .then(setCompetitions)
      .catch((err) =>
        setCompetitionsError(err instanceof Error ? err.message : 'Kunde inte ladda tävlingar.'),
      );
  }, []);

  return (
      <main id="top">
        <section className="section path-section" aria-labelledby="paths-title">
          <div className="section-heading">
            <h2 className="path-heading" id="paths-title">
              Hitta rätt snabbt
            </h2>
            <p>Fyra genvägar till det viktigaste.</p>
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
              Välkommen till KBTK — en förening för alla. Här tränar barn, ungdomar,
              vuxna, motionärer och para-utövare i KBTK-hallen med fokus på spelglädje,
              trygghet och laganda.
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

          <aside className="hero-card" aria-label="Aktuellt">
            <img
              className="club-logo-card"
              src={clubLogo}
              alt=""
            />
            <span className="card-label hero-card-label">Aktuellt</span>
            <div className="hero-card-content">
            {aktuelltItems.length === 0 ? (
              <p className="aktuellt-empty">
                Inget aktuellt just nu. Hör av dig till klubben om du har frågor.
              </p>
            ) : (
              <div className="aktuellt-list">
                {aktuelltItems.map((item) => {
                  const href = item.slug ? newsArticlePath(item.slug) : undefined;
                  return (
                    <article className="aktuellt-item" key={item.slug ?? item.title}>
                      <h3>{href ? <a href={href}>{item.title}</a> : item.title}</h3>
                      <p>{item.text}</p>
                      {href ? (
                        <a href={href}>Läs mer</a>
                      ) : item.link ? (
                        <a href={item.link.href}>{item.link.label}</a>
                      ) : null}
                    </article>
                  );
                })}
                <a className="text-link" href="/nyheter">
                  Alla nyheter
                </a>
              </div>
            )}
            </div>
          </aside>
        </section>

        <section className="section split" id="borja-spela">
          <div>
            <p className="eyebrow">Börja spela</p>
            <h2>Prova på eller bli medlem.</h2>
            <p>
              Ny i klubben? Välj gruppkategori, kom till en träning och se tiderna under{" "}
              <a href="#traning">Träningstider</a>. Vill du fortsätta swishar du medlems- och
              träningsavgiften — då registreras du som medlem. All information finns på hemsidan,
              se <a href="#avgifter">Avgifter</a> och <a href="#incheckning">check-in</a>.
            </p>
            <p>
              Vi är en förening för alla. Läs mer om vårt arbete som pilotförening för{' '}
              <a href="#para">ParaPingis 360</a>.
            </p>
            <div className="quick-links">
              <a href="/form/borja-spela">Anmäl intresse</a>
            </div>
          </div>

          <div className="panel">
            <h3>Gruppkategorier</h3>
            <ul className="check-list">
              {signupGroups.map((category) => (
                <li key={category.name}>
                  <strong>{category.name}</strong>
                  {category.description ? (
                    <p className="check-list-desc">{category.description}</p>
                  ) : null}
                  {category.info ? (
                    <p className="check-list-info">{category.info}</p>
                  ) : null}
                </li>
              ))}
            </ul>
            <a className="text-link" href="/form/borja-spela">
              Anmäl intresse via formulär
            </a>
          </div>
        </section>

        <section className="section split" id="para" aria-labelledby="para-title">
          <div>
            <p className="eyebrow">ParaPingis 360</p>
            <h2 id="para-title">Pilotförening för ParaPingis 360</h2>
            <p>
              Kungälvs BTK är stolta över att vara pilotförening för{' '}
              <strong>ParaPingis 360</strong>. Vi är en förening för alla, och en av våra
              prioriterade målgrupper är spelare med funktionsnedsättning. Genom projektet
              tar vi ett helhetsgrepp kring rekrytering, utveckling och långsiktig
              hållbarhet.
            </p>
            <p>
              Vårt mål är att skapa rätt förutsättningar och ge varje individ de
              möjligheter som behövs för att kunna delta, utvecklas och trivas i vår
              verksamhet. För att para-utövare ska ha samma möjligheter till ett aktivt
              idrottsliv arbetar vi aktivt med samarbeten.
            </p>
            <p>
              Vi samarbetar nära med SBTF och andra aktörer i vår närhet för att testa och
              utveckla våra arbetssätt — så att vi kan behålla och utveckla våra
              para-utövare. Tillsammans skapar vi tydliga strukturer, rutiner och verktyg
              som underlättar för både spelare, föräldrar och ledare. Allt detta ser vi
              som en självklarhet.
            </p>
            <div className="quick-links">
              <a href="/form/borja-spela">Anmäl intresse</a>
              <a href="/form/kontakt">Kontakta klubben</a>
            </div>
          </div>

          <div className="panel para-panel">
            <h3>Vårt helhetsgrepp</h3>
            <ul className="para-focus-list">
              {paraFocusAreas.map((area) => (
                <li key={area.title}>
                  <strong>{area.title}</strong>
                  <p>{area.text}</p>
                </li>
              ))}
            </ul>
            <p className="para-panel-note">
              Som pilotförening för ParaPingis 360 utvecklar vi arbetssätt som fler
              föreningar kan ha nytta av. Vill du veta mer eller komma igång? Hör av dig
              så hjälper vi dig vidare.
            </p>
          </div>
        </section>

        <section className="section schedule-section" id="traning">
          <div className="section-heading">
            <p className="eyebrow">Träning</p>
            <h2>Träningstider</h2>
            <p>
              Här visas klubbens aktuella träningstider per grupp. Schemat
              uppdateras automatiskt när klubben gör ändringar i check-in-systemet.
            </p>
          </div>

          <div className="schedule-embed">
            <iframe
              src={checkinScheduleEmbedUrl}
              title="KBTK träningsschema"
              loading="lazy"
            />
          </div>
        </section>

        <section className="section split" id="incheckning">
          <div>
            <p className="eyebrow">Incheckning</p>
            <h2>Check-in i hallen — varför och hur</h2>
            <p>
              KBTK använder ett enkelt check-in-system i hallen. När du betalat
              medlems- och träningsavgift registrerar klubben dig och du får ett
              personlig inchecknings-tagg som du använder vid varje träning.
            </p>
            <p>
              Incheckningen hjälper oss att veta vem som är på plats, planera träningen
              bättre och följa närvaro. Uppgifterna ligger också till grund för
              närvarorapportering mot Riksidrottförbundet (LOK). Träningsschemat ovan
              hämtas från samma system.
            </p>

            <p>
              Föräldrar som själva behöver kunna öppna dörren utanför barnets träning
              ansöker separat om <a href="/form/doraccess">dörraccess</a> — det är
              inte samma sak som medlemmens inchecknings-tagg.
            </p>
          </div>

          <div className="panel">
            <h3>Så kommer du igång</h3>
            <ol className="checkin-steps">
              <li>Provträna och anmäl intresse via formuläret.</li>
              <li>Swisha medlems- och träningsavgiften inom en vecka om du vill fortsätta.</li>
              <li>Klubben registrerar dig och kopplar din inchecknings-tagg.</li>
              <li>Vid träning håller du taggen mot läsaren vid ingången — klart!</li>
            </ol>
            <p className="checkin-note">
              Inchecknings-taggen delas ut vid nästkommande träningstillfälle efter att du betalat.
            </p>
            <div className="quick-links">
              <a href="/form/borja-spela">Anmäl intresse</a>
              <a href="/form/doraccess">Dörraccess för föräldrar</a>
            </div>
          </div>
        </section>

        <section className="section split reverse" id="serier">
          <div className="panel-stack">
            <div className="panel dark-panel">
              <h3>Seriestatus</h3>
              <div className="link-grid">
                {series.map((item) => (
                  <a key={item.name} href={item.href} rel="noreferrer" target="_blank">
                    {item.name}
                  </a>
                ))}
              </div>
            </div>

            <div className="panel dark-panel">
              <h3>Aktuella tävlingar</h3>
              {hasOpenCompetitions ? (
                <div className="link-grid competition-status-grid">
                  {youthCompetitions.map((item) => (
                    <a key={item.id} href="/form/tavling#ungdomstavlingar">
                      <span className="competition-status-title">{item.title}</span>
                      <span className="competition-status-meta">
                        Egen anmälan
                        {formatYouthCompetitionDate(item.date)
                          ? ` · ${formatYouthCompetitionDate(item.date)}`
                          : ''}
                      </span>
                    </a>
                  ))}
                  {competitions.map((item) => (
                    <a key={item.slug} href={`/form/tavling/${item.slug}`}>
                      <span className="competition-status-title">{item.title}</span>
                      <span className="competition-status-meta">
                        {item.registration_count} anmäld
                        {item.registration_count === 1 ? '' : 'a'}
                        {formatCompetitionDate(item.event_date)
                          ? ` · ${formatCompetitionDate(item.event_date)}`
                          : ''}
                      </span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="panel-empty-copy">
                  {competitionsError || 'Inga öppna tävlingar just nu.'}
                </p>
              )}
              <a className="panel-inline-link" href="/form/tavling">
                Till tävlingsanmälan
              </a>
            </div>
          </div>

          <div>
            <p className="eyebrow">Tävling</p>
            <h2>Serier, licens och tävlingsanmälan</h2>
            <p>
              Följ serieläget för klubbens lag, se kommande tävlingar i kalendern och anmäl licens
              eller tävling via formulären. Från säsongen 2026–2027 gäller A-licens för nationell
              tävling/serie och B-licens för distriktsnivå (D-licensen är borttagen).
            </p>
            <div className="quick-links">
              <a href="/ranking">Ranking</a>
              <a href="/form/tavling#tavlingskalender">Tävlingskalender</a>
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
                <a href="/stadgar/KBTK-stadgar-2024.pdf" target="_blank" rel="noreferrer">
                  Stadgar 2024
                </a>
                <a href="/klubbkop">Klubbköp</a>
                <a href="#sponsorer">Våra sponsorer</a>
                <a href="#para">ParaPingis 360</a>
                <a href="#incheckning">Check-in i hallen</a>
                <a href="#kontakt">Kontakta klubben</a>
                <a href="/form/doraccess">Dörraccess</a>
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

          <p className="fee-season-label">Säsong 2026–2027</p>

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
                  <tr key={row.group} className={row.addon ? 'fee-table-addon' : undefined}>
                    <th scope="row">{row.group}</th>
                    <td>{row.training.toLocaleString('sv-SE')} kr</td>
                    <td>
                      {typeof row.membership === 'number'
                        ? `${row.membership.toLocaleString('sv-SE')} kr`
                        : row.membership}
                    </td>
                    <td>{row.license}</td>
                    <td>
                      {row.total.toLocaleString('sv-SE')} kr
                      {row.addon ? ' (tillägg)' : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="fee-footnote">
            Börjar man på vårsäsongen kan träningsavgiften halveras i pingisskolan. Grupper
            startar i regel på hösten. Utvecklingsgrupp är ett tillägg utöver den ordinarie grupp
            du tillhör — medlemsavgift betalas som vanligt via huvudgruppen.
          </p>

          <div className="fee-grid">
            <article className="fee-card">
              <h3>Utvecklingsgrupp</h3>
              <p>
                Extra träningsgrupp utöver din ordinarie grupp:{' '}
                <strong>500 kr/säsong</strong> (sept–maj). Tillkommer utöver avgiften för den grupp
                du redan tillhör.
              </p>
            </article>

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
                Gäller 15 maj–15 augusti: träning 2 gånger per vecka,{' '}
                <strong>500 kr</strong> för alla medlemmar.
              </p>
            </article>

            <article className="fee-card">
              <h3>Tävlingsavgift</h3>
              <p>
                Swisha tävlingsavgiften till klubben innan du skickar in anmälan. Formuläret
                visar vilket belopp och meddelande du ska använda.
              </p>
              <a className="text-link" href="/form/tavling">
                Till tävlingsanmälan
              </a>
            </article>

            <article className="fee-card featured">
              <h3>Betalning med Swish</h3>
              <div className="info-box">
                <strong>Swish:</strong> 123 260 3272
                <span>Skriv namn och grupp i meddelandet.</span>
              </div>
              <p>
                <strong>Medlemsavgift:</strong> 350 kr/säsong
                <br />
                <strong>Träningsavgift:</strong> 1 300–2 250 kr/säsong beroende på grupp (se tabellen
                ovan)
              </p>
              <p>
                <strong>Bankgiro:</strong> 479-3915
                <br />
                <strong>Friskvårdsbidrag:</strong> via Epassi
              </p>
              <p>
                Efter provträning: swisha medlems- och träningsavgiften senast inom en vecka om du
                vill fortsätta — då registreras du som medlem. Vill du inte fortsätta, hör av dig till
                klubben inom en vecka.
              </p>
              <a className="text-link" href="#incheckning">
                Läs om check-in i hallen
              </a>
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
              dig till klubben så hjälper vi dig vidare.
            </p>
          </div>
          <div className="contact-card">
            <p className="contact-lead">
              Det enklaste sättet att nå oss är via kontaktformuläret.
            </p>
            <a className="button primary contact-form-link" href="/form/kontakt">
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
