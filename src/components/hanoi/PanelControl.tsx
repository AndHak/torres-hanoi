"use client";

import { Cpu, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface PropsPanelControl {
  numeroDiscos: number;
  cambiarNumeroDiscos: (n: number) => void;
  tipoHeuristica: number;
  cambiarTipoHeuristica: (t: number) => void;
  modoVisualizacion: "movimientos" | "iteraciones";
  cambiarModoVisualizacion: (m: "movimientos" | "iteraciones") => void;
  velocidad: number;
  cambiarVelocidad: (v: number) => void;
  resolviendo: boolean;
  ejecutarAlgoritmo: () => void;
}

export function PanelControl({
  numeroDiscos,
  cambiarNumeroDiscos,
  tipoHeuristica,
  cambiarTipoHeuristica,
  modoVisualizacion,
  cambiarModoVisualizacion,
  velocidad,
  cambiarVelocidad,
  resolviendo,
  ejecutarAlgoritmo,
}: PropsPanelControl) {
  return (
    <Card className="border-slate-200 shadow-sm bg-white">
      <CardHeader className="pb-3 border-b border-slate-100">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700">
          <Settings2 className="h-4 w-4 text-slate-400" /> Configuración
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 pt-5">
        {/* Número de discos */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Discos
            </Label>
            <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-0.5 rounded">
              {numeroDiscos}
            </span>
          </div>
          <Slider
            value={[numeroDiscos]}
            min={3}
            max={7}
            step={1}
            onValueChange={(valor) => cambiarNumeroDiscos(valor[0])}
          />
        </div>

        <Separator className="bg-slate-100" />

        {/* Tipo de heurística */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Heurística
          </Label>
          <div className="space-y-1.5">
            <button
              onClick={() => cambiarTipoHeuristica(1)}
              className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-all ${
                tipoHeuristica === 1
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              <span className="font-bold">H1:</span> Discos descolocados
            </button>
            <button
              onClick={() => cambiarTipoHeuristica(2)}
              className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-all ${
                tipoHeuristica === 2
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              <span className="font-bold">H2:</span> Suma de distancias
            </button>
            <button
              onClick={() => cambiarTipoHeuristica(3)}
              className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-all ${
                tipoHeuristica === 3
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              <span className="font-bold">H3:</span> Disco grande bloqueado
            </button>
          </div>
        </div>

        <Separator className="bg-slate-100" />

        {/* Modo de visualización */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Modo de Visualización
          </Label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => cambiarModoVisualizacion("movimientos")}
              className={`px-3 py-2 rounded-lg border text-xs font-bold transition-all text-center ${
                modoVisualizacion === "movimientos"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Solo Movimientos
            </button>
            <button
              onClick={() => cambiarModoVisualizacion("iteraciones")}
              className={`px-3 py-2 rounded-lg border text-xs font-bold transition-all text-center ${
                modoVisualizacion === "iteraciones"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Con Iteraciones
            </button>
          </div>
        </div>

        <Separator className="bg-slate-100" />

        {/* Velocidad */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Velocidad
            </Label>
            <span className="text-xs font-mono text-slate-500">{velocidad}ms</span>
          </div>
          <Slider
            value={[velocidad]}
            min={100}
            max={2000}
            step={100}
            onValueChange={(valor) => cambiarVelocidad(valor[0])}
          />
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Button
          onClick={ejecutarAlgoritmo}
          disabled={resolviendo}
          className="w-full font-bold uppercase tracking-wide text-xs h-11 bg-slate-900 hover:bg-slate-800 text-white"
        >
          {resolviendo ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Calculando...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              Ejecutar A*
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
