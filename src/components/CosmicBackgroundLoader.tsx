"use client";

import dynamic from "next/dynamic";

const CosmicBackground = dynamic(() => import("./CosmicBackground"), {
  ssr: false,
  loading: () => (
    <div
      className="fixed inset-0 z-0"
      style={{
        background:
          "radial-gradient(ellipse at 25% 35%, #1a0533 0%, #0d0015 55%, #000008 100%)",
      }}
      aria-hidden="true"
    />
  ),
});

export default function CosmicBackgroundLoader() {
  return <CosmicBackground />;
}
