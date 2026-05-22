"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
}

export default function CursorTrail() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let particleId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      // Add new particle
      const newParticle: Particle = {
        id: particleId++,
        x: e.clientX,
        y: e.clientY,
      };

      setParticles((prev) => [...prev.slice(-15), newParticle]);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Remove old particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) => prev.slice(1));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Main cursor glow */}
      <motion.div
        className="absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          background: "radial-gradient(circle, hsl(260 100% 65% / 0.3) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
        }}
      />

      {/* Particle trail */}
      <AnimatePresence>
        {particles.map((particle, index) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0.8, scale: 1 }}
            animate={{ opacity: 0, scale: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              background: index % 2 === 0 
                ? "hsl(260 100% 65% / 0.6)" 
                : "hsl(175 100% 50% / 0.6)",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
