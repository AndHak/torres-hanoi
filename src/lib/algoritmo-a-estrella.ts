// ==============================
// ALGORITMO A* PARA TORRES DE HANOI
// ==============================
//
// FUNCIÓN DE EVALUACIÓN:
//   f(n) = g(n) + h(n)
//
//   g(n) = Costo acumulado de la RUTA desde el estado inicial hasta el nodo n.
//          Cada movimiento de disco tiene un costo de 1.
//          Entonces g(n) = número de movimientos realizados hasta llegar al nodo n.
//          Este valor se SUMA porque representa el costo ya gastado.
//
//   h(n) = Valor HEURÍSTICO que estima el costo restante desde el nodo n
//          hasta el estado objetivo. Depende del estado actual de las torres.
//          Se calcula según la heurística elegida.
//
//   El algoritmo A* selecciona siempre el nodo con menor f(n),
//   es decir, el que tiene la suma más baja de costo real + estimación.
//
// ==============================
// TIPOS DE DATOS
// ==============================

// Un estado es un arreglo de 3 torres, cada torre tiene discos (números)
export type Estado = number[][];

// Cada paso guardado en el resultado
export interface Paso {
  estado: Estado;
  g: number;         // g(n): costo de la ruta (movimientos realizados)
  h: number;         // h(n): valor heurístico (estimación al objetivo)
  f: number;         // f(n) = g(n) + h(n): función de evaluación total
  movimiento: string;
}

// Cada iteración del algoritmo (modo detallado)
export interface Iteracion {
  numeroPaso: number;
  estadoActual: Estado;
  g: number;
  h: number;
  f: number;
  movimiento: string;
  cantidadAbiertos: number;
  cantidadCerrados: number;
  sucesoresGenerados: { estado: Estado; movimiento: string; f: number; g: number; h: number }[];
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
// FUNCIONES AUXILIARES
// ==============================

// Convierte el estado a texto para poder compararlo (como tupla en Python)
export function estadoATexto(estado: Estado): string {
  // Ejemplo: "3,2,1|0|0" para torre1=[3,2,1], torre2=[], torre3=[]
  const resultado = estado.map(function (torre) {
    return torre.join(",");
  });
  return resultado.join("|");
}

// Copia profunda del estado (para no modificar el original)
export function copiarEstado(estado: Estado): Estado {
  const copia: Estado = [];
  for (let i = 0; i < estado.length; i++) {
    copia.push([...estado[i]]);
  }
  return copia;
}

// ==============================
// HEURÍSTICAS
// ==============================
//
// Cada heurística estima h(n): el costo RESTANTE para llegar al objetivo.
// Una buena heurística es ADMISIBLE (nunca sobreestima el costo real).
// Esto garantiza que A* encuentre la solución óptima.
//

// Heurística 1: Cantidad de discos fuera de la torre destino
export function heuristica1_discosDescolocados(estado: Estado, torreObjetivo: number): number {
  let total = 0;
  for (let i = 0; i < 3; i++) {
    if (i !== torreObjetivo) {
      total = total + estado[i].length;
    }
  }
  return total;
}

// Heurística 2: Suma de distancias de cada disco a su posición objetivo
// Si un disco está en torre 0 y objetivo es torre 2, distancia = 2
// Si un disco está en torre 1 y objetivo es torre 2, distancia = 1
// Si un disco está en torre 2 (objetivo), distancia = 0
export function heuristica2_sumaDistancias(estado: Estado, torreObjetivo: number): number {
  let sumaTotal = 0;
  for (let indiceTorre = 0; indiceTorre < 3; indiceTorre++) {
    const torre = estado[indiceTorre];
    for (let j = 0; j < torre.length; j++) {
      // Distancia = diferencia absoluta entre torre actual y torre objetivo
      const distancia = Math.abs(indiceTorre - torreObjetivo);
      sumaTotal = sumaTotal + distancia;
    }
  }
  return sumaTotal;
}

// Heurística 3: Movimientos para colocar el disco más grande correctamente
// Considera los discos que bloquean al disco más grande
export function heuristica3_discoGrande(estado: Estado, torreObjetivo: number, numeroDiscos: number): number {
  const discoMasGrande = numeroDiscos;

  // Buscar en qué torre está el disco más grande
  let torreDondeEsta = -1;
  let posicionEnTorre = -1;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < estado[i].length; j++) {
      if (estado[i][j] === discoMasGrande) {
        torreDondeEsta = i;
        posicionEnTorre = j;
      }
    }
  }

  // Si ya está en la torre objetivo y en la base (posición 0), no hay costo
  if (torreDondeEsta === torreObjetivo && posicionEnTorre === 0) {
    // Contar cuántos discos encima no están bien colocados
    let discosDescolocados = 0;
    for (let i = 0; i < 3; i++) {
      if (i !== torreObjetivo) {
        discosDescolocados = discosDescolocados + estado[i].length;
      }
    }
    return discosDescolocados;
  }

  // Si el disco grande NO está en la torre objetivo:
  // Necesitamos mover todos los discos encima de él + mover el disco grande + recolocar
  if (torreDondeEsta === -1) {
    return 0; // No debería pasar, pero por seguridad
  }

  // Contar discos encima del disco grande en su torre actual
  const discosEncima = estado[torreDondeEsta].length - posicionEnTorre - 1;

  // Costo estimado: mover discos encima (2^discosEncima - 1) + 1 (mover el grande)
  // + mover los demás discos restantes
  let costoEstimado = discosEncima + 1;

  // Sumar los discos que están en otras torres (que tampoco están en objetivo)
  for (let i = 0; i < 3; i++) {
    if (i !== torreObjetivo) {
      costoEstimado = costoEstimado + estado[i].length;
    }
  }

  // Evitar doble conteo del disco grande
  if (torreDondeEsta !== torreObjetivo) {
    costoEstimado = costoEstimado - 1; // Ya lo contamos con el +1
  }

  return Math.max(costoEstimado, heuristica1_discosDescolocados(estado, torreObjetivo));
}

