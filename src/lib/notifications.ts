import { getPublicAppUrl } from "@/lib/app-url";
import { inviaAggiornamentoStato, inviaRicevuta, inviaSollecitoRitiro } from "@/lib/email";
import type { Canale, StatoRiparazione } from "@/lib/types";

type DbClient = any;

type ClienteContatto = {
  email?: string | null;
  telefono?: string | null;
  canale_preferito?: Canale | string | null;
};

type NotificaBase = {
  db: DbClient;
  riparazioneId: string;
  cliente: ClienteContatto;
};

function canaleSupportato(canale?: string | null): canale is Canale {
  return canale === "email" || canale === "whatsapp" || canale === "sms";
}

function canalePreferito(cliente: ClienteContatto): Canale {
  return canaleSupportato(cliente.canale_preferito) ? cliente.canale_preferito : "email";
}

function emailDestinatario(cliente: ClienteContatto) {
  return cliente.email?.trim() || null;
}

function telefonoDestinatario(cliente: ClienteContatto) {
  return cliente.telefono?.trim() || null;
}

async function logNotifica(opts: {
  db: DbClient;
  riparazioneId: string;
  tipo: string;
  canale: Canale;
  destinatario: string;
  stato: "inviata" | "errore";
  errore?: string;
  payload?: Record<string, unknown>;
}) {
  await opts.db.from("notifiche").insert({
    riparazione_id: opts.riparazioneId,
    tipo: opts.tipo,
    canale: opts.canale,
    destinatario: opts.destinatario,
    stato_invio: opts.stato,
    inviata_at: opts.stato === "inviata" ? new Date().toISOString() : null,
    errore: opts.errore,
    payload: opts.payload,
  });
}

async function logCanaleNonConfigurato(opts: {
  db: DbClient;
  riparazioneId: string;
  tipo: string;
  canale: Canale;
  destinatario: string;
  payload?: Record<string, unknown>;
}) {
  await logNotifica({
    ...opts,
    stato: "errore",
    errore: `${opts.canale.toUpperCase()} predisposto ma non configurato. Invio email attivo.`,
  });
}

export async function notificaRicevuta(opts: NotificaBase & {
  numeroScheda: string;
  pdf: Buffer;
  trackingUrl: string;
}) {
  const canaleRichiesto = canalePreferito(opts.cliente);
  const destinatario = emailDestinatario(opts.cliente);
  if (!destinatario) {
    const telefono = telefonoDestinatario(opts.cliente);
    if (telefono && canaleRichiesto !== "email") {
      await logCanaleNonConfigurato({
        db: opts.db,
        riparazioneId: opts.riparazioneId,
        tipo: "ricevuta",
        canale: canaleRichiesto,
        destinatario: telefono,
        payload: { trackingUrl: opts.trackingUrl },
      });
      return { inviata: false, canale: canaleRichiesto, motivo: "canale_non_configurato" };
    }
    return { inviata: false, canale: "email" as const, motivo: "destinatario_mancante" };
  }

  if (canaleRichiesto !== "email") {
    await logCanaleNonConfigurato({
      db: opts.db,
      riparazioneId: opts.riparazioneId,
      tipo: "ricevuta",
      canale: canaleRichiesto,
      destinatario: telefonoDestinatario(opts.cliente) ?? destinatario,
      payload: { trackingUrl: opts.trackingUrl },
    });
  }

  try {
    await inviaRicevuta({
      to: destinatario,
      numeroScheda: opts.numeroScheda,
      pdf: opts.pdf,
      trackingUrl: opts.trackingUrl,
    });
    await logNotifica({
      db: opts.db,
      riparazioneId: opts.riparazioneId,
      tipo: "ricevuta",
      canale: "email",
      destinatario,
      stato: "inviata",
      payload: { trackingUrl: opts.trackingUrl, canaleRichiesto },
    });
    return { inviata: true, canale: "email" as const };
  } catch (err: any) {
    await logNotifica({
      db: opts.db,
      riparazioneId: opts.riparazioneId,
      tipo: "ricevuta",
      canale: "email",
      destinatario,
      stato: "errore",
      errore: String(err?.message || err),
      payload: { trackingUrl: opts.trackingUrl, canaleRichiesto },
    });
    return { inviata: false, canale: "email" as const, motivo: "errore_provider" };
  }
}

