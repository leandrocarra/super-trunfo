"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import { BotaoImprimir } from "@/components/botao-imprimir";
import { CartaForm } from "@/components/carta-form";
import { CartaPreview } from "@/components/carta-preview";
import { CartasSalvas } from "@/components/cartas-salvas";
import { FolhaImpressao } from "@/components/folha-impressao";
import {
  POSICAO_IMAGEM_X,
  POSICAO_IMAGEM_Y,
  ZOOM_IMAGEM_PADRAO,
  cartaParaRascunho,
  rascunhoParaCarta,
  rascunhoVazio,
  type Carta,
  type RascunhoCarta,
} from "@/lib/carta";
import {
  getCartasProntas,
  getCartasProntasServidor,
  getCartasServerSnapshot,
  getCartasSnapshot,
  persistirCartas,
  removerCarta,
  salvarCarta,
  subscribeCartas,
} from "@/lib/cartas-storage";
import { codigoValido, sortearCodigo } from "@/lib/codigo-trunfo";
import type { TemplateCarta } from "@/lib/template-carta";

let codigoInicial: string | null = null;

function inscreverCodigo(): () => void {
  return () => {};
}

function codigoNoNavegador(): string {
  if (codigoInicial === null) {
    codigoInicial = sortearCodigo(
      getCartasSnapshot().map((carta) => carta.codigo),
    );
  }

  return codigoInicial;
}

function codigoNoServidor(): string {
  return "1A";
}

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

