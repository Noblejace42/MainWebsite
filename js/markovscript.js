// Sample two linked passage fragments from the trained transition graph.
// Consume each edge once per cycle. Keep recent passages out of the foreground.
class PassageChain {
  constructor(model, random = Math.random) {
    this.model = model;
    this.random = random;
    this.recent = [];
    this.reset();
  }

  reset() {
    this.ends = this.model.groups.map(group => group.slice());
    this.prose = [];
    this.poetry = [];
    for (const [index, [, passage]] of this.model.prefixes.entries()) {
      const pool = passage >= this.model.firstPoem ? this.poetry : this.prose;
      pool.push(index);
    }
    this.untilPoem = this.index(7);
  }

  index(length) {
    return Math.floor(this.random() * length);
  }

  draw() {
    if (!this.prose.length && !this.poetry.length) this.reset();
    const usePoem = this.poetry.length && (!this.prose.length || this.untilPoem <= 0);
    const pool = usePoem ? this.poetry : this.prose;
    let best;
    for (let i = 0; i < 12; i++) {
      const slot = this.index(pool.length);
      const state = pool[slot];
      const edge = this.index(this.ends[state].length);
      const end = this.model.suffixes[this.ends[state][edge]];
      const start = this.model.prefixes[state];
      const age = id => this.recent.lastIndexOf(id) + 1;
      const score = this.random() - age(start[1]) - age(end[1]);
      if (!best || score > best.score) best = {slot, state, edge, start, end, score};
    }
    const {slot, state, edge, start, end} = best;
    const edges = this.ends[state];
    edges[edge] = edges[edges.length - 1];
    edges.pop();
    if (!edges.length) {
      pool[slot] = pool[pool.length - 1];
      pool.pop();
    }
    this.untilPoem = usePoem ? 5 + this.index(4) : this.untilPoem - 1;
    this.recent = [...this.recent.slice(-30), start[1], end[1]];
    return (start[0] + ' ' + end[0]).replace(/\s+([,;:.!?])/g, '$1').replace(/\s*—\s*/g, '—');
  }
}
