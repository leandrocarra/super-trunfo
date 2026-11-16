import { useEffect, useState } from "react";
import { arquivoDeImagem, copiarImagem, lerImagemArquivo } from "@/lib/imagem";
import { transformarEmPixar } from "@/lib/pixar";

function focoEmTexto(alvo: EventTarget | null): boolean {
  if (!(alvo instanceof HTMLElement)) {
    return false;
  }

  return (
    alvo instanceof HTMLInputElement ||
    alvo instanceof HTMLTextAreaElement ||
    alvo.isContentEditable
  );
}

type CampoImagemProps = {
  idCarta: string | null;
  imagem: string;
  onChange: (valor: string) => void;
};

export function CampoImagem({ idCarta, imagem, onChange }: CampoImagemProps) {
  const [erro, setErro] = useState<string | null>(null);
  const [pixarizando, setPixarizando] = useState(false);

  async function handleArquivo(arquivo: File | undefined) {
    if (!arquivo) {
      return;
    }

    try {
      const dataUrl = await lerImagemArquivo(arquivo);
      setErro(null);
      onChange(dataUrl);
    } catch (falha) {
      setErro(
        falha instanceof Error ? falha.message : "Não deu para usar essa foto",
      );
    }
  }

  useEffect(() => {
    function aoColar(event: ClipboardEvent) {
      if (focoEmTexto(event.target)) {
        return;
      }

      const arquivo = arquivoDeImagem(event.clipboardData);

      if (!arquivo) {
        return;
      }

      event.preventDefault();
      void handleArquivo(arquivo);
    }

    function aoCopiar(event: ClipboardEvent) {
      if (!imagem || focoEmTexto(event.target)) {
        return;
      }

      if ((window.getSelection()?.toString() ?? "") !== "") {
        return;
      }

      event.preventDefault();
      copiarImagem(imagem).catch((falha: unknown) => {
        setErro(
          falha instanceof Error ? falha.message : "Não foi possível copiar a foto",
        );
      });
    }

    window.addEventListener("paste", aoColar);
    window.addEventListener("copy", aoCopiar);

    return () => {
      window.removeEventListener("paste", aoColar);
      window.removeEventListener("copy", aoCopiar);
    };
  }, [imagem, onChange]);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-lg font-black text-[#3a0ca3]">Foto</span>
      <label className="flex h-16 cursor-pointer items-center justify-center gap-3 rounded-2xl border-4 border-dashed border-[#4895ef] bg-[#e7f1ff] px-4 text-lg font-black text-[#4361ee] transition-colors hover:bg-[#d6e8ff]">
        <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
          <path
            fill="currentColor"
            d="M9 4 7.2 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3.2L15 4H9zm3 4.5A4.5 4.5 0 1 1 7.5 13 4.5 4.5 0 0 1 12 8.5z"
          />
        </svg>
        {imagem ? "Trocar a foto" : "Escolher uma foto"}
        <input
          key={`${idCarta ?? "nova"}:${imagem ? "1" : "0"}`}
          className="sr-only"
          type="file"
          accept="image/*"
          name="imagem"
          onChange={(event) => void handleArquivo(event.target.files?.[0])}
        />
      </label>
      {imagem ? (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={pixarizando}
            onClick={() => {
              setErro(null);
              setPixarizando(true);
              transformarEmPixar(imagem)
                .then((resultado) => onChange(resultado))
                .catch((falha: unknown) => {
                  setErro(
                    falha instanceof Error
                      ? falha.message
                      : "Não foi possível transformar a foto",
                  );
                })
                .finally(() => setPixarizando(false));
            }}
            className="h-12 rounded-2xl bg-[#9b5de5] px-5 text-lg font-black text-white shadow-[0_4px_0_#6f2dbd] transition-transform active:translate-y-1 active:shadow-none disabled:cursor-wait disabled:opacity-70"
          >
            {pixarizando ? "Pixarizando..." : "Pixar"}
          </button>
          <button
            type="button"
            disabled={pixarizando}
            onClick={() => {
              setErro(null);
              onChange("");
            }}
            className="rounded-full px-3 py-1 text-base font-bold text-[#4361ee] hover:bg-[#e7f1ff] disabled:opacity-50"
          >
            Tirar a foto
          </button>
        </div>
      ) : null}
      <p className="text-base font-bold text-[#3a0ca3]/60">
        {imagem
          ? "Ctrl+V troca a foto. Ctrl+C copia. Arraste na carta. Use + e − para aproximar."
          : "Ctrl+V cola uma foto copiada."}
      </p>
      {erro ? (
        <p className="text-base font-bold text-[#d62839]">{erro}</p>
      ) : null}
    </div>
  );
}
