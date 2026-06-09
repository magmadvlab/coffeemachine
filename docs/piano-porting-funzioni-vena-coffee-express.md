# Piano porting funzioni Vena su Coffee Express

## Obiettivo

Coffee Express deve restare semplice per gli operatori di officina e diventare completo per gli admin, riusando il gestionale avanzato gia' costruito in Vena.

La separazione non deve essere solo grafica:

- gli operatori vedono e usano solo il flusso riparazioni;
- gli admin vedono tutto il gestionale avanzato;
- pagine e API admin-only devono rispondere `403` agli operatori;
- le API riparazioni restano disponibili agli operatori collegati.

## Stato di partenza

Coffee Express oggi contiene gia':

- dashboard schede riparazione: `src/app/page.tsx`;
- nuova scheda: `src/app/nuova/page.tsx`;
- dettaglio riparazione: `src/app/riparazioni/[id]/page.tsx`;
- cambio stato: `src/app/api/riparazioni/[id]/stato/route.ts`;
- preventivo/esito: `src/app/api/riparazioni/[id]/preventivo/route.ts`;
- foto: `src/app/api/riparazioni/[id]/foto/route.ts`;
- ricevuta: `src/app/api/ricevuta/[id]/route.ts`;
- solleciti: `src/app/solleciti/page.tsx`;
- gestione operatori admin: `src/app/admin/operatori/page.tsx`;
- diagnostica/reset admin: `src/app/api/admin/*`;
- auth basata su Supabase e `ADMIN_EMAILS`.

La nuova correzione scheda operatore deve coprire:

- dati cliente;
- dati macchina;
- difetto;
- stato estetico/accessori;
- preventivo;
- importi;
- note tecniche.

## Sorgente Vena da portare

Repository locale di riferimento: `/Users/magma/venamachine`.

Migrazioni Supabase:

- `/Users/magma/venamachine/supabase/07_vendite_fedelta.sql`;
- `/Users/magma/venamachine/supabase/08_riordino_caffe.sql`;
- `/Users/magma/venamachine/supabase/09_pagamenti_vendite.sql`;
- `/Users/magma/venamachine/supabase/10_macchine_consumi_opportunita.sql`;
- `/Users/magma/venamachine/supabase/11_score_fedelta_categorie_macchina.sql`;
- `/Users/magma/venamachine/supabase/12_azioni_commerciali.sql`;
- `/Users/magma/venamachine/supabase/13_piani_operativi_completi.sql`.

Componenti e pagine principali:

- `src/components/AppChrome.tsx`;
- `src/components/RepairEditForm.tsx`;
- `src/components/commercial/AgendaActions.tsx`;
- `src/components/config/ConfigForms.tsx`;
- `src/components/customers/CustomerEditForm.tsx`;
- `src/components/customers/CustomerNoteForm.tsx`;
- `src/components/machines/MachineEditForm.tsx`;
- `src/components/maintenance/MaintenanceActions.tsx`;
- `src/components/products/ProductForm.tsx`;
- `src/components/sales/SaleForm.tsx`;
- `src/app/clienti/[id]/page.tsx`;
- `src/app/dashboard-commerciale/page.tsx`;
- `src/app/agenda/page.tsx`;
- `src/app/manutenzioni/page.tsx`;
- `src/app/opportunita/page.tsx`;
- `src/app/vendite/page.tsx`;
- `src/app/prodotti/page.tsx`;
- `src/app/configurazione/page.tsx`;
- `src/app/manuale/page.tsx`.

API avanzate:

- `src/app/api/clienti/[id]/route.ts`;
- `src/app/api/clienti/[id]/note/route.ts`;
- `src/app/api/macchine/[id]/route.ts`;
- `src/app/api/prodotti/route.ts`;
- `src/app/api/prodotti/[id]/route.ts`;
- `src/app/api/vendite/route.ts`;
- `src/app/api/manutenzioni/route.ts`;
- `src/app/api/azioni-commerciali/route.ts`;
- `src/app/api/configurazione/route.ts`.

## Modello ruoli

Usare due helper condivisi:

- `requireAdmin()` per pagine/API admin-only;
- `requireRepairAccess()` per API officina, che accetta admin o operatore collegato.

Regole:

- admin: email presente in `ADMIN_EMAILS`, accesso a tutto;
- operatore: riga attiva in `operatori` collegata a `auth_user_id`, accesso solo a officina;
- utente autenticato ma non admin/non operatore: nessun accesso operativo.

Route operatori consentite:

- `/`;
- `/nuova`;
- `/riparazioni/[id]`;
- `/solleciti`;
- `/api/riparazioni*`;
- `/api/macchine/storico`;
- `/api/ricevuta/[id]`;
- pagina pubblica cliente `/r/[token]`.

Route admin-only:

