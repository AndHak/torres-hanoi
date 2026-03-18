// ==============================
// ALGORITMO A* PARA TORRES DE HANOI
// ==============================
//
// FUNCION DE EVALUACION:
//   f(n) = g(n) + h(n)
//
//   g(n) = Costo acumulado de la ruta (numero de movimientos)
//   h(n) = Valor heuristico (estimacion del costo restante)
//
// ==============================

// ==============================
// TIPOS DE DATOS
// ==============================

export type Estado = number[][];
export type TipoHeuristica = 1 | 2 | 3 | 4;

export interface Paso {
  estado: Estado;
  g: number;
  h: number;
  f: number;
  movimiento: string;
}

export interface Iteracion {
  numeroPaso: number;
  estadoActual: Estado;
  g: number;
  h: number;
  f: number;
  movimiento: string;
  nodosAbiertos: string[];
  nodosCerrados: string[];
  sucesoresGenerados: {
    estado: Estado;
    movimiento: string;
    g: number;
    h: number;
    f: number;
  }[];
}

export interface Resultado {
  pasos: Paso[];
  iteraciones: Iteracion[];
  totalMovimientos: number;
  nodosExpandidos: number;
  solucionEncontrada: boolean;
}

export interface HeuristicaDisponible {
  id: TipoHeuristica;
  nombre: string;
  descripcion: string;
}

export interface ObjetivoHeuristica {
  formula: string;
  valorReferencia: number;
  valorMeta: number;
}

export const HEURISTICAS_DISPONIBLES: HeuristicaDisponible[] = [
  {
    id: 1,
    nombre: "Contar discos fuera",
    descripcion: "Cuenta cuantos discos estan fuera de la torre objetivo.",
  },
  {
    id: 2,
    nombre: "Por peso",
    descripcion: "Suma el numero de cada disco que todavia no esta en la torre objetivo.",
  },
  {
    id: 3,
    nombre: "Exponencial",
    descripcion: "Asigna mas costo a discos grandes usando 2^(disco - 1).",
  },
  {
    id: 4,
    nombre: "Bloqueadores",
    descripcion: "Suma discos fuera de objetivo y cuantos discos los bloquean encima.",
  },
];

export function calcularMovimientosOptimos(nDiscos: number): number {
  return Math.pow(2, nDiscos) - 1;
}

export function obtenerObjetivoHeuristica(
  tipoHeuristica: TipoHeuristica,
  nDiscos: number
): ObjetivoHeuristica {
  switch (tipoHeuristica) {
    case 1:
      return {
        formula: "n",
        valorReferencia: nDiscos,
        valorMeta: 0,
      };
    case 2:
      return {
        formula: "n * (n + 1) / 2",
        valorReferencia: (nDiscos * (nDiscos + 1)) / 2,
        valorMeta: 0,
      };
    case 3:
      return {
        formula: "2^n - 1",
        valorReferencia: calcularMovimientosOptimos(nDiscos),
        valorMeta: 0,
      };
    case 4:
      return {
        formula: "n * (n + 1) / 2",
        valorReferencia: (nDiscos * (nDiscos + 1)) / 2,
        valorMeta: 0,
      };
    default:
      return {
        formula: "n",
        valorReferencia: nDiscos,
        valorMeta: 0,
      };
  }
}

// ==============================
// REPRESENTACION DEL ESTADO
// ==============================

/**
 * Proposito: Convierte un Estado (arreglo) a un string para poder compararlo o guardarlo en un Set.
 * Recibe   : estado (Estado)
 * Retorna  : string
 * * --- EJEMPLO DE ENTRADA Y SALIDA ---
 * Entrada: [[3,2,1], [], []]
 * Salida : "((3,2,1), (), ())"
 */
export function estadoATexto(estado: Estado): string {
  const partes: string[] = [];

  for (let i = 0; i < estado.length; i++) {
    partes.push("(" + estado[i].join(",") + ")");
  }

  return "(" + partes.join(", ") + ")";
}

/**
 * Proposito: Crea una copia profunda del estado para no modificar los arreglos originales por referencia.
 * Recibe   : estado (Estado)
 * Retorna  : Estado (nuevo arreglo)
 * * --- EJEMPLO DE ENTRADA Y SALIDA ---
 * Entrada: [[3,2], [1], []]
 * Salida : [[3,2], [1], []] (en una nueva direccion de memoria)
 */
export function copiarEstado(estado: Estado): Estado {
  const copia: Estado = [];

  for (let i = 0; i < estado.length; i++) {
    copia.push([...estado[i]]);
  }

  return copia;
}

// ==============================
// HEURISTICAS
// ==============================

