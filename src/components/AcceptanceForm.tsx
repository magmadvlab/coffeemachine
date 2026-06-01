"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { NuovaAccettazione, StatoEstetico, TipoMacchina, Canale } from "@/lib/types";

const ACCESSORI = ["Serbatoio", "Vassoio", "Cavo alim.", "Portacialde"];

export default function AcceptanceForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);

  const [f, setF] = useState<NuovaAccettazione>({
    cliente: { tipo: "privato", ragione_sociale: "", telefono: "", email: "",
      consenso_gdpr: false, canale_preferito: "email" },
    macchina: { tipologia: "capsule" },
    scheda: { accessori: [] },
  });

  const set = (path: string, val: any) =>
    setF((prev) => {
      const next = structuredClone(prev) as any;
      const [a, b] = path.split(".");
      next[a][b] = val;
      return next;
    });

  const toggleAccessorio = (acc: string) =>
    setF((prev) => {
      const has = prev.scheda.accessori.includes(acc);
      const accessori = has ? prev.scheda.accessori.filter((x) => x !== acc) : [...prev.scheda.accessori, acc];
      return { ...prev, scheda: { ...prev.scheda, accessori } };
    });

  const mostraFoto = f.scheda.stato_estetico === "graffi" || f.scheda.stato_estetico === "danni";

  async function submit() {
    setErrore(null);
    if (!f.cliente.ragione_sociale.trim()) { setErrore("Inserisci nome o ragione sociale."); return; }
    if (!f.cliente.consenso_gdpr) { setErrore("Manca il consenso al trattamento dati (GDPR)."); return; }
    setSaving(true);
    try {
      let foto_path: string | undefined;
      if (mostraFoto && fotoFile) {
        const ext = fotoFile.name.split(".").pop() || "jpg";
        foto_path = `ingresso/${crypto.randomUUID()}.${ext}`;
        const supa = createClient();
        const { error } = await supa.storage.from("riparazioni-foto").upload(foto_path, fotoFile);
        if (error) throw new Error("Upload foto: " + error.message);
      }
      const payload: NuovaAccettazione = { ...f, scheda: { ...f.scheda, foto_path } };
      const res = await fetch("/api/riparazioni", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const out = await res.json();
      if (!res.ok) throw new Error(out.error || "Errore salvataggio");
      router.push("/");
      router.refresh();
    } catch (e: any) {
      setErrore(e.message); setSaving(false);
    }
  }

  const inputCls = "w-full rounded-lg border border-coffee-200 bg-white px-3 py-2.5 text-coffee-900 outline-none focus:border-coffee-600";
  const labelCls = "mb-1 block text-xs font-semibold uppercase tracking-wide text-coffee-400";

  return (
    <div className="space-y-6">
      {/* CLIENTE */}
      <section className="rounded-xl border border-coffee-100 bg-white p-4">
        <h2 className="mb-3 font-display text-lg font-semibold text-coffee-700">Cliente</h2>
        <div className="mb-3 flex gap-2">
          {(["privato", "azienda"] as const).map((t) => (
            <button key={t} type="button" onClick={() => set("cliente.tipo", t)}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium capitalize ${
                f.cliente.tipo === t ? "border-coffee-600 bg-coffee-50 text-coffee-700" : "border-coffee-200 text-coffee-400"}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Nome / Ragione sociale *</label>
            <input className={inputCls} value={f.cliente.ragione_sociale}
              onChange={(e) => set("cliente.ragione_sociale", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>Telefono</label>
              <input className={inputCls} value={f.cliente.telefono}
                onChange={(e) => set("cliente.telefono", e.target.value)} /></div>
            <div><label className={labelCls}>Email</label>
              <input className={inputCls} type="email" value={f.cliente.email}
                onChange={(e) => set("cliente.email", e.target.value)} /></div>
          </div>
        </div>
      </section>

      {/* MACCHINA */}
      <section className="rounded-xl border border-coffee-100 bg-white p-4">
        <h2 className="mb-3 font-display text-lg font-semibold text-coffee-700">Macchina</h2>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>Marca</label>
            <input className={inputCls} onChange={(e) => set("macchina.marca", e.target.value)} /></div>
          <div><label className={labelCls}>Modello</label>
            <input className={inputCls} onChange={(e) => set("macchina.modello", e.target.value)} /></div>
          <div><label className={labelCls}>Matricola</label>
            <input className={inputCls} onChange={(e) => set("macchina.matricola", e.target.value)} /></div>
          <div><label className={labelCls}>Colore</label>
            <input className={inputCls} onChange={(e) => set("macchina.colore", e.target.value)} /></div>
        </div>
        <div className="mt-3">
          <label className={labelCls}>Tipologia</label>
          <select className={inputCls} value={f.macchina.tipologia}
            onChange={(e) => set("macchina.tipologia", e.target.value as TipoMacchina)}>
            <option value="cialde">Cialde</option><option value="capsule">Capsule</option>
            <option value="macinato">Macinato</option><option value="altro">Altro</option>
          </select>
        </div>
      </section>

      {/* STATO + GUASTO */}
      <section className="rounded-xl border border-coffee-100 bg-white p-4">
        <h2 className="mb-3 font-display text-lg font-semibold text-coffee-700">Stato e guasto</h2>
        <label className={labelCls}>Stato estetico all'ingresso</label>
        <div className="mb-3 flex gap-2">
          {(["buono", "graffi", "danni"] as const).map((t) => (
            <button key={t} type="button" onClick={() => set("scheda.stato_estetico", t)}
              className={`flex-1 rounded-lg border px-2 py-2 text-sm font-medium capitalize ${
                f.scheda.stato_estetico === t ? "border-coffee-600 bg-coffee-50 text-coffee-700" : "border-coffee-200 text-coffee-400"}`}>
              {t}
            </button>
          ))}
        </div>

        {mostraFoto && (
          <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <label className="mb-1 block text-xs font-semibold text-amber-800">
              Foto del difetto (consigliata per tutela)
            </label>
            <input type="file" accept="image/*" capture="environment"
              onChange={(e) => setFotoFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-coffee-600" />
          </div>
        )}

        <label className={labelCls}>Accessori consegnati</label>
        <div className="mb-3 flex flex-wrap gap-2">
          {ACCESSORI.map((acc) => (
            <button key={acc} type="button" onClick={() => toggleAccessorio(acc)}
              className={`rounded-full border px-3 py-1.5 text-sm ${
                f.scheda.accessori.includes(acc) ? "border-coffee-600 bg-coffee-50 text-coffee-700" : "border-coffee-200 text-coffee-400"}`}>
              {acc}
            </button>
          ))}
        </div>

        <label className={labelCls}>Difetto segnalato dal cliente</label>
        <textarea className={`${inputCls} min-h-[80px]`}
          onChange={(e) => set("scheda.difetto_cliente", e.target.value)} />
      </section>

      {/* GDPR */}
      <label className="flex items-start gap-3 rounded-xl border border-coffee-100 bg-white p-4 text-sm">
        <input type="checkbox" checked={f.cliente.consenso_gdpr} className="mt-0.5 h-5 w-5 accent-coffee-700"
          onChange={(e) => set("cliente.consenso_gdpr", e.target.checked)} />
        <span className="text-coffee-600">
          Il cliente acconsente al trattamento dei dati (Reg. UE 2016/679) per la gestione della riparazione
          e autorizza a essere ricontattato ai recapiti indicati.
        </span>
      </label>

      {errore && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{errore}</p>}

      <button onClick={submit} disabled={saving}
        className="w-full rounded-full bg-coffee-700 py-3.5 text-base font-semibold text-white shadow active:scale-[0.99] disabled:opacity-60">
        {saving ? "Salvataggio…" : "Crea scheda e invia ricevuta"}
      </button>
    </div>
  );
}
