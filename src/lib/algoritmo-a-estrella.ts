// ==============================
// ALGORITMO A* PARA TORRES DE HANOI
// ==============================
//
// FUNCIÓN DE EVALUACIÓN:
//   f(n) = g(n) + h(n)
//
//   g(n) = Costo acumulado de la RUTA (número de movimientos realizados)
//   h(n) = Valor HEURÍSTICO (estimación del costo restante)
//
// ==============================

// ==============================
// TIPOS DE DATOS
// ==============================

export type Estado = number[][];

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

// ==============================
// REPRESENTACIÓN DEL ESTADO
// ==============================

/**
 * Propósito: Convierte un Estado (arreglo) a un string para poder compararlo o guardarlo en un Set.
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
 * Propósito: Crea una copia profunda del estado para no modificar los arreglos originales por referencia.
 * Recibe   : estado (Estado)
 * Retorna  : Estado (nuevo arreglo)
 * * --- EJEMPLO DE ENTRADA Y SALIDA ---
 * Entrada: [[3,2], [1], []]
 * Salida : [[3,2], [1], []] (en una nueva dirección de memoria)
 */
export function copiarEstado(estado: Estado): Estado {
  const copia: Estado = [];
  for (let i = 0; i < estado.length; i++) {
    copia.push([...estado[i]]); // El operador spread [...] clona el sub-arreglo
  }
  return copia;
}

// ==============================
// HEURÍSTICAS
// ==============================

/**
 * Propósito: Cuenta cuántos discos NO están en la torre objetivo.
 * Recibe   : estado (Estado), torreObjetivo (number: 0, 1 o 2)
 * Retorna  : number -> Cantidad de discos fuera de su lugar.
 * * --- EJEMPLOS DE ENTRADA Y SALIDA ---
 * Entrada: estado: [[3,2], [1], []], torreObjetivo: 2
 * Salida : 3 (Los discos 3, 2 y 1 no están en la torre 3)
 * 
 * Entrada: estado: [[3], [], [2,1]], torreObjetivo: 2
 * Salida : 1 (Solo el disco 3 está fuera de la torre 3)
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
 * Propósito: Calcula la estimación h(n) usando la heurística clásica.
 * Recibe   : estado (Estado), torreObjetivo (number)
 * Retorna  : number -> Valor heurístico.
 * * --- EJEMPLO ---
 * Entrada: estado: [[3], [2], [1]], torreObjetivo: 2, nDiscos: 3
 * Salida : 2 (Los discos 3 y 2 están fuera de la torre 2)
 */
export function heuristicaClasica(estado: Estado, torreObjetivo: number): number {
  return contarDiscosFuera(estado, torreObjetivo);
}

/**
 * Propósito: Evalúa una fórmula matemática inyectada por el usuario para calcular h(n).
 * Recibe   : estado, torreObjetivo, formula (string), nDiscos
 * Retorna  : number -> Resultado de la fórmula, garantizando que no sea negativo (Math.max(0, ...)).
 * * --- EJEMPLOS DE EVALUACIÓN ---
 * Entrada: k=3, n=3, formula="k * 2"
 * Salida : 6
 * 
 * Entrada: k=3, n=3, formula="Math.pow(2, k) - 1"
 * Salida : 7
 */
export function heuristicaPersonalizada(
  estado: Estado,
  torreObjetivo: number,
  formula: string,
  nDiscos: number
): number {
  const k = contarDiscosFuera(estado, torreObjetivo);
  const n = nDiscos;

  try {
    let formulaLimpia = formula.replace(/\^/g, "**");
    formulaLimpia = formulaLimpia.replace(/math\./g, "Math."); // Simplifica el reemplazo de la librería Math

    const funcionEvaluar = new Function("k", "n", "Math", "return " + formulaLimpia);
    const resultado = funcionEvaluar(k, n, Math);
    
    return Math.max(0, Number(resultado));
  } catch (error) {
    return 0; // Si la fórmula falla, asumimos costo 0 (se vuelve algoritmo de Dijkstra)
  }
}

// ==============================
// GENERAR SUCESORES
// ==============================