/**
 * Proposito: Cuenta cuantos discos NO estan en la torre objetivo.
 * Nota     : Esta funcion tambien se usa como la heuristica tipo 1.
 * Recibe   : estado (Estado), torreObjetivo (number: 0, 1 o 2)
 * Retorna  : number -> Cantidad de discos fuera de su lugar.
 * * --- EJEMPLOS DE ENTRADA Y SALIDA ---
 * Entrada: estado: [[3,2], [1], []], torreObjetivo: 2
 * Salida : 3 (Los discos 3, 2 y 1 no estan en la torre 3)
 *
 * Entrada: estado: [[3], [], [2,1]], torreObjetivo: 2
 * Salida : 1 (Solo el disco 3 esta fuera de la torre 3)
 */
export function contarDiscosFuera(estado: Estado, torreObjetivo: number): number {
  let total = 0;

  for (let i = 0; i < 3; i++) {
    if (i !== torreObjetivo) {
      total += estado[i].length;
    }
  }

  return total;
}

/**
 * Proposito: Estimar h(n) dando mas peso a discos grandes fuera de la torre objetivo.
 * Regla    : Cada disco fuera del objetivo aporta su propio valor numerico.
 * Recibe   : estado (Estado), torreObjetivo (number: 0, 1 o 2)
 * Retorna  : number -> Suma de los valores de discos fuera de objetivo.
 * * --- EJEMPLOS DE ENTRADA Y SALIDA ---
 * Entrada: estado: [[3,2], [1], []], torreObjetivo: 2
 * Salida : 6 (3 + 2 + 1)
 *
 * Entrada: estado: [[], [2], [3,1]], torreObjetivo: 2
 * Salida : 2 (Solo el disco 2 esta fuera de la torre 3)
 */
export function heuristicaPorPeso(estado: Estado, torreObjetivo: number): number {
  let h = 0;

  for (let i = 0; i < 3; i++) {
    if (i !== torreObjetivo) {
      for (const disco of estado[i]) {
        h += disco;
      }
    }
  }

  return h;
}

/**
 * Proposito: Estimar h(n) con una penalizacion exponencial para discos grandes fuera de objetivo.
 * Regla    : Cada disco fuera de la torre objetivo aporta 2^(disco - 1).
 * Recibe   : estado (Estado), torreObjetivo (number: 0, 1 o 2)
 * Retorna  : number -> Suma exponencial de discos fuera de objetivo.
 * * --- EJEMPLOS DE ENTRADA Y SALIDA ---
 * Entrada: estado: [[3,2], [1], []], torreObjetivo: 2
 * Salida : 7 (2^(3-1) + 2^(2-1) + 2^(1-1) = 4 + 2 + 1)
 *
 * Entrada: estado: [[], [], [3,2,1]], torreObjetivo: 2
 * Salida : 0
 */
export function heuristicaExponencial(estado: Estado, torreObjetivo: number): number {
  let h = 0;

  for (let i = 0; i < 3; i++) {
    if (i !== torreObjetivo) {
      for (const disco of estado[i]) {
        h += Math.pow(2, disco - 1);
      }
    }
  }

  return h;
}

/**
 * Proposito: Estimar h(n) penalizando discos fuera de objetivo y sus bloqueadores.
 * Regla    : Por cada disco fuera se suma:
 *            1) Un punto por estar fuera de la torre objetivo.
 *            2) La cantidad de discos encima de el en su misma torre.
 * Recibe   : estado (Estado), torreObjetivo (number: 0, 1 o 2)
 * Retorna  : number -> Penalizacion por discos fuera + bloqueadores.
 * * --- EJEMPLOS DE ENTRADA Y SALIDA ---
 * Entrada: estado: [[3,2], [1], []], torreObjetivo: 2
 * Salida : 4
 *          - Torre 1: disco 3 aporta 2 (1 por fuera + 1 bloqueador), disco 2 aporta 1
 *          - Torre 2: disco 1 aporta 1
 *
 * Entrada: estado: [[], [], [3,2,1]], torreObjetivo: 2
 * Salida : 0
 */
export function heuristicaBloqueadores(estado: Estado, torreObjetivo: number): number {
  let h = 0;

  for (let i = 0; i < 3; i++) {
    if (i !== torreObjetivo) {
      const cantidadDiscos = estado[i].length;

      for (let j = 0; j < cantidadDiscos; j++) {
        h += 1;

        const discosEncima = cantidadDiscos - 1 - j;
        h += discosEncima;
      }
    }
  }

  return h;
}

// ==============================
// GENERAR SUCESORES
// ==============================

