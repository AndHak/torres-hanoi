"use client";

import { BrainCircuit, Pause, Play, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PropsCabecera {
  textoEstado: string;
  reproduciendo: boolean;
  cambiarReproduccion: (valor: boolean) => void;
  reiniciar: () => void;
  tieneResultado: boolean;
}

export function Cabecera({
  textoEstado,
  reproduciendo,
  cambiarReproduccion,
  reiniciar,
  tieneResultado,
}: PropsCabecera) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 bg-white p-5 rounded-xl border shadow-sm">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3 text-slate-900">
          Torres de Hanoi
          <span className="text-slate-400 font-normal text-lg">— Algoritmo A*</span>
        </h1>
        <h2 className="flex flex-col">
          Presentado por:
          <p className="flex flex-col">
            <span>Andres Felipe Martinez Guerra</span>
            <span>Sebastian David Ordonez Bolanos</span>
          </p>
        </h2>
        <p className="text-sm text-slate-500">
          Resolución con búsqueda informada y heurísticas.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Badge
          variant="secondary"
          className="px-3 py-1 text-xs font-bold bg-slate-100 text-slate-600"
        >
          {textoEstado}
        </Badge>

        <div className="flex border rounded-lg overflow-hidden bg-slate-50 p-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => cambiarReproduccion(!reproduciendo)}
            disabled={!tieneResultado}
            className={
              reproduciendo
                ? "bg-slate-900 text-white hover:bg-slate-800"
                : "text-slate-500 hover:bg-slate-200"
            }
          >
            {reproduciendo ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-500 hover:bg-slate-200"
            onClick={reiniciar}
            disabled={!tieneResultado}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