/**
 * Propósito: Genera todos los movimientos válidos desde un estado actual.
 * Regla    : No se puede colocar un disco grande sobre uno pequeño.
 * Recibe   : estado (Estado)
 * Retorna  : Arreglo de objetos con el nuevo estado y el string del movimiento realizado.
 * * --- EJEMPLOS DE ENTRADA Y SALIDA ---
 * * ITERACIÓN 1 (Estado Inicial):
 * Entrada: [[3,2,1], [], []]
 * Salida : [
 * { nuevoEstado: [[3,2], [1], []], movimiento: "Mover disco 1 de Torre 1 a Torre 2" },
 * { nuevoEstado: [[3,2], [], [1]], movimiento: "Mover disco 1 de Torre 1 a Torre 3" }
 * ]
 * * ITERACIÓN 2 (Tras mover a la Torre 2):
 * Entrada: [[3,2], [1], []]
 * Salida : [
 * { nuevoEstado: [[3], [1], [2]], movimiento: "Mover disco 2 de Torre 1 a Torre 3" },
 * { nuevoEstado: [[3,2,1], [], []], movimiento: "Mover disco 1 de Torre 2 a Torre 1" } // Nota: A* descartará este luego por estar en "cerrados"
 * ]
 */
export function generarSucesores(estado: Estado): { nuevoEstado: Estado; movimiento: string }[] {
  const sucesores: { nuevoEstado: Estado; movimiento: string }[] = [];

  // i = Torre de Origen, j = Torre de Destino
  for (let i = 0; i < 3; i++) {
    if (estado[i].length > 0) {
      const disco = estado[i][estado[i].length - 1]; // Toma el disco superior

      for (let j = 0; j < 3; j++) {
        if (i !== j) {
          const destinoVacio = estado[j].length === 0;
          const discoDestinoMayor = estado[j][estado[j].length - 1] > disco;

          // Valida la regla de las Torres de Hanói
          if (destinoVacio || discoDestinoMayor) {
            const nuevoEstado = copiarEstado(estado);
            nuevoEstado[j].push(nuevoEstado[i].pop()!); // Mueve el disco
            
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
 * Propósito: Ejecuta la búsqueda A* para encontrar el camino más corto al estado objetivo.
 * Recibe   : nDiscos, tipoHeuristica (1=Clásica, 2=Personalizada), formula
 * Retorna  : Objeto Resultado (pasos, iteraciones, métricas).
 * * --- EJEMPLO DE FLUJO (3 Discos) ---
 * * PASO 0 (Configuración): 
 *   - Estado Inicial: [[3,2,1], [], []], Objetivo: [[], [], [3,2,1]]
 *   - g(n)=0, h(n)=3, f(n)=3. Se añade a la lista "Abiertos".
 * 
 * * ITERACIÓN 1:
 *   - Seleccionado de Abiertos: [[3,2,1], [], []] (el único con menor f=3)
 *   - Sucesores Generados: 
 *     1. [[3,2], [1], []] -> g=1, h=2, f=3
 *     2. [[3,2], [], [1]] -> g=1, h=2, f=3
 *   - Se guardan en "Abiertos" y se marca el inicial como "Cerrado".
 * 
 * * ITERACIÓN 2:
 *   - Seleccionado de Abiertos: [[3,2], [1], []] (f=3)
 *   - Sucesores Generados: 
 *     1. [[3], [1], [2]] -> g=2, h=2, f=4
 *     2. [[3,2,1], [], []] -> (Ignorado por estar en "Cerrados")
 *   - El proceso continúa hasta que el estado seleccionado sea igual al objetivo.
 */
export function aEstrella(nDiscos: number, tipoHeuristica: number, formula: string): Resultado {

  // 1. CONFIGURACIÓN INICIAL DEL TABLERO
  const estadoInicial: Estado = [[], [], []];
  const estadoObjetivo: Estado = [[], [], []];
  const torreObjetivo = 2;

  // Llenar torre 1 (inicial) y torre 3 (objetivo) con discos [n, n-1, ..., 1]
  for (let i = nDiscos; i >= 1; i--) {
    estadoInicial[0].push(i);
    estadoObjetivo[2].push(i);
  }

  const estadoObjetivoTexto = estadoATexto(estadoObjetivo);

  // 2. ESTRUCTURAS DE DATOS DE A*
  interface NodoAbierto {
    f: number;
    g: number;
    estado: Estado;
    camino: string[];
    pasos: Paso[];
  }

  const abiertos: NodoAbierto[] = [];
  const cerrados = new Set<string>();

  // 3. CALCULAR NODO RAÍZ (INICIAL)
  const gInicial = 0;
  const hInicial = tipoHeuristica === 1 
    ? heuristicaClasica(estadoInicial, torreObjetivo) 
    : heuristicaPersonalizada(estadoInicial, torreObjetivo, formula, nDiscos);
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

  // 4. BUCLE PRINCIPAL DE BÚSQUEDA
  while (abiertos.length > 0) {

    // Extraer el nodo con el menor f(n)
    let indiceMejor = 0;
    for (let i = 1; i < abiertos.length; i++) {
      if (abiertos[i].f < abiertos[indiceMejor].f) {
        indiceMejor = i;
      }
    }

    const nodoActual = abiertos.splice(indiceMejor, 1)[0];
    const { f: fActual, g: gActual, estado: estadoActual, camino: caminoActual, pasos: pasosActuales } = nodoActual;
    const estadoTexto = estadoATexto(estadoActual);

    // Evitar procesar estados ya visitados (ciclos)
    if (cerrados.has(estadoTexto)) continue;
    cerrados.add(estadoTexto);

    // Generar sucesores del nodo actual
    const sucesores = generarSucesores(estadoActual);
    console.log(sucesores)

    // 5. REGISTRAR DATOS PARA LA INTERFAZ GRÁFICA (ITERACIÓN)
    const sucesoresConDatos = sucesores.map((sucesor) => {
      const gSucesor = gActual + 1;
      const hSucesor = tipoHeuristica === 1 
        ? heuristicaClasica(sucesor.nuevoEstado, torreObjetivo) 
        : heuristicaPersonalizada(sucesor.nuevoEstado, torreObjetivo, formula, nDiscos);
      
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
      estadoActual: estadoActual,
      g: gActual,
      h: fActual - gActual,
      f: fActual,
      movimiento: caminoActual.length > 0 ? caminoActual[caminoActual.length - 1] : "Estado inicial",
      nodosAbiertos: abiertos.map(n => estadoATexto(n.estado)),
      nodosCerrados: Array.from(cerrados),
      sucesoresGenerados: sucesoresConDatos,
    });

    // 6. VERIFICAR CONDICIÓN DE ÉXITO
    if (estadoTexto === estadoObjetivoTexto) {
      return {
        pasos: pasosActuales,
        iteraciones: iteraciones,
        totalMovimientos: caminoActual.length,
        nodosExpandidos: paso,
        solucionEncontrada: true,
      };
    }

    // 7. AÑADIR SUCESORES VÁLIDOS A LA LISTA DE ABIERTOS
    for (const sucesor of sucesoresConDatos) {
      const sucesorTexto = estadoATexto(sucesor.estado);

      if (!cerrados.has(sucesorTexto)) {
        abiertos.push({
          f: sucesor.f,
          g: sucesor.g,
          estado: sucesor.estado,
          camino: [...caminoActual, sucesor.movimiento],
          pasos: [...pasosActuales, {
            estado: sucesor.estado,
            g: sucesor.g,
            h: sucesor.h,
            f: sucesor.f,
            movimiento: sucesor.movimiento,
          }],
        });
      }
    }

    paso++;

    // Seguro de vida: prevenir colapsos del navegador
    if (paso > 20000) break; 
  }

  // 8. RETORNO SI NO HAY SOLUCIÓN (O SI SE EXCEDIÓ EL LÍMITE)
  return {
    pasos: [],
    iteraciones: iteraciones,
    totalMovimientos: 0,
    nodosExpandidos: paso,
    solucionEncontrada: false,
  };
}