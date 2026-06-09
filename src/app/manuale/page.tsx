import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  Camera,
  CheckCircle2,
  ClipboardList,
  Coffee,
  Euro,
  FileText,
  Gauge,
  MessageCircle,
  PackageSearch,
  ReceiptText,
  SearchCheck,
  Settings,
  ShieldAlert,
  ShoppingBag,
  Target,
  Users,
  Wrench,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { requireAdminPage } from "@/lib/authz";

export const dynamic = "force-dynamic";

const menuSections = [
  {
    href: "/",
    title: "Schede",
    icon: ClipboardList,
    text: "Dashboard dell'officina: cerca riparazioni, apri dettagli, cambia stato e crea nuove schede.",
  },
  {
    href: "/clienti",
    title: "Clienti",
    icon: Users,
    text: "Anagrafica, macchine associate, score, timeline, modifica cliente e storico commerciale.",
  },
  {
    href: "/vendite",
    title: "Vendite",
    icon: ShoppingBag,
    text: "Registra acquisti certi di caffe/prodotti con quantita, prezzo, data, pagamento e macchina collegata.",
  },
  {
    href: "/prodotti",
    title: "Prodotti",
    icon: PackageSearch,
    text: "Catalogo con formato, caffe stimati, prezzo, margine e compatibilita con macchine.",
  },
  {
    href: "/agenda",
    title: "Agenda",
    icon: CalendarDays,
    text: "Azioni commerciali generate da rischio comodato, riordino, calo vendite, upgrade e assistenza.",
  },
  {
    href: "/manutenzioni",
    title: "Manutenzioni",
    icon: Wrench,
    text: "Programmazione preventiva basata su uso stimato, tempo, categoria macchina e segnali tecnici.",
  },
  {
    href: "/opportunita",
    title: "Opportunita",
    icon: Target,
    text: "Analisi di clienti e macchine con rischio o potenziale commerciale.",
  },
  {
    href: "/dashboard-commerciale",
    title: "Dashboard",
    icon: BarChart3,
    text: "Vista direzionale su vendite, rischi, azioni, manutenzioni e clienti da recuperare.",
  },
  {
    href: "/solleciti",
    title: "Solleciti",
    icon: Bell,
    text: "Elenco macchine pronte e non ritirate da oltre 90 giorni, con promemoria al cliente.",
  },
  {
    href: "/configurazione",
    title: "Configurazione",
    icon: Settings,
    text: "Soglie, profili attivita, regole azioni e impostazioni score modificabili dall'app.",
  },
];

const operatorGuides = [
  {
    title: "Nuova accettazione",
    icon: ClipboardList,
    steps: [
      "Inserisci nome cliente, telefono o email e consenso GDPR prima di salvare.",
      "Compila marca, modello e matricola: la matricola recupera lo storico e segnala rientri ravvicinati.",
      "Indica stato estetico, accessori consegnati e difetto con parole concrete.",
      "Se ci sono graffi o danni, carica una foto in ingresso per tutelare officina e cliente.",
      "Se il cliente chiede un preventivo, attiva Preventivo previsto e registra la spesa massima autorizzata.",
    ],
  },
  {
    title: "Dettaglio scheda",
    icon: SearchCheck,
    steps: [
      "Usa Modifica scheda per correggere dati cliente, macchina, difetto, accessori e importi.",
      "Scrivi diagnosi e lavoro svolto mentre intervieni, non solo a fine giornata.",
      "Carica foto aggiuntive quando documentano danni, ricambi o condizioni di ritiro.",
      "Apri ricevuta PDF per consegna o ristampa; apri pagina cliente per controllare cosa vede il cliente.",
    ],
  },
  {
    title: "Preventivi e stati",
    icon: Euro,
    steps: [
      "Porta la scheda a Preventivo quando serve autorizzazione prima della riparazione.",
      "Registra importo preventivo e attendi l'esito: Accettato passa in lavorazione, Rifiutato chiude come non riparabile.",
      "Aggiorna lo stato appena cambia la lavorazione: il cliente vede uno stadio semplificato ma coerente.",
      "Quando la macchina e' pronta, usa Cliente avvisato: da quel momento puo' entrare nei solleciti.",
    ],
  },
  {
    title: "Solleciti ritiro",
    icon: MessageCircle,
    steps: [
      "Controlla Solleciti per macchine in Cliente avvisato da oltre 90 giorni.",
      "Verifica recapiti cliente prima di inviare il promemoria.",
      "Dopo contatto o ritiro, aggiorna la scheda per non lasciare arretrati falsi.",
    ],
  },
];

