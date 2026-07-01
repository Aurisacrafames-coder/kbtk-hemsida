import { useEffect, useState } from 'react';
import HomePage from './HomePage';
import { FormPage } from './FormPage';
import { getFormSlugFromPath } from './lib/forms';

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

  const formSlug = getFormSlugFromPath(pathname);

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

        {!formSlug ? (
          <nav className="main-nav" aria-label="Huvudmeny">
            <a href="/">Hem</a>
            <a href="/#borja-spela">Börja spela</a>
            <a href="/#traning">Träningstider</a>
            <a href="/#fragor">FAQ</a>
            <a href="/form/kontakt">Kontakt</a>
          </nav>
        ) : null}
      </header>
      {formSlug ? <FormPage slug={formSlug} /> : <HomePage />}
      <footer className="site-footer">
        <span>Kungälvs Bordtennisklubb</span>
        <span>Vi älskar pingis</span>
      </footer>
    </>
  );
}