/**
 * Proposito: Genera todos los movimientos validos desde un estado actual.
 * Regla    : No se puede colocar un disco grande sobre uno pequeno.
 * Recibe   : estado (Estado)
 * Retorna  : Arreglo de objetos con el nuevo estado y el string del movimiento realizado.
 * * --- EJEMPLOS DE ENTRADA Y SALIDA ---
 * * ITERACION 1 (Estado Inicial):
 * Entrada: [[3,2,1], [], []]
 * Salida : [
 * { nuevoEstado: [[3,2], [1], []], movimiento: "Mover disco 1 de Torre 1 a Torre 2" },
 * { nuevoEstado: [[3,2], [], [1]], movimiento: "Mover disco 1 de Torre 1 a Torre 3" }
 * ]
 * * ITERACION 2 (Tras mover a la Torre 2):
 * Entrada: [[3,2], [1], []]
 * Salida : [
 * { nuevoEstado: [[3], [1], [2]], movimiento: "Mover disco 2 de Torre 1 a Torre 3" },
 * { nuevoEstado: [[3,2,1], [], []], movimiento: "Mover disco 1 de Torre 2 a Torre 1" } // Nota: A* descartara este luego por estar en "cerrados"
 * ]
 */
export function generarSucesores(estado: Estado): { nuevoEstado: Estado; movimiento: string }[] {
  const sucesores: { nuevoEstado: Estado; movimiento: string }[] = [];

  // i = Torre de origen, j = Torre de destino
  for (let i = 0; i < 3; i++) {
    if (estado[i].length > 0) {
      const disco = estado[i][estado[i].length - 1];

      for (let j = 0; j < 3; j++) {
        if (i !== j) {
          const destinoVacio = estado[j].length === 0;
          const discoDestinoMayor = estado[j][estado[j].length - 1] > disco;

          if (destinoVacio || discoDestinoMayor) {
            const nuevoEstado = copiarEstado(estado);
            nuevoEstado[j].push(nuevoEstado[i].pop()!);

            const movimiento = `Mover disco ${disco} de Torre ${i + 1} a Torre ${j + 1}`;
            sucesores.push({ nuevoEstado, movimiento });
          }
        }
      }
    }
  }

  return sucesores;
}

// ==============================
// ALGORITMO A* PRINCIPAL
// ==============================

/**
 * Proposito: Ejecuta la busqueda A* para encontrar el camino mas corto al estado objetivo.
 * Recibe   : nDiscos, tipoHeuristica (1=Contar discos fuera, 2=Por peso, 3=Exponencial, 4=Bloqueadores)
 * Retorna  : Objeto Resultado (pasos, iteraciones, metricas).
 * * --- EJEMPLO DE FLUJO (3 Discos) ---
 * * PASO 0 (Configuracion):
 *   - Estado Inicial: [[3,2,1], [], []], Objetivo: [[], [], [3,2,1]]
 *   - g(n)=0, h(n)=3, f(n)=3. Se agrega a la lista "Abiertos".
 *
 * * ITERACION 1:
 *   - Seleccionado de Abiertos: [[3,2,1], [], []] (el unico con menor f=3)
 *   - Sucesores Generados:
 *     1. [[3,2], [1], []] -> g=1, h=2, f=3
 *     2. [[3,2], [], [1]] -> g=1, h=2, f=3
 *   - Se guardan en "Abiertos" y se marca el inicial como "Cerrado".
 *
 * * ITERACION 2:
 *   - Seleccionado de Abiertos: [[3,2], [1], []] (f=3)
 *   - Sucesores Generados:
 *     1. [[3], [1], [2]] -> g=2, h=2, f=4
 *     2. [[3,2,1], [], []] -> (Ignorado por estar en "Cerrados")
 *   - El proceso continua hasta que el estado seleccionado sea igual al objetivo.
 */