const adminGuides = [
  {
    title: "Clienti e macchine",
    icon: Users,
    steps: [
      "Completa profilo attivita, categoria utilizzo e regime possesso per ogni macchina importante.",
      "Usa la scheda cliente per leggere timeline, acquisti, assistenze e note commerciali in un unico punto.",
      "Controlla i comodati: senza vendite registrate diventano rischi prioritari.",
    ],
  },
  {
    title: "Vendite e prodotti",
    icon: ShoppingBag,
    steps: [
      "Registra ogni vendita certa e collega la macchina quando il consumo dipende da una macchina specifica.",
      "Tieni aggiornato il catalogo prodotti: caffe stimati, prezzo, margine e compatibilita alimentano score e copertura.",
      "Usa i pagamenti e le date reali per non falsare dashboard, riordini e margini.",
    ],
  },
  {
    title: "Opportunita e agenda",
    icon: Target,
    steps: [
      "Parti da Opportunita per vedere priorita, copertura caffe, fit macchina e azione consigliata.",
      "Trasforma i casi rilevanti in Agenda, assegna una scadenza e salva sempre esito e follow-up.",
      "Distingui recupero commerciale, riordino, upgrade e riallocazione: richiedono messaggi diversi al cliente.",
    ],
  },
  {
    title: "Manutenzioni e configurazione",
    icon: Wrench,
    steps: [
      "Genera manutenzioni preventive almeno una volta a settimana.",
      "Dai priorita a macchine Ho.Re.Ca., comodati e clienti con interventi costosi negli ultimi 365 giorni.",
      "Aggiorna configurazione quando cambiano soglie, profili attivita, prezzi o regole commerciali.",
    ],
  },
];

const statusFlow = [
  {
    status: "Ricevuta",
    action: "La scheda e' stata creata e la macchina e' entrata in officina.",
    customer: "Il cliente vede che la richiesta e' stata presa in carico.",
  },
  {
    status: "In analisi",
    action: "Il tecnico sta verificando guasto, accessori, stato estetico e storico.",
    customer: "Il cliente vede che la macchina e' in controllo tecnico.",
  },
  {
    status: "Preventivo",
    action: "Serve decisione cliente prima di procedere.",
    customer: "Il cliente deve confermare o rifiutare il costo.",
  },
  {
    status: "In lavorazione",
    action: "Riparazione autorizzata o intervento in corso.",
    customer: "Il cliente vede avanzamento attivo.",
  },
  {
    status: "Riparata / Cliente avvisato",
    action: "Macchina pronta; registra data avviso e canale usato.",
    customer: "Il cliente vede che puo' ritirare.",
  },
  {
    status: "Ritirata",
    action: "Chiudi solo quando la macchina e' uscita davvero.",
    customer: "La pratica risulta conclusa.",
  },
];

const dataQuality = [
  "Matricola: e' il dato che collega storico, rientri ravvicinati e analisi per macchina.",
  "Regime possesso: comodato e proprieta' cliente hanno rischi commerciali diversi.",
  "Categoria utilizzo: casa, ufficio e Ho.Re.Ca. cambiano consumo atteso e priorita.",
  "Vendite collegate: senza prodotti e quantita registrati lo score resta debole.",
  "Diagnosi e importi: servono per margini, costo assistenza e decisioni su upgrade o riallocazione.",
  "Foto: documentano condizioni di ingresso, danni e contestazioni.",
];

