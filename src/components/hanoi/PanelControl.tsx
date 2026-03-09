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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface PropsPanelControl {
  numeroDiscos: number;
  cambiarNumeroDiscos: (n: number) => void;
  tipoHeuristica: number;
  cambiarTipoHeuristica: (t: number) => void;
  formula: string;
  cambiarFormula: (f: string) => void;
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
  formula,
  cambiarFormula,
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
            onValueChange={function (valor) { cambiarNumeroDiscos(valor[0]); }}
          />
        </div>

        <Separator className="bg-slate-100" />

        {/* Seleccionar heurística */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Heurística
          </Label>
          <div className="space-y-1.5">
            {/* Opción 1: Clásica */}
            <button
              onClick={function () { cambiarTipoHeuristica(1); }}
              className={
                "w-full text-left px-3 py-2.5 rounded-lg border text-xs transition-all " +
                (tipoHeuristica === 1
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300")
              }
            >
              <span className="font-bold">1. Clásica</span>
              <p className={
                "text-[10px] mt-0.5 " +
                (tipoHeuristica === 1 ? "text-white/70" : "text-slate-400")
              }>
                Discos fuera de la torre destino
              </p>
            </button>

            {/* Opción 2: Personalizada */}
            <button
              onClick={function () { cambiarTipoHeuristica(2); }}
              className={
                "w-full text-left px-3 py-2.5 rounded-lg border text-xs transition-all " +
                (tipoHeuristica === 2
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300")
              }
            >
              <span className="font-bold">2. Personalizada</span>
              <p className={
                "text-[10px] mt-0.5 " +
                (tipoHeuristica === 2 ? "text-white/70" : "text-slate-400")
              }>
                Escribir fórmula matemática
              </p>
            </button>
          </div>
        </div>

        {/* Campo de fórmula (solo si tipo 2) */}
        {tipoHeuristica === 2 && (
          <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <Label className="text-[10px] font-bold text-slate-400 uppercase">
              Fórmula heurística
            </Label>
            <Input
              value={formula}
              onChange={function (e) { cambiarFormula(e.target.value); }}
              className="h-9 text-xs font-mono bg-white border-slate-200"
              placeholder="2**k - 1"
            />
            <div className="text-[9px] text-slate-400 space-y-0.5">
              <p className="font-bold">Variables disponibles:</p>
              <p>k → discos fuera de la torre destino</p>
              <p>n → número total de discos</p>
              <p>math.log(), math.sqrt(), math.pow()</p>
              <p className="font-bold pt-1">Ejemplos:</p>
              <p>k &nbsp;|&nbsp; 2*k &nbsp;|&nbsp; 2**k - 1 &nbsp;|&nbsp; k**2 &nbsp;|&nbsp; math.log(k+1)</p>
            </div>
          </div>
        )}

        <Separator className="bg-slate-100" />

        {/* Modo de ejecución */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Modo de ejecución
          </Label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={function () { cambiarModoVisualizacion("movimientos"); }}
              className={
                "px-3 py-2 rounded-lg border text-xs font-bold transition-all text-center " +
                (modoVisualizacion === "movimientos"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50")
              }
            >
              Solo Resultado
            </button>
            <button
              onClick={function () { cambiarModoVisualizacion("iteraciones"); }}
              className={
                "px-3 py-2 rounded-lg border text-xs font-bold transition-all text-center " +
                (modoVisualizacion === "iteraciones"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50")
              }
            >
              Paso a Paso
            </button>
          </div>
        </div>

        <Separator className="bg-slate-100" />

        {/* Velocidad de reproducción */}
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
            onValueChange={function (valor) { cambiarVelocidad(valor[0]); }}
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
