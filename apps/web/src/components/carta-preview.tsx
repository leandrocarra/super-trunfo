import { CartaPreviewClassico } from "@/components/carta-preview-classico";
import { CartaPreviewHeroi } from "@/components/carta-preview-heroi";
import type { RascunhoCarta } from "@/lib/carta";

type CartaPreviewProps = {
  rascunho: RascunhoCarta;
  onPosicaoImagem?: (x: number, y: number) => void;
  onZoomImagem?: (zoom: number) => void;
};

export function CartaPreview({
  rascunho,
  onPosicaoImagem,
  onZoomImagem,
}: CartaPreviewProps) {
  if (rascunho.template === "heroi") {
    return (
      <CartaPreviewHeroi
        rascunho={rascunho}
        onPosicaoImagem={onPosicaoImagem}
        onZoomImagem={onZoomImagem}
      />
    );
  }

  return (
    <CartaPreviewClassico
      rascunho={rascunho}
      onPosicaoImagem={onPosicaoImagem}
      onZoomImagem={onZoomImagem}
    />
  );
}
