import { HomeHero, ValueProps, ComeFunziona, PreventivoSection, ServiziSection, BlogListSection, FAQSection, ContattiSection } from "@/components/Sections";

export default function Page() {
  return (
    <>
      <HomeHero />
      <ValueProps />
      <ComeFunziona />

      {/* Home order: Preventivo → Servizi → Blog → FAQ → Contatti */}
      <PreventivoSection />
      <ServiziSection />
      <BlogListSection />
      <FAQSection />
      <ContattiSection />
    </>
  );
}
