import type { ChaveAtributo } from "@/lib/carta-preview-utils";

const CAMINHOS: Record<ChaveAtributo, string> = {
  forca: "M13 2 4 14h6l-1 8 9-12h-6l1-8z",
  altura: "M12 2l5 5h-3.5v10H17l-5 5-5-5h3.5V7H7l5-5z",
  peso: "M9 4a3 3 0 0 1 6 0h3l3 16H3L6 4h3zm2 0a1 1 0 0 0 2 0h-2z",
  ano: "M7 2h2v3H7V2zm8 0h2v3h-2V2zM4 6h16v15H4V6zm2 4h12v2H6v-2z",
};

export function IconeAtributo({
  tipo,
  className,
}: {
  tipo: ChaveAtributo;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d={CAMINHOS[tipo]} fill="currentColor" />
    </svg>
  );
}
