import { parseNumero, type RascunhoCarta } from "@/lib/carta";

export type ChaveAtributo = "forca" | "altura" | "peso" | "ano";

export type VisualAtributo = {
  chave: ChaveAtributo;
  label: string;
  titulo: string;
  unidade: string;
  fundo: string;
  texto: string;
  foco: string;
};

export const ATRIBUTOS_PREVIEW: VisualAtributo[] = [
  {
    chave: "forca",
    label: "Força",
    titulo: "Força",
    unidade: "",
    fundo: "bg-[#ff5a5f]",
    texto: "text-[#d62839]",
    foco: "focus-within:border-[#ff5a5f]",
  },
  {
    chave: "altura",
    label: "Altura",
    titulo: "Altura",
    unidade: "cm",
    fundo: "bg-[#06c48c]",
    texto: "text-[#048a63]",
    foco: "focus-within:border-[#06c48c]",
  },
  {
    chave: "peso",
    label: "Peso",
    titulo: "Peso",
    unidade: "kg",
    fundo: "bg-[#ff9f1c]",
    texto: "text-[#c86f00]",
    foco: "focus-within:border-[#ff9f1c]",
  },
  {
    chave: "ano",
    label: "Ano",
    titulo: "Ano de nascimento",
    unidade: "",
    fundo: "bg-[#9b5de5]",
    texto: "text-[#6f2dbd]",
    foco: "focus-within:border-[#9b5de5]",
  },
];

export function valorAtributo(valor: string): string {
  const numero = parseNumero(valor);
  return numero === null ? "—" : String(numero);
}

export function nomeCarta(rascunho: RascunhoCarta): string {
  return rascunho.nome.trim();
}
