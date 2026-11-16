"use client";

import Image from "next/image";
import { useEffect, useRef, type PointerEvent } from "react";
import { limitarPosicao, limitarZoom } from "@/lib/carta";

type FotoCartaProps = {
  src: string;
  alt: string;
  x: number;
  y: number;
  zoom: number;
  onMove?: (x: number, y: number) => void;
  onZoom?: (zoom: number) => void;
};

type Arraste = {
  ponteiroX: number;
  ponteiroY: number;
  x: number;
  y: number;
};

type Ponto = {
  x: number;
  y: number;
};

type Pinca = {
  distancia: number;
  zoom: number;
};

export function FotoCarta({
  src,
  alt,
  x,
  y,
  zoom,
  onMove,
  onZoom,
}: FotoCartaProps) {
  const areaRef = useRef<HTMLDivElement>(null);
  const arraste = useRef<Arraste | null>(null);
  const ponteiros = useRef(new Map<number, Ponto>());
  const pinca = useRef<Pinca | null>(null);
  useEffect(() => {
    const area = areaRef.current;

    if (!area || !onZoom) {
      return;
    }

    function aoRolar(event: WheelEvent) {
      event.preventDefault();
      const passo = event.deltaY < 0 ? 0.1 : -0.1;
      onZoom(limitarZoom(zoom + passo));
    }

    area.addEventListener("wheel", aoRolar, { passive: false });

    return () => area.removeEventListener("wheel", aoRolar);
  }, [onZoom, zoom]);

  function iniciar(event: PointerEvent<HTMLDivElement>) {
    if (!onMove && !onZoom) {
      return;
    }

    ponteiros.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      ponteiros.current.delete(event.pointerId);
      return;
    }

    if (ponteiros.current.size >= 2 && onZoom) {
      arraste.current = null;
      pinca.current = {
        distancia: distanciaDosPonteiros(),
        zoom,
      };
      return;
    }

    if (!onMove) {
      return;
    }

    arraste.current = {
      ponteiroX: event.clientX,
      ponteiroY: event.clientY,
      x,
      y,
    };
  }

  function mover(event: PointerEvent<HTMLDivElement>) {
    if (!ponteiros.current.has(event.pointerId)) {
      return;
    }

    ponteiros.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    if (ponteiros.current.size >= 2 && pinca.current && onZoom) {
      const distancia = distanciaDosPonteiros();

      if (pinca.current.distancia > 0) {
        onZoom(
          limitarZoom(
            pinca.current.zoom * (distancia / pinca.current.distancia),
          ),
        );
      }

      return;
    }

    const inicio = arraste.current;

    if (!inicio || !onMove) {
      return;
    }

    const area = event.currentTarget.getBoundingClientRect();

    if (area.width === 0 || area.height === 0) {
      return;
    }

    const deslocamentoX = ((event.clientX - inicio.ponteiroX) / area.width) * 100;
    const deslocamentoY = ((event.clientY - inicio.ponteiroY) / area.height) * 100;

    onMove(
      limitarPosicao(inicio.x - deslocamentoX),
      limitarPosicao(inicio.y - deslocamentoY),
    );
  }

  function soltar(event: PointerEvent<HTMLDivElement>) {
    ponteiros.current.delete(event.pointerId);
    pinca.current = null;

    if (ponteiros.current.size === 0) {
      arraste.current = null;
    }
  }

  function distanciaDosPonteiros(): number {
    const pontos = [...ponteiros.current.values()];
    const primeiro = pontos[0];
    const segundo = pontos[1];

    if (!primeiro || !segundo) {
      return 0;
    }

    return Math.hypot(primeiro.x - segundo.x, primeiro.y - segundo.y);
  }

  function ajustarZoom(passo: number) {
    onZoom?.(limitarZoom(zoom + passo));
  }

  return (
    <div
      ref={areaRef}
      role={onMove ? "group" : undefined}
      aria-label={onMove ? "Foto da carta" : undefined}
      className={`absolute inset-0 ${onMove ? "cursor-grab touch-none active:cursor-grabbing" : ""}`}
      onPointerDown={onMove || onZoom ? iniciar : undefined}
      onPointerMove={onMove || onZoom ? mover : undefined}
      onPointerUp={onMove || onZoom ? soltar : undefined}
      onPointerCancel={onMove || onZoom ? soltar : undefined}
    >
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        loading="eager"
        draggable={false}
        sizes="248px"
        className="pointer-events-none object-cover"
        style={{
          objectPosition: `${x}% ${y}%`,
          transform: `scale(${zoom})`,
        }}
      />
      {onZoom ? (
        <div className="absolute left-2 top-2 z-30 flex flex-col gap-1">
          <button
            type="button"
            aria-label="Aproximar a foto"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => ajustarZoom(0.1)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xl font-black text-[#3a0ca3] shadow"
          >
            +
          </button>
          <button
            type="button"
            aria-label="Afastar a foto"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => ajustarZoom(-0.1)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xl font-black text-[#3a0ca3] shadow"
          >
            −
          </button>
        </div>
      ) : null}
      {onMove ? (
        <span className="pointer-events-none absolute bottom-2 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/55 px-3 py-1 text-xs font-bold text-white">
          Arraste a foto
        </span>
      ) : null}
    </div>
  );
}