const routines = [
  "Mattina: controlla Schede aperte, Cliente avvisato e Solleciti.",
  "Durante gli interventi: aggiorna diagnosi, importi e foto appena disponibili.",
  "Fine giornata: porta ogni scheda nello stato reale e registra vendite certe.",
  "Ogni settimana: genera Manutenzioni, verifica Agenda scaduta e opportunita critiche.",
  "Ogni cambio listino: aggiorna Prodotti e Configurazione prima di leggere dashboard e score.",
];

const rules = [
  "Comodato con pochi acquisti e assistenze frequenti: rischio alto.",
  "Ho.Re.Ca. sotto consumo atteso: recupero rapido.",
  "Assistenza recente senza vendite: possibile uso caffe concorrente.",
  "Macchina sottodimensionata: valutare upgrade.",
  "Macchina sovradimensionata: valutare riallocazione.",
  "Vendite registrate bene: score piu affidabile.",
];

const thresholdGuides = [
  {
    title: "Categorie macchina",
    icon: Gauge,
    steps: [
      "Consumo annuo min/max definisce la fascia normale della macchina: casa, ufficio o Ho.Re.Ca.",
      "Il target commerciale a 365 giorni usa il valore piu alto tra consumo atteso del cliente e minimo della categoria macchina.",
      "Se gli acquisti sono sotto il 50% del minimo categoria, la macchina risulta sovradimensionata.",
      "Se gli acquisti superano il 115% del massimo categoria, la macchina risulta sottodimensionata e puo' generare proposta upgrade.",
      "Manutenzione ogni caffe indica dopo quanti caffe stimati conviene programmare un controllo preventivo.",
    ],
  },
  {
    title: "Profili attivita",
    icon: Users,
    steps: [
      "Min/max giorno descrive il consumo atteso del cliente, non quello della singola macchina.",
      "Il valore giornaliero minimo viene proiettato su 90 giorni per lo score fedelta e su 365 giorni per le opportunita.",
      "Override cliente o macchina servono quando un caso reale non rientra nelle fasce standard.",
      "La stagionalita va usata per clienti con picchi prevedibili, cosi non vengono creati falsi allarmi nei mesi bassi.",
    ],
  },
  {
    title: "Impostazioni score",
    icon: FileText,
    steps: [
      "soglia_rischio_comodato 0.35: se un comodato copre meno del 35% del target e ha assistenza recente, e' rischio alto.",
      "soglia_horeca_sotto_consumo 0.50: se un Ho.Re.Ca. copre meno del 50% del target, va recuperato commercialmente.",
      "peso_vendite_score pesa la mancanza di acquisti nello score fedelta; piu alto e', piu lo score scende quando mancano vendite.",
      "peso_manutenzione_score penalizza interventi recenti: assistenza frequente con poche vendite indica rischio o uso prodotto concorrente.",
      "giorni_follow_up_default propone dopo quanti giorni richiamare quando un contatto viene rimandato.",
    ],
  },
  {
    title: "Regole azioni",
    icon: Target,
    steps: [
      "Priorita base decide l'urgenza iniziale dell'azione: 100 e' critica, 70-90 importante, sotto 70 monitoraggio.",
      "Categoria, regime e classe rischio limitano quando la regola si applica.",
      "Azione generata e' il suggerimento operativo mostrato in Opportunita e Agenda.",
      "Scadenza giorni determina entro quando l'azione deve comparire come da fare.",
      "Disattiva una regola quando produce troppi falsi positivi; abbassa priorita o allunga scadenza quando e' utile ma non urgente.",
    ],
  },
];

