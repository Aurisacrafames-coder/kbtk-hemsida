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
      'Klubben försöker matcha spelare efter ålder, nivå, gruppstorlek och kompisar. Börja med en provträning så hjälper vi er rätt.',
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
      'Medlemsavgiften är 350 kr per säsong. Träningsavgiften varierar per grupp (1 000–1 800 kr för höst/vår). Betala via Swish 123 260 3272.',
    keywords: ['avgift', 'kostnad', 'pris', 'swish', 'betala', 'pengar', 'medlemsavgift'],
    link: { label: 'Se alla avgifter', href: '#avgifter' },
  },
  {
    id: 'door-access',
    question: 'Hur får jag access till hallen?',
    answer:
      'Ansök om dörraccess via formuläret på hemsidan, eller hör av dig till klubben om du är osäker.',
    keywords: ['dörr', 'access', 'kod', 'lås', 'hallen', 'öppna'],
    link: { label: 'Ansök om dörraccess', href: '/form/doraccess' },
  },
  {
    id: 'competition',
    question: 'Hur anmäler jag mig till tävling?',
    answer:
      'Under Tävling finns länkar för licensanmälan, tävlingsanmälan och seriestatus. Där hittar du rätt väg vidare.',
    keywords: ['tävling', 'licens', 'serie', 'anmälan', 'profixio'],
    link: { label: 'Till tävling', href: '#serier' },
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
];

export const FAQ_STARTER_QUESTIONS = [
  'När tränar min grupp?',
  'Vad kostar det?',
  'Hur anmäler jag provträning?',
  'Hur får jag dörraccess?',
];
