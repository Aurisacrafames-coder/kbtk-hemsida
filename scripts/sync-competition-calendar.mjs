#!/usr/bin/env node
/**
 * Uppdaterar public/tavlingskalender.json från SBTF-kalendern i Google Sheets.
 *
 * Kör: node scripts/sync-competition-calendar.mjs
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SHEET_ID = '1H_moTmmQl5o4uVBkiJLgao13aKbOCGg_';
const SHEET_NAME = '2026-2027';
const SOURCE_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit?usp=sharing`;
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_NAME)}`;

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        cell += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(cell);
      cell = '';
    } else if (char === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else if (char !== '\r') {
      cell += char;
    }
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

function todayIso() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const response = await fetch(CSV_URL, {
  headers: { 'User-Agent': 'kbtk-hemsida-calendar-sync' },
});

if (!response.ok) {
  throw new Error(`Kunde inte hämta Google Sheet (${response.status}).`);
}

const rows = parseCsv(await response.text());
const events = [];

for (const raw of rows.slice(1)) {
  const row = [...raw];
  while (row.length < 8) {
    row.push('');
  }

  const [status, bLicense, category, title, start, end, place, organizer] = row
    .slice(0, 8)
    .map((value) => String(value ?? '').trim());

  if (!title || !category || !start) {
    continue;
  }

  events.push({
    status,
    bLicense,
    category,
    title,
    start,
    end: end || start,
    place,
    organizer,
  });
}

const payload = {
  seasonLabel: '2026/2027',
  updated: todayIso(),
  sourceUrl: SOURCE_URL,
  events,
};

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outPath = join(root, 'public', 'tavlingskalender.json');
writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(`Skrev ${events.length} tävlingar till ${outPath}`);
