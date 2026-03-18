"use client";

import React, { useEffect, useState } from "react";
import { aEstrella, Resultado, TipoHeuristica } from "@/lib/algoritmo-a-estrella";
import { Cabecera } from "@/components/hanoi/Cabecera";
import { PanelControl } from "@/components/hanoi/PanelControl";
import { VisualizadorTorres } from "@/components/hanoi/VisualizadorTorres";
import { NavegadorPasos } from "@/components/hanoi/NavegadorPasos";
import { HistorialMovimientos } from "@/components/hanoi/HistorialMovimientos";
import { PanelIteraciones } from "@/components/hanoi/PanelIteraciones";

type ModoVisualizacion = "movimientos" | "iteraciones";

function crearEstadoInicial(numeroDiscos: number): number[][] {
  const torre1: number[] = [];

  for (let disco = numeroDiscos; disco >= 1; disco--) {
    torre1.push(disco);
  }

  return [torre1, [], []];
}

export default function PaginaPrincipal() {
  // Configuracion del usuario
  const [numeroDiscos, setNumeroDiscos] = useState(3);
  const [tipoHeuristica, setTipoHeuristica] = useState<TipoHeuristica>(1);
  const [modoVisualizacion, setModoVisualizacion] = useState<ModoVisualizacion>("movimientos");
  const [velocidad, setVelocidad] = useState(500);

  // Estado de ejecucion
  const [resolviendo, setResolviendo] = useState(false);
  const [resultado, setResultado] = useState<Resultado | null>(null);

  // Navegacion / reproduccion
  const [indicePasoActual, setIndicePasoActual] = useState(0);
  const [reproduciendo, setReproduciendo] = useState(false);

  function limpiarVisualizacion() {
    setResultado(null);
    setIndicePasoActual(0);
    setReproduciendo(false);
  }

  function cambiarDiscos(nuevoNumero: number) {
    setNumeroDiscos(nuevoNumero);
    limpiarVisualizacion();
  }

  function cambiarHeuristica(nuevaHeuristica: TipoHeuristica) {
    setTipoHeuristica(nuevaHeuristica);
    limpiarVisualizacion();
  }

  function cambiarModo(nuevoModo: ModoVisualizacion) {
    setModoVisualizacion(nuevoModo);
    setIndicePasoActual(0);
    setReproduciendo(false);
  }

  function cambiarPaso(indice: number) {
    setReproduciendo(false);
    setIndicePasoActual(indice);
  }

  function reiniciar() {
    setIndicePasoActual(0);
    setReproduciendo(false);
  }

  function ejecutarAlgoritmo() {
    setResolviendo(true);
    setReproduciendo(false);

    // Timeout corto para que se vea el estado "Calculando..."
    setTimeout(() => {
      const res = aEstrella(numeroDiscos, tipoHeuristica);
      setResultado(res);
      setIndicePasoActual(0);
      setResolviendo(false);
    }, 100);
  }

  // Reproduccion automatica de pasos
  useEffect(() => {
    if (!reproduciendo || !resultado) {
      return;
    }

    const totalPasos =
      modoVisualizacion === "movimientos" ? resultado.pasos.length : resultado.iteraciones.length;

    if (totalPasos <= 1) {
      return;
    }

    const temporizador = window.setInterval(() => {
      setIndicePasoActual((anterior) => {
        if (anterior >= totalPasos - 1) {
          setReproduciendo(false);
          return anterior;
        }

        return anterior + 1;
      });
    }, velocidad);

    return () => {
      window.clearInterval(temporizador);
    };
  }, [reproduciendo, resultado, modoVisualizacion, velocidad, indicePasoActual]);

  const totalPasos = !resultado
    ? 0
    : modoVisualizacion === "movimientos"
      ? resultado.pasos.length
      : resultado.iteraciones.length;

  const estadoActual = (() => {
    if (!resultado) {
      return crearEstadoInicial(numeroDiscos);
    }

    if (modoVisualizacion === "movimientos") {
      return resultado.pasos[indicePasoActual]?.estado ?? crearEstadoInicial(numeroDiscos);
    }

    const indiceSeguro = Math.min(indicePasoActual, Math.max(0, resultado.iteraciones.length - 1));
    return resultado.iteraciones[indiceSeguro]?.estadoActual ?? crearEstadoInicial(numeroDiscos);
  })();

  const datosNodoActual = (() => {
    if (!resultado) {
      return { g: undefined, h: undefined, f: undefined };
    }

    if (modoVisualizacion === "movimientos") {
      const paso = resultado.pasos[indicePasoActual];
      return { g: paso?.g, h: paso?.h, f: paso?.f };
    }

    const indiceSeguro = Math.min(indicePasoActual, Math.max(0, resultado.iteraciones.length - 1));
    const iteracion = resultado.iteraciones[indiceSeguro];
    return { g: iteracion?.g, h: iteracion?.h, f: iteracion?.f };
  })();

  const textoEstado = resolviendo
    ? "CALCULANDO..."
    : !resultado
      ? "PENDIENTE"
      : resultado.solucionEncontrada
        ? "SOLUCION ENCONTRADA"
        : "SIN SOLUCION";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <div className="container mx-auto py-6 px-4 max-w-[1600px]">
        <Cabecera
          textoEstado={textoEstado}
          reproduciendo={reproduciendo}
          cambiarReproduccion={setReproduciendo}
          reiniciar={reiniciar}
          tieneResultado={!!resultado}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <PanelControl
              numeroDiscos={numeroDiscos}
              cambiarNumeroDiscos={cambiarDiscos}
              tipoHeuristica={tipoHeuristica}
              cambiarTipoHeuristica={cambiarHeuristica}
              modoVisualizacion={modoVisualizacion}
              cambiarModoVisualizacion={cambiarModo}
              velocidad={velocidad}
              cambiarVelocidad={setVelocidad}
              resolviendo={resolviendo}
              ejecutarAlgoritmo={ejecutarAlgoritmo}
            />
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4">
            <VisualizadorTorres estado={estadoActual} numeroDiscos={numeroDiscos} />
            <NavegadorPasos
              indiceActual={indicePasoActual}
              totalPasos={totalPasos}
              cambiarIndice={cambiarPaso}
              gActual={datosNodoActual.g}
              hActual={datosNodoActual.h}
              fActual={datosNodoActual.f}
            />
          </div>

          <div className="lg:col-span-4">
            {modoVisualizacion === "movimientos" ? (
              <HistorialMovimientos
                pasos={resultado?.pasos}
                indiceActual={indicePasoActual}
                cambiarIndice={cambiarPaso}
                nodosExpandidos={resultado?.nodosExpandidos}
                totalMovimientos={resultado?.totalMovimientos}
              />
            ) : (
              <PanelIteraciones
                iteraciones={resultado?.iteraciones}
                indiceActual={indicePasoActual}
                cambiarIndice={cambiarPaso}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
