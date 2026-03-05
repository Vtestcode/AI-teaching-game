import { Creature, CreatureClass, QuestionId, QUESTIONS } from "./creatures";

export type Node =
  | { type: "leaf"; guess: CreatureClass; samples: Creature[] }
  | { type: "q"; q: QuestionId; yes: Node; no: Node; samples: Creature[] };

export function majorityClass(samples: Creature[]): CreatureClass {
  const floof = samples.filter((s) => s.clazz === "Floof").length;
  const bouncer = samples.length - floof;
  return floof >= bouncer ? "Floof" : "Bouncer";
}

export function split(samples: Creature[], q: QuestionId) {
  const yes: Creature[] = [];
  const no: Creature[] = [];
  const fn = QUESTIONS[q].fn;
  for (const s of samples) (fn(s) ? yes : no).push(s);
  return { yes, no };
}

export function buildNode(samples: Creature[], q?: QuestionId, yes?: Node, no?: Node): Node {
  if (!q || !yes || !no) return { type: "leaf", guess: majorityClass(samples), samples };
  return { type: "q", q, yes, no, samples };
}

export function classify(node: Node, creature: Creature): CreatureClass {
  if (node.type === "leaf") return node.guess;
  const fn = QUESTIONS[node.q].fn;
  return fn(creature) ? classify(node.yes, creature) : classify(node.no, creature);
}

export function accuracy(node: Node, data: Creature[]) {
  const correct = data.filter((c) => classify(node, c) === c.clazz).length;
  return data.length ? correct / data.length : 0;
}