export async function notificaAggiornamentoStato(opts: NotificaBase & {
  numeroScheda: string;
  tokenPubblico: string;
  stato: StatoRiparazione;
  macchina?: string;
}) {
  const canaleRichiesto = canalePreferito(opts.cliente);
  const destinatario = emailDestinatario(opts.cliente);
  const trackingUrl = `${getPublicAppUrl()}/r/${opts.tokenPubblico}`;
  if (!destinatario) {
    const telefono = telefonoDestinatario(opts.cliente);
    if (telefono && canaleRichiesto !== "email") {
      await logCanaleNonConfigurato({
        db: opts.db,
        riparazioneId: opts.riparazioneId,
        tipo: "aggiornamento_stato",
        canale: canaleRichiesto,
        destinatario: telefono,
        payload: { stato: opts.stato, trackingUrl },
      });
      return { inviata: false, canale: canaleRichiesto, motivo: "canale_non_configurato" };
    }
    return { inviata: false, canale: "email" as const, motivo: "destinatario_mancante" };
  }

  if (canaleRichiesto !== "email") {
    await logCanaleNonConfigurato({
      db: opts.db,
      riparazioneId: opts.riparazioneId,
      tipo: "aggiornamento_stato",
      canale: canaleRichiesto,
      destinatario: telefonoDestinatario(opts.cliente) ?? destinatario,
      payload: { stato: opts.stato, trackingUrl },
    });
  }

  try {
    await inviaAggiornamentoStato({
      to: destinatario,
      numeroScheda: opts.numeroScheda,
      stato: opts.stato,
      trackingUrl,
      macchina: opts.macchina,
    });
    await logNotifica({
      db: opts.db,
      riparazioneId: opts.riparazioneId,
      tipo: "aggiornamento_stato",
      canale: "email",
      destinatario,
      stato: "inviata",
      payload: { stato: opts.stato, trackingUrl, canaleRichiesto },
    });
    return { inviata: true, canale: "email" as const };
  } catch (err: any) {
    await logNotifica({
      db: opts.db,
      riparazioneId: opts.riparazioneId,
      tipo: "aggiornamento_stato",
      canale: "email",
      destinatario,
      stato: "errore",
      errore: String(err?.message || err),
      payload: { stato: opts.stato, trackingUrl, canaleRichiesto },
    });
    return { inviata: false, canale: "email" as const, motivo: "errore_provider" };
  }
}

export async function notificaSollecitoRitiro(opts: NotificaBase & {
  numeroScheda: string;
  tokenPubblico: string;
  macchina?: string;
}) {
  const canaleRichiesto = canalePreferito(opts.cliente);
  const destinatario = emailDestinatario(opts.cliente);
  const trackingUrl = `${getPublicAppUrl()}/r/${opts.tokenPubblico}`;
  if (!destinatario) {
    const telefono = telefonoDestinatario(opts.cliente);
    if (telefono && canaleRichiesto !== "email") {
      await logCanaleNonConfigurato({
        db: opts.db,
        riparazioneId: opts.riparazioneId,
        tipo: "sollecito",
        canale: canaleRichiesto,
        destinatario: telefono,
        payload: { trackingUrl },
      });
      return { inviata: false, canale: canaleRichiesto, motivo: "canale_non_configurato" };
    }
    return { inviata: false, canale: "email" as const, motivo: "destinatario_mancante" };
  }

  if (canaleRichiesto !== "email") {
    await logCanaleNonConfigurato({
      db: opts.db,
      riparazioneId: opts.riparazioneId,
      tipo: "sollecito",
      canale: canaleRichiesto,
      destinatario: telefonoDestinatario(opts.cliente) ?? destinatario,
      payload: { trackingUrl },
    });
  }

  try {
    await inviaSollecitoRitiro({
      to: destinatario,
      numeroScheda: opts.numeroScheda,
      trackingUrl,
      macchina: opts.macchina,
    });
    await logNotifica({
      db: opts.db,
      riparazioneId: opts.riparazioneId,
      tipo: "sollecito",
      canale: "email",
      destinatario,
      stato: "inviata",
      payload: { trackingUrl, canaleRichiesto },
    });
    return { inviata: true, canale: "email" as const };
  } catch (err: any) {
    await logNotifica({
      db: opts.db,
      riparazioneId: opts.riparazioneId,
      tipo: "sollecito",
      canale: "email",
      destinatario,
      stato: "errore",
      errore: String(err?.message || err),
      payload: { trackingUrl, canaleRichiesto },
    });
    return { inviata: false, canale: "email" as const, motivo: "errore_provider" };
  }
}
