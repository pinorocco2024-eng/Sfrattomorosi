import { INVARIANTS } from "@/lib/invariants";

export function siteTitle(page?: string) {
  const base = INVARIANTS.brand;
  return page ? `${page} | ${base}` : base;
}

export function siteDescription() {
  return "Avvocato per sfratto per morosità: tempi, costi e gestione completa della procedura. Consulenza gratuita.";
}

export function canonical(pathname: string) {
  const p = pathname?.startsWith("/") ? pathname : `/${pathname || ""}`;
  return `https://sfrattomorosi.it${p}`;
}
