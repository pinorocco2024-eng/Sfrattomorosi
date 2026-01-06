import type { Metadata } from "next";
import { INVARIANTS } from "./invariants";

type SiteMetadataInput = {
  title?: string;
  description?: string;
  pathname?: string;
};

const siteUrl = "https://sfrattomorosi.it";

export const siteTitle = INVARIANTS.brand;

export function absoluteUrl(pathname = "/") {
  const clean = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${siteUrl}${clean}`;
}

export function siteMetadata(input: SiteMetadataInput = {}): Metadata {
  const title = input.title ?? siteTitle;
  const description =
    input.description ??
    "Avvocato per sfratto per morosità: consulenza, procedura completa, tempi e costi indicativi, supporto per gestione locazioni.";

  const url = absoluteUrl(input.pathname ?? "/");

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "it_IT",
      url,
      title,
      description,
      siteName: INVARIANTS.brand,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
