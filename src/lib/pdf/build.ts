import { renderToBuffer } from "@react-pdf/renderer";
import { Ricevuta, type RicevutaData } from "./ricevuta";

async function qrDataUrl(text: string): Promise<string | undefined> {
  try {
    const QR = await import("qrcode");
    return await QR.toDataURL(text, { margin: 1, width: 220 });
  } catch {
    return undefined;
  }
}

export async function buildRicevutaPDF(input: Omit<RicevutaData, "qrDataUrl" | "trackingShort"> & {
  trackingUrl: string;
}): Promise<Buffer> {
  const qr = await qrDataUrl(input.trackingUrl);
  const short = input.trackingUrl.replace(/^https?:\/\//, "").slice(0, 22) + "…";
  const data: RicevutaData = { ...input, qrDataUrl: qr, trackingShort: short };
  // Ricevuta(data) restituisce direttamente l'elemento <Document>
  return renderToBuffer(Ricevuta(data));
}
