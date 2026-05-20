# Deploya KBTK-hemsidan på Vercel

Hemsidan är en statisk Vite-sida. Den ska ligga som **eget Vercel-projekt** bredvid KBTK Check-in (som redan finns på Vercel).

## Varför hittar jag inte `kbtk-hemsida` i Vercel?

Vercel importerar från **GitHub**, inte från mappen på din dator.

| Projekt | Var koden ligger |
|---|---|
| KBTK Check-in | GitHub → syns i Vercel |
| KBTK-hemsida | Just nu bara lokalt på din dator → **syns inte** i Vercel förrän den ligger på GitHub |

Du måste först lägga upp hemsidan på GitHub (steg A). Sedan importerar du den i Vercel (steg B).

---

## Steg A: Lägg hemsidan på GitHub (gör detta först)

### A1. Skapa nytt repo på GitHub

1. Öppna [github.com](https://github.com) och logga in (samma konto som för `kbtk-checkin`).
2. Klicka **+** uppe till höger → **New repository**.
3. **Repository name:** `kbtk-hemsida`
4. Välj **Private** eller **Public** (spelar ingen roll för Vercel).
5. **Lämna** "Add a README" **avmarkerat** (mappen har redan filer).
6. Klicka **Create repository**.

GitHub visar sedan kommandon för att pusha befintlig kod. Använd dem i nästa steg.

### A2. Pusha koden från din dator

Öppna terminal (PowerShell) i mappen `kbtk-hemsida` och kör (byt `DITT-KONTO` om det skiljer sig):

```powershell
cd C:\Users\ander\kbtk-hemsida

git init
git add .
git commit -m "Första version av KBTK-hemsidan"
git branch -M main
git remote add origin https://github.com/DITT-KONTO/kbtk-hemsida.git
git push -u origin main
```

Om du redan har `git init` kan du hoppa över `git init` och bara köra `add`, `commit`, `remote`, `push`.

**Tips:** Om du använder samma GitHub-konto som check-in blir adressen troligen:

`https://github.com/Aurisacrafames-coder/kbtk-hemsida.git`

---

## Steg B: Importera i Vercel (nytt projekt)

### B1. Öppna rätt ställe i Vercel

1. Gå till [vercel.com/dashboard](https://vercel.com/dashboard)
2. Du ska se ditt befintliga projekt (check-in), t.ex. `kbtk-checkin`
3. Klicka **Add New…** (knappen uppe till höger)
4. Välj **Project** (inte "Team" eller "Domain")

Du ska nu se sidan **"Let's build something new"** med en lista över GitHub-repos.

### B2. Hitta repot `kbtk-hemsida`

- Scrolla i listan eller sök efter `kbtk-hemsida`
- Klicka **Import** bredvid `kbtk-hemsida`

**Om repot inte syns:**

1. Klicka länken **Adjust GitHub App Permissions** (eller **Configure GitHub App**)
2. Välj organisation/konto → **Repository access**
3. Välj **Only select repositories** och lägg till `kbtk-hemsida`, eller **All repositories**
4. Spara och gå tillbaka till Vercel → **Add New** → **Project**

### B3. Konfigurera projektet (viktigt)

På sidan **Configure Project**:

| Fält | Värde |
|---|---|
| Project Name | `kbtk-hemsida` (valfritt) |
| Framework Preset | **Vite** |
| Root Directory | **Lämna tom** (om hela repot bara är hemsidan) |
| Build Command | `npm run build` |
| Output Directory | `dist` |

Under **Environment Variables**, lägg till:

| Name | Value |
|---|---|
| `VITE_CHECKIN_URL` | `https://kbtk-checkin.vercel.app` |

(Använd er riktiga check-in-URL om den skiljer sig.)

### B4. Deploy

1. Klicka **Deploy**
2. Vänta tills status blir **Ready**
3. Klicka **Visit** – du får en adress som `https://kbtk-hemsida.vercel.app`

Den adressen kan du skicka till styrelsen och medlemmar.

---

## Översikt: två projekt i samma Vercel-konto

```
Vercel Dashboard
├── kbtk-checkin     → incheckning, schema, admin
└── kbtk-hemsida     → publik klubbsida  ← detta skapar du nu
```

De delar samma Vercel-konto men är **inte** samma projekt.

---

## Förutsättningar (check-in / Supabase)

- KBTK Check-in ska redan vara deployad
- Migration `023_site_announcements.sql` ska vara körd i Supabase om styrelsen ska redigera **Aktuellt** under **Admin → Hemsida**

---

## Egen domän (valfritt, senare)

Vercel → välj projektet `kbtk-hemsida` → **Settings** → **Domains**

Exempel:

- `www.kungalvsbtk.se` → hemsida
- check-in kan ligga kvar på `kbtk-checkin.vercel.app` eller egen subdomän

---

## Kontroll efter deploy

- [ ] Startsidan med **Hitta rätt snabbt**
- [ ] Träningsschema syns under **Träningstider**
- [ ] **Aktuellt** visas (om ni skapat nyheter i check-in)
- [ ] Sponsorer och FAQ fungerar

---

## Felsökning

| Problem | Lösning |
|---|---|
| Ser inte `kbtk-hemsida` i Vercel | Koden måste ligga på GitHub först (steg A) |
| Fel vid `git push` | Kontrollera att repot skapats på GitHub och att du är inloggad |
| Schema/Aktuellt tom | Sätt `VITE_CHECKIN_URL` under Environment Variables |
| Vit sida | Output Directory ska vara `dist` |
| 404 | `vercel.json` ska finnas i projektroten |
