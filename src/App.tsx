import { useEffect, useState } from 'react';
import HomePage from './HomePage';
import ClubShopPage from './ClubShopPage';
import RankingPage from './RankingPage';
import NewsListPage from './NewsListPage';
import NewsArticlePage from './NewsArticlePage';
import { FormPage } from './FormPage';
import { CompetitionListPage, CompetitionSignupPage } from './CompetitionForms';
import { FaqBot } from './FaqBot';
import { HallTodayBar } from './HallTodayBar';
import { getFormRouteFromPath } from './lib/forms';

function readPathname() {
  return window.location.pathname;
}

function getNewsRoute(pathname: string): { kind: 'list' } | { kind: 'article'; slug: string } | null {
  const path = pathname.replace(/\/$/, '') || '/';
  if (path === '/nyheter') return { kind: 'list' };
  const match = /^\/nyhet\/([^/]+)$/.exec(path);
  if (match?.[1]) {
    return { kind: 'article', slug: decodeURIComponent(match[1]) };
  }
  return null;
}

function getStaticPage(pathname: string): 'klubbkop' | 'ranking' | null {
  const path = pathname.replace(/\/$/, '') || '/';
  if (path === '/klubbkop') return 'klubbkop';
  if (path === '/ranking') return 'ranking';
  return null;
}

export default function App() {
  const [pathname, setPathname] = useState(readPathname);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const onNavigate = () => {
      setPathname(readPathname());
      setNavOpen(false);
    };
    window.addEventListener('popstate', onNavigate);
    return () => window.removeEventListener('popstate', onNavigate);
  }, []);

  const formRoute = getFormRouteFromPath(pathname);
  const staticPage = getStaticPage(pathname);
  const newsRoute = getNewsRoute(pathname);
  const showMainNav = !formRoute && !staticPage && !newsRoute;

  function closeNav() {
    setNavOpen(false);
  }

  return (
    <>
      <header className={`site-header${navOpen ? ' site-header-nav-open' : ''}`}>
        <div className="site-header-top">
          <a className="brand" href="/" aria-label="Till startsidan">
            <img className="brand-logo" src="/kbtk-logo.png" alt="Kungälvs Bordtennisklubb" />
            <span>
              <strong>Kungälvs BTK</strong>
              <small>Vi älskar pingis</small>
            </span>
          </a>

          {showMainNav ? (
            <button
              type="button"
              className="nav-toggle"
              aria-expanded={navOpen}
              aria-controls="main-nav"
              onClick={() => setNavOpen((open) => !open)}
            >
              {navOpen ? 'Stäng' : 'Meny'}
            </button>
          ) : null}
        </div>

        {showMainNav ? <HallTodayBar /> : null}

        {showMainNav ? (
          <nav
            id="main-nav"
            className={`main-nav${navOpen ? ' is-open' : ''}`}
            aria-label="Huvudmeny"
          >
            <a href="/" onClick={closeNav}>
              Hem
            </a>
            <a href="/nyheter" onClick={closeNav}>
              Nyheter
            </a>
            <a href="/#borja-spela" onClick={closeNav}>
              Börja spela
            </a>
            <a href="/#para" onClick={closeNav}>
              ParaPingis 360
            </a>
            <a href="/#traning" onClick={closeNav}>
              Träningstider
            </a>
            <a href="/klubbkop" onClick={closeNav}>
              Klubbköp
            </a>
            <a href="/form/kontakt" onClick={closeNav}>
              Kontakt
            </a>
          </nav>
        ) : null}
      </header>
      {formRoute?.kind === 'competition-list' ? <CompetitionListPage /> : null}
      {formRoute?.kind === 'competition' ? (
        <CompetitionSignupPage slug={formRoute.slug} />
      ) : null}
      {formRoute?.kind === 'form' ? <FormPage slug={formRoute.slug} /> : null}
      {staticPage === 'klubbkop' ? <ClubShopPage /> : null}
      {staticPage === 'ranking' ? <RankingPage /> : null}
      {newsRoute?.kind === 'list' ? <NewsListPage /> : null}
      {newsRoute?.kind === 'article' ? <NewsArticlePage slug={newsRoute.slug} /> : null}
      {!formRoute && !staticPage && !newsRoute ? <HomePage /> : null}
      <footer className="site-footer">
        <span>Kungälvs Bordtennisklubb</span>
        <span>Vi älskar pingis</span>
      </footer>
      <FaqBot />
    </>
  );
}