export function EditorCartas() {
  const codigoNova = useSyncExternalStore(
    inscreverCodigo,
    codigoNoNavegador,
    codigoNoServidor,
  );
  const [rascunho, setRascunho] = useState<RascunhoCarta>(() => ({
    ...rascunhoVazio(),
    codigo: "",
  }));
  const [erroSalvar, setErroSalvar] = useState<string | null>(null);
  const [idsImpressao, setIdsImpressao] = useState<string[] | null>(null);
  const cartaTopoRef = useRef<HTMLDivElement>(null);
  const rascunhoNaTela =
    rascunho.id === null && !codigoValido(rascunho.codigo)
      ? { ...rascunho, codigo: codigoNova }
      : rascunho;
  const cartas = useSyncExternalStore(
    subscribeCartas,
    getCartasSnapshot,
    getCartasServerSnapshot,
  );
  const prontas = useSyncExternalStore(
    subscribeCartas,
    getCartasProntas,
    getCartasProntasServidor,
  );

  const cartaValidada = rascunhoParaCarta(
    rascunho,
    rascunho.id ?? "rascunho",
  );
  const idsSalvas = cartas.map((carta) => carta.id);
  const selecionadasImpressao = (idsImpressao ?? idsSalvas).filter((id) =>
    idsSalvas.includes(id),
  );
  const cartasImpressao = cartas.filter((carta) =>
    selecionadasImpressao.includes(carta.id),
  );

  function atualizarCampo(campo: Campo, valor: string) {
    setRascunho((atual) => ({
      ...atual,
      [campo]: valor,
      ...(campo === "imagem"
        ? {
            imagemX: POSICAO_IMAGEM_X,
            imagemY: POSICAO_IMAGEM_Y,
            imagemZoom: ZOOM_IMAGEM_PADRAO,
          }
        : {}),
    }));
  }

  function atualizarPosicao(imagemX: number, imagemY: number) {
    setRascunho((atual) => ({ ...atual, imagemX, imagemY }));
  }

  const atualizarZoom = useCallback((imagemZoom: number) => {
    setRascunho((atual) => ({ ...atual, imagemZoom }));
  }, []);

  function atualizarTrunfo(valor: boolean) {
    setRascunho((atual) => ({ ...atual, trunfo: valor }));
  }

  function atualizarTemplate(valor: TemplateCarta) {
    setRascunho((atual) => ({ ...atual, template: valor }));
  }

  async function handleSalvar() {
    const id = rascunho.id ?? crypto.randomUUID();
    const usados = cartas
      .filter((carta) => carta.id !== id)
      .map((carta) => carta.codigo);
    const codigo =
      codigoValido(rascunhoNaTela.codigo) && !usados.includes(rascunhoNaTela.codigo)
        ? rascunhoNaTela.codigo
        : sortearCodigo(usados);
    const carta = rascunhoParaCarta({ ...rascunhoNaTela, codigo }, id);

    if (!carta) {
      return;
    }

    try {
      await persistirCartas(salvarCarta(cartas, carta));
      setErroSalvar(null);
      setRascunho(cartaParaRascunho(carta));
      setIdsImpressao((atual) =>
        atual === null || atual.includes(carta.id) ? atual : [...atual, carta.id],
      );
    } catch (falha) {
      setErroSalvar(
        falha instanceof Error ? falha.message : "Não foi possível guardar as cartas",
      );
    }
  }

  function handleNova() {
    setRascunho(rascunhoVazio(cartas.map((carta) => carta.codigo)));
  }

  function handleEditar(carta: Carta) {
    setRascunho(cartaParaRascunho(carta));
    cartaTopoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function alternarImpressao(id: string) {
    setIdsImpressao((atual) => {
      const base = new Set(atual ?? cartas.map((item) => item.id));

      if (base.has(id)) {
        base.delete(id);
      } else {
        base.add(id);
      }

      return [...base];
    });
  }

  function marcarImpressao(marcar: boolean) {
    setIdsImpressao(marcar ? cartas.map((carta) => carta.id) : []);
  }

  async function handleExcluir(id: string) {
    if (!window.confirm("Quer mesmo apagar esta carta?")) {
      return;
    }

    try {
      await persistirCartas(removerCarta(cartas, id));
      setErroSalvar(null);
      setIdsImpressao((atual) => atual?.filter((item) => item !== id) ?? null);
    } catch (falha) {
      setErroSalvar(
        falha instanceof Error ? falha.message : "Não foi possível guardar as cartas",
      );
      return;
    }

    if (rascunho.id === id) {
      setRascunho(
        rascunhoVazio(
          cartas.filter((carta) => carta.id !== id).map((carta) => carta.codigo),
        ),
      );
    }
  }

  return (
    <>
      <div className="flex flex-1 flex-col bg-gradient-to-b from-[#fff4d6] via-[#ffeef5] to-[#e3f0ff] px-4 py-8 sm:px-8 print:hidden">
        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10">
          <header className="text-center lg:text-left">
            <h1 className="text-4xl font-black tracking-tight text-[#3a0ca3] [text-shadow:0_3px_0_#ffd23f] sm:text-5xl">
              Monte sua carta!
            </h1>
            <p className="mt-3 text-lg font-bold text-[#3a0ca3]/70">
              Escreva o nome, escolha uma foto e veja sua carta aparecer.
            </p>
          </header>
          <section className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
            <div className="flex flex-col gap-3">
              <CartaForm
                rascunho={rascunhoNaTela}
                podeSalvar={cartaValidada !== null && prontas}
                editando={rascunho.id !== null}
                onChange={atualizarCampo}
                onTemplateChange={atualizarTemplate}
                onTrunfoChange={atualizarTrunfo}
                onSalvar={handleSalvar}
                onNova={handleNova}
              />
              {erroSalvar ? (
                <p className="text-base font-bold text-[#d62839]">{erroSalvar}</p>
              ) : null}
            </div>
            <div
              ref={cartaTopoRef}
              className="flex scroll-mt-8 justify-center lg:sticky lg:top-8 lg:justify-end"
            >
              <CartaPreview
                rascunho={rascunhoNaTela}
                onPosicaoImagem={atualizarPosicao}
                onZoomImagem={atualizarZoom}
              />
            </div>
          </section>
          <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <h2 className="text-2xl font-black text-[#3a0ca3]">
                Minhas cartas
              </h2>
              <BotaoImprimir
                quantidade={cartasImpressao.length}
                total={cartas.length}
              />
            </div>
            <CartasSalvas
              cartas={cartas}
              carregando={!prontas}
              selecionadaId={rascunho.id}
              idsImpressao={selecionadasImpressao}
              onEditar={handleEditar}
              onExcluir={handleExcluir}
              onAlternarImpressao={alternarImpressao}
              onMarcarImpressao={marcarImpressao}
            />
          </section>
        </main>
      </div>
      <FolhaImpressao cartas={cartasImpressao} />
    </>
  );
}
