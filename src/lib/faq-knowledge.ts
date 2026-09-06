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
      'Medlemsavgiften är 350 kr per säsong. Träningsavgiften varierar per grupp (1 300–2 250 kr för höst/vår). Betala via Swish 123 260 3272. När avgiften är betald registrerar klubben dig och du får en inchecknings-tagg i hallen.',
    keywords: ['avgift', 'kostnad', 'pris', 'swish', 'betala', 'pengar', 'medlemsavgift', 'tagg', 'inchecknings-tagg'],
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
    id: 'competition',
    question: 'Hur anmäler jag mig till tävling?',
    answer:
      'Under Tävling finns länkar för licensanmälan, tävlingsanmälan och seriestatus. Under Tävlingsanmälan finns även tävlingskalendern med kommande tävlingar. Anmäl dig via tävlingsanmälan när klubben öppnar anmälan. Vissa ungdomstävlingar (till exempel Lilla GBG-Smashen) har egen extern anmälan och ligger under Tävlingsanmälan.',
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
      'Ja, medlemmar och externa kan ansöka om att boka KBTK-hallen via formuläret på hemsidan.',
    keywords: ['boka', 'bokning', 'hyra', 'hall', 'fredag', 'lördag'],
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
