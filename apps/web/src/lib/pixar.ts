import { getApiBaseUrl } from "@/lib/api";

type RespostaPixar = {
  imagem?: string;
  erro?: string;
};

export async function transformarEmPixar(imagem: string): Promise<string> {
  let response: Response;

  try {
    response = await fetch(`${getApiBaseUrl()}/imagens/pixar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imagem }),
      signal: AbortSignal.timeout(120_000),
    });
  } catch {
    throw new Error("Não foi possível falar com o servidor");
  }

  const corpo: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(lerErro(corpo));
  }

  if (!isResposta(corpo) || typeof corpo.imagem !== "string" || corpo.imagem === "") {
    throw new Error("A resposta da imagem veio incompleta");
  }

  return corpo.imagem;
}

function lerErro(corpo: unknown): string {
  if (isResposta(corpo) && typeof corpo.erro === "string" && corpo.erro !== "") {
    return corpo.erro;
  }

  return "Não foi possível transformar a foto";
}

function isResposta(valor: unknown): valor is RespostaPixar {
  return typeof valor === "object" && valor !== null;
}
