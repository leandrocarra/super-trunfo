"use client";

import { useState } from "react";
import Image from "next/image";
import { IconeAtributo } from "@/components/icone-atributo";
import type { Carta } from "@/lib/carta";
import { ATRIBUTOS_PREVIEW } from "@/lib/carta-preview-utils";

function textoBusca(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
}

type CartasSalvasProps = {
  cartas: Carta[];
  carregando: boolean;
  selecionadaId: string | null;
  idsImpressao: string[];
  onEditar: (carta: Carta) => void;
  onExcluir: (id: string) => void;
  onAlternarImpressao: (id: string) => void;
  onMarcarImpressao: (marcar: boolean) => void;
};

export function CartasSalvas({
  cartas,
  carregando,
  selecionadaId,
  idsImpressao,
  onEditar,
  onExcluir,
  onAlternarImpressao,
  onMarcarImpressao,
}: CartasSalvasProps) {
  const [busca, setBusca] = useState("");

  if (carregando) {
    return (
      <p className="rounded-2xl bg-white/70 p-5 text-center text-lg font-bold text-[#3a0ca3]/60">
        Carregando cartas...
      </p>
    );
  }

  if (cartas.length === 0) {
    return (
      <p className="rounded-2xl bg-white/70 p-5 text-center text-lg font-bold text-[#3a0ca3]/60">
        Você ainda não salvou nenhuma carta.
      </p>
    );
  }

  const termo = textoBusca(busca);
  const visiveis =
    termo === ""
      ? cartas
      : cartas.filter((carta) => textoBusca(carta.nome).includes(termo));
  const todasMarcadas = cartas.every((carta) => idsImpressao.includes(carta.id));

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="sr-only">Buscar por nome</span>
        <input
          className="h-14 rounded-2xl border-4 border-[#dbe4ff] bg-white px-4 text-xl font-black text-[#3a0ca3] outline-none transition-colors placeholder:text-[#3a0ca3]/30 focus:border-[#4895ef]"
          type="search"
          name="busca"
          value={busca}
          placeholder="Buscar por nome"
          onChange={(event) => setBusca(event.target.value)}
        />
      </label>
      <button
        type="button"
        onClick={() => onMarcarImpressao(!todasMarcadas)}
        className="h-12 self-start rounded-2xl border-4 border-[#ffd23f] bg-white px-5 text-lg font-black text-[#3a0ca3] transition-colors hover:bg-[#fff8e1]"
      >
        {todasMarcadas ? "Desmarcar todas" : "Marcar todas"}
      </button>
      {visiveis.length === 0 ? (
        <p className="rounded-2xl bg-white/70 p-5 text-center text-lg font-bold text-[#3a0ca3]/60">
          Nenhuma carta com esse nome.
        </p>
      ) : (
    <ul className="grid gap-4 sm:grid-cols-2">
      {visiveis.map((carta) => {
        const selecionada = carta.id === selecionadaId;
        const imprimir = idsImpressao.includes(carta.id);

        return (
          <li key={carta.id}>
            <div
              className={`flex flex-col gap-4 rounded-[24px] border-4 bg-white p-4 shadow-[0_8px_20px_rgba(67,97,238,0.12)] ${
                selecionada ? "border-[#ffd23f]" : "border-transparent"
              }`}
            >
              <button
                type="button"
                onClick={() => onEditar(carta)}
                className="flex items-center gap-4 text-left"
              >
                {carta.imagem ? (
                  <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-4 border-[#ffd23f]">
                    <Image
                      src={carta.imagem}
                      alt=""
                      fill
                      unoptimized
                      sizes="64px"
                      className="object-cover"
                      style={{
                        objectPosition: `${carta.imagemX}% ${carta.imagemY}%`,
                        transform: `scale(${carta.imagemZoom})`,
                      }}
                    />
                  </span>
                ) : (
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-4 border-[#ffd23f] bg-gradient-to-b from-[#4cc9f0] to-[#4361ee] text-2xl font-black text-white">
                    {carta.nome.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="shrink-0 rounded-full bg-[#ffd23f] px-2 py-0.5 text-sm font-black text-[#3a0ca3]">
                      {carta.codigo}
                    </span>
                    <span className="truncate text-xl font-black text-[#3a0ca3]">
                      {carta.nome}
                    </span>
                    {carta.trunfo ? (
                      <span className="shrink-0 rounded-full bg-[#ffd23f] px-2 py-0.5 text-xs font-black uppercase text-[#3a0ca3]">
                        Trunfo
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-2 flex flex-wrap gap-1.5">
                    {ATRIBUTOS_PREVIEW.map(({ chave, fundo }) => (
                      <span
                        key={chave}
                        className={`flex items-center gap-1 rounded-full ${fundo} px-2 py-0.5 text-sm font-black text-white`}
                      >
                        <IconeAtributo tipo={chave} className="h-3.5 w-3.5" />
                        {carta[chave] ?? "—"}
                      </span>
                    ))}
                  </span>
                </span>
              </button>
              <label className="flex cursor-pointer items-center gap-3 text-lg font-black text-[#3a0ca3]">
                <input
                  type="checkbox"
                  className="h-6 w-6 accent-[#ff9f1c]"
                  checked={imprimir}
                  onChange={() => onAlternarImpressao(carta.id)}
                />
                Imprimir
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => onEditar(carta)}
                  className="h-12 flex-1 rounded-2xl bg-[#4895ef] text-lg font-black text-white shadow-[0_4px_0_#3a6fd0] transition-transform active:translate-y-1 active:shadow-none"
                >
                  Mudar
                </button>
                <button
                  type="button"
                  onClick={() => onExcluir(carta.id)}
                  className="h-12 flex-1 rounded-2xl border-4 border-[#ffc2c4] bg-white text-lg font-black text-[#d62839] transition-colors hover:bg-[#fff0f0]"
                >
                  Apagar
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
      )}
    </div>
  );
}
