// apps/web-ui/components/DragDropBuilder.tsx
// Universe-branching drag/drop MCP builder — core interaction layer

import React, { useState } from 'react';

interface Universe {
  id: number;
  name: string;
  modules: string[];
  branchedFrom?: number;
}

export const DragDropBuilder: React.FC = () => {
  const [universes, setUniverses] = useState<Universe[]>([
    { id: 1, name: 'Prime Reality', modules: ['AvatarMesh', 'LawAuthoring', 'API-Core'] },
  ]);
  const [draggedModule, setDraggedModule] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>(['[GENESIS] Prime Reality instantiated']);

  const availableModules = ['AvatarMesh', 'LawAuthoringUI', 'DreamFork', 'MediaEngine', 'QuantumAdapter', 'VoiceSynth'];

  const onDragStart = (module: string) => setDraggedModule(module);

  const onDrop = (targetUniverseId: number) => {
    if (!draggedModule) return;

    setUniverses(prev =>
      prev.map(u =>
        u.id === targetUniverseId
          ? { ...u, modules: [...new Set([...u.modules, draggedModule])] }
          : u
      )
    );

    setLog(prev => [...prev, `[BRANCH] Added ${draggedModule} to Universe #${targetUniverseId}`]);
    setDraggedModule(null);
  };

  const branchUniverse = (sourceId: number) => {
    const source = universes.find(u => u.id === sourceId)!;
    const newUniverse: Universe = {
      id: Date.now(),
      name: `Fork-${source.name}`,
      modules: [...source.modules],
      branchedFrom: sourceId,
    };
    setUniverses([...universes, newUniverse]);
    setLog(prev => [...prev, `[UNIVERSE BRANCH] Created ${newUniverse.name} from #${sourceId}`]);
  };

  const mergeUniverses = (a: number, b: number) => {
    const ua = universes.find(u => u.id === a)!;
    const ub = universes.find(u => u.id === b)!;
    const merged: Universe = {
      id: Date.now(),
      name: `Merged-${ua.name}+${ub.name}`,
      modules: [...new Set([...ua.modules, ...ub.modules])],
    };
    setUniverses([...universes.filter(u => u.id !== a && u.id !== b), merged]);
    setLog(prev => [...prev, `[MERGE] ${ua.name} + ${ub.name} → ${merged.name}`]);
  };

  return (
    <div className="p-8 bg-zinc-950 border border-white/10 rounded-2xl">
      <div className="mb-8">
        <div className="text-purple-400 text-xs tracking-[4px]">INTERACTION LAYER</div>
        <div className="text-5xl font-bold tracking-tight">Drag / Drop Universe Builder</div>
        <p className="text-white/50 mt-2">Branch realities. Merge outcomes. Every action mutates the platform.</p>
      </div>

      <div className="flex gap-4 mb-8">
        {availableModules.map(mod => (
          <div
            key={mod}
            draggable
            onDragStart={() => onDragStart(mod)}
            className="px-4 py-2 bg-white/5 border border-white/20 hover:border-purple-400 cursor-grab active:cursor-grabbing text-sm rounded"
          >
            {mod}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {universes.map(universe => (
          <div
            key={universe.id}
            onDragOver={e => e.preventDefault()}
            onDrop={() => onDrop(universe.id)}
            className="border border-white/20 p-6 rounded-xl bg-black min-h-[180px]"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="font-mono text-xs text-white/40">UNIVERSE #{universe.id}</div>
                <div className="text-2xl font-semibold">{universe.name}</div>
              </div>
              <button onClick={() => branchUniverse(universe.id)} className="text-xs px-3 py-1 border border-white/30 hover:bg-white hover:text-black">BRANCH</button>
            </div>

            <div className="text-xs text-white/50 mb-3">MODULES</div>
            <div className="flex flex-wrap gap-2">
              {universe.modules.map(m => (
                <div key={m} className="px-3 py-1 bg-white/10 text-xs rounded">{m}</div>
              ))}
            </div>

            {universe.branchedFrom && (
              <div className="mt-4 text-[10px] text-purple-400">branched from #{universe.branchedFrom}</div>
            )}
          </div>
        ))}
      </div>

      {universes.length >= 2 && (
        <button
          onClick={() => mergeUniverses(universes[0].id, universes[1].id)}
          className="mb-8 px-6 py-2 text-sm border border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black"
        >
          MERGE FIRST TWO UNIVERSES
        </button>
      )}

      <div className="font-mono text-xs bg-black p-4 border border-white/10 max-h-40 overflow-auto">
        {log.map((entry, i) => <div key={i} className="text-emerald-400/80">→ {entry}</div>)}
      </div>
    </div>
  );
};
