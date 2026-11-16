import { CampoImagem } from "@/components/campo-imagem";
import { CampoNumero } from "@/components/campo-numero";
import type { RascunhoCarta } from "@/lib/carta";
import { ATRIBUTOS_PREVIEW } from "@/lib/carta-preview-utils";
import {
  TEMPLATES_CARTA,
  type TemplateCarta,
} from "@/lib/template-carta";

type Campo = Exclude<
  keyof RascunhoCarta,
  | "id"
  | "trunfo"
  | "template"
  | "codigo"
  | "imagemX"
  | "imagemY"
  | "imagemZoom"
>;

type CartaFormProps = {
  rascunho: RascunhoCarta;
  podeSalvar: boolean;
  editando: boolean;
  onChange: (campo: Campo, valor: string) => void;
  onTemplateChange: (valor: TemplateCarta) => void;
  onTrunfoChange: (valor: boolean) => void;
  onSalvar: () => void;
  onNova: () => void;
};

export function CartaForm({
  rascunho,
  podeSalvar,
  editando,
  onChange,
  onTemplateChange,
  onTrunfoChange,
  onSalvar,
  onNova,
}: CartaFormProps) {
  return (
    <form
      className="flex w-full flex-col gap-6 rounded-[28px] bg-white p-5 shadow-[0_12px_30px_rgba(67,97,238,0.15)] sm:p-7"
      onSubmit={(event) => {
        event.preventDefault();
        onSalvar();
      }}
    >
      <div className="flex flex-col gap-2">
        <span className="text-lg font-black text-[#3a0ca3]">
          Escolha a carta
        </span>
        <div className="grid grid-cols-2 gap-3">
          {TEMPLATES_CARTA.map((template) => {
            const selecionado = rascunho.template === template.id;

            return (
              <button
                key={template.id}
                type="button"
                aria-pressed={selecionado}
                onClick={() => onTemplateChange(template.id)}
                className={`flex flex-col items-center gap-2 rounded-2xl border-4 px-3 py-3 transition-colors ${
                  selecionado
                    ? "border-[#ffd23f] bg-[#fff8db]"
                    : "border-[#dbe4ff] bg-white hover:border-[#a5b8ff]"
                }`}
              >
                <span
                  className={`h-10 w-8 rounded-lg ${template.amostra} shadow-[0_3px_0_rgba(0,0,0,0.15)]`}
                />
                <span className="text-base font-black text-[#3a0ca3]">
                  {template.nome}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <label className="flex flex-col gap-2">
        <span className="text-lg font-black text-[#3a0ca3]">Nome</span>
        <input
          className="h-14 rounded-2xl border-4 border-[#dbe4ff] bg-white px-4 text-2xl font-black text-[#3a0ca3] outline-none transition-colors placeholder:text-[#3a0ca3]/30 focus:border-[#4895ef]"
          type="text"
          name="nome"
          maxLength={20}
          placeholder="Ex.: Super Leo"
          value={rascunho.nome}
          onChange={(event) => onChange("nome", event.target.value)}
        />
      </label>
      <CampoImagem
        idCarta={rascunho.id}
        imagem={rascunho.imagem}
        onChange={(valor) => onChange("imagem", valor)}
      />
      {ATRIBUTOS_PREVIEW.map((atributo) => (
        <CampoNumero
          key={atributo.chave}
          atributo={atributo}
          valor={rascunho[atributo.chave]}
          onChange={(valor) => onChange(atributo.chave, valor)}
        />
      ))}
      <label className="flex cursor-pointer items-center gap-4 rounded-2xl border-4 border-[#ffd23f] bg-[#fff8db] px-4 py-4">
        <input
          type="checkbox"
          name="trunfo"
          checked={rascunho.trunfo}
          onChange={(event) => onTrunfoChange(event.target.checked)}
          className="h-8 w-8 shrink-0 accent-[#ffb703]"
        />
        <span className="text-lg font-black text-[#3a0ca3]">
          Esta é a carta Super Trunfo!
        </span>
      </label>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={!podeSalvar}
            className="h-16 flex-1 rounded-2xl bg-[#06c48c] px-4 text-2xl font-black text-white shadow-[0_5px_0_#048a63] transition-transform active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:bg-[#c9d1e6] disabled:shadow-[0_5px_0_#aab4cc]"
          >
            {editando ? "Guardar mudanças" : "Salvar carta"}
          </button>
          <button
            type="button"
            onClick={onNova}
            className="h-16 flex-1 rounded-2xl border-4 border-[#4895ef] bg-white px-4 text-xl font-black text-[#4361ee] transition-colors hover:bg-[#e7f1ff]"
          >
            Nova carta
          </button>
        </div>
        {podeSalvar ? null : (
          <p className="text-center text-base font-bold text-[#3a0ca3]/60">
            Coloque o nome para salvar
          </p>
        )}
      </div>
    </form>
  );
}
