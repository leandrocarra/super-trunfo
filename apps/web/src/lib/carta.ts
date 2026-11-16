import { sortearCodigo } from "./codigo-trunfo";
import type { TemplateCarta } from "./template-carta";

export const POSICAO_IMAGEM_X = 50;
export const POSICAO_IMAGEM_Y = 0;
export const ZOOM_IMAGEM_MIN = 1;
export const ZOOM_IMAGEM_MAX = 3;
export const ZOOM_IMAGEM_PADRAO = 1;

export function limitarPosicao(valor: number): number {
  return Math.min(100, Math.max(0, Math.round(valor)));
}

export function limitarZoom(valor: number): number {
  const limitado = Math.min(ZOOM_IMAGEM_MAX, Math.max(ZOOM_IMAGEM_MIN, valor));
  return Math.round(limitado * 10) / 10;
}

export type Carta = {
  id: string;
  nome: string;
  imagem: string | null;
  imagemX: number;
  imagemY: number;
  imagemZoom: number;
  trunfo: boolean;
  template: TemplateCarta;
  forca: number | null;
  altura: number | null;
  peso: number | null;
  ano: number | null;
  codigo: string;
};

export type RascunhoCarta = {
  id: string | null;
  nome: string;
  imagem: string;
  imagemX: number;
  imagemY: number;
  imagemZoom: number;
  trunfo: boolean;
  template: TemplateCarta;
  forca: string;
  altura: string;
  peso: string;
  ano: string;
  codigo: string;
};

export function rascunhoVazio(codigosUsados: readonly string[] = []): RascunhoCarta {
  return {
    id: null,
    nome: "",
    imagem: "",
    imagemX: POSICAO_IMAGEM_X,
    imagemY: POSICAO_IMAGEM_Y,
    imagemZoom: ZOOM_IMAGEM_PADRAO,
    trunfo: false,
    template: "classico",
    forca: "",
    altura: "",
    peso: "",
    ano: "",
    codigo: sortearCodigo(codigosUsados),
  };
}

export function parseNumero(valor: string): number | null {
  const trimmed = valor.trim().replace(",", ".");

  if (trimmed === "") {
    return null;
  }

  const numero = Number(trimmed);

  if (!Number.isFinite(numero)) {
    return null;
  }

  return numero;
}

export function cartaParaRascunho(carta: Carta): RascunhoCarta {
  return {
    id: carta.id,
    nome: carta.nome,
    imagem: carta.imagem ?? "",
    imagemX: carta.imagemX,
    imagemY: carta.imagemY,
    imagemZoom: carta.imagemZoom,
    trunfo: carta.trunfo,
    template: carta.template,
    forca: carta.forca === null ? "" : String(carta.forca),
    altura: carta.altura === null ? "" : String(carta.altura),
    peso: carta.peso === null ? "" : String(carta.peso),
    ano: carta.ano === null ? "" : String(carta.ano),
    codigo: carta.codigo,
  };
}

export function rascunhoParaCarta(
  rascunho: RascunhoCarta,
  id: string,
): Carta | null {
  const nome = rascunho.nome.trim();
  const forca = parseNumero(rascunho.forca);
  const altura = parseNumero(rascunho.altura);
  const peso = parseNumero(rascunho.peso);
  const ano = parseNumero(rascunho.ano);

  if (nome === "") {
    return null;
  }

  return {
    id,
    nome,
    imagem: rascunho.imagem === "" ? null : rascunho.imagem,
    imagemX: limitarPosicao(rascunho.imagemX),
    imagemY: limitarPosicao(rascunho.imagemY),
    imagemZoom: limitarZoom(rascunho.imagemZoom),
    trunfo: rascunho.trunfo,
    template: rascunho.template,
    forca,
    altura,
    peso,
    ano,
    codigo: rascunho.codigo,
  };
}

export function formatarAtributo(valor: number | null, sufixo: string): string {
  if (valor === null) {
    return "—";
  }

  if (sufixo === "") {
    return String(valor);
  }

  return `${valor} ${sufixo}`;
}
