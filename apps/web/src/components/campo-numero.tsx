import { IconeAtributo } from "@/components/icone-atributo";
import { parseNumero } from "@/lib/carta";
import type { VisualAtributo } from "@/lib/carta-preview-utils";

type CampoNumeroProps = {
  atributo: VisualAtributo;
  valor: string;
  onChange: (valor: string) => void;
};

function ajustar(valor: string, passo: number): string {
  const atual = parseNumero(valor) ?? 0;
  return String(Math.max(0, Math.round(atual + passo)));
}

export function CampoNumero({ atributo, valor, onChange }: CampoNumeroProps) {
  const { chave, titulo, unidade, fundo, foco } = atributo;
  const botao = `flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${fundo} text-3xl font-black text-white shadow-[0_4px_0_rgba(0,0,0,0.2)] transition-transform active:translate-y-1 active:shadow-none`;

  return (
    <div className="flex flex-col gap-2">
      <span className="flex items-center gap-2 text-lg font-black text-[#3a0ca3]">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-full ${fundo} text-white`}
        >
          <IconeAtributo tipo={chave} className="h-5 w-5" />
        </span>
        {titulo}
        {unidade ? (
          <span className="text-base font-bold text-[#3a0ca3]/60">
            ({unidade})
          </span>
        ) : null}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`Diminuir ${titulo}`}
          onClick={() => onChange(ajustar(valor, -1))}
          className={botao}
        >
          −
        </button>
        <label
          className={`flex h-14 min-w-0 flex-1 items-center rounded-2xl border-4 border-[#dbe4ff] bg-white px-4 transition-colors ${foco}`}
        >
          <span className="sr-only">{titulo}</span>
          <input
            className="w-full bg-transparent text-center text-2xl font-black text-[#3a0ca3] outline-none"
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            name={chave}
            value={valor}
            placeholder="0"
            onChange={(event) => onChange(event.target.value)}
          />
        </label>
        <button
          type="button"
          aria-label={`Aumentar ${titulo}`}
          onClick={() => onChange(ajustar(valor, 1))}
          className={botao}
        >
          +
        </button>
      </div>
    </div>
  );
}
