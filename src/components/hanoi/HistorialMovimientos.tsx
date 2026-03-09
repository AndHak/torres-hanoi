"use client";

import { useEffect, useRef } from "react";
import { History, Terminal, Trophy } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface DatosPaso {
  estado: number[][];
  g: number;
  h: number;
  f: number;
  movimiento: string;
}

interface PropsHistorialMovimientos {
  pasos: DatosPaso[] | undefined;
  indiceActual: number;
  cambiarIndice: (indice: number) => void;
  nodosExpandidos?: number;
  totalMovimientos?: number;
}

export function HistorialMovimientos({
  pasos,
  indiceActual,
  cambiarIndice,
  nodosExpandidos,
  totalMovimientos,
}: PropsHistorialMovimientos) {
  const referencia = useRef<HTMLDivElement>(null);

  // Hacer scroll automático al paso activo
  useEffect(function () {
    const elementoActivo = document.getElementById("paso-" + indiceActual);
    if (elementoActivo) {
      elementoActivo.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [indiceActual]);

  return (
    <Card className="border-slate-200 shadow-sm flex flex-col overflow-hidden bg-white h-full">
      <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50 shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <Terminal className="h-3.5 w-3.5 text-slate-400" /> Historial de Movimientos
          </CardTitle>
          {pasos && (
            <Badge variant="secondary" className="text-[9px] py-0 h-4 bg-green-100 text-green-700 border-none font-bold">
              COMPLETO
            </Badge>
          )}
        </div>
      </CardHeader>

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-3" ref={referencia}>
          {!pasos ? (
            <div className="flex flex-col items-center justify-center text-center p-6 space-y-3 py-16">
              <div className="bg-slate-100 p-3 rounded-full">
                <History className="h-6 w-6 text-slate-300" />
              </div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Ejecute el algoritmo para ver los movimientos
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {pasos.map(function (paso, indice) {
                const estaActivo = indice === indiceActual;

                return (
                  <button
                    key={indice}
                    id={"paso-" + indice}
                    onClick={() => cambiarIndice(indice)}
                    className={
                      "w-full text-left p-2.5 rounded-lg text-[10px] font-mono border transition-all " +
                      (estaActivo
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50 hover:border-slate-300")
                    }
                  >
                    <div
                      className={
                        "flex justify-between items-center mb-0.5 " +
                        (estaActivo ? "text-white/60" : "text-slate-300")
                      }
                    >
                      <span className="font-bold">
                        MOV {indice.toString().padStart(2, "0")}
                      </span>
                      <span>
                        g:{paso.g} h:{paso.h.toFixed(0)} f:{paso.f.toFixed(0)}
                      </span>
                    </div>
                    <p
                      className={
                        "truncate font-sans font-bold " +
                        (estaActivo ? "text-white" : "text-slate-600")
                      }
                    >
                      {paso.movimiento}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>

      {pasos && (
        <div className="p-4 border-t border-slate-100 bg-white shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
              Resultados
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <span className="text-[9px] text-slate-400 uppercase font-bold block">
                Nodos expandidos
              </span>
              <p className="text-sm font-bold text-slate-800">{nodosExpandidos}</p>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <span className="text-[9px] text-slate-400 uppercase font-bold block">
                Movimientos
              </span>
              <p className="text-sm font-bold text-slate-800">{totalMovimientos}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
