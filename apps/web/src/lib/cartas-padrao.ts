import {
  POSICAO_IMAGEM_X,
  POSICAO_IMAGEM_Y,
  ZOOM_IMAGEM_PADRAO,
  type Carta,
} from "./carta";
import { CODIGOS_TRUNFO } from "./codigo-trunfo";

type PessoaTrunfo = {
  nome: string;
  altura: number;
  peso: number;
  ano: number | null;
};

const PESSOAS: PessoaTrunfo[] = [
  { nome: "Paulo Patrezze", altura: 178, peso: 79, ano: 1985 },
  { nome: "Paulo Paro", altura: 180, peso: 81, ano: null },
  { nome: "Larissa", altura: 165, peso: 54, ano: 1984 },
  { nome: "Tata", altura: 160, peso: 69, ano: 1970 },
  { nome: "Leo", altura: 180, peso: 77, ano: 2000 },
  { nome: "Pietra", altura: 163, peso: 54, ano: 2006 },
  { nome: "Gi", altura: 158, peso: 63, ano: 2003 },
  { nome: "Maricota", altura: 158, peso: 59, ano: 2008 },
  { nome: "Roberto", altura: 173, peso: 87, ano: 1955 },
  { nome: "Antônio", altura: 183, peso: 73, ano: 2004 },
  { nome: "Ricardo", altura: 173, peso: 78, ano: 1969 },
  { nome: "Andressa", altura: 163, peso: 76, ano: 1982 },
  { nome: "Gabi", altura: 162, peso: 62, ano: 1993 },
  { nome: "Paula", altura: 154, peso: 58, ano: 1975 },
  { nome: "Gustavo", altura: 170, peso: 63, ano: 2002 },
  { nome: "Let", altura: 164, peso: 65, ano: 1996 },
  { nome: "Felipe", altura: 170, peso: 83, ano: null },
  { nome: "Nat", altura: 164, peso: 54, ano: 1995 },
  { nome: "Vera", altura: 158, peso: 55, ano: null },
  { nome: "Dindo", altura: 177, peso: 83, ano: null },
  { nome: "Tia de", altura: 155, peso: 61, ano: 1965 },
  { nome: "Dinda", altura: 161, peso: 70, ano: null },
  { nome: "Marina", altura: 160, peso: 70, ano: null },
  { nome: "Tio Pin", altura: 171, peso: 60, ano: 1977 },
  { nome: "Igao", altura: 183, peso: 92, ano: 1985 },
  { nome: "Prima Alice", altura: 145, peso: 35, ano: null },
  { nome: "Biso", altura: 170, peso: 65, ano: 1931 },
];

export function criarCartasPadrao(): Carta[] {
  return PESSOAS.map((pessoa, indice) => ({
    id: `padrao-${indice + 1}`,
    nome: pessoa.nome,
    imagem: null,
    imagemX: POSICAO_IMAGEM_X,
    imagemY: POSICAO_IMAGEM_Y,
    imagemZoom: ZOOM_IMAGEM_PADRAO,
    trunfo: false,
    template: "classico",
    forca: null,
    altura: pessoa.altura,
    peso: pessoa.peso,
    ano: pessoa.ano,
    codigo: CODIGOS_TRUNFO[indice] ?? "1A",
  }));
}
