// apps/web-ui/pages/index.tsx
import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { motion } from 'framer-motion';
import { LawAuthoringUI } from '../components/LawAuthoringUI';
import { DragDropBuilder } from '../components/DragDropBuilder';
import { liveAvatar } from '../../media-engine/generative/AvatarMesh';
import { generativeSound } from '../../media-engine/generative/GenerativeSound';

function ReactiveAvatarMesh() {
  const [shape, setShape] = useState(liveAvatar.shape);
  const [color, setColor] = useState(liveAvatar.color);

  useEffect(() => {
    const interval = setInterval(() => {
      const state = liveAvatar.getCurrentState();
      if (state.shape !== shape) {
        setShape(state.shape);
        setColor(state.color);
        generativeSound.triggerMutationSound(Math.random(), state.personality);
      }
    }, 1200);
    return () => clearInterval(interval);
  }, [shape]);

  return (
    <mesh rotation={[0.4, 0.2, 0]}>
      {shape === 'dodecahedron' && <dodecahedronGeometry args={[6]} />}
      {shape === 'octahedron' && <octahedronGeometry args={[6]} />}
      {shape === 'icosahedron' && <icosahedronGeometry args={[6]} />}
      <meshPhongMaterial color={color} wireframe />
    </mesh>
  );
}

export default function EpicAigentUI() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-center z-50">
        <div className="text-3xl font-bold tracking-[8px]">EPIC TECH AIGENT</div>
        <div className="flex gap-8 text-sm">
          <a href="#legend">LEGEND</a>
          <a href="#laws">LAWS</a>
          <a href="#builder">BUILDER</a>
          <a href="#mesh">LIVE MESH</a>
        </div>
      </div>

      <div className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 20] }}>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} />
            <Stars radius={300} depth={50} count={2000} factor={4} />
            <ReactiveAvatarMesh />
            <OrbitControls />
          </Canvas>
        </div>

        <div className="relative z-10 text-center">
          <motion.h1 
            className="text-[120px] font-black tracking-[-8px] leading-none mb-4"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            THE<br />RECURSIVE<br />UNIVERSE
          </motion.h1>
          <p className="text-xl text-white/60 max-w-md mx-auto">
            Fractal. Multimodal. Self-evolving.<br />Every instance is unique.
          </p>
          <div className="mt-12 flex gap-4 justify-center">
            <button className="px-8 py-4 border border-white/40 hover:bg-white hover:text-black transition-all">ENTER THE MESH</button>
            <button className="px-8 py-4 bg-white text-black">PROPOSE A LAW</button>
          </div>
        </div>
      </div>

      <div id="mesh" className="min-h-screen border-t border-white/10 bg-zinc-950 pt-16 pb-24">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-12">
            <div className="text-emerald-400 text-sm tracking-[4px] mb-2">LIVE SYSTEM STATE • REALITY LAYER 0</div>
            <div className="text-6xl font-bold tracking-tight">REAL-TIME AVATAR MESH</div>
            <p className="mt-4 text-white/50">Neuro-responsive • Generative audio • Self-mutating • Fractal recursion active</p>
          </div>

          {/* Live Avatar State Panel */}
          <div className="bg-black border border-white/10 p-8 rounded-xl mb-12 font-mono text-sm">
            <div className="grid grid-cols-4 gap-8">
              <div><span className="text-white/40">PERSONALITY</span><br/>{liveAvatar.personality}</div>
              <div><span className="text-white/40">DIMENSION</span><br/>{liveAvatar.dimension}</div>
              <div><span className="text-white/40">SHAPE</span><br/>{liveAvatar.shape}</div>
              <div><span className="text-white/40">SUB-AVATARS</span><br/>{liveAvatar.subAvatars.length} (fractal depth)</div>
            </div>
            <div className="mt-8 pt-8 border-t border-white/10 text-emerald-400">
              MUTATIONS: {liveAvatar.mutationHistory.length} • LAST: {liveAvatar.mutationHistory[liveAvatar.mutationHistory.length-1]?.timestamp || 'GENESIS'}
            </div>
          </div>

          {/* Dream Forks — Parallel realities */}
          <div className="mb-12 p-8 border border-white/10 bg-black/50 rounded-xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <div className="text-amber-400 text-xs tracking-[4px]">SANDBOX</div>
                <div className="text-4xl font-bold tracking-tight">Dream Forks</div>
              </div>
              <div className="text-white/40 text-sm">Parallel experiments • Auto-merge supported</div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm font-mono">
              <div className="p-4 border border-white/10">Quantum Avatar Variant — EVOLVING (3 mutations)</div>
              <div className="p-4 border border-white/10">Voice-Law Synthesis — DREAMING</div>
            </div>
            <div className="mt-4 text-[10px] text-white/40">Run evolution cycle via API: POST /dream-fork/create</div>
          </div>

          {/* Drag/Drop Universe Builder */}
          <div id="builder" className="mb-12">
            <DragDropBuilder />
          </div>

          {/* Law Authoring — Direct platform transformation */}
          <div id="laws">
            <LawAuthoringUI />
          </div>
        </div>
      </div>
    </div>
  );
}
