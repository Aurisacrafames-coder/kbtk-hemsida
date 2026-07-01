import { useEffect, useState } from 'react';
import HomePage from './HomePage';
import { FormPage } from './FormPage';
import { CompetitionListPage, CompetitionSignupPage } from './CompetitionForms';
import { FaqBot } from './FaqBot';
import { getFormRouteFromPath } from './lib/forms';

function readPathname() {
  return window.location.pathname;
}

export default function App() {
  const [pathname, setPathname] = useState(readPathname);

  useEffect(() => {
    const onNavigate = () => setPathname(readPathname());
    window.addEventListener('popstate', onNavigate);
    return () => window.removeEventListener('popstate', onNavigate);
  }, []);

  const formRoute = getFormRouteFromPath(pathname);
  const showMainNav = !formRoute;

  return (
    <>
      <header className="site-header">
        <a className="brand" href="/" aria-label="Till startsidan">
          <img className="brand-logo" src="/kbtk-logo.png" alt="Kungälvs Bordtennisklubb" />
          <span>
            <strong>Kungälvs BTK</strong>
            <small>Vi älskar pingis</small>
          </span>
        </a>

        {showMainNav ? (
          <nav className="main-nav" aria-label="Huvudmeny">
            <a href="/">Hem</a>
            <a href="/#borja-spela">Börja spela</a>
            <a href="/#traning">Träningstider</a>
            <a href="/form/kontakt">Kontakt</a>
          </nav>
        ) : null}
      </header>
      {formRoute?.kind === 'competition-list' ? <CompetitionListPage /> : null}
      {formRoute?.kind === 'competition' ? (
        <CompetitionSignupPage slug={formRoute.slug} />
      ) : null}
      {formRoute?.kind === 'form' ? <FormPage slug={formRoute.slug} /> : null}
      {!formRoute ? <HomePage /> : null}
      <footer className="site-footer">
        <span>Kungälvs Bordtennisklubb</span>
        <span>Vi älskar pingis</span>
      </footer>
      <FaqBot />
    </>
  );
}
