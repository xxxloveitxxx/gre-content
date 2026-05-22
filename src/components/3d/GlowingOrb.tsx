"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GlowingOrbProps {
  position: [number, number, number];
  color: string;
  scale?: number;
}

export default function GlowingOrb({ position, color, scale = 1 }: GlowingOrbProps) {
  const innerRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const initialPos = [...position];
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (innerRef.current) {
      innerRef.current.rotation.x = time * 0.5;
      innerRef.current.rotation.y = time * 0.3;
    }
    
    if (outerRef.current) {
      outerRef.current.rotation.x = time * 0.2;
      outerRef.current.rotation.z = time * 0.4;
    }
    
    if (glowRef.current) {
      const pulseScale = scale * (1 + Math.sin(time * 2) * 0.1);
      glowRef.current.scale.setScalar(pulseScale * 1.5);
      glowRef.current.position.y = initialPos[1] + Math.sin(time * 0.5) * 0.3;
    }
    
    if (innerRef.current) {
      innerRef.current.position.y = initialPos[1] + Math.sin(time * 0.5) * 0.3;
    }
    
    if (outerRef.current) {
      outerRef.current.position.y = initialPos[1] + Math.sin(time * 0.5) * 0.3;
    }
  });

  return (
    <group position={position}>
      {/* Inner core */}
      <mesh ref={innerRef} scale={scale * 0.5}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
      
      {/* Outer wireframe */}
      <mesh ref={outerRef} scale={scale * 0.8}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color={color}
          wireframe
          transparent
          opacity={0.3}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Glow sphere */}
      <mesh ref={glowRef} scale={scale * 1.5}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}
