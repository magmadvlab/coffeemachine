import Link from "next/link";
import AcceptanceForm from "@/components/AcceptanceForm";

export default function NuovaScheda() {
  return (
    <main className="mx-auto max-w-2xl px-4 pb-24 pt-6">
      <header className="mb-5 flex items-center gap-3">
        <Link href="/" className="text-coffee-400">←</Link>
        <img src="/symbol.png" alt="" className="h-7 w-auto" />
        <h1 className="font-display text-xl font-bold text-coffee-700">Nuova accettazione</h1>
      </header>
      <AcceptanceForm />
    </main>
  );
}
