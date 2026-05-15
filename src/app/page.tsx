import { Suspense } from "react";
import CosmicBackgroundLoader from "@/components/CosmicBackgroundLoader";
import ChatWindow from "@/components/ChatWindow";

export default function Home() {
  return (
    <main className="relative w-full h-dvh overflow-hidden">
      {/* Cosmic canvas background — SSR fallback is dark radial gradient */}
      <Suspense
        fallback={
          <div
            className="fixed inset-0 z-0"
            style={{
              background:
                "radial-gradient(ellipse at 25% 35%, #1a0533 0%, #0d0015 55%, #000008 100%)",
            }}
            aria-hidden="true"
          />
        }
      >
        <CosmicBackgroundLoader />
      </Suspense>

      {/* All page content sits above z-10 */}
      <div className="relative z-10 w-full h-full">
        <ChatWindow />
      </div>
    </main>
  );
}
