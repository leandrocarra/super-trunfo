export const CARTAS_POR_FOLHA = 9;

export function dividirEmFolhas<T>(itens: T[]): T[][] {
  const folhas: T[][] = [];

  for (let inicio = 0; inicio < itens.length; inicio += CARTAS_POR_FOLHA) {
    folhas.push(itens.slice(inicio, inicio + CARTAS_POR_FOLHA));
  }

  return folhas;
}

export function totalDeFolhas(quantidade: number): number {
  return Math.ceil(quantidade / CARTAS_POR_FOLHA);
}
