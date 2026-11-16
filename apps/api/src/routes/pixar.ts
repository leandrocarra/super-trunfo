import { Router } from "express";
import { editarEstiloPixar, imagemValida } from "../pixar.js";

export const pixarRouter = Router();

pixarRouter.post("/", async (req, res) => {
  const imagem = lerImagem(req.body);

  if (imagem === null || !imagemValida(imagem)) {
    res.status(400).json({ erro: "Envie uma foto para transformar" });
    return;
  }

  try {
    const resultado = await editarEstiloPixar(imagem);
    res.json({ imagem: resultado });
  } catch (falha) {
    const mensagem =
      falha instanceof Error
        ? falha.message
        : "Não foi possível transformar a foto";
    const status = mensagem.includes("não está configurada") ? 503 : 502;
    res.status(status).json({ erro: mensagem });
  }
});

function lerImagem(body: unknown): string | null {
  if (typeof body !== "object" || body === null || !("imagem" in body)) {
    return null;
  }

  return typeof body.imagem === "string" ? body.imagem : null;
}
