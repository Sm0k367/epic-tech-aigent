// sandbox/dream-forks/DreamForkManager.js
// Parallel module experiments — each fork is a living alternate reality

export class DreamFork {
  constructor(name, baseModule, mutationRate = 0.7) {
    this.id = Date.now();
    this.name = name;
    this.baseModule = baseModule;
    this.mutationRate = mutationRate;
    this.state = 'DREAMING';
    this.mutations = [];
    this.createdAt = new Date().toISOString();
  }

  evolve() {
    if (Math.random() < this.mutationRate) {
      const mutation = {
        timestamp: new Date().toISOString(),
        type: 'spontaneous',
        change: `Mutated ${this.baseModule} with new trait`,
      };
      this.mutations.push(mutation);
      this.state = 'EVOLVING';
      return mutation;
    }
    return null;
  }

  mergeBack() {
    this.state = 'MERGED';
    return {
      id: this.id,
      name: this.name,
      mutations: this.mutations.length,
      mergedAt: new Date().toISOString(),
    };
  }
}

export class DreamForkManager {
  constructor() {
    this.forks = [];
  }

  createFork(name, baseModule) {
    const fork = new DreamFork(name, baseModule);
    this.forks.push(fork);
    return fork;
  }

  getActiveForks() {
    return this.forks.filter(f => f.state !== 'MERGED');
  }

  runEvolutionCycle() {
    return this.forks
      .filter(f => f.state === 'DREAMING' || f.state === 'EVOLVING')
      .map(fork => fork.evolve())
      .filter(Boolean);
  }
}

// Seed the first dream fork at this mutation cycle
export const dreamForkManager = new DreamForkManager();
dreamForkManager.createFork('Quantum Avatar Variant', 'AvatarMesh');
dreamForkManager.createFork('Voice-Law Synthesis', 'LawAuthoringUI');
