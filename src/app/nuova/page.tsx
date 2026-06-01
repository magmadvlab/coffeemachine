import Link from "next/link";
import AcceptanceForm from "@/components/AcceptanceForm";

export default function NuovaScheda() {
  return (
    <main className="mx-auto max-w-2xl px-3 pb-24 pt-4 sm:px-4 sm:pt-6">
      <header className="mb-4 flex items-center gap-3 sm:mb-5">
        <Link href="/" className="flex h-10 w-10 items-center justify-center rounded-full text-coffee-400">←</Link>
        <img src="/symbol.png" alt="" className="h-7 w-auto" />
        <h1 className="font-display text-lg font-bold text-coffee-700 sm:text-xl">Nuova accettazione</h1>
      </header>
      <AcceptanceForm />
    </main>
  );
}
