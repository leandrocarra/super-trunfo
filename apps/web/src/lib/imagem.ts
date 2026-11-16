const MAX_LADO = 720;
const QUALIDADE = 0.82;

export function arquivoDeImagem(dados: DataTransfer | null): File | undefined {
  if (!dados) {
    return undefined;
  }

  const arquivo = [...dados.files].find((item) => item.type.startsWith("image/"));

  if (arquivo) {
    return arquivo;
  }

  const item = [...dados.items].find(
    (entrada) => entrada.kind === "file" && entrada.type.startsWith("image/"),
  );

  return item?.getAsFile() ?? undefined;
}

export function copiarImagem(dataUrl: string): Promise<void> {
  if (!navigator.clipboard?.write) {
    return Promise.reject(new Error("Não foi possível copiar a foto"));
  }

  return navigator.clipboard.write([
    new ClipboardItem({ "image/png": blobPng(dataUrl) }),
  ]);
}

function blobPng(dataUrl: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const imagem = new Image();

    imagem.onerror = () => {
      reject(new Error("Não foi possível copiar a foto"));
    };

    imagem.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, imagem.naturalWidth);
      canvas.height = Math.max(1, imagem.naturalHeight);

      const contexto = canvas.getContext("2d");

      if (!contexto) {
        reject(new Error("Não foi possível copiar a foto"));
        return;
      }

      contexto.drawImage(imagem, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Não foi possível copiar a foto"));
          return;
        }

        resolve(blob);
      }, "image/png");
    };

    imagem.src = dataUrl;
  });
}

export function lerImagemArquivo(arquivo: File): Promise<string> {
  if (arquivo.type !== "" && !arquivo.type.startsWith("image/")) {
    return Promise.reject(new Error("Selecione um arquivo de imagem"));
  }

  return new Promise((resolve, reject) => {
    const leitor = new FileReader();

    leitor.onerror = () => {
      reject(new Error("Não foi possível ler a imagem"));
    };

    leitor.onload = () => {
      const resultado = leitor.result;

      if (typeof resultado !== "string") {
        reject(new Error("Não foi possível ler a imagem"));
        return;
      }

      redimensionarImagem(resultado).then(resolve).catch(reject);
    };

    leitor.readAsDataURL(arquivo);
  });
}

function redimensionarImagem(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const imagem = new Image();

    imagem.onerror = () => {
      reject(new Error("Imagem inválida"));
    };

    imagem.onload = () => {
      const maior = Math.max(imagem.width, imagem.height);
      const escala = maior > MAX_LADO ? MAX_LADO / maior : 1;
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(imagem.width * escala));
      canvas.height = Math.max(1, Math.round(imagem.height * escala));

      const contexto = canvas.getContext("2d");

      if (!contexto) {
        reject(new Error("Não foi possível processar a imagem"));
        return;
      }

      contexto.drawImage(imagem, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", QUALIDADE));
    };

    imagem.src = dataUrl;
  });
}
