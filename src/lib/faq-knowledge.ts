export type FaqLink = {
  label: string;
  href: string;
};

export type FaqEntry = {
  id: string;
  question: string;
  answer: string;
  keywords?: string[];
  link?: FaqLink;
};

export const FAQ_ENTRIES: FaqEntry[] = [
  {
    id: 'news',
    question: 'Var hittar jag klubbens nyheter?',
    answer:
      'Aktuella nyheter syns på startsidan. Alla nyheter, även äldre, finns under Nyheter. Klicka på en rubrik för att läsa hela texten.',
    keywords: ['nyhet', 'nyheter', 'aktuellt', 'info', 'information'],
    link: { label: 'Alla nyheter', href: '/nyheter' },
  },
  {
    id: 'training-times',
    question: 'När tränar min grupp?',
    answer: 'Titta i schemat under Träningstider — där ser du när varje grupp tränar.',
    keywords: ['schema', 'träning', 'tid', 'grupp', 'pass', 'hall'],
    link: { label: 'Se träningstider', href: '#traning' },
  },
  {
    id: 'group-fit',
    question: 'Vilken grupp passar mitt barn?',
    answer:
      'Välj den gruppkategori som passar ålder och nivå under Börja spela, och kom till en träning. Tiderna finns under Träningstider.',
    keywords: ['barn', 'ungdom', 'nybörjare', 'nivå', 'ålder'],
    link: { label: 'Anmäl intresse', href: '/form/borja-spela' },
  },
  {
    id: 'trial-signup',
    question: 'Hur anmäler jag mig till provträning?',
    answer:
      'Använd formuläret under Börja spela med namn, ålder, kontaktuppgifter och eventuell tidigare erfarenhet.',
    keywords: ['prov', 'prova', 'börja', 'anmälan', 'ny medlem', 'intresse'],
    link: { label: 'Anmäl intresse', href: '/form/borja-spela' },
  },
  {
    id: 'fees',
    question: 'Vad kostar det och hur betalar jag?',
    answer:
      'Medlemsavgiften är 350 kr per säsong. Träningsavgiften varierar per grupp (1 300–2 250 kr för höst/vår). Betala via Swish 123 260 3272. När avgiften är betald registrerar klubben dig som medlem.',
    keywords: ['avgift', 'kostnad', 'pris', 'swish', 'betala', 'pengar', 'medlemsavgift'],
    link: { label: 'Se alla avgifter', href: '#avgifter' },
  },
  {
    id: 'checkin',
    question: 'Hur fungerar incheckning i hallen?',
    answer:
      'Medlemmar checkar in med en personlig inchecknings-tagg vid läsaren i hallen. Taggen kopplas till dig när du är registrerad och har betalat avgiften. Incheckningen hjälper klubben följa närvaro och ligger till grund för LOK-registrering.',
    keywords: ['incheckning', 'check-in', 'tagg', 'inchecknings-tagg', 'rfid', 'kiosk', 'närvaro', 'läsare', 'lok'],
    link: { label: 'Läs om check-in', href: '#incheckning' },
  },
  {
    id: 'door-access',
    question: 'Hur får jag access till hallen?',
    answer:
      'Medlemmar använder inchecknings-tagg vid träning. Föräldrar som behöver kunna öppna dörren själva (t.ex. under fria tider med barnet) kan ansöka om dörraccess via formuläret.',
    keywords: ['dörr', 'access', 'kod', 'lås', 'hallen', 'öppna', 'förälder'],
    link: { label: 'Ansök om dörraccess', href: '/form/doraccess' },
  },
  {
    id: 'license',
    question: 'Vilken licens behöver jag för tävling och serie?',
    answer:
      'Från säsongen 2026–2027 finns A-licens och B-licens (D-licensen är borttagen). A-licens krävs för nationella tävlingar, Sweden Tour, SM, nationellt seriespel och distriktsserier i seriepyramiden. B-licens räcker till distriktstävlingar och lokala tourer (även utanför eget distrikt), ungdoms-/veteran-/pensionärsserier på distriktsnivå och vissa riktade klasser. Med B-licens får man prova en nationell tävling en gång och högst en seriehelg per säsong. Ålder: barn född 2015 eller senare, ungdom 2006–2014, vuxen 1963–2005, pensionär född 1962 eller tidigare. Anmäl licens via formuläret.',
    keywords: [
      'licens',
      'a-licens',
      'b-licens',
      'd-licens',
      'tävlingslicens',
      'serie',
      'sweden tour',
      'sm',
      'avgift',
      'barn',
      'ungdom',
      'pensionär',
    ],
    link: { label: 'Till licensanmälan', href: '/form/licens' },
  },
  {
    id: 'ranking',
    question: 'Vilken ranking har jag?',
    answer:
      'Rankinglistan finns i Profixio och uppdateras normalt första måndagen varje månad. Barn under 12 år har ofta ingen ranking — titta då på klubbens spelklarlista och läs av max. Välj alltid rätt säsong. Saknar du licens syns du oftast inte i aktuell lista; kolla då föregående säsong. Har du aldrig tävlat brukar man kunna spela i klasser kring rankingtal 400 (kontrollera alltid inbjudan).',
    keywords: [
      'ranking',
      'rank',
      'profixio',
      'spelklarlista',
      'spelklar',
      'max',
      'barn',
      'under 12',
      'säsong',
      '400',
      'klass',
    ],
    link: { label: 'Läs mer om ranking', href: '/ranking' },
  },
  {
    id: 'competition',
    question: 'Hur anmäler jag mig till tävling?',
    answer:
      'Under Tävling finns länkar för licensanmälan, tävlingsanmälan och seriestatus. Under Tävlingsanmälan finns även tävlingskalendern med kommande tävlingar. Anmäl dig via tävlingsanmälan när klubben öppnar anmälan. Vissa ungdomstävlingar (till exempel Lilla GBG-Smashen) har egen extern anmälan och ligger under Tävlingsanmälan. Kom ihåg att du behöver rätt licens (A eller B) beroende på tävlingstyp.',
    keywords: ['tävling', 'licens', 'serie', 'anmälan', 'profixio', 'kalender', 'ungdom', 'smashen'],
    link: { label: 'Till tävlingsanmälan', href: '/form/tavling' },
  },
  {
    id: 'contact',
    question: 'Hur kontaktar jag klubben?',
    answer:
      'Det enklaste sättet är kontaktformuläret på hemsidan. Där når du styrelsen med frågor om träning, medlemskap eller hallen.',
    keywords: ['kontakt', 'mail', 'e-post', 'fråga', 'styrelsen', 'klubben'],
    link: { label: 'Kontaktformulär', href: '/form/kontakt' },
  },
  {
    id: 'hall-booking',
    question: 'Kan jag boka hallen?',
    answer:
      'Ja, för bordtennisfest när ingen träning eller match är inplanerad. Skicka en förfrågan via formuläret. Priser (fre/lör 16–20): medlemmar 500 kr för ungdomsfest eller färre än 5 vuxna, annars 100 kr/person; ej medlemmar 800 kr respektive 160 kr/person (minst en medlem måste vara närvarande). Swisha efter beviljande och lämna hallen i samma skick.',
    keywords: [
      'boka',
      'bokning',
      'hyra',
      'hall',
      'pingisfest',
      'fest',
      'pris',
      'swish',
      'fredag',
      'lördag',
      'söndag',
    ],
    link: { label: 'Boka hallen', href: '/form/boka-hall' },
  },
  {
    id: 'para',
    question: 'Finns det plats för spelare med funktionsnedsättning?',
    answer:
      'Ja. Kungälvs BTK är pilotförening för ParaPingis 360 och arbetar aktivt med rekrytering, utveckling och långsiktig hållbarhet för spelare med funktionsnedsättning. Vi samarbetar med SBTF och andra aktörer för att skapa rätt förutsättningar för spelare, föräldrar och ledare.',
    keywords: [
      'para',
      'parapingis',
      'parapingis 360',
      'pilotförening',
      'funktionsnedsättning',
      'funktionsvariation',
      'inkludering',
      'tillgänglighet',
      'sbtf',
      'parabordtennis',
    ],
    link: { label: 'Läs om ParaPingis 360', href: '#para' },
  },
];

export const FAQ_STARTER_QUESTIONS = [
  'När tränar min grupp?',
  'Vad kostar det?',
  'Hur fungerar incheckning?',
  'Hur anmäler jag provträning?',
];
