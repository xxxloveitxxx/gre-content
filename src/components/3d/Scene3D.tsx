"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei";
import FloatingShapes from "./FloatingShapes";
import ParticleField from "./ParticleField";
import GlowingOrb from "./GlowingOrb";

export default function Scene3D() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={60} />
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={0.5} color="#a855f7" />
          <pointLight position={[-10, -10, -10]} intensity={0.3} color="#22d3ee" />
          
          <FloatingShapes />
          <ParticleField count={200} />
          <GlowingOrb position={[5, 3, -5]} color="#a855f7" scale={1.5} />
          <GlowingOrb position={[-6, -2, -8]} color="#22d3ee" scale={2} />
          <GlowingOrb position={[0, -4, -10]} color="#f59e0b" scale={1} />
          
          <Environment preset="night" />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 3}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