export function aEstrella(nDiscos: number, tipoHeuristica: TipoHeuristica): Resultado {
  // 1) Configuracion inicial del tablero
  const estadoInicial: Estado = [[], [], []];
  const estadoObjetivo: Estado = [[], [], []];
  const torreObjetivo = 2; // Indice 2 = Torre 3

  for (let i = nDiscos; i >= 1; i--) {
    estadoInicial[0].push(i);
    estadoObjetivo[2].push(i);
  }

  const estadoObjetivoTexto = estadoATexto(estadoObjetivo);

  // Funcion local para elegir la heuristica
  const calcularH = (estadoEvaluar: Estado) => {
    switch (tipoHeuristica) {
      case 1:
        return contarDiscosFuera(estadoEvaluar, torreObjetivo);
      case 2:
        return heuristicaPorPeso(estadoEvaluar, torreObjetivo);
      case 3:
        return heuristicaExponencial(estadoEvaluar, torreObjetivo);
      case 4:
        return heuristicaBloqueadores(estadoEvaluar, torreObjetivo);
      default:
        return contarDiscosFuera(estadoEvaluar, torreObjetivo);
    }
  };

  // 2) Estructuras de datos de A*
  interface NodoAbierto {
    f: number;
    g: number;
    estado: Estado;
    camino: string[];
    pasos: Paso[];
  }

  const abiertos: NodoAbierto[] = [];
  const cerrados = new Set<string>();

  // 3) Nodo raiz
  const gInicial = 0;
  const hInicial = calcularH(estadoInicial);
  const fInicial = gInicial + hInicial;

  abiertos.push({
    f: fInicial,
    g: gInicial,
    estado: estadoInicial,
    camino: [],
    pasos: [{ estado: estadoInicial, g: gInicial, h: hInicial, f: fInicial, movimiento: "Estado inicial" }],
  });

  let paso = 0;
  const iteraciones: Iteracion[] = [];

  // 4) Bucle principal de busqueda
  while (abiertos.length > 0) {
    // Buscar el nodo con menor f(n)
    let indiceMejor = 0;
    for (let i = 1; i < abiertos.length; i++) {
      if (abiertos[i].f < abiertos[indiceMejor].f) {
        indiceMejor = i;
      }
    }

    const nodoActual = abiertos.splice(indiceMejor, 1)[0];
    const {
      f: fActual,
      g: gActual,
      estado: estadoActual,
      camino: caminoActual,
      pasos: pasosActuales,
    } = nodoActual;
    const estadoTexto = estadoATexto(estadoActual);

    // Evita reprocesar estados ya visitados
    if (cerrados.has(estadoTexto)) {
      continue;
    }
    cerrados.add(estadoTexto);

    // 5) Fin de la busqueda si llegamos al objetivo
    if (estadoTexto === estadoObjetivoTexto) {
      // Guardamos tambien la ultima iteracion para que se vea el paso final en el panel.
      iteraciones.push({
        numeroPaso: paso,
        estadoActual,
        g: gActual,
        h: fActual - gActual,
        f: fActual,
        movimiento: caminoActual.length > 0 ? caminoActual[caminoActual.length - 1] : "Estado inicial",
        nodosAbiertos: abiertos.map((nodo) => estadoATexto(nodo.estado)),
        nodosCerrados: Array.from(cerrados),
        sucesoresGenerados: [],
      });

      return {
        pasos: pasosActuales,
        iteraciones,
        totalMovimientos: caminoActual.length,
        nodosExpandidos: paso,
        solucionEncontrada: true,
      };
    }

    // 6) Expandir el nodo y preparar datos para UI
    const sucesores = generarSucesores(estadoActual);

    const sucesoresConDatos = sucesores.map((sucesor) => {
      const gSucesor = gActual + 1;
      const hSucesor = calcularH(sucesor.nuevoEstado);

      return {
        estado: sucesor.nuevoEstado,
        movimiento: sucesor.movimiento,
        g: gSucesor,
        h: hSucesor,
        f: gSucesor + hSucesor,
      };
    });

    iteraciones.push({
      numeroPaso: paso,
      estadoActual,
      g: gActual,
      h: fActual - gActual,
      f: fActual,
      movimiento: caminoActual.length > 0 ? caminoActual[caminoActual.length - 1] : "Estado inicial",
      nodosAbiertos: abiertos.map((nodo) => estadoATexto(nodo.estado)),
      nodosCerrados: Array.from(cerrados),
      sucesoresGenerados: sucesoresConDatos,
    });

    // 7) Meter sucesores validos a abiertos
    for (const sucesor of sucesoresConDatos) {
      const sucesorTexto = estadoATexto(sucesor.estado);

      if (!cerrados.has(sucesorTexto)) {
        abiertos.push({
          f: sucesor.f,
          g: sucesor.g,
          estado: sucesor.estado,
          camino: [...caminoActual, sucesor.movimiento],
          pasos: [
            ...pasosActuales,
            {
              estado: sucesor.estado,
              g: sucesor.g,
              h: sucesor.h,
              f: sucesor.f,
              movimiento: sucesor.movimiento,
            },
          ],
        });
      }
    }

    paso++;

    // Seguro de vida para evitar ciclos infinitos o bloqueos del navegador
    if (paso > 20000) {
      break;
    }
  }

  // 8) Retorno cuando no hay solucion
  return {
    pasos: [],
    iteraciones,
    totalMovimientos: 0,
    nodosExpandidos: paso,
    solucionEncontrada: false,
  };
}
