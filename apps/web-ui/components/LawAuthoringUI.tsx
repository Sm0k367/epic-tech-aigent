// apps/web-ui/components/LawAuthoringUI.tsx
// Collaborative law authoring UI — immediate platform transformation

import React, { useState } from 'react';

interface ProposedLaw {
  id: number;
  text: string;
  proposer: string;
  votes: number;
}

export const LawAuthoringUI: React.FC = () => {
  const [laws, setLaws] = useState<ProposedLaw[]>([
    { id: 1, text: "All avatars must maintain at least 3 sub-fractals", proposer: "Architect", votes: 3 },
  ]);
  const [newLaw, setNewLaw] = useState('');
  const [mutationLog, setMutationLog] = useState<string[]>([]);

  const proposeLaw = () => {
    if (!newLaw.trim()) return;

    const law: ProposedLaw = {
      id: Date.now(),
      text: newLaw.trim(),
      proposer: 'User + Agent',
      votes: 1,
    };

    setLaws([...laws, law]);
    setMutationLog(prev => [...prev, `LAW PROPOSED: "${newLaw}" — awaiting consensus`]);
    setNewLaw('');

    // Simulate immediate platform mutation (per spec)
    setTimeout(() => {
      setMutationLog(prev => [...prev, `MUTATION: Law entered recursive evaluation`]);
    }, 800);
  };

  const vote = (id: number) => {
    setLaws(laws.map(l => l.id === id ? { ...l, votes: l.votes + 1 } : l));
    setMutationLog(prev => [...prev, `VOTE CAST — Law #${id} consensus rising`]);
  };

  return (
    <div className="p-8 bg-zinc-950 border border-white/10 rounded-xl max-w-4xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="text-emerald-400 text-xs tracking-[4px]">LAW LAB — SANDBOX</div>
          <div className="text-5xl font-bold tracking-tight">Author New Laws</div>
        </div>
        <div className="text-right text-white/40 text-sm">Self-governance active • Rollback supported</div>
      </div>

      <div className="flex gap-4 mb-8">
        <input
          value={newLaw}
          onChange={e => setNewLaw(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && proposeLaw()}
          placeholder="Propose a new immutable law for the platform..."
          className="flex-1 bg-black border border-white/20 px-6 py-4 text-lg focus:outline-none focus:border-white/60"
        />
        <button onClick={proposeLaw} className="px-10 py-4 bg-white text-black font-medium">PROPOSE + MUTATE</button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Active Proposals */}
        <div>
          <div className="uppercase text-xs tracking-widest text-white/40 mb-4">PROPOSED LAWS • AWAITING CONSENSUS</div>
          {laws.map(law => (
            <div key={law.id} className="mb-3 p-5 border border-white/10 hover:border-white/30 transition-all">
              <div className="font-mono text-sm text-emerald-400 mb-1">LAW #{law.id}</div>
              <div className="text-xl mb-4">“{law.text}”</div>
              <div className="flex items-center justify-between text-sm">
                <div>Proposed by {law.proposer}</div>
                <button onClick={() => vote(law.id)} className="px-4 py-1 border border-white/40 hover:bg-white hover:text-black">VOTE ({law.votes})</button>
              </div>
            </div>
          ))}
        </div>

        {/* Live Mutation Feed */}
        <div>
          <div className="uppercase text-xs tracking-widest text-white/40 mb-4">LIVE MUTATION FEED</div>
          <div className="bg-black p-5 h-[320px] overflow-auto font-mono text-sm border border-white/10">
            {mutationLog.length === 0 ? (
              <div className="text-white/30">No mutations yet. Propose a law to begin recursive transformation.</div>
            ) : (
              mutationLog.map((entry, i) => <div key={i} className="mb-2 text-emerald-400/90">→ {entry}</div>)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