const marketingActions = [
  {
    title: "Proteggi comodato",
    icon: ShieldAlert,
    steps: [
      "Quando scatta: macchina in comodato, interventi recenti e copertura caffe sotto circa 35% del target.",
      "Obiettivo: capire se il cliente compra caffe altrove, usa poco la macchina o tiene un comodato non redditizio.",
      "Operazione: chiamata prioritaria, verifica consumi reali, proposta riordino o accordo di rientro/riallocazione.",
      "Esito corretto: vendita registrata, nuova scadenza follow-up oppure azione annullata con motivo chiaro.",
    ],
  },
  {
    title: "Recupero Ho.Re.Ca.",
    icon: Coffee,
    steps: [
      "Quando scatta: categoria Ho.Re.Ca. con copertura sotto circa 50% del consumo atteso.",
      "Obiettivo: recuperare volume su clienti professionali, dove pochi ordini mancanti pesano molto.",
      "Operazione: contatto entro 1-2 giorni, controllo listino/miscela, proposta ordine o visita.",
      "Esito corretto: ordine, campionatura, visita pianificata o nota sul motivo del calo.",
    ],
  },
  {
    title: "Post assistenza",
    icon: Wrench,
    steps: [
      "Quando scatta: assistenza recente ma nessun acquisto registrato.",
      "Obiettivo: trasformare il rientro tecnico in contatto commerciale leggero.",
      "Operazione: dopo riparazione o ritiro, proporre prodotto compatibile, decalcificante o primo riordino.",
      "Esito corretto: vendita collegata alla macchina o follow-up breve se il cliente deve decidere.",
    ],
  },
  {
    title: "Upgrade o riallocazione",
    icon: Gauge,
    steps: [
      "Upgrade: macchina sottodimensionata, cioe' consumi sopra il massimo categoria con margine per una macchina superiore.",
      "Riallocazione: macchina sovradimensionata in ufficio o Ho.Re.Ca., con consumi troppo bassi per tenerla li.",
      "Operazione: confronta consumi, guasti e margine; poi proponi upgrade, cambio macchina o rientro comodato.",
      "Esito corretto: opportunita chiusa con decisione, nuova manutenzione o nota commerciale sul prossimo passaggio.",
    ],
  },
  {
    title: "Verifica miscela",
    icon: SearchCheck,
    steps: [
      "Quando scatta: l'assistenza segnala caffe non idoneo, sporco/incrostazioni o anomalie tecniche da prodotto.",
      "Obiettivo: proteggere macchina, qualita in tazza e vendite ricorrenti.",
      "Operazione: chiedere che prodotto usa il cliente, proporre miscela compatibile e spiegare impatto su guasti.",
      "Esito corretto: prova prodotto, vendita o nota tecnica utile per prossimi interventi.",
    ],
  },
  {
    title: "Primo ordine e riordino",
    icon: ShoppingBag,
    steps: [
      "Primo ordine: macchina senza vendite registrate, utile soprattutto dopo nuova installazione o accettazione.",
      "Riordino: cliente con storico acquisti vicino a esaurimento stimato.",
      "Operazione: contatto rapido, conferma prodotto abituale, quantita e metodo pagamento.",
      "Esito corretto: ordine registrato con prodotto, quantita, prezzo e macchina collegata quando possibile.",
    ],
  },
];

const marketingWorkflow = [
  "Apri Opportunita per leggere i casi ordinati per priorita commerciale.",
  "Controlla motivo, copertura caffe, macchina, categoria e ultimo acquisto prima di chiamare.",
  "Premi Genera azioni in Agenda per creare o aggiornare le attivita operative.",
  "Lavora prima Scadute e Oggi, poi le priorita sopra 90.",
  "Durante il contatto registra canale, esito, nota e prossimo follow-up.",
  "Se il cliente compra, registra subito la vendita: e' il dato che chiude il ciclo e corregge score e copertura.",
  "Marca Fatta solo quando l'azione ha avuto un esito reale; usa Rimanda 7g se serve un richiamo, Annulla se non e' piu pertinente.",
];

