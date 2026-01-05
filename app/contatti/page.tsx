import { ContattiSection } from "@/components/Sections";

export default function Page() {
  return (
    <div className="pt-28">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        <h1 className="font-serif text-4xl md:text-5xl text-center">Contatti</h1>
      </div>
      <ContattiSection showTitle={false} />
    </div>
  );
}
