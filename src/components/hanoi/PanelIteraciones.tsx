"use client";

import { useEffect } from "react";
import { Layers, ListTree, Eye } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface DatosSucesor {
  estado: number[][];
  movimiento: string;
  f: number;
  g: number;
  h: number;
}

interface DatosIteracion {
  numeroPaso: number;
  estadoActual: number[][];
  g: number;
  h: number;
  f: number;
  movimiento: string;
  cantidadAbiertos: number;
  cantidadCerrados: number;
  sucesoresGenerados: DatosSucesor[];
}

interface PropsPanelIteraciones {
  iteraciones: DatosIteracion[] | undefined;
  indiceActual: number;
  cambiarIndice: (indice: number) => void;
}

export function PanelIteraciones({
  iteraciones,
  indiceActual,
  cambiarIndice,
}: PropsPanelIteraciones) {

  // Scroll automático a la iteración activa
  useEffect(function () {
    const elemento = document.getElementById("iter-" + indiceActual);
    if (elemento) {
      elemento.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [indiceActual]);

  if (!iteraciones || iteraciones.length === 0) {
    return (
      <Card className="border-slate-200 shadow-sm bg-white h-full flex items-center justify-center p-6">
        <div className="text-center space-y-2 opacity-50">
          <Layers className="h-8 w-8 text-slate-300 mx-auto" />
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Ejecute el algoritmo en modo &quot;Con Iteraciones&quot;
          </p>
        </div>
      </Card>
    );
  }

  // La iteración que se está mostrando
  const iteracionSeleccionada = iteraciones[Math.min(indiceActual, iteraciones.length - 1)];

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Detalle de la iteración seleccionada */}
      <Card className="border-slate-200 shadow-sm bg-white shrink-0">
        <CardHeader className="pb-2 border-b border-slate-100">
          <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <Eye className="h-3.5 w-3.5 text-slate-400" />
            Detalle — Iteración {iteracionSeleccionada.numeroPaso}
          </CardTitle>
        </CardHeader>

        <div className="p-4 space-y-3">
          {/* Función de evaluación: f(n) = g(n) + h(n) */}
          <div className="bg-slate-50 p-2 rounded border border-slate-100 text-center text-[10px] font-mono text-slate-500 mb-2">
            f(n) = g(n) + h(n) = <span className="text-blue-600 font-bold">{iteracionSeleccionada.g}</span> + <span className="text-orange-600 font-bold">{iteracionSeleccionada.h.toFixed(0)}</span> = <span className="text-slate-900 font-black">{iteracionSeleccionada.f.toFixed(0)}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-blue-50 p-2 rounded border border-blue-100 text-center">
              <span className="block text-[9px] text-blue-500 font-bold">g(n)</span>
              <span className="text-sm font-bold text-blue-700">{iteracionSeleccionada.g}</span>
              <span className="block text-[8px] text-blue-400 mt-0.5">Costo ruta</span>
            </div>
            <div className="bg-orange-50 p-2 rounded border border-orange-100 text-center">
              <span className="block text-[9px] text-orange-500 font-bold">h(n)</span>
              <span className="text-sm font-bold text-orange-700">{iteracionSeleccionada.h.toFixed(0)}</span>
              <span className="block text-[8px] text-orange-400 mt-0.5">Heurística</span>
            </div>
            <div className="bg-slate-100 p-2 rounded border border-slate-200 text-center">
              <span className="block text-[9px] text-slate-600 font-bold">f(n)</span>
              <span className="text-sm font-black text-slate-900">{iteracionSeleccionada.f.toFixed(0)}</span>
              <span className="block text-[8px] text-slate-400 mt-0.5">Evaluación</span>
            </div>
          </div>

          {/* Estado de las pilas */}
          <div className="space-y-1">
            <p className="text-[9px] font-bold text-slate-400 uppercase">Estado de las Torres</p>
            {iteracionSeleccionada.estadoActual.map(function (torre, indice) {
              return (
                <div key={indice} className="flex items-center gap-2 text-xs bg-slate-50 px-2 py-1 rounded border border-slate-100">
                  <span className="font-bold text-slate-500 w-14">Torre {indice + 1}:</span>
                  <span className="font-mono text-slate-700">
                    {torre.length > 0 ? "[" + torre.join(", ") + "]" : "[ ]"}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Contadores */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-50 p-2 rounded border border-blue-100">
              <span className="block text-[9px] text-blue-500 font-bold uppercase">Nodos Abiertos</span>
              <span className="text-sm font-bold text-blue-700">{iteracionSeleccionada.cantidadAbiertos}</span>
            </div>
            <div className="bg-orange-50 p-2 rounded border border-orange-100">
              <span className="block text-[9px] text-orange-500 font-bold uppercase">Nodos Cerrados</span>
              <span className="text-sm font-bold text-orange-700">{iteracionSeleccionada.cantidadCerrados}</span>
            </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* Sucesores */}
          <div className="space-y-1.5">
            <p className="text-[9px] font-bold text-slate-400 uppercase">
              Sucesores Generados ({iteracionSeleccionada.sucesoresGenerados.length})
            </p>
            {iteracionSeleccionada.sucesoresGenerados.map(function (sucesor, indice) {
              return (
                <div key={indice} className="bg-slate-50 p-2 rounded border border-slate-100 text-[10px]">
                  <p className="font-bold text-slate-600">{sucesor.movimiento}</p>
                  <p className="text-slate-400 font-mono mt-0.5">
                    g={sucesor.g} h={sucesor.h.toFixed(0)} f={sucesor.f.toFixed(0)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Lista de iteraciones */}
      <Card className="border-slate-200 shadow-sm bg-white flex-1 flex flex-col overflow-hidden min-h-0">
        <CardHeader className="pb-2 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <ListTree className="h-3.5 w-3.5 text-slate-400" />
            Todas las Iteraciones
            <Badge variant="secondary" className="text-[9px] py-0 h-4 bg-slate-100 text-slate-600 ml-auto">
              {iteraciones.length}
            </Badge>
          </CardTitle>
        </CardHeader>

        <ScrollArea className="flex-1 min-h-0">
          <div className="p-3 space-y-1">
            {iteraciones.map(function (iteracion, indice) {
              const estaActivo = indice === indiceActual;

              return (
                <button
                  key={indice}
                  id={"iter-" + indice}
                  onClick={() => cambiarIndice(indice)}
                  className={
                    "w-full text-left p-2 rounded-lg text-[10px] border transition-all " +
                    (estaActivo
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50 hover:border-slate-300")
                  }
                >
                  <div className={"flex justify-between " + (estaActivo ? "text-white/60" : "text-slate-300")}>
                    <span className="font-bold">ITER {indice.toString().padStart(3, "0")}</span>
                    <span className="font-mono">f:{iteracion.f.toFixed(0)}</span>
                  </div>
                  <p className={"truncate font-bold mt-0.5 " + (estaActivo ? "text-white" : "text-slate-600")}>
                    {iteracion.movimiento}
                  </p>
                  <p className={"text-[9px] mt-0.5 " + (estaActivo ? "text-white/50" : "text-slate-300")}>
                    Abiertos: {iteracion.cantidadAbiertos} | Cerrados: {iteracion.cantidadCerrados}
                  </p>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
