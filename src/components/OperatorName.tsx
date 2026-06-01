"use client";

import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";

export const OPERATOR_STORAGE_KEY = "coffee_operator_name";

export function getStoredOperatorName() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(OPERATOR_STORAGE_KEY)?.trim() ?? "";
}

export function OperatorName() {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(getStoredOperatorName());
  }, []);

  function updateName(value: string) {
    setName(value);
    window.localStorage.setItem(OPERATOR_STORAGE_KEY, value.trim());
  }

  return (
    <label className="flex items-center gap-2 rounded-2xl border border-coffee-100 bg-white px-3 py-2 text-sm shadow-sm shadow-coffee-900/5">
      <UserRound className="h-4 w-4 shrink-0 text-arancio" />
      <span className="shrink-0 font-semibold text-coffee-700">Operatore</span>
      <input
        value={name}
        onChange={(e) => updateName(e.target.value)}
        placeholder="Nome"
        className="min-w-0 flex-1 bg-transparent text-coffee-900 outline-none placeholder:text-coffee-300"
      />
    </label>
  );
}
