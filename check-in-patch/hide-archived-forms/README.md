# Dölj arkiverade formulärinskick — patch för kbtk-checkin

I admin under **Formulär** visas arkiverade inskick när statusfiltret är **Alla**. De ska bara synas när man aktivt väljer **Arkiverad**.

## Problem (produktion)

I `FormTypePanel` (minifierat som `tr` i `_next/static/chunks/16hpd5if8p.ng.js`):

```js
.filter(e => "all" === o || e.status === o)
```

Statusvärden: `new` | `in_progress` | `done` | `archived`  
Filterdefault: `"all"` → arkiverade ingår i listan.

## Ändring

Hitta komponenten som renderar flikarna **Inskick** / **Mailavisering** och selecten **Filtrera status** (sök efter `"Filtrera status"` eller `"Arkiverad"` + `form_type`).

### 1. Lista — exkludera arkiverade när filtret är «alla/aktiva»

**Före:**

```tsx
.filter((entry) => statusFilter === 'all' || entry.status === statusFilter)
```

**Efter:**

```tsx
.filter((entry) =>
  statusFilter === 'all'
    ? entry.status !== 'archived'
    : entry.status === statusFilter,
)
```

### 2. Etikett på standardvalet (rekommenderas)

Byt texten på option `value="all"` från `Alla` till `Aktiva`, så det är tydligt att arkiverade inte ingår.

### 3. Flikräkning «Inskick (N)» (rekommenderas)

Räkna bara icke-arkiverade i tab-texten, så N matchar standardvyn:

```tsx
submissions.filter(
  (s) => s.form_type === formType && s.status !== 'archived',
).length
```

Badge för **nya** (`status === 'new'`) kan lämnas oförändrad.

### 4. Export (valfritt)

IdrottOnline-export sätter bara `status` i query när filtret inte är `all`. Om exporten ska följa listan, skicka `status=active` eller exkludera `archived` på serversidan när status saknas/är `all`. Listvyn är den viktigaste fixen.

## Var filen troligen ligger

| Sök efter | Trolig fil |
|---|---|
| `Filtrera status` | `components/AdminFormsPanel.tsx` (eller `FormTypePanel`) |
| `AdminForms` / formulärflik | `components/AdminDashboard.tsx` |
| `site-form-export` | `app/api/admin/site-form-export/route.ts` |

Se även `FORM_TYPE_PANEL_SNIPPET.tsx` i denna mapp för en rekonstruerad referens.

## Verifiering efter deploy

1. Öppna admin → **Formulär** → valfritt formulär.
2. Standardfilter **Aktiva**: arkiverade syns **inte**.
3. Välj **Arkiverad**: bara arkiverade syns.
4. Välj **Ny** / **Pågår** / **Klar**: oförändrat beteende.
