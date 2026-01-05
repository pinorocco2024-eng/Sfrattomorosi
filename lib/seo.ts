import type { Metadata } from "next";
import { INVARIANTS } from "@/lib/invariants";

export function siteMetadata(partial?: Partial<Metadata>): Metadata {
  const title = partial?.title ?? INVARIANTS.brand;
  const description =
    partial?.description ??
    "Avvocato per sfratto per morosità: gestione completa, trasparenza su costi e tempi, consulenza gratuita.";

  return {
    title,
    description,
    metadataBase: new URL("https://sfrattomorosi.it"),
    alternates: { canonical: partial?.alternates?.canonical ?? "/" },
    openGraph: {
      title: typeof title === "string" ? title : INVARIANTS.brand,
      description,
      url: "/",
      siteName: INVARIANTS.brand,
      type: "website",
    },
    robots: { index: true, follow: true },
    ...partial,
  };
}
