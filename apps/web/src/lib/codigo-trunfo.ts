const GRUPOS = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;
const LETRAS = ["A", "B", "C", "D"] as const;

export const CODIGOS_TRUNFO: readonly string[] = GRUPOS.flatMap((grupo) =>
  LETRAS.map((letra) => `${grupo}${letra}`),
);

const CODIGOS = new Set<string>(CODIGOS_TRUNFO);

export function codigoValido(valor: unknown): valor is string {
  return typeof valor === "string" && CODIGOS.has(valor);
}

export function sortearCodigo(usados: readonly string[]): string {
  const livres = CODIGOS_TRUNFO.filter((codigo) => !usados.includes(codigo));
  const opcoes = livres.length > 0 ? livres : CODIGOS_TRUNFO;
  const indice = Math.floor(Math.random() * opcoes.length);

  return opcoes[indice] ?? "1A";
}

export function garantirCodigos<T extends { codigo: string }>(cartas: T[]): T[] {
  const usados: string[] = [];

  return cartas.map((carta) => {
    if (codigoValido(carta.codigo) && !usados.includes(carta.codigo)) {
      usados.push(carta.codigo);
      return carta;
    }

    const codigo = sortearCodigo(usados);
    usados.push(codigo);
    return { ...carta, codigo };
  });
}
