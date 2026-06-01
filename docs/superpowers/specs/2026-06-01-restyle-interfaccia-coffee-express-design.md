# Restyle interfaccia Coffee Express · Officina — Design

**Data:** 2026-06-01
**Progetto:** `coffee-express` (Next.js 14 App Router + Supabase + Resend)
**Tipo:** Restyle puramente di interfaccia + rifinitura PWA installabile

## Obiettivo

Rendere l'app mobile-first e visivamente curata — "una vera app" — installabile su
smartphone e avviabile dall'icona in home. Identità visiva: **toni del caffè + bianco**,
con **arancio come unico colore d'azione**.

## Vincolo di scope (importante)

Questo intervento tocca **solo l'interfaccia (presentazione)**. NON modifica:

- logica applicativa, query Supabase, API route, generazione PDF, invio email;
- comportamento dei componenti esistenti (`AcceptanceForm`, `StatusControl`,
  lookup storico macchina via matricola);
- funzionalità (nessuna ricerca, filtro, conteggio o feature nuova in questa fase).

Nuove funzionalità verranno aggiunte in iterazioni successive, separate.

Direzione visiva approvata: **"Espresso bar"** — superfici caffè scuro per header,
card bianche pulite, arancio per CTA / FAB / stato attivo / step completati.

## Sistema visivo

### Palette
Base caffè esistente mantenuta; aggiunta della famiglia `arancio`.

| Token | Hex | Uso |
|---|---|---|
| `coffee-900` (espresso) | `#2b2320` | header, sfondi scuri, testo principale, `theme_color` |
| `coffee-700` | `#5b3a29` | testo brand, dettagli scuri |
| `coffee-50` (crema) | `#faf7f4` | sfondo pagina |
| bianco | `#ffffff` | card / superfici |
| coffee-100/200/400 | esistenti | bordi, testo secondario, stati spenti |
| **`arancio` (DEFAULT)** | `#E8731C` | CTA, FAB, badge stato attivo, step completati, focus ring |
| `arancio-light` | `#F59E3B` | hover / accenti chiari |
| `arancio-dark` | `#C75E12` | active / pressed |

- Aggiungere la scala `arancio` a `tailwind.config.ts` sotto `theme.extend.colors`.
- `theme_color` del manifest e meta viewport → `#2b2320` (era `#5b3a29`).
- Gli **stati riparazione** (badge `stadioColore`) restano a colori semantici
  (verde = pronta, blu = preventivo, ecc.) ma riarmonizzati su toni caldi coerenti;
  l'arancio resta riservato ad azione e stato "in corso/attivo" per non confondere.

### Tipografia
Nessun cambio di font: **Fraunces** (display) + **Public Sans** (sans), già caricati.
Solo ritocco della scala: titoli display più grandi/decisi sulle schermate chiave.

### Forme & profondità
- Raggi: card `rounded-2xl`, pill/azioni `rounded-full`.
- Ombre morbide a due livelli: card sollevate / elementi flottanti (FAB).
- Target touch ≥ 44px su tutte le azioni.

### Icone
Aggiungere **`lucide-react`** come dipendenza e sostituire i link testuali con
azioni iconografiche (`FileText`, `ExternalLink`/`QrCode`, `Plus`, `ArrowLeft`,
`Check`, `User`, `Coffee`, `ClipboardList`, `Search`).

## Componenti riusabili (nuovi, isolati)

In `src/components/ui/` — piccoli, una responsabilità ciascuno, riusati dalle 3 schermate:

- **`Button`** — varianti: `primary` (arancio pieno), `ghost`, `dark` (espresso).
  Props: `variant`, `size`, stato disabilitato/loading. Solo presentazione.
- **`Badge`** — varianti per stadio cliente (mappa stadio → classi colore).
- **`Card`** — superficie bianca + ombra morbida + raggio.
- **`Fab`** — bottone flottante arancio (icona), posizionato in basso a destra,
  rispetta `env(safe-area-inset-bottom)`.
- **`BrandHeader`** — header espresso sticky con logo bianco; slot per azione a destra.

Ogni componente è puramente visivo: riceve dati/handler via props, non contiene
logica di dominio né fetch.

## Le tre schermate

### 1. Dashboard operatore — `src/app/page.tsx`
- `BrandHeader` espresso sticky: logo bianco a sinistra (slot azione a destra lasciato
  vuoto per ora — niente ricerca in questa fase).
- Lista card schede ristilizzata: `numero_scheda` mono, cliente in grassetto, macchina;
  `Badge` stadio; riga azioni con icone (`FileText` Ricevuta PDF, `ExternalLink`
  Pagina cliente, data a destra); `StatusControl` integrato nel nuovo stile
  (stato attivo evidenziato in arancio) — **logica invariata**.
