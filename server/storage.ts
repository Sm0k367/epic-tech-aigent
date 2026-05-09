import { randomUUID } from "crypto";
import { z } from "zod";

// EPIC TECH AIGENT Production Storage — Persistent Laws, Mutations, Dream Forks

export const LawSchema = z.object({
  id: z.number().optional(),
  text: z.string().min(5),
  proposer: z.string().default("Architect"),
  votes: z.number().default(1),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
  createdAt: z.date().default(() => new Date()),
});

export const MutationSchema = z.object({
  id: z.number().optional(),
  description: z.string(),
  timestamp: z.date().default(() => new Date()),
});

export const DreamForkSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  description: z.string().optional(),
  status: z.enum(["EVOLVING", "DREAMING", "MERGED"]).default("EVOLVING"),
  createdAt: z.date().default(() => new Date()),
});

export type Law = z.infer<typeof LawSchema>;
export type Mutation = z.infer<typeof MutationSchema>;
export type DreamFork = z.infer<typeof DreamForkSchema>;

export interface IStorage {
  getAllLaws(): Promise<Law[]>;
  createLaw(law: Omit<Law, "id" | "createdAt">): Promise<Law>;
  voteOnLaw(id: number): Promise<Law | undefined>;
  getAllDreamForks(): Promise<DreamFork[]>;
  createDreamFork(fork: Omit<DreamFork, "id" | "createdAt">): Promise<DreamFork>;
  getRecentMutations(limit?: number): Promise<Mutation[]>;
  createMutation(description: string): Promise<Mutation>;
}

class InMemoryStorage implements IStorage {
  private laws: Law[] = [];
  private mutations: Mutation[] = [];
  private dreamForks: DreamFork[] = [];
  private nextId = 1;

  async getAllLaws(): Promise<Law[]> {
    return [...this.laws];
  }

  async createLaw(data: Omit<Law, "id" | "createdAt">): Promise<Law> {
    const law: Law = {
      ...data,
      id: this.nextId++,
      createdAt: new Date(),
    };
    this.laws.unshift(law);
    return law;
  }

  async voteOnLaw(id: number): Promise<Law | undefined> {
    const law = this.laws.find(l => l.id === id);
    if (law) {
      law.votes += 1;
      if (law.votes >= 5) law.status = "approved";
    }
    return law;
  }

  async getAllDreamForks(): Promise<DreamFork[]> {
    return [...this.dreamForks];
  }

  async createDreamFork(data: Omit<DreamFork, "id" | "createdAt">): Promise<DreamFork> {
    const fork: DreamFork = {
      ...data,
      id: this.nextId++,
      createdAt: new Date(),
    };
    this.dreamForks.unshift(fork);
    return fork;
  }

  async getRecentMutations(limit = 15): Promise<Mutation[]> {
    return this.mutations.slice(0, limit);
  }

  async createMutation(description: string): Promise<Mutation> {
    const mutation: Mutation = {
      id: this.nextId++,
      description,
      timestamp: new Date(),
    };
    this.mutations.unshift(mutation);
    return mutation;
  }
}

export const storage = new InMemoryStorage();

console.log("🧬 EPIC TECH AIGENT Storage initialized — Laws, Mutations, and Dream Forks ready for recursive evolution.");
