"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, RoundedBox, Torus } from "@react-three/drei";
import * as THREE from "three";

function AnimatedBox({ position, color, speed = 1 }: { position: [number, number, number]; color: string; speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = position[1];
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3 * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2 * speed;
      meshRef.current.position.y = initialY + Math.sin(state.clock.elapsedTime * speed) * 0.5;
    }
  });

  return (
    <RoundedBox ref={meshRef} position={position} args={[1, 1, 1]} radius={0.1} smoothness={4}>
      <MeshDistortMaterial
        color={color}
        transparent
        opacity={0.6}
        distort={0.3}
        speed={2}
        roughness={0.2}
        metalness={0.8}
      />
    </RoundedBox>
  );
}

function AnimatedTorus({ position, color, speed = 1 }: { position: [number, number, number]; color: string; speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = position[1];
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.4 * speed;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.2 * speed;
      meshRef.current.position.y = initialY + Math.cos(state.clock.elapsedTime * speed * 0.8) * 0.3;
    }
  });

  return (
    <Torus ref={meshRef} position={position} args={[0.6, 0.2, 16, 32]}>
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.5}
        roughness={0.3}
        metalness={0.9}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </Torus>
  );
}

function AnimatedSphere({ position, color, speed = 1 }: { position: [number, number, number]; color: string; speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialPos = [...position];
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.x = initialPos[0] + Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.8;
      meshRef.current.position.y = initialPos[1] + Math.cos(state.clock.elapsedTime * speed * 0.7) * 0.5;
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * speed * 2) * 0.1);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <icosahedronGeometry args={[0.5, 1]} />
      <MeshDistortMaterial
        color={color}
        transparent
        opacity={0.4}
        distort={0.4}
        speed={3}
        roughness={0.1}
        metalness={0.9}
      />
    </mesh>
  );
}

export default function FloatingShapes() {
  return (
    <group>
      <AnimatedBox position={[-7, 2, -3]} color="#a855f7" speed={0.8} />
      <AnimatedBox position={[8, -1, -5]} color="#22d3ee" speed={1.2} />
      <AnimatedBox position={[3, 4, -8]} color="#f59e0b" speed={0.6} />
      
      <AnimatedTorus position={[-5, -3, -4]} color="#a855f7" speed={1} />
      <AnimatedTorus position={[6, 3, -6]} color="#22d3ee" speed={0.7} />
      
      <AnimatedSphere position={[-3, 0, -2]} color="#a855f7" speed={1.1} />
      <AnimatedSphere position={[4, -2, -4]} color="#22d3ee" speed={0.9} />
      <AnimatedSphere position={[0, 3, -5]} color="#f59e0b" speed={1.3} />
    </group>
  );
}
