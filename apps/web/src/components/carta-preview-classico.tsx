import { FaixaSuperTrunfo } from "@/components/faixa-super-trunfo";
import { FotoCarta } from "@/components/foto-carta";
import { IconeAtributo } from "@/components/icone-atributo";
import {
  ATRIBUTOS_PREVIEW,
  nomeCarta,
  valorAtributo,
} from "@/lib/carta-preview-utils";
import type { RascunhoCarta } from "@/lib/carta";

type CartaPreviewClassicoProps = {
  rascunho: RascunhoCarta;
  onPosicaoImagem?: (x: number, y: number) => void;
  onZoomImagem?: (zoom: number) => void;
};

export function CartaPreviewClassico({
  rascunho,
  onPosicaoImagem,
  onZoomImagem,
}: CartaPreviewClassicoProps) {
  const nome = nomeCarta(rascunho);

  return (
    <div className="h-[391px] w-[280px] shrink-0 rounded-[13px] border-4 border-[#ffd23f] bg-white p-[5px] shadow-[0_18px_40px_rgba(67,97,238,0.35)] print:shadow-none">
      <article className="relative flex h-full w-full flex-col overflow-hidden rounded-[8px] bg-gradient-to-b from-[#4cc9f0] via-[#4895ef] to-[#4361ee]">
        <div className="pointer-events-none absolute -left-8 -top-8 h-28 w-28 rounded-full bg-white/15" />
        <div className="pointer-events-none absolute -right-6 top-24 h-16 w-16 rounded-full bg-white/10" />
        <header className="relative z-10 flex items-center gap-2 px-3 pb-1 pt-3">
          <span className="flex h-8 min-w-8 shrink-0 items-center justify-center rounded-full bg-[#ffd23f] px-1.5 text-[13px] font-black text-[#3a0ca3] shadow-[0_3px_0_#e0a800]">
            {rascunho.codigo}
          </span>
          <h2 className="min-w-0 flex-1 truncate text-center text-[20px] font-black uppercase leading-none tracking-wide text-white [text-shadow:0_3px_0_#3a0ca3]">
            {nome || "Seu herói"}
          </h2>
          <span className="w-8 shrink-0" />
        </header>
        <div className="relative z-10 min-h-0 flex-1 px-3 pb-2 pt-1">
          <div className="relative h-full overflow-hidden rounded-[20px] border-4 border-white bg-[#bde0fe] shadow-[0_0_0_4px_#ffd23f,0_8px_16px_rgba(58,12,163,0.35)]">
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
              <div className="flex h-full flex-col items-center justify-center gap-1 bg-gradient-to-b from-[#caf0f8] to-[#a2d2ff]">
                <span className="text-6xl font-black text-[#4361ee]/70">
                  {nome ? nome.charAt(0).toUpperCase() : "?"}
                </span>
                <span className="text-xs font-bold text-[#4361ee]/70 print:hidden">
                  Coloque uma foto
                </span>
              </div>
            )}
            {rascunho.trunfo ? (
              <FaixaSuperTrunfo className="absolute right-0 top-0 z-20" />
            ) : null}
          </div>
        </div>
        <ul className="relative z-10 flex flex-col gap-1 px-3 pb-3">
          {ATRIBUTOS_PREVIEW.map(({ chave, label, unidade, fundo, texto }) => (
            <li
              key={chave}
              className={`flex items-center gap-2 rounded-full ${fundo} py-[3px] pl-1 pr-1 shadow-[0_3px_0_rgba(0,0,0,0.18)]`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/30 text-white">
                <IconeAtributo tipo={chave} className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1 truncate text-[14px] font-black text-white">
                {label}
                {unidade ? (
                  <span className="ml-1 text-[11px] font-bold opacity-80">
                    {unidade}
                  </span>
                ) : null}
              </span>
              <span
                className={`flex h-6 min-w-12 shrink-0 items-center justify-center rounded-full bg-white px-2 text-[15px] font-black tabular-nums ${texto}`}
              >
                {valorAtributo(rascunho[chave])}
              </span>
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}
