"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PropsNavegadorPasos {
  indiceActual: number;
  totalPasos: number;
  cambiarIndice: (indice: number) => void;
  // Datos del nodo actual para mostrar f = g + h
  gActual?: number;
  hActual?: number;
  fActual?: number;
}

export function NavegadorPasos({
  indiceActual,
  totalPasos,
  cambiarIndice,
  gActual,
  hActual,
  fActual,
}: PropsNavegadorPasos) {
  const ultimoIndice = totalPasos > 0 ? totalPasos - 1 : 0;

  // Calcular el progreso en porcentaje
  const progreso = totalPasos > 1
    ? Math.round((indiceActual / (totalPasos - 1)) * 100)
    : 0;

  return (
    <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
      {/* Barra de progreso superior (bien visible) */}
      <div className="w-full h-3 bg-slate-100 relative">
        <div
          className="h-full bg-slate-700 transition-all duration-300"
          style={{ width: progreso + "%" }}
        />
        {/* Indicador de posición */}
        <div
          className="absolute top-0 h-full w-[3px] bg-white shadow transition-all duration-300"
          style={{ left: progreso + "%" }}
        />
      </div>

      <div className="p-4 flex items-center justify-between">
        {/* Controles de navegación */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-slate-200 hover:bg-slate-100"
            onClick={() => cambiarIndice(Math.max(0, indiceActual - 1))}
            disabled={indiceActual === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex flex-col items-center min-w-[60px]">
            <span className="text-[9px] text-slate-400 font-bold uppercase">Paso</span>
            <span className="text-sm font-mono font-bold text-slate-700">
              {indiceActual}
              <span className="text-slate-300 mx-1">/</span>
              <span className="text-slate-400">{ultimoIndice}</span>
            </span>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-slate-200 hover:bg-slate-100"
            onClick={() => cambiarIndice(Math.min(ultimoIndice, indiceActual + 1))}
            disabled={indiceActual >= ultimoIndice}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Función de evaluación f(n) = g(n) + h(n) */}
        {gActual !== undefined && hActual !== undefined && fActual !== undefined && (
          <div className="flex items-center gap-2 text-[10px] font-mono bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
            <span className="text-slate-400 font-bold">f(n) =</span>
            <span className="text-blue-600 font-bold" title="g(n): Costo de la ruta">
              {gActual}
            </span>
            <span className="text-slate-400">+</span>
            <span className="text-orange-600 font-bold" title="h(n): Estimación heurística">
              {hActual.toFixed(0)}
            </span>
            <span className="text-slate-400">=</span>
            <span className="text-slate-900 font-black">
              {fActual.toFixed(0)}
            </span>
          </div>
        )}

        {/* Progreso */}
        <div className="flex flex-col items-end">
          <span className="text-[9px] text-slate-400 font-bold uppercase">Progreso</span>
          <span className="text-sm font-bold text-slate-700">{progreso}%</span>
        </div>
      </div>

      {/* Leyenda de la fórmula */}
      {gActual !== undefined && (
        <div className="px-4 pb-3 flex gap-4 text-[9px] text-slate-400">
          <span>
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1" />
            g(n) = costo ruta ({gActual} mov)
          </span>
          <span>
            <span className="inline-block w-2 h-2 rounded-full bg-orange-500 mr-1" />
            h(n) = heurística ({hActual?.toFixed(0)})
          </span>
        </div>
      )}
    </Card>
  );
}
