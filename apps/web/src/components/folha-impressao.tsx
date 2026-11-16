import { CartaPreview } from "@/components/carta-preview";
import { MolduraImpressao } from "@/components/moldura-impressao";
import { cartaParaRascunho, type Carta } from "@/lib/carta";
import { dividirEmFolhas } from "@/lib/impressao";

export function FolhaImpressao({ cartas }: { cartas: Carta[] }) {
  const folhas = dividirEmFolhas(cartas);

  return (
    <div className="hidden print:block">
      {folhas.map((folha, indice) => (
        <section
          key={folha[0].id}
          className="flex h-[296mm] w-[210mm] break-after-page flex-col items-center gap-[3mm] overflow-hidden pt-[10mm] last:break-after-auto"
        >
          <div className="grid grid-cols-[repeat(3,63mm)] gap-[2mm]">
            {folha.map((carta) => (
              <MolduraImpressao key={carta.id}>
                <CartaPreview rascunho={cartaParaRascunho(carta)} />
              </MolduraImpressao>
            ))}
          </div>
          <p className="w-[193mm] text-[8pt] text-neutral-500">
            Recorte na linha tracejada (63 × 88 mm) e cole sobre a carta ·
            Folha {indice + 1} de {folhas.length}
          </p>
        </section>
      ))}
    </div>
  );
}