- `/clienti` e `/clienti/[id]`;
- `/vendite`;
- `/prodotti`;
- `/dashboard-commerciale`;
- `/agenda`;
- `/manutenzioni`;
- `/opportunita`;
- `/configurazione`;
- `/manuale`;
- `/admin/operatori`;
- `/api/clienti*`;
- `/api/macchine/[id]`;
- `/api/prodotti*`;
- `/api/vendite`;
- `/api/manutenzioni`;
- `/api/azioni-commerciali`;
- `/api/configurazione`;
- `/api/admin/*`.

## Fasi implementative

### 1. Correzione scheda operatori

Stato: completata in Coffee Express.

Interventi:

- aggiunto `src/components/RepairEditForm.tsx`;
- estesa `PATCH /api/riparazioni/[id]`;
- collegato il form al dettaglio riparazione;
- mantenuto l'accesso a operatori collegati e admin.
- aggiunto helper permessi `src/lib/authz.ts`;
- protette le superfici admin gia' presenti: `/clienti`, `/admin/operatori`, `/api/operatori`, `/api/admin/*`;
- nascosto il link clienti agli operatori nella dashboard.

Verifica:

- build Next;
- apertura dettaglio scheda;
- modifica cliente/macchina/scheda/importi/note;
- conferma refresh dati;
- blocco server-side delle pagine/API admin esistenti;
- prova `403` con utente non collegato.

### 2. Porting migrazioni database

Copiare in Coffee Express le migrazioni Vena `07`-`13`, mantenendo la numerazione e adattando solo intestazioni/seed brand se necessario.

Controlli prima di applicare su Supabase:

- tutte le migrazioni sono idempotenti (`if not exists`, `create or replace view`);
- nessuna migrazione elimina dati operativi Coffee Express;
- le colonne aggiunte a `macchine`, `clienti`, `riparazioni` sono compatibili con le query esistenti;
- reset diagnostico non cancella operatori/auth.

### 3. Helper permessi

Creare `src/lib/authz.ts` con:

- `getRole()`;
- `isAdmin()`;
- `requireAdminResponse()`;
- `requireRepairAccessResponse()`;
- varianti per server component che fanno `redirect` o `notFound`.

Aggiornare tutte le API copiate da Vena per usare gli helper admin-only, non `getSessionOperatore`.

### 4. AppChrome con visibilita' per ruolo

Portare `AppChrome` da Vena e adattare:

- brand `Coffee Express`;
- link operatori: Schede, Nuova scheda, Solleciti;
- link admin: menu Vena completo;
- mobile nav separata per ruolo;
- logout sempre disponibile;
- nessuna voce admin renderizzata per operatori.

La visibilita' del menu e' solo UX: la protezione vera resta in middleware, server component e API.

### 5. Pagine admin avanzate

Portare e adattare:

- clienti avanzati;
- dettaglio cliente con timeline;
- modifica cliente;
- macchine e modifica macchina;
- vendite;
- prodotti/catalogo compatibilita';
- dashboard commerciale;
- opportunita';
- agenda commerciale;
- manutenzioni programmate;
- configurazione soglie/regole;
- manuale operativo.

Ogni pagina admin deve chiamare `requireAdmin()` prima di leggere dati.

### 6. API admin avanzate

Portare le API Vena e modificare l'autorizzazione:

- `GET/POST/PATCH` admin-only dove gestiscono gestionale commerciale;
- solo le API riparazioni restano abilitate agli operatori;
- risposte coerenti: `401` non autenticato, `403` ruolo insufficiente, `400` errore dati.

### 7. Manuale Coffee Express

Adattare il manuale Vena in `/manuale`:

- sezione operatori: accettazione, stato, preventivo, foto, ricevuta, solleciti, correzione scheda;
- sezione admin: clienti, vendite, prodotti, score, categorie macchina, opportunita', agenda, manutenzioni, configurazione;
- brand e lessico Coffee Express;
- dominio produzione `coffeemachine-neon.vercel.app`.

### 8. Build, migrazione, deploy

Sequenza consigliata:

1. `npm run build`;
2. applicazione migrazioni Supabase su progetto Coffee Express;
3. test smoke locale con utenti admin e operatore;
4. deploy Vercel;
5. verifica produzione su `https://coffeemachine-neon.vercel.app`;
6. test produzione: menu per ruolo, `403` API admin da operatore, CRUD admin, flusso officina.

## Checklist finale

- Operatore vede solo officina.
- Operatore puo' correggere scheda.
- Operatore non apre pagine admin.
- Operatore riceve `403` sulle API admin.
- Admin vede AppChrome completo.
- Admin usa clienti, vendite, prodotti, agenda, manutenzioni, configurazione e manuale.
- Score fedelta' e opportunita' leggono le nuove viste.
- Prodotti hanno compatibilita' con tipologia e categoria uso macchina.
- Dashboard commerciale non rompe se non ci sono ancora dati vendita.
- Build e deploy completati senza errori.
