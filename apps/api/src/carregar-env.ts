import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export function carregarEnvLocal(): void {
  const arquivo = resolve(dirname(fileURLToPath(import.meta.url)), "../.env");

  if (!existsSync(arquivo)) {
    return;
  }

  for (const linha of readFileSync(arquivo, "utf8").split("\n")) {
    const texto = linha.trim();

    if (texto === "" || texto.startsWith("#") || !texto.includes("=")) {
      continue;
    }

    const igual = texto.indexOf("=");
    const chave = texto.slice(0, igual).trim();
    let valor = texto.slice(igual + 1).trim();

    if (
      (valor.startsWith('"') && valor.endsWith('"')) ||
      (valor.startsWith("'") && valor.endsWith("'"))
    ) {
      valor = valor.slice(1, -1);
    }

    if (chave !== "" && process.env[chave] === undefined) {
      process.env[chave] = valor;
    }
  }
}
