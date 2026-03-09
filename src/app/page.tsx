"use client";

import React, { useState, useEffect } from "react";
import { aEstrella, Resultado } from "@/lib/algoritmo-a-estrella";
import { Cabecera } from "@/components/hanoi/Cabecera";
import { PanelControl } from "@/components/hanoi/PanelControl";
import { VisualizadorTorres } from "@/components/hanoi/VisualizadorTorres";
import { NavegadorPasos } from "@/components/hanoi/NavegadorPasos";
import { HistorialMovimientos } from "@/components/hanoi/HistorialMovimientos";
import { PanelIteraciones } from "@/components/hanoi/PanelIteraciones";

export default function PaginaPrincipal() {
  // ---------- ESTADO DE LA APP ----------

  // Configuración del algoritmo
  var [numeroDiscos, setNumeroDiscos] = useState(3);
  var [tipoHeuristica, setTipoHeuristica] = useState(1);
  var [formula, setFormula] = useState("2**k - 1");
  var [modoVisualizacion, setModoVisualizacion] = useState<"movimientos" | "iteraciones">("movimientos");

  // Estado del algoritmo
  var [resolviendo, setResolviendo] = useState(false);
  var [resultado, setResultado] = useState<Resultado | null>(null);

  // Navegación
  var [indicePasoActual, setIndicePasoActual] = useState(0);
  var [reproduciendo, setReproduciendo] = useState(false);
  var [velocidad, setVelocidad] = useState(500);

  // ---------- FUNCIONES ----------

  // Cambiar número de discos y limpiar resultado anterior
  function cambiarDiscos(nuevoNumero: number) {
    setNumeroDiscos(nuevoNumero);
    setResultado(null);
    setIndicePasoActual(0);
    setReproduciendo(false);
  }

  // Ejecutar el algoritmo A*
  function ejecutarAlgoritmo() {
    setResolviendo(true);
    setReproduciendo(false);

    // Pequeño timeout para que React muestre el loading
    setTimeout(function () {
      var res = aEstrella(numeroDiscos, tipoHeuristica, formula);
      setResultado(res);
      setIndicePasoActual(0);
      setResolviendo(false);
    }, 100);
  }

  // Reproducción automática
  useEffect(function () {
    if (!reproduciendo || !resultado) {
      return;
    }

    // Determinar el total de pasos según el modo
    var totalPasos = modoVisualizacion === "movimientos"
      ? resultado.pasos.length
      : resultado.iteraciones.length;

    if (indicePasoActual >= totalPasos - 1) {
      setReproduciendo(false);
      return;
    }

    var temporizador = setInterval(function () {
      setIndicePasoActual(function (anterior) {
        var siguiente = anterior + 1;
        if (siguiente >= totalPasos - 1) {
          setReproduciendo(false);
        }
        return Math.min(siguiente, totalPasos - 1);
      });
    }, velocidad);

    return function () {
      clearInterval(temporizador);
    };
  }, [reproduciendo, resultado, indicePasoActual, velocidad, modoVisualizacion]);

  // Reiniciar navegación
  function reiniciar() {
    setIndicePasoActual(0);
    setReproduciendo(false);
  }

  // ---------- DATOS DERIVADOS ----------

  // Estado actual de las torres para mostrar en el visualizador
  function obtenerEstadoActual(): number[][] {
    if (!resultado) {
      // Estado inicial: todos los discos en torre 1
      var torre1: number[] = [];
      for (var i = numeroDiscos; i >= 1; i--) {
        torre1.push(i);
      }
      return [torre1, [], []];
    }

    if (modoVisualizacion === "movimientos") {
      var paso = resultado.pasos[indicePasoActual];
      if (paso) return paso.estado;
      return [[], [], []];
    } else {
      var indiceSeguro = Math.min(indicePasoActual, resultado.iteraciones.length - 1);
      var iteracion = resultado.iteraciones[indiceSeguro];
      if (iteracion) return iteracion.estadoActual;
      return [[], [], []];
    }
  }

  // Total de pasos según el modo
  function obtenerTotalPasos(): number {
    if (!resultado) return 0;

    if (modoVisualizacion === "movimientos") {
      return resultado.pasos.length;
    } else {
      return resultado.iteraciones.length;
    }
  }

  // Texto del estado para la cabecera
  function obtenerTextoEstado(): string {
    if (resolviendo) return "CALCULANDO...";
    if (!resultado) return "PENDIENTE";
    if (resultado.solucionEncontrada) return "SOLUCIÓN ENCONTRADA";
    return "SIN SOLUCIÓN";
  }

  // Obtener los datos g, h, f del nodo actual
  function obtenerDatosNodoActual(): { g?: number; h?: number; f?: number } {
    if (!resultado) return {};

    if (modoVisualizacion === "movimientos") {
      var paso = resultado.pasos[indicePasoActual];
      if (!paso) return {};
      return { g: paso.g, h: paso.h, f: paso.f };
    } else {
      var indiceSeguro = Math.min(indicePasoActual, resultado.iteraciones.length - 1);
      var iteracion = resultado.iteraciones[indiceSeguro];
      if (!iteracion) return {};
      return { g: iteracion.g, h: iteracion.h, f: iteracion.f };
    }
  }

  var estadoActual = obtenerEstadoActual();
  var totalPasos = obtenerTotalPasos();
  var datosNodo = obtenerDatosNodoActual();

  // ---------- RENDERIZADO ----------

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <div className="container mx-auto py-6 px-4 max-w-[1600px]">
        {/* Cabecera */}
        <Cabecera
          textoEstado={obtenerTextoEstado()}
          reproduciendo={reproduciendo}
          cambiarReproduccion={setReproduciendo}
          reiniciar={reiniciar}
          tieneResultado={!!resultado}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Columna izquierda: Controles */}
          <div className="lg:col-span-3">
            <PanelControl
              numeroDiscos={numeroDiscos}
              cambiarNumeroDiscos={cambiarDiscos}
              tipoHeuristica={tipoHeuristica}
              cambiarTipoHeuristica={setTipoHeuristica}
              formula={formula}
              cambiarFormula={setFormula}
              modoVisualizacion={modoVisualizacion}
              cambiarModoVisualizacion={setModoVisualizacion}
              velocidad={velocidad}
              cambiarVelocidad={setVelocidad}
              resolviendo={resolviendo}
              ejecutarAlgoritmo={ejecutarAlgoritmo}
            />
          </div>

          {/* Columna central: Visualización */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <VisualizadorTorres
              estado={estadoActual}
              numeroDiscos={numeroDiscos}
            />
            <NavegadorPasos
              indiceActual={indicePasoActual}
              totalPasos={totalPasos}
              cambiarIndice={function (indice: number) {
                setReproduciendo(false);
                setIndicePasoActual(indice);
              }}
              gActual={datosNodo.g}
              hActual={datosNodo.h}
              fActual={datosNodo.f}
            />
          </div>

          {/* Columna derecha: Historial / Iteraciones */}
          <div className="lg:col-span-4">
            {modoVisualizacion === "movimientos" ? (
              <HistorialMovimientos
                pasos={resultado?.pasos}
                indiceActual={indicePasoActual}
                cambiarIndice={function (indice: number) {
                  setReproduciendo(false);
                  setIndicePasoActual(indice);
                }}
                nodosExpandidos={resultado?.nodosExpandidos}
                totalMovimientos={resultado?.totalMovimientos}
              />
            ) : (
              <PanelIteraciones
                iteraciones={resultado?.iteraciones}
                indiceActual={indicePasoActual}
                cambiarIndice={function (indice: number) {
                  setReproduciendo(false);
                  setIndicePasoActual(indice);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
