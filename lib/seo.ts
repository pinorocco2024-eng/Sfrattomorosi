import type { Metadata } from "next";
import { INVARIANTS } from "@/lib/invariants";

type SiteMetadataArgs = {
  title?: string;
  description?: string;
  pathname?: string; // "/"
};

function absoluteUrl(pathname: string) {
  const base = "https://sfrattomorosi.it";
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${p === "/" ? "" : p}`;
}

export function siteMetadata(args: SiteMetadataArgs = {}): Metadata {
  const title = args.title ?? INVARIANTS.brand;
  const description =
    args.description ??
    "Avvocato per sfratto per morosità: procedura completa, costi chiari e tempi indicativi. Consulenza gratuita.";

  const url = absoluteUrl(args.pathname ?? "/");

  return {
    title,
    description,
    metadataBase: new URL("https://sfrattomorosi.it"),
    alternates: {
      canonical: url
    },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: INVARIANTS.brand
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    }
  };
}