// ==============================
// CALCULAR HEURÍSTICA SEGÚN EL TIPO
// ==============================

export function calcularHeuristica(
  estado: Estado,
  torreObjetivo: number,
  tipoHeuristica: number,
  numeroDiscos: number
): number {
  if (tipoHeuristica === 1) {
    return heuristica1_discosDescolocados(estado, torreObjetivo);
  }
  if (tipoHeuristica === 2) {
    return heuristica2_sumaDistancias(estado, torreObjetivo);
  }
  if (tipoHeuristica === 3) {
    return heuristica3_discoGrande(estado, torreObjetivo, numeroDiscos);
  }
  return 0;
}

// ==============================
// GENERAR SUCESORES (HIJOS)
// ==============================

export function generarSucesores(estado: Estado): { nuevoEstado: Estado; movimiento: string }[] {
  const sucesores: { nuevoEstado: Estado; movimiento: string }[] = [];

  for (let origen = 0; origen < 3; origen++) {
    // Solo si la torre origen tiene discos
    if (estado[origen].length > 0) {
      // El disco de arriba de la torre origen
      const disco = estado[origen][estado[origen].length - 1];

      for (let destino = 0; destino < 3; destino++) {
        if (origen !== destino) {
          // Regla de Hanoi: solo mover si destino vacío o disco arriba es mayor
          const torreDestino = estado[destino];
          const destinoVacio = torreDestino.length === 0;
          const discoDestinoMayor = !destinoVacio && torreDestino[torreDestino.length - 1] > disco;

          if (destinoVacio || discoDestinoMayor) {
            const copia = copiarEstado(estado);
            const discoMovido = copia[origen].pop()!;
            copia[destino].push(discoMovido);

            const textoMovimiento = "Disco " + disco + ": Torre " + (origen + 1) + " → Torre " + (destino + 1);
            sucesores.push({ nuevoEstado: copia, movimiento: textoMovimiento });
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

export function aEstrella(
  numeroDiscos: number,
  tipoHeuristica: number
): Resultado {
  // Estado inicial: todos los discos en la torre 1 (índice 0)
  const estadoInicial: Estado = [[], [], []];
  for (let i = numeroDiscos; i >= 1; i--) {
    estadoInicial[0].push(i);
  }

  // Estado objetivo: todos los discos en la torre 3 (índice 2)
  const torreObjetivo = 2;

  const estadoObjetivoTexto = estadoATexto([
    [],
    [],
    Array.from({ length: numeroDiscos }, function (_, i) {
      return numeroDiscos - i;
    }),
  ]);

  // Lista de nodos abiertos (frontera de exploración)
  interface NodoAbierto {
    f: number;       // f(n) = g(n) + h(n)
    g: number;       // g(n) = costo acumulado de la ruta
    estado: Estado;
    camino: string[];
    pasos: Paso[];
  }

  const abiertos: NodoAbierto[] = [];
  // Conjunto de nodos cerrados (ya visitados)
  const cerrados = new Set<string>();

  // Calcular heurística del estado inicial
  // g(inicial) = 0 porque no hemos hecho ningún movimiento
  // h(inicial) = estimación heurística del estado inicial
  const costoRutaInicial = 0; // g(n): no se ha recorrido ninguna ruta todavía
  const hInicial = calcularHeuristica(estadoInicial, torreObjetivo, tipoHeuristica, numeroDiscos);
  const fInicial = costoRutaInicial + hInicial; // f(n) = g(n) + h(n)

  // Agregar nodo inicial a la lista de abiertos
  abiertos.push({
    f: fInicial,
    g: costoRutaInicial,
    estado: estadoInicial,
    camino: [],
    pasos: [
      {
        estado: estadoInicial,
        g: costoRutaInicial,
        h: hInicial,
        f: fInicial,
        movimiento: "Estado inicial",
      },
    ],
  });

  let nodosExpandidos = 0;
  const iteraciones: Iteracion[] = [];

  // Bucle principal del algoritmo
  while (abiertos.length > 0) {
    // Buscar el nodo con menor f(n) en la lista de abiertos
    let indiceMejor = 0;
    for (let i = 1; i < abiertos.length; i++) {
      if (abiertos[i].f < abiertos[indiceMejor].f) {
        indiceMejor = i;
      }
    }

    // Extraer el mejor nodo
    const nodoActual = abiertos.splice(indiceMejor, 1)[0];
    const textoEstado = estadoATexto(nodoActual.estado);

    // Si ya fue visitado, saltar
    if (cerrados.has(textoEstado)) {
      continue;
    }

    // Marcar como visitado
    cerrados.add(textoEstado);

    // Generar sucesores para registrarlos en la iteración
    const sucesores = generarSucesores(nodoActual.estado);

    // Calcular datos de los sucesores para mostrar
    const sucesoresConDatos = sucesores.map(function (s) {
      const hSucesor = calcularHeuristica(s.nuevoEstado, torreObjetivo, tipoHeuristica, numeroDiscos);
      const gSucesor = nodoActual.g + 1;
      return {
        estado: s.nuevoEstado,
        movimiento: s.movimiento,
        g: gSucesor,
        h: hSucesor,
        f: gSucesor + hSucesor,
      };
    });

    // Guardar iteración
    iteraciones.push({
      numeroPaso: nodosExpandidos,
      estadoActual: nodoActual.estado,
      g: nodoActual.g,
      h: nodoActual.f - nodoActual.g,
      f: nodoActual.f,
      movimiento: nodoActual.camino.length > 0
        ? nodoActual.camino[nodoActual.camino.length - 1]
        : "Estado inicial",
      cantidadAbiertos: abiertos.length,
      cantidadCerrados: cerrados.size,
      sucesoresGenerados: sucesoresConDatos,
    });

    // ¿Llegamos al objetivo?
    if (textoEstado === estadoObjetivoTexto) {
      return {
        pasos: nodoActual.pasos,
        iteraciones: iteraciones,
        totalMovimientos: nodoActual.camino.length,
        nodosExpandidos: nodosExpandidos,
        solucionEncontrada: true,
      };
    }

    // Explorar sucesores (nodos hijos)
    for (let i = 0; i < sucesores.length; i++) {
      const sucesor = sucesores[i];
      const textoSucesor = estadoATexto(sucesor.nuevoEstado);

      if (!cerrados.has(textoSucesor)) {
        // g(n) = costo de la ruta: cada movimiento cuesta 1
        // Entonces g(hijo) = g(padre) + 1
        const costoRutaNuevo = nodoActual.g + 1;

        // h(n) = estimación heurística del nuevo estado
        const hNuevo = calcularHeuristica(sucesor.nuevoEstado, torreObjetivo, tipoHeuristica, numeroDiscos);

        // f(n) = g(n) + h(n) → función de evaluación
        // g se SUMA porque es un costo acumulado de la ruta seguida
        const fNuevo = costoRutaNuevo + hNuevo;

        abiertos.push({
          f: fNuevo,
          g: costoRutaNuevo,
          estado: sucesor.nuevoEstado,
          camino: [...nodoActual.camino, sucesor.movimiento],
          pasos: [
            ...nodoActual.pasos,
            {
              estado: sucesor.nuevoEstado,
              g: costoRutaNuevo,
              h: hNuevo,
              f: fNuevo,
              movimiento: sucesor.movimiento,
            },
          ],
        });
      }
    }

    nodosExpandidos = nodosExpandidos + 1;

    // Seguridad: evitar bucles infinitos
    if (nodosExpandidos > 20000) {
      break;
    }
  }

  // No se encontró solución
  return {
    pasos: [],
    iteraciones: iteraciones,
    totalMovimientos: 0,
    nodosExpandidos: nodosExpandidos,
    solucionEncontrada: false,
  };
}
