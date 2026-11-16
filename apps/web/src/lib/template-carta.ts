export type TemplateCarta = "classico" | "heroi";

export const TEMPLATES_CARTA: Array<{
  id: TemplateCarta;
  nome: string;
  amostra: string;
}> = [
  {
    id: "classico",
    nome: "Super Trunfo",
    amostra: "bg-gradient-to-b from-[#4cc9f0] to-[#4361ee] ring-2 ring-[#ffd23f]",
  },
  {
    id: "heroi",
    nome: "Herói",
    amostra: "bg-gradient-to-b from-[#8f739f] to-[#574766] ring-2 ring-[#ece8ef]",
  },
];

export function templateValido(valor: unknown): valor is TemplateCarta {
  return valor === "classico" || valor === "heroi";
}

export function nomeTemplate(template: TemplateCarta): string {
  return (
    TEMPLATES_CARTA.find((item) => item.id === template)?.nome ?? "Super Trunfo"
  );
}
