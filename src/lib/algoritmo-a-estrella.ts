// ==============================
// ALGORITMO A* PARA TORRES DE HANOI
// ==============================
//
// Traducción fiel del código Python proporcionado.
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

// Un estado es un arreglo de 3 torres, cada torre tiene discos (números)
export type Estado = number[][];

// Cada paso del camino solución
export interface Paso {
  estado: Estado;
  g: number;         // g(n): costo de la ruta
  h: number;         // h(n): valor heurístico
  f: number;         // f(n) = g(n) + h(n)
  movimiento: string;
}

// Cada iteración del algoritmo (modo paso a paso)
export interface Iteracion {
  numeroPaso: number;
  estadoActual: Estado;
  g: number;
  h: number;
  f: number;
  movimiento: string;
  // Los nodos abiertos y cerrados como texto (para mostrar)
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

// Resultado final del algoritmo
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

// Convierte el estado a texto para poder compararlo
// Equivalente a estado_a_tupla() en Python
export function estadoATexto(estado: Estado): string {
  var partes = [];
  for (var i = 0; i < estado.length; i++) {
    partes.push("(" + estado[i].join(",") + ")");
  }
  return "(" + partes.join(", ") + ")";
}

// Copia profunda del estado (equivalente a copy.deepcopy)
export function copiarEstado(estado: Estado): Estado {
  var copia: Estado = [];
  for (var i = 0; i < estado.length; i++) {
    copia.push([...estado[i]]);
  }
  return copia;
}

// ==============================
// HEURÍSTICAS
// ==============================

// Contar discos fuera de la torre objetivo
// Equivalente a contar_discos_fuera() en Python
export function contarDiscosFuera(estado: Estado, torreObjetivo: number): number {
  var total = 0;
  for (var i = 0; i < 3; i++) {
    if (i !== torreObjetivo) {
      total = total + estado[i].length;
    }
  }
  return total;
}

// Heurística clásica: discos fuera de la torre destino
// Equivalente a heuristica_clasica() en Python
export function heuristicaClasica(estado: Estado, torreObjetivo: number): number {
  return contarDiscosFuera(estado, torreObjetivo);
}

// Heurística personalizada: evalúa una fórmula matemática
// Equivalente a heuristica_personalizada() en Python
// Variables disponibles: k (discos fuera), n (total de discos)
export function heuristicaPersonalizada(
  estado: Estado,
  torreObjetivo: number,
  formula: string,
  nDiscos: number
): number {
  var k = contarDiscosFuera(estado, torreObjetivo);
  var n = nDiscos;

  try {
    // Reemplazar ^ por ** para potencias
    var formulaLimpia = formula.replace(/\^/g, "**");
    // Reemplazar math.log por Math.log, etc.
    formulaLimpia = formulaLimpia.replace(/math\.log/g, "Math.log");
    formulaLimpia = formulaLimpia.replace(/math\.sqrt/g, "Math.sqrt");
    formulaLimpia = formulaLimpia.replace(/math\.pow/g, "Math.pow");
    formulaLimpia = formulaLimpia.replace(/math\.ceil/g, "Math.ceil");
    formulaLimpia = formulaLimpia.replace(/math\.floor/g, "Math.floor");

    var funcionEvaluar = new Function("k", "n", "Math", "return " + formulaLimpia);
    var resultado = funcionEvaluar(k, n, Math);
    return Math.max(0, Number(resultado));
  } catch (error) {
    return 0;
  }
}

// ==============================
// GENERAR SUCESORES
// ==============================

// Equivalente a generar_sucesores() en Python
export function generarSucesores(estado: Estado): { nuevoEstado: Estado; movimiento: string }[] {
  var sucesores: { nuevoEstado: Estado; movimiento: string }[] = [];

  for (var i = 0; i < 3; i++) {
    if (estado[i].length > 0) {
      var disco = estado[i][estado[i].length - 1];

      for (var j = 0; j < 3; j++) {
        if (i !== j) {
          // Regla de Hanoi: solo mover si destino vacío o disco de arriba es mayor
          if (estado[j].length === 0 || estado[j][estado[j].length - 1] > disco) {
            var nuevoEstado = copiarEstado(estado);
            nuevoEstado[j].push(nuevoEstado[i].pop()!);
            var movimiento = "Mover disco " + disco + " de Torre " + (i + 1) + " a Torre " + (j + 1);
            sucesores.push({ nuevoEstado: nuevoEstado, movimiento: movimiento });
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

// Equivalente a a_estrella() en Python
export function aEstrella(
  nDiscos: number,
  tipoHeuristica: number,
  formula: string
): Resultado {

  // Estado inicial: todos los discos en la torre 1 (índice 0)
  // Equivalente a: estado_inicial = [list(range(n_discos, 0, -1)), [], []]
  var estadoInicial: Estado = [[], [], []];
  for (var i = nDiscos; i >= 1; i--) {
    estadoInicial[0].push(i);
  }

  // Estado objetivo: todos los discos en la torre 3 (índice 2)
  // Equivalente a: estado_objetivo = [[], [], list(range(n_discos, 0, -1))]
  var estadoObjetivo: Estado = [[], [], []];
  for (var i = nDiscos; i >= 1; i--) {
    estadoObjetivo[2].push(i);
  }
  var torreObjetivo = 2;

  // Texto del estado objetivo para comparar
  var estadoObjetivoTexto = estadoATexto(estadoObjetivo);

  // Lista de nodos abiertos
  // En Python: abiertos = []  (con heapq)
  // Aquí usamos un arreglo y buscamos el menor f manualmente
  interface NodoAbierto {
    f: number;
    g: number;
    estado: Estado;
    camino: string[];
    pasos: Paso[];
  }

  var abiertos: NodoAbierto[] = [];

  // Conjunto de cerrados
  // En Python: cerrados = set()
  var cerrados = new Set<string>();

  // Calcular valores iniciales
  var gInicial = 0;
  var hInicial: number;

  if (tipoHeuristica === 1) {
    hInicial = heuristicaClasica(estadoInicial, torreObjetivo);
  } else {
    hInicial = heuristicaPersonalizada(estadoInicial, torreObjetivo, formula, nDiscos);
  }

  var fInicial = gInicial + hInicial;

  // Agregar nodo inicial
  // En Python: heapq.heappush(abiertos, (f_inicial, g_inicial, estado_inicial, []))
  abiertos.push({
    f: fInicial,
    g: gInicial,
    estado: estadoInicial,
    camino: [],
    pasos: [{
      estado: estadoInicial,
      g: gInicial,
      h: hInicial,
      f: fInicial,
      movimiento: "Estado inicial",
    }],
  });

  var paso = 0;
  var iteraciones: Iteracion[] = [];

  // Bucle principal
  // En Python: while abiertos:
  while (abiertos.length > 0) {

    // Buscar el nodo con menor f(n) (equivalente a heapq.heappop)
    var indiceMejor = 0;
    for (var i = 1; i < abiertos.length; i++) {
      if (abiertos[i].f < abiertos[indiceMejor].f) {
        indiceMejor = i;
      }
    }

    // Extraer el mejor nodo
    // En Python: f_actual, g_actual, estado_actual, camino = heapq.heappop(abiertos)
    var nodoActual = abiertos.splice(indiceMejor, 1)[0];
    var fActual = nodoActual.f;
    var gActual = nodoActual.g;
    var estadoActual = nodoActual.estado;
    var caminoActual = nodoActual.camino;
    var pasosActuales = nodoActual.pasos;

    // En Python: estado_t = estado_a_tupla(estado_actual)
    var estadoTexto = estadoATexto(estadoActual);

    // En Python: if estado_t in cerrados: continue
    if (cerrados.has(estadoTexto)) {
      continue;
    }

    // En Python: cerrados.add(estado_t)
    cerrados.add(estadoTexto);

    // Generar sucesores para mostrar en iteraciones
    var sucesores = generarSucesores(estadoActual);

    // Calcular datos de cada sucesor
    var sucesoresConDatos = [];
    for (var i = 0; i < sucesores.length; i++) {
      var sucesor = sucesores[i];
      var gSucesor = gActual + 1;
      var hSucesor: number;

      if (tipoHeuristica === 1) {
        hSucesor = heuristicaClasica(sucesor.nuevoEstado, torreObjetivo);
      } else {
        hSucesor = heuristicaPersonalizada(sucesor.nuevoEstado, torreObjetivo, formula, nDiscos);
      }

      sucesoresConDatos.push({
        estado: sucesor.nuevoEstado,
        movimiento: sucesor.movimiento,
        g: gSucesor,
        h: hSucesor,
        f: gSucesor + hSucesor,
      });
    }

    // Guardar los nodos abiertos como texto (equivalente al print de abiertos en Python)
    var abiertosTexto: string[] = [];
    for (var i = 0; i < abiertos.length; i++) {
      abiertosTexto.push(estadoATexto(abiertos[i].estado));
    }

    // Guardar los nodos cerrados como texto (equivalente al print de cerrados en Python)
    var cerradosTexto: string[] = [];
    cerrados.forEach(function (valor) {
      cerradosTexto.push(valor);
    });

    // Guardar iteración (equivalente al modo == 1 en Python)
    iteraciones.push({
      numeroPaso: paso,
      estadoActual: estadoActual,
      g: gActual,
      h: fActual - gActual,
      f: fActual,
      movimiento: caminoActual.length > 0
        ? caminoActual[caminoActual.length - 1]
        : "Estado inicial",
      nodosAbiertos: abiertosTexto,
      nodosCerrados: cerradosTexto,
      sucesoresGenerados: sucesoresConDatos,
    });

    // Verificar si llegamos al objetivo
    // En Python: if estado_actual == estado_objetivo:
    if (estadoTexto === estadoObjetivoTexto) {
      return {
        pasos: pasosActuales,
        iteraciones: iteraciones,
        totalMovimientos: caminoActual.length,
        nodosExpandidos: paso,
        solucionEncontrada: true,
      };
    }

    // Explorar sucesores
    // En Python: for sucesor, movimiento in generar_sucesores(estado_actual):
    for (var i = 0; i < sucesores.length; i++) {
      var sucesor = sucesores[i];
      var sucesorTexto = estadoATexto(sucesor.nuevoEstado);

      // En Python: if sucesor_t not in cerrados:
      if (!cerrados.has(sucesorTexto)) {
        var gNuevo = gActual + 1;
        var hNuevo: number;

        if (tipoHeuristica === 1) {
          hNuevo = heuristicaClasica(sucesor.nuevoEstado, torreObjetivo);
        } else {
          hNuevo = heuristicaPersonalizada(sucesor.nuevoEstado, torreObjetivo, formula, nDiscos);
        }

        var fNuevo = gNuevo + hNuevo;

        // En Python: heapq.heappush(abiertos, (f_nuevo, g_nuevo, sucesor, camino + [movimiento]))
        abiertos.push({
          f: fNuevo,
          g: gNuevo,
          estado: sucesor.nuevoEstado,
          camino: [...caminoActual, sucesor.movimiento],
          pasos: [...pasosActuales, {
            estado: sucesor.nuevoEstado,
            g: gNuevo,
            h: hNuevo,
            f: fNuevo,
            movimiento: sucesor.movimiento,
          }],
        });
      }
    }

    // En Python: paso += 1
    paso = paso + 1;

    // Seguridad: evitar bucles infinitos
    if (paso > 20000) {
      break;
    }
  }

  // No se encontró solución
  return {
    pasos: [],
    iteraciones: iteraciones,
    totalMovimientos: 0,
    nodosExpandidos: paso,
    solucionEncontrada: false,
  };
}
