import { FaixaSuperTrunfo } from "@/components/faixa-super-trunfo";
import { FotoCarta } from "@/components/foto-carta";
import {
  ATRIBUTOS_PREVIEW,
  nomeCarta,
  valorAtributo,
  type ChaveAtributo,
} from "@/lib/carta-preview-utils";
import type { RascunhoCarta } from "@/lib/carta";

type CartaPreviewHeroiProps = {
  rascunho: RascunhoCarta;
  onPosicaoImagem?: (x: number, y: number) => void;
  onZoomImagem?: (zoom: number) => void;
};

function IconeAtributo({ tipo }: { tipo: ChaveAtributo }) {
  const letras: Record<ChaveAtributo, string> = {
    forca: "F",
    altura: "A",
    peso: "P",
    ano: "N",
  };
  const letra = letras[tipo];

  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#d8d2de] to-[#a89bb0] text-[11px] font-black text-[#3f3348] shadow-inner">
      {letra}
    </span>
  );
}

export function CartaPreviewHeroi({
  rascunho,
  onPosicaoImagem,
  onZoomImagem,
}: CartaPreviewHeroiProps) {
  const nome = nomeCarta(rascunho);

  return (
    <div className="h-[391px] w-[280px] shrink-0 rounded-[13px] bg-black p-[5px] shadow-[0_22px_50px_rgba(0,0,0,0.6)] print:shadow-none">
      <article className="relative flex h-full w-full flex-col overflow-hidden rounded-[9px] border border-[#2f2438] bg-gradient-to-br from-[#8f739f] via-[#6f587d] to-[#574766]">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-11 bg-gradient-to-b from-[#4f3f5d]/80 to-[#3a2f45]/90">
          <div className="absolute inset-0 opacity-25 bg-[repeating-linear-gradient(180deg,#ffffff10_0px,#ffffff10_2px,transparent_2px,transparent_8px)]" />
        </div>
        <header className="relative z-10 flex h-11 items-center pl-12 pr-2">
          <span className="absolute left-12 top-2 text-[22px] font-black leading-none tracking-tight text-[#f3edf8] drop-shadow">
            {rascunho.codigo}
          </span>
          <div className="ml-auto flex min-w-0 flex-1 items-center justify-end">
            <div
              className="flex min-w-0 max-w-[170px] flex-1 items-center gap-2 bg-black px-3 py-1.5 shadow-lg"
              style={{ clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)" }}
            >
              <h2 className="min-w-0 flex-1 truncate text-center text-[15px] font-black uppercase tracking-wide text-[#ece8ef]">
                {nome || "Sem nome"}
              </h2>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#c8c0d0] bg-[#ece8ef]">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#2f2438]" aria-hidden="true">
                  <path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3z" />
                </svg>
              </span>
            </div>
          </div>
        </header>
        <div className="relative z-10 min-h-0 flex-[1.15] pl-11 pr-2">
          <div className="relative h-full overflow-hidden rounded-sm border border-[#2f2438]/70 bg-[#cfc7d4] shadow-[inset_0_0_0_1px_#ffffff55]">
            {rascunho.imagem ? (
              <FotoCarta
                src={rascunho.imagem}
                alt={nome || "Carta"}
                x={rascunho.imagemX}
                y={rascunho.imagemY}
                zoom={rascunho.imagemZoom}
                onMove={onPosicaoImagem}
                onZoom={onZoomImagem}
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-b from-[#ddd6e2] to-[#9a8da8]">
                <span className="text-6xl font-black text-white/50">
                  {nome ? nome.charAt(0).toUpperCase() : "?"}
                </span>
              </div>
            )}
            {rascunho.trunfo ? (
              <FaixaSuperTrunfo className="absolute right-0 top-0 z-20" />
            ) : null}
          </div>
        </div>
        <div className="relative z-10 mx-1 mb-1 mt-1 rounded-l-[999px] bg-[#ece8ef] py-1 pl-3 shadow-[inset_0_1px_0_#ffffff]">
          <ul>
            {ATRIBUTOS_PREVIEW.map(({ chave, label }, index) => (
              <li
                key={chave}
                className={`flex items-center gap-2 px-3 py-[4px] ${
                  index < ATRIBUTOS_PREVIEW.length - 1
                    ? "border-b border-[#c8bfd0]"
                    : ""
                }`}
              >
                <IconeAtributo tipo={chave} />
                <span className="min-w-0 flex-1 truncate text-[12px] font-black uppercase tracking-wide text-[#2f2438]">
                  {label}
                </span>
                <span className="text-[14px] font-black tabular-nums text-[#2f2438]">
                  {valorAtributo(rascunho[chave])}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </div>
  );
}
