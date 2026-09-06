import {
  CLUB_NAME_IN_PROFIXIO,
  RANKING_LIST_URL,
  SPELKARLISTA_URL,
  TYPICAL_STARTING_RANKING,
} from './lib/ranking';

export default function RankingPage() {
  return (
    <main className="section form-page ranking-page">
      <a className="text-link form-back" href="/#serier">
        Tillbaka till Tävling
      </a>

      <div className="section-heading">
        <p className="eyebrow">Tävling</p>
        <h1>Ranking</h1>
        <p>
          Så hittar du din ranking (eller max för yngre spelare) i Profixio — och vad som gäller
          om du saknar licens eller aldrig har tävlat.
        </p>
      </div>

      <section className="panel ranking-panel">
        <h2>Var finns rankingen?</h2>
        <p>
          Den nationella rankinglistan ligger i Profixio och uppdateras normalt{' '}
          <strong>första måndagen varje månad</strong>.
        </p>
        <p>
          <a className="button primary" href={RANKING_LIST_URL} rel="noreferrer" target="_blank">
            Öppna rankinglistan
          </a>
        </p>
        <p className="form-hint">
          Länk:{' '}
          <a href={RANKING_LIST_URL} rel="noreferrer" target="_blank">
            {RANKING_LIST_URL}
          </a>
        </p>
      </section>

      <section className="panel ranking-panel">
        <h2>Barn under 12 år (utan ranking)</h2>
        <p>
          Spelare under 12 år har ofta ingen ranking i den vanliga listan. Då tittar du i stället på
          klubbens <strong>spelklarlista</strong> i Profixio och ser aktuellt <strong>max</strong>{' '}
          för spelaren.
        </p>
        <ol className="ranking-steps">
          <li>
            Öppna{' '}
            <a href={SPELKARLISTA_URL} rel="noreferrer" target="_blank">
              spelklarlistan / licensöversikten
            </a>
            .
          </li>
          <li>
            Välj klubben <strong>{CLUB_NAME_IN_PROFIXIO}</strong>.
          </li>
          <li>
            Se till att <strong>rätt säsong</strong> är markerad (t.ex. innevarande licensår).
          </li>
          <li>Hitta spelaren och läs av max-värdet.</li>
        </ol>
        <p>
          <a className="button secondary" href={SPELKARLISTA_URL} rel="noreferrer" target="_blank">
            Öppna spelklarlistan
          </a>
        </p>
      </section>

      <section className="panel ranking-panel">
        <h2>Saknar du licens?</h2>
        <p>
          Utan giltig licens för aktuell säsong syns du normalt inte i listorna. Byt då till{' '}
          <strong>föregående säsong</strong> i Profixio för att se senaste ranking/max, eller anmäl
          ny licens via klubben.
        </p>
        <p>
          <a className="text-link" href="/form/licens">
            Till licensanmälan
          </a>
        </p>
      </section>

      <section className="panel ranking-panel">
        <h2>Aldrig tävlat?</h2>
        <p>
          Har du aldrig tävlat brukar man kunna spela i klasser kring rankingtal{' '}
          <strong>{TYPICAL_STARTING_RANKING}</strong>. Kontrollera alltid inbjudan till respektive
          tävling — klassindelning och gränser kan skilja sig.
        </p>
      </section>
    </main>
  );
}
