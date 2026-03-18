"use client";

import { Cpu, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  calcularMovimientosOptimos,
  HEURISTICAS_DISPONIBLES,
  obtenerObjetivoHeuristica,
  TipoHeuristica,
} from "@/lib/algoritmo-a-estrella";

interface PropsPanelControl {
  numeroDiscos: number;
  cambiarNumeroDiscos: (n: number) => void;
  tipoHeuristica: TipoHeuristica;
  cambiarTipoHeuristica: (t: TipoHeuristica) => void;
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
  const heuristicaActual = HEURISTICAS_DISPONIBLES.find((heuristica) => heuristica.id === tipoHeuristica);
  const objetivoHeuristica = obtenerObjetivoHeuristica(tipoHeuristica, numeroDiscos);
  const movimientosOptimos = calcularMovimientosOptimos(numeroDiscos);

  return (
    <Card className="border-slate-200 shadow-sm bg-white">
      <CardHeader className="pb-3 border-b border-slate-100">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700">
          <Settings2 className="h-4 w-4 text-slate-400" /> Configuracion
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 pt-5">
        {/* Cantidad de discos */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Discos</Label>
            <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-0.5 rounded">{numeroDiscos}</span>
          </div>
          <Slider
            value={[numeroDiscos]}
            min={3}
            max={11}
            step={1}
            onValueChange={(valor) => cambiarNumeroDiscos(valor[0])}
          />
        </div>

        <Separator className="bg-slate-100" />

        {/* Selector de heuristica */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Heuristica</Label>

          <Select
            value={String(tipoHeuristica)}
            onValueChange={(value) => cambiarTipoHeuristica(Number(value) as TipoHeuristica)}
          >
            <SelectTrigger className="w-full h-10 rounded-lg text-xs font-semibold text-slate-700">
              <SelectValue placeholder="Seleccione una heuristica" />
            </SelectTrigger>
            <SelectContent>
            {HEURISTICAS_DISPONIBLES.map((heuristica) => (
              <SelectItem key={heuristica.id} value={String(heuristica.id)}>
                {heuristica.id}. {heuristica.nombre}
              </SelectItem>
            ))}
            </SelectContent>
          </Select>

          <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Descripcion</p>
            <p className="mt-1 text-[11px] text-slate-600">
              {heuristicaActual?.descripcion}
            </p>
          </div>

          {/* Referencias para saber hacia que valor deberia ir la busqueda */}
          <div className="rounded-lg border border-slate-100 bg-white p-2.5 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Valor objetivo</p>
            <p className="text-[11px] text-slate-600">
              h(n) meta: <span className="font-bold">{objetivoHeuristica.valorMeta}</span>
            </p>
            <p className="text-[11px] text-slate-600">
              Referencia inicial: <span className="font-mono">{objetivoHeuristica.formula}</span> ={" "}
              <span className="font-bold">{objetivoHeuristica.valorReferencia}</span>
            </p>
            <p className="text-[11px] text-slate-600">
              Movimientos minimos de Hanoi: <span className="font-mono">2^n - 1</span> ={" "}
              <span className="font-bold">{movimientosOptimos}</span>
            </p>
          </div>
        </div>

        <Separator className="bg-slate-100" />

        {/* Modo de visualizacion */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Modo de ejecucion</Label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => cambiarModoVisualizacion("movimientos")}
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
              onClick={() => cambiarModoVisualizacion("iteraciones")}
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

        {/* Velocidad del autoplay */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Velocidad</Label>
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
