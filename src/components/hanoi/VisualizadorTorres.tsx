"use client";

import { Card } from "@/components/ui/card";

// Colores para cada disco (variedad de colores)
const COLORES_DISCOS = [
  "bg-red-500 border-red-600",
  "bg-amber-500 border-amber-600",
  "bg-yellow-400 border-yellow-500",
  "bg-emerald-500 border-emerald-600",
  "bg-blue-500 border-blue-600",
  "bg-indigo-500 border-indigo-600",
  "bg-purple-500 border-purple-600",
  "bg-pink-500 border-pink-600",
];

interface PropsVisualizadorTorres {
  estado: number[][];
  numeroDiscos: number;
}

export function VisualizadorTorres({ estado, numeroDiscos }: PropsVisualizadorTorres) {
  return (
    <Card className="bg-white border-slate-200 shadow-sm overflow-hidden p-6 min-h-[400px] flex flex-col">
      {/* Título */}
      <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-4">
        Visualización de Torres
      </p>

      {/* Área de las torres */}
      <div className="flex-1 flex items-end justify-center pb-10">
        <div className="grid grid-cols-3 w-full max-w-3xl gap-8 relative">
          {[0, 1, 2].map(function (indiceTorre) {
            const discosEnTorre = estado[indiceTorre];

            return (
              <div
                key={indiceTorre}
                className="relative flex flex-col justify-end items-center"
                style={{ minHeight: (numeroDiscos + 1) * 32 + 40 }}
              >
                {/* Eje vertical */}
                <div
                  className="w-2 bg-slate-200 rounded-full absolute bottom-0 z-0 border border-slate-300"
                  style={{ height: numeroDiscos * 32 + 20 }}
                />

                {/* Discos apilados */}
                <div className="absolute bottom-0 left-0 right-0 flex flex-col-reverse items-center z-10 w-full">
                  {discosEnTorre.map(function (disco) {
                    const anchoPorcentaje = (disco / numeroDiscos) * 90 + 10;
                    const colorDisco = COLORES_DISCOS[(disco - 1) % COLORES_DISCOS.length];

                    return (
                      <div
                        key={disco}
                        className={`h-7 mb-0.5 rounded border-2 flex items-center justify-center ${colorDisco}`}
                        style={{ width: anchoPorcentaje + "%" }}
                      >
                        <span className="text-[10px] font-bold text-white drop-shadow">
                          {disco}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Etiqueta de la torre */}
                <div className="absolute -bottom-8 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Torre {indiceTorre + 1}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Línea del piso */}
          <div className="absolute bottom-[-2px] left-[-5%] right-[-5%] h-1.5 bg-slate-200 rounded-full" />
        </div>
      </div>
    </Card>
  );
}
