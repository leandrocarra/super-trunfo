import {
  POSICAO_IMAGEM_X,
  POSICAO_IMAGEM_Y,
  ZOOM_IMAGEM_PADRAO,
  limitarPosicao,
  limitarZoom,
  type Carta,
} from "./carta";
import { gravarBaralho, lerBaralho } from "./cartas-banco";
import { criarCartasPadrao } from "./cartas-padrao";
import { codigoValido, garantirCodigos } from "./codigo-trunfo";
import { templateValido } from "./template-carta";

const CHAVE = "trunfo.cartas.v2";
const CHAVE_ANTERIOR = "trunfo.cartas";
const VAZIA: Carta[] = [];
const listeners = new Set<() => void>();

let snapshot: Carta[] = VAZIA;
let snapshotRaw: string | undefined;
let prontas = false;
let carga: Promise<void> | null = null;

function isNumeroOuNull(value: unknown): value is number | null {
  return value === null || (typeof value === "number" && Number.isFinite(value));
}

function isImagem(value: unknown): boolean {
  return (
    value === null ||
    value === undefined ||
    (typeof value === "string" &&
      (value === "" || value.startsWith("data:image/")))
  );
}

function isCarta(value: unknown): value is Carta {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return (
    "id" in value &&
    "nome" in value &&
    "altura" in value &&
    "peso" in value &&
    "ano" in value &&
    typeof value.id === "string" &&
    typeof value.nome === "string" &&
    isNumeroOuNull(value.altura) &&
    isNumeroOuNull(value.peso) &&
    isNumeroOuNull(value.ano) &&
    (!("forca" in value) || isNumeroOuNull(value.forca)) &&
    (!("imagem" in value) || isImagem(value.imagem)) &&
    (!("trunfo" in value) || typeof value.trunfo === "boolean") &&
    (!("template" in value) || templateValido(value.template)) &&
    (!("codigo" in value) || typeof value.codigo === "string")
  );
}

function posicaoSalva(
  carta: Carta,
  chave: "imagemX" | "imagemY",
  padrao: number,
): number {
  if (!(chave in carta)) {
    return padrao;
  }

  const valor = carta[chave];

  if (typeof valor !== "number" || !Number.isFinite(valor)) {
    return padrao;
  }

  return limitarPosicao(valor);
}

function forcaSalva(carta: Carta): number | null {
  if (!("forca" in carta) || carta.forca === null) {
    return null;
  }

  return typeof carta.forca === "number" && Number.isFinite(carta.forca)
    ? carta.forca
    : null;
}

function zoomSalvo(carta: Carta): number {
  if (!("imagemZoom" in carta)) {
    return ZOOM_IMAGEM_PADRAO;
  }

  const valor = carta.imagemZoom;

  if (typeof valor !== "number" || !Number.isFinite(valor)) {
    return ZOOM_IMAGEM_PADRAO;
  }

  return limitarZoom(valor);
}

function normalizarCarta(carta: Carta): Carta {
  return {
    ...carta,
    imagem:
      typeof carta.imagem === "string" && carta.imagem !== ""
        ? carta.imagem
        : null,
    imagemX: posicaoSalva(carta, "imagemX", POSICAO_IMAGEM_X),
    imagemY: posicaoSalva(carta, "imagemY", POSICAO_IMAGEM_Y),
    imagemZoom: zoomSalvo(carta),
    forca: forcaSalva(carta),
    trunfo: carta.trunfo === true,
    template: templateValido(carta.template) ? carta.template : "classico",
    codigo: codigoValido(carta.codigo) ? carta.codigo : "",
  };
}

function parseCartas(raw: string | null): Carta[] {
  if (!raw) {
    return VAZIA;
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return VAZIA;
    }

    return garantirCodigos(parsed.filter(isCarta).map(normalizarCarta));
  } catch {
    return VAZIA;
  }
}

function notificar() {
  for (const listener of listeners) {
    listener();
  }
}

export function subscribeCartas(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function lerLocal(): string | null {
  try {
    return window.localStorage.getItem(CHAVE);
  } catch {
    return null;
  }
}

function limparLocal(): void {
  try {
    window.localStorage.removeItem(CHAVE_ANTERIOR);
    window.localStorage.removeItem(CHAVE);
  } catch {
    return;
  }
}

function mensagemQuota(erro: unknown): boolean {
  return erro instanceof DOMException && erro.name === "QuotaExceededError";
}

async function publicar(cartas: Carta[], raw: string): Promise<void> {
  try {
    await gravarBaralho(raw);
    limparLocal();
  } catch (erroBanco) {
    try {
      window.localStorage.setItem(CHAVE, raw);
    } catch (erroLocal) {
      if (mensagemQuota(erroBanco) || mensagemQuota(erroLocal)) {
        throw new Error(
          "As fotos não cabem no navegador. Apague uma foto grande e tente de novo.",
        );
      }

      throw new Error("Não foi possível guardar as cartas");
    }
  }

  snapshot = cartas;
  snapshotRaw = raw;
  prontas = true;
  notificar();
}

async function lerInicial(): Promise<void> {
  limparLocalChaveAntiga();

  let brutoBanco: string | null = null;

  try {
    brutoBanco = await lerBaralho();
  } catch {
    brutoBanco = null;
  }

  if (brutoBanco !== null && brutoBanco !== "[]") {
    const cartas = parseCartas(brutoBanco);
    const gravadas = JSON.stringify(cartas);

    if (gravadas !== brutoBanco) {
      try {
        await gravarBaralho(gravadas);
      } catch {
        snapshot = cartas;
        snapshotRaw = brutoBanco;
        prontas = true;
        notificar();
        return;
      }
    }

    limparLocal();
    snapshot = cartas;
    snapshotRaw = gravadas;
    prontas = true;
    notificar();
    return;
  }

  const brutoLocal = lerLocal();

  if (brutoLocal !== null && brutoLocal !== "[]") {
    const cartas = parseCartas(brutoLocal);

    try {
      await publicar(cartas, JSON.stringify(cartas));
    } catch {
      snapshot = cartas;
      snapshotRaw = brutoLocal;
      prontas = true;
      notificar();
    }

    return;
  }

  const padrao = criarCartasPadrao();
  await publicar(padrao, JSON.stringify(padrao));
}

function limparLocalChaveAntiga(): void {
  try {
    window.localStorage.removeItem(CHAVE_ANTERIOR);
  } catch {
    return;
  }
}

function iniciar(): Promise<void> {
  if (carga === null) {
    carga = lerInicial().catch(() => {
      prontas = true;
      notificar();
    });
  }

  return carga;
}

export function getCartasProntas(): boolean {
  void iniciar();
  return prontas;
}

export function getCartasProntasServidor(): boolean {
  return false;
}

export function getCartasSnapshot(): Carta[] {
  void iniciar();
  return snapshot;
}

export function getCartasServerSnapshot(): Carta[] {
  return VAZIA;
}

export async function persistirCartas(cartas: Carta[]): Promise<void> {
  await iniciar();
  await publicar(cartas, JSON.stringify(cartas));
}

export function salvarCarta(cartas: Carta[], carta: Carta): Carta[] {
  const base = carta.trunfo
    ? cartas.map((item) =>
        item.id === carta.id ? item : { ...item, trunfo: false },
      )
    : cartas;
  const existe = base.some((item) => item.id === carta.id);

  if (!existe) {
    return [...base, carta];
  }

  return base.map((item) => (item.id === carta.id ? carta : item));
}

export function removerCarta(cartas: Carta[], id: string): Carta[] {
  return cartas.filter((item) => item.id !== id);
}