- `Fab` arancio "+" → `/nuova`.
- Stato vuoto curato: simbolo Coffee Express tenue + testo + `Button` primary "Nuova scheda".
- Blocco `missingSupabaseEnv` mantenuto: solo restyle, stessa logica.

### 2. Nuova accettazione — `src/app/nuova/page.tsx` + `src/components/AcceptanceForm.tsx`
- Header con freccia indietro (`ArrowLeft`) + simbolo + titolo "Nuova accettazione".
- Form a card-sezioni (Cliente · Macchina · Difetto/Estetica) con titolino + icona.
- Chips accessori e tipologia in stile pill, selezionati in **arancio**.
- Campi input con focus ring arancio, label chiare, touch ≥ 44px.
- Blocco **storico macchina** (esistente, via matricola) presentato come card evidenziata
  quando trova precedenti — **stessa logica/fetch**.
- Foto condizionale (graffi/danni): area upload disegnata invece di input grezzo — stesso
  comportamento di caricamento su Supabase Storage.
- CTA sticky in basso: `Button` primary arancio full-width "Salva e genera ricevuta",
  con stato `saving` esistente.

### 3. Tracking cliente pubblico — `src/app/r/[token]/page.tsx`
- Vetrina cliente: card bianca centrata, header simbolo + "Coffee Express", numero scheda.
- Stato attuale grande in display (Fraunces).
- Timeline a step verticale: step completati con pallino **arancio** pieno + `Check`,
  step futuri spenti in caffè chiaro (oggi marroni → arancio).
- Box preventivo evidenziato (€) se presente.
- Footer contatti officina; fascia superiore espresso sottile come richiamo al volantino.
- Query e `stadioCliente` invariati.

## PWA & installazione (icona avviabile)

Impacchettamento + interfaccia di installazione; nessuna logica di dominio toccata.
**Niente service worker / offline** (deciso).

- **Manifest** (`public/manifest.webmanifest`): `name`, `short_name`, `lang: it`,
  `theme_color: #2b2320`, `background_color: #faf7f4`, `display: standalone`,
  più **icone `maskable`** (oltre alle 192/512 esistenti).
- **Meta iOS** in `src/app/layout.tsx`: `apple-mobile-web-app-capable`,
  `apple-mobile-web-app-status-bar-style`, `apple-touch-icon` dedicata.
- **Banner "Aggiungi a schermata Home"** — componente client `InstallPrompt`:
  - Android/Chrome: intercetta `beforeinstallprompt`, mostra `Button` arancio "Installa l'app".
  - iOS/Safari: istruzioni illustrate ("Condividi → Aggiungi a Home") con icone.
  - Si nasconde se già installata (`display-mode: standalone`); ricorda "non mostrare più"
    in `localStorage`.
- **Icone**: verificare adeguatezza delle PNG esistenti; se necessario generare varianti
  maskable/apple da `symbol.png` / logo.

## Architettura del cambiamento

```
src/
  app/
    layout.tsx          + meta iOS, montaggio InstallPrompt
    globals.css         (eventuali utility minime)
    page.tsx            restyle con BrandHeader/Card/Badge/Fab
    nuova/page.tsx      restyle header
    r/[token]/page.tsx  restyle timeline arancio
  components/
    ui/Button.tsx       (nuovo)
    ui/Badge.tsx        (nuovo)
    ui/Card.tsx         (nuovo)
    ui/Fab.tsx          (nuovo)
    BrandHeader.tsx     (nuovo)
    InstallPrompt.tsx   (nuovo, client)
    AcceptanceForm.tsx  restyle presentazione (logica invariata)
    StatusControl.tsx   restyle presentazione (logica invariata)
tailwind.config.ts      + scala colori arancio
public/manifest.webmanifest  aggiornato
public/                 eventuali icone maskable/apple
package.json            + lucide-react
```

## Testing / verifica

Trattandosi di restyle, la verifica è visiva e funzionale-di-regressione:

- `npm run build` passa.
- Le 3 schermate rendono correttamente su viewport mobile (preview browser).
- Azioni esistenti continuano a funzionare: creazione scheda, cambio stato,
  link Ricevuta PDF, link pagina cliente, lookup storico, upload foto condizionale.
- Manifest valido e installabilità verificata (prompt Android / istruzioni iOS).
- Nessuna regressione di logica (query/API/PDF/email invariate).

## Fuori scope (iterazioni future)

Ricerca/filtri in dashboard, offline/service worker, autenticazione operatori,
avanzamento preventivo lato cliente, notifiche SMS, e altre funzionalità.
