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
  nodosAbiertos: string[];
  nodosCerrados: string[];
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
    var elemento = document.getElementById("iter-" + indiceActual);
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
            Ejecute el algoritmo en modo &quot;Paso a Paso&quot;
          </p>
        </div>
      </Card>
    );
  }

  // La iteración que se está mostrando
  var indiceSeguro = Math.min(indiceActual, iteraciones.length - 1);
  var iteracionSeleccionada = iteraciones[indiceSeguro];

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Detalle de la iteración seleccionada */}
      <Card className="border-slate-200 shadow-sm bg-white shrink-0">
        <CardHeader className="pb-2 border-b border-slate-100">
          <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <Eye className="h-3.5 w-3.5 text-slate-400" />
            Paso {iteracionSeleccionada.numeroPaso}
          </CardTitle>
        </CardHeader>

        <ScrollArea className="max-h-[500px]">
          <div className="p-4 space-y-3">
            {/* Función de evaluación: f(n) = g(n) + h(n) */}
            <div className="bg-slate-50 p-2 rounded border border-slate-100 text-center text-[10px] font-mono text-slate-500">
              f(n) = g(n) + h(n) = <span className="text-blue-600 font-bold">{iteracionSeleccionada.g}</span> + <span className="text-orange-600 font-bold">{(iteracionSeleccionada.h).toFixed(0)}</span> = <span className="text-slate-900 font-black">{iteracionSeleccionada.f.toFixed(0)}</span>
            </div>

            {/* Cajas g, h, f */}
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

            {/* Estado de las torres (pilas) */}
            <div className="space-y-1">
              <p className="text-[9px] font-bold text-slate-400 uppercase">Estado Actual de las Torres</p>
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

            <Separator className="bg-slate-100" />

            {/* Nodos ABIERTOS */}
            <div className="space-y-1">
              <p className="text-[9px] font-bold text-blue-500 uppercase">
                Nodos Abiertos ({iteracionSeleccionada.nodosAbiertos.length})
              </p>
              <div className="bg-blue-50 p-2 rounded border border-blue-100 max-h-32 overflow-y-auto">
                {iteracionSeleccionada.nodosAbiertos.length === 0 ? (
                  <p className="text-[9px] text-blue-400 italic">Vacío</p>
                ) : (
                  iteracionSeleccionada.nodosAbiertos.map(function (nodo, indice) {
                    return (
                      <p key={indice} className="text-[9px] font-mono text-blue-600 leading-relaxed">
                        {nodo}
                      </p>
                    );
                  })
                )}
              </div>
            </div>

            {/* Nodos CERRADOS */}
            <div className="space-y-1">
              <p className="text-[9px] font-bold text-orange-500 uppercase">
                Nodos Cerrados ({iteracionSeleccionada.nodosCerrados.length})
              </p>
              <div className="bg-orange-50 p-2 rounded border border-orange-100 max-h-32 overflow-y-auto">
                {iteracionSeleccionada.nodosCerrados.length === 0 ? (
                  <p className="text-[9px] text-orange-400 italic">Vacío</p>
                ) : (
                  iteracionSeleccionada.nodosCerrados.map(function (nodo, indice) {
                    return (
                      <p key={indice} className="text-[9px] font-mono text-orange-600 leading-relaxed">
                        {nodo}
                      </p>
                    );
                  })
                )}
              </div>
            </div>

            <Separator className="bg-slate-100" />

            {/* Sucesores generados */}
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
        </ScrollArea>
      </Card>

      {/* Lista de todas las iteraciones */}
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
              var estaActivo = indice === indiceActual;

              return (
                <button
                  key={indice}
                  id={"iter-" + indice}
                  onClick={function () { cambiarIndice(indice); }}
                  className={
                    "w-full text-left p-2 rounded-lg text-[10px] border transition-all " +
                    (estaActivo
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50 hover:border-slate-300")
                  }
                >
                  <div className={"flex justify-between " + (estaActivo ? "text-white/60" : "text-slate-300")}>
                    <span className="font-bold">PASO {indice}</span>
                    <span className="font-mono">f:{iteracion.f.toFixed(0)}</span>
                  </div>
                  <p className={"truncate font-bold mt-0.5 " + (estaActivo ? "text-white" : "text-slate-600")}>
                    {iteracion.movimiento}
                  </p>
                  <p className={"text-[9px] mt-0.5 " + (estaActivo ? "text-white/50" : "text-slate-300")}>
                    Abiertos: {iteracion.nodosAbiertos.length} | Cerrados: {iteracion.nodosCerrados.length}
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
