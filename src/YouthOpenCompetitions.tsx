import {
  formatYouthCompetitionDate,
  getUpcomingYouthOpenCompetitions,
} from './lib/youth-open-competitions';

export function YouthOpenCompetitions() {
  const competitions = getUpcomingYouthOpenCompetitions();

  if (competitions.length === 0) {
    return null;
  }

  return (
    <section
      className="section youth-open-section"
      id="ungdomstavlingar"
      aria-labelledby="youth-open-heading"
    >
      <div className="section-heading">
        <p className="eyebrow">Ungdomstävlingar</p>
        <h2 id="youth-open-heading">Anmäl dig själv</h2>
        <p>
          Här listas tävlingar som riktar sig till ungdomar och där anmälan görs direkt av
          spelaren/vårdnadshavaren — inte via klubbens vanliga tävlingsanmälan. Avgift betalas
          enligt respektive inbjudan.
        </p>
      </div>

      <div className="youth-open-grid">
        {competitions.map((item) => (
          <article key={item.id} className="youth-open-card">
            <div className="youth-open-card-top">
              <span className="youth-open-badge">Egen anmälan</span>
              <time dateTime={item.date}>{formatYouthCompetitionDate(item.date)}</time>
            </div>
            <h3>{item.title}</h3>
            <p className="youth-open-audience">{item.audience}</p>
            <p>{item.summary}</p>
            <ul className="youth-open-meta">
              <li>
                <strong>Plats:</strong> {item.place}
              </li>
              <li>
                <strong>Avgift:</strong> {item.feeNote}
              </li>
              <li>
                <strong>Anmälan:</strong> {item.deadlineNote}
              </li>
            </ul>
            <ul className="youth-open-highlights">
              {item.highlights.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <div className="youth-open-actions">
              <a
                className="button primary"
                href={item.signupUrl}
                rel="noreferrer"
                target="_blank"
              >
                Anmäl dig här
              </a>
              <a className="text-link" href={item.invitationPdf} rel="noreferrer" target="_blank">
                Läs inbjudan (PDF)
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
