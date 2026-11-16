import { CARTAS_POR_FOLHA, totalDeFolhas } from "@/lib/impressao";

export function BotaoImprimir({ quantidade }: { quantidade: number }) {
  const folhas = totalDeFolhas(quantidade);

  return (
    <div className="flex flex-col items-start gap-1 sm:items-end sm:text-right">
      <button
        type="button"
        disabled={quantidade === 0}
        onClick={() => window.print()}
        className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-[#ff9f1c] px-6 text-xl font-black text-white shadow-[0_5px_0_#c86f00] transition-transform active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:bg-[#c9d1e6] disabled:shadow-[0_5px_0_#aab4cc]"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
          <path
            fill="currentColor"
            d="M7 3h10v4H7V3zm-2 5h14a3 3 0 0 1 3 3v6h-4v4H6v-4H2v-6a3 3 0 0 1 3-3zm3 7v4h8v-4H8z"
          />
        </svg>
        Imprimir minhas cartas
      </button>
      <p className="text-sm font-bold text-[#3a0ca3]/60">
        {quantidade === 0
          ? "Salve uma carta para poder imprimir."
          : `${quantidade} ${quantidade === 1 ? "carta" : "cartas"} em ${folhas} ${folhas === 1 ? "folha" : "folhas"} A4 (até ${CARTAS_POR_FOLHA} por folha, tamanho Pokémon 63 × 88 mm). Use escala 100%.`}
      </p>
    </div>
  );
}