function GuideCard({ guide }: { guide: (typeof operatorGuides)[number] }) {
  const Icon = guide.icon;

  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-arancio/10 text-arancio">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-display text-lg font-semibold text-coffee-900">{guide.title}</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-coffee-700">
            {guide.steps.map((step) => (
              <li key={step} className="flex gap-2">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-arancio" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}

export default async function ManualePage() {
  await requireAdminPage();

  return (
    <main className="mx-auto max-w-6xl px-3 pb-24 pt-4 sm:px-4 sm:pt-6">
      <header className="mb-5">
        <p className="text-sm font-semibold text-arancio-dark">Guida operativa</p>
        <h1 className="font-display text-2xl font-bold text-coffee-900">Manuale Coffee Express</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-coffee-600">
          Manuale pratico per usare Coffee Express come gestionale unico di officina, vendite, manutenzioni
          e fidelizzazione clienti.
        </p>
      </header>

      <section className="mb-5 grid gap-3 lg:grid-cols-3">
        <Card className="p-4 sm:p-5">
          <BookOpen className="h-6 w-6 text-arancio" />
          <h2 className="mt-3 font-display text-lg font-semibold text-coffee-900">Obiettivo</h2>
          <p className="mt-2 text-sm leading-6 text-coffee-600">
            L'app non registra solo riparazioni: collega vendite, macchine e assistenza per capire fedelta,
            rischio comodati e opportunita commerciali.
          </p>
        </Card>
        <Card className="p-4 sm:p-5">
          <Coffee className="h-6 w-6 text-arancio" />
          <h2 className="mt-3 font-display text-lg font-semibold text-coffee-900">Dato chiave</h2>
          <p className="mt-2 text-sm leading-6 text-coffee-600">
            Le vendite registrate sono il dato certo: servono per stimare copertura caffe, riordino,
            margine e rischio uso concorrente.
          </p>
        </Card>
        <Card className="p-4 sm:p-5">
          <ShieldAlert className="h-6 w-6 text-arancio" />
          <h2 className="mt-3 font-display text-lg font-semibold text-coffee-900">Priorita</h2>
          <p className="mt-2 text-sm leading-6 text-coffee-600">
            Le viste operative da controllare con continuita sono Schede, Solleciti, Agenda, Opportunita
            e Manutenzioni.
          </p>
        </Card>
      </section>

      <section className="mb-5">
        <h2 className="mb-3 font-display text-xl font-bold text-coffee-900">Voci del menu</h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {menuSections.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.href} className="p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-arancio/10 text-arancio">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-coffee-900">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-coffee-600">{item.text}</p>
                    <Link href={item.href} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-arancio-dark underline-offset-2 hover:underline">
                      Apri voce
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mb-5">
        <div className="mb-3 flex items-center gap-2">
          <ReceiptText className="h-5 w-5 text-arancio" />
          <h2 className="font-display text-xl font-bold text-coffee-900">Flusso operatore</h2>
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          {operatorGuides.map((guide) => (
            <GuideCard key={guide.title} guide={guide} />
          ))}
        </div>
      </section>

      <section className="mb-5">
        <div className="mb-3 flex items-center gap-2">
          <Gauge className="h-5 w-5 text-arancio" />
          <h2 className="font-display text-xl font-bold text-coffee-900">Flusso admin</h2>
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          {adminGuides.map((guide) => (
            <GuideCard key={guide.title} guide={guide} />
          ))}
        </div>
      </section>

      <section className="mb-5">
        <div className="mb-3 flex items-center gap-2">
          <Settings className="h-5 w-5 text-arancio" />
          <h2 className="font-display text-xl font-bold text-coffee-900">Soglie e configurazione</h2>
        </div>
        <div className="mb-3 rounded-2xl border border-coffee-100 bg-white p-4 text-sm leading-6 text-coffee-700 shadow-sm shadow-coffee-900/5 sm:p-5">
          Le soglie non sono solo numeri tecnici: decidono quando una macchina e' coerente, quando un cliente
          sta comprando troppo poco e quando l'agenda deve proporre un'azione. Dopo ogni modifica importante,
          rigenera Agenda e ricontrolla Opportunita per vedere l'effetto sui casi aperti.
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          {thresholdGuides.map((guide) => (
            <GuideCard key={guide.title} guide={guide} />
          ))}
        </div>
      </section>

      <section className="mb-5">
        <div className="mb-3 flex items-center gap-2">
          <Target className="h-5 w-5 text-arancio" />
          <h2 className="font-display text-xl font-bold text-coffee-900">Operazioni marketing</h2>
        </div>
        <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
          {marketingActions.map((guide) => (
            <GuideCard key={guide.title} guide={guide} />
          ))}
        </div>
      </section>

      <section className="mb-5">
        <Card className="p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-arancio" />
            <h2 className="font-display text-xl font-bold text-coffee-900">Come lavorare l'agenda marketing</h2>
          </div>
          <ol className="space-y-2 text-sm leading-6 text-coffee-700">
            {marketingWorkflow.map((item, index) => (
              <li key={item} className="flex gap-2">
                <span className="font-bold text-arancio-dark">{index + 1}.</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </Card>
      </section>

      <section className="mb-5">
        <h2 className="mb-3 font-display text-xl font-bold text-coffee-900">Stati della riparazione</h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {statusFlow.map((row) => (
            <Card key={row.status} className="p-4 sm:p-5">
              <h3 className="font-display text-lg font-semibold text-coffee-900">{row.status}</h3>
              <p className="mt-2 text-sm leading-6 text-coffee-700">{row.action}</p>
              <p className="mt-3 rounded-xl border border-coffee-100 bg-coffee-50 px-3 py-2 text-sm leading-6 text-coffee-600">
                {row.customer}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2">
            <FileText className="h-5 w-5 text-arancio" />
            <h2 className="font-display text-xl font-bold text-coffee-900">Qualita dei dati</h2>
          </div>
          <ul className="space-y-2 text-sm leading-6 text-coffee-700">
            {dataQuality.map((item) => (
              <li key={item} className="rounded-xl border border-coffee-100 bg-coffee-50 px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-arancio" />
            <h2 className="font-display text-xl font-bold text-coffee-900">Routine consigliata</h2>
          </div>
          <ol className="space-y-2 text-sm leading-6 text-coffee-700">
            {routines.map((item, index) => (
              <li key={item} className="flex gap-2">
                <span className="font-bold text-arancio-dark">{index + 1}.</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Card className="p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2">
            <Camera className="h-5 w-5 text-arancio" />
            <h2 className="font-display text-xl font-bold text-coffee-900">Documenti e prove</h2>
          </div>
          <ul className="space-y-2 text-sm leading-6 text-coffee-700">
            <li className="rounded-xl border border-coffee-100 bg-coffee-50 px-3 py-2">
              Ricevuta PDF: consegna o invia al cliente quando serve una copia formale della presa in carico.
            </li>
            <li className="rounded-xl border border-coffee-100 bg-coffee-50 px-3 py-2">
              Pagina cliente: mostra lo stato pubblico e riduce telefonate di aggiornamento.
            </li>
            <li className="rounded-xl border border-coffee-100 bg-coffee-50 px-3 py-2">
              Foto: caricale in ingresso, durante diagnosi o prima del ritiro quando chiariscono responsabilita e condizioni.
            </li>
          </ul>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2">
            <Target className="h-5 w-5 text-arancio" />
            <h2 className="font-display text-xl font-bold text-coffee-900">Regole pratiche</h2>
          </div>
          <ul className="space-y-2 text-sm leading-6 text-coffee-700">
            {rules.map((item) => (
              <li key={item} className="rounded-xl border border-coffee-100 bg-coffee-50 px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </main>
  );
}
