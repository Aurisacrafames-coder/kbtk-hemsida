import { FAQ_ENTRIES, type FaqEntry } from './faq-knowledge';

const STOP_WORDS = new Set([
  'och',
  'att',
  'som',
  'för',
  'med',
  'jag',
  'det',
  'hur',
  'kan',
  'är',
  'en',
  'ett',
  'till',
  'på',
  'i',
  'av',
  'om',
  'den',
  'har',
  'får',
  'min',
  'mitt',
  'mina',
  'vi',
  'man',
]);

function normalizeText(value: string) {
  return value
    .toLocaleLowerCase('sv-SE')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(value: string) {
  return normalizeText(value)
    .split(' ')
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

function scoreEntry(query: string, entry: FaqEntry) {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return 0;

  const questionTokens = tokenize(entry.question);
  const answerTokens = tokenize(entry.answer);
  const keywordTokens = (entry.keywords ?? []).flatMap((word) => tokenize(word));
  const normalizedQuery = normalizeText(query);
  const normalizedQuestion = normalizeText(entry.question);

  let score = 0;

  if (normalizedQuery.includes(normalizedQuestion) || normalizedQuestion.includes(normalizedQuery)) {
    score += 12;
  }

  for (const token of queryTokens) {
    if (questionTokens.includes(token)) score += 4;
    if (answerTokens.includes(token)) score += 2;
    if (keywordTokens.includes(token)) score += 5;
    if (normalizeText(entry.question).includes(token)) score += 1;
    if ((entry.keywords ?? []).some((keyword) => normalizeText(keyword).includes(token))) {
      score += 3;
    }
  }

  return score;
}

export type FaqSearchResult = {
  entries: FaqEntry[];
  best?: FaqEntry;
  confident: boolean;
};

export function searchFaq(query: string): FaqSearchResult {
  const trimmed = query.trim();
  if (!trimmed) {
    return { entries: [], confident: false };
  }

  const ranked = FAQ_ENTRIES.map((entry) => ({
    entry,
    score: scoreEntry(trimmed, entry),
  }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (ranked.length === 0) {
    return { entries: [], confident: false };
  }

  const best = ranked[0]!;
  const confident = best.score >= 6;
  const entries = ranked.slice(0, 3).map((item) => item.entry);

  return {
    entries,
    best: best.entry,
    confident,
  };
}
