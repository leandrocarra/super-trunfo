import { env } from "./env.js";

const MODELO = "gpt-image-1.5";
const ENDPOINT = "https://api.openai.com/v1/images/edits";

export const PROMPT_PIXAR =
  "Turn the person in this photo into a Pixar-style 3D animated character. Keep the same person, age, face, hairstyle, pose, clothes and framing, but always make them look happy, with a warm smile and bright cheerful eyes. Use large expressive eyes, soft lighting, smooth rounded shapes and vivid colors, like a still from a modern Pixar movie. Do not add text, logos or extra people.";

const PREFIXOS = [
  "data:image/jpeg;base64,",
  "data:image/png;base64,",
  "data:image/webp;base64,",
];

type ErroOpenAI = {
  error?: {
    message?: string;
    code?: string;
  };
};

type RespostaOpenAI = {
  data?: Array<{
    b64_json?: string;
  }>;
};

export function imagemValida(valor: string): boolean {
  return (
    PREFIXOS.some((prefixo) => valor.startsWith(prefixo)) &&
    valor.length > 40 &&
    valor.length < 8_000_000
  );
}

export async function editarEstiloPixar(imagem: string): Promise<string> {
  if (env.openaiApiKey === "") {
    throw new Error("A chave da OpenAI não está configurada no servidor");
  }

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.openaiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODELO,
      prompt: PROMPT_PIXAR,
      images: [{ image_url: imagem }],
      size: "1024x1536",
      quality: "medium",
      output_format: "jpeg",
      output_compression: 80,
      input_fidelity: "high",
      n: 1,
    }),
    signal: AbortSignal.timeout(120_000),
  });

  const corpo: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(mensagemOpenAI(corpo, response.status));
  }

  const base64 = lerBase64(corpo);

  if (base64 === null) {
    throw new Error("A OpenAI não devolveu a imagem");
  }

  return `data:image/jpeg;base64,${base64}`;
}

function lerBase64(corpo: unknown): string | null {
  if (!isResposta(corpo) || !Array.isArray(corpo.data)) {
    return null;
  }

  const primeiro = corpo.data[0];

  if (
    primeiro === undefined ||
    typeof primeiro.b64_json !== "string" ||
    primeiro.b64_json === ""
  ) {
    return null;
  }

  return primeiro.b64_json;
}

function isResposta(valor: unknown): valor is RespostaOpenAI {
  return typeof valor === "object" && valor !== null;
}

function mensagemOpenAI(corpo: unknown, status: number): string {
  const mensagem = isErro(corpo) ? corpo.error?.message ?? "" : "";
  const codigo = isErro(corpo) ? corpo.error?.code ?? "" : "";

  if (codigo === "invalid_api_key" || status === 401) {
    return "A chave da OpenAI foi recusada";
  }

  if (status === 429 || mensagem.toLowerCase().includes("billing")) {
    return "A conta da OpenAI está sem crédito ou no limite";
  }

  if (mensagem !== "" && !mensagem.includes("sk-") && mensagem.length < 180) {
    return mensagem;
  }

  return "A OpenAI não conseguiu transformar a foto";
}

function isErro(valor: unknown): valor is ErroOpenAI {
  return typeof valor === "object" && valor !== null;
}
