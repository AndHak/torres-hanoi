export type State = number[][];
export type Path = string[];

export interface Step {
  estado: State;
  g: number;
  h: number;
  f: number;
  movimiento: string;
}

export interface Result {
  camino: string[];
  pasos: Step[];
  totalMovimientos: number;
  nodosExpandidos: number;
}

export function stateToTuple(state: State): string {
  return state.map(tower => tower.join(',')).join('|');
}

export function copyState(state: State): State {
  return state.map(tower => [...tower]);
}

export function countDisksOutside(state: State, targetTower: number): number {
  let total = 0;
  for (let i = 0; i < 3; i++) {
    if (i !== targetTower) {
      total += state[i].length;
    }
  }
  return total;
}

export function customHeuristic(state: State, targetTower: number, formula: string, nDisks: number): number {
  const k = countDisksOutside(state, targetTower);
  const n = nDisks;
  try {
    // Basic sanitization and evaluation
    const safeFormula = formula.replace(/\*\*/g, '**').replace(/\^/g, '**');
    // We use a limited Function constructor for basic evaluation
    const fn = new Function('k', 'n', `return ${safeFormula}`);
    const h = fn(k, n);
    return Math.max(0, Number(h));
  } catch (e) {
    return 0;
  }
}

export function generateSuccessors(state: State): [State, string][] {
  const successors: [State, string][] = [];
  for (let i = 0; i < 3; i++) {
    if (state[i].length > 0) {
      const disco = state[i][state[i].length - 1];
      for (let j = 0; j < 3; j++) {
        if (i !== j) {
          if (state[j].length === 0 || state[j][state[j].length - 1] > disco) {
            const newState = copyState(state);
            newState[j].push(newState[i].pop()!);
            const movimiento = `Mover disco ${disco} de Torre ${i + 1} a Torre ${j + 1}`;
            successors.push([newState, movimiento]);
          }
        }
      }
    }
  }
  return successors;
}

export function aStar(nDisks: number, tipoHeuristica: number, formula: string): Result | null {
  const estadoInicial = [Array.from({ length: nDisks }, (_, i) => nDisks - i), [], []];
  const estadoObjetivoStr = stateToTuple([[], [], Array.from({ length: nDisks }, (_, i) => nDisks - i)]);
  const objetivoTorre = 2;

  const abiertos: { f: number; g: number; estado: State; camino: string[]; pasos: Step[] }[] = [];
  const cerrados = new Set<string>();

  const hInicial = tipoHeuristica === 1 
    ? countDisksOutside(estadoInicial, objetivoTorre)
    : customHeuristic(estadoInicial, objetivoTorre, formula, nDisks);
  
  abiertos.push({
    f: hInicial,
    g: 0,
    estado: estadoInicial,
    camino: [],
    pasos: [{
      estado: estadoInicial,
      g: 0,
      h: hInicial,
      f: hInicial,
      movimiento: "Estado inicial"
    }]
  });

  let nodosExpandidos = 0;

  while (abiertos.length > 0) {
    // Find node with minimum f
    let minIdx = 0;
    for (let i = 1; i < abiertos.length; i++) {
      if (abiertos[i].f < abiertos[minIdx].f) {
        minIdx = i;
      }
    }

    const current = abiertos.splice(minIdx, 1)[0];
    const { f, g, estado, camino, pasos } = current;
    const estadoT = stateToTuple(estado);

    if (cerrados.has(estadoT)) continue;
    cerrados.add(estadoT);

    if (estadoT === estadoObjetivoStr) {
      return {
        camino,
        pasos,
        totalMovimientos: camino.length,
        nodosExpandidos
      };
    }

    const sucesores = generateSuccessors(estado);
    for (const [sucesor, movimiento] of sucesores) {
      if (!cerrados.has(stateToTuple(sucesor))) {
        const gNuevo = g + 1;
        const hNuevo = tipoHeuristica === 1
          ? countDisksOutside(sucesor, objetivoTorre)
          : customHeuristic(sucesor, objetivoTorre, formula, nDisks);
        const fNuevo = gNuevo + hNuevo;
        
        abiertos.push({
          f: fNuevo,
          g: gNuevo,
          estado: sucesor,
          camino: [...camino, movimiento],
          pasos: [...pasos, {
            estado: sucesor,
            g: gNuevo,
            h: hNuevo,
            f: fNuevo,
            movimiento
          }]
        });
      }
    }

    nodosExpandidos++;
    if (nodosExpandidos > 15000) return null; // Safety break
  }

  return null;
}
