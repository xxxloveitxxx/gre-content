"use client";

import { motion } from "framer-motion";
import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "primary" | "accent" | "warm";
  interactive?: boolean;
  delay?: number;
}

const glowColors = {
  primary: "hover:shadow-[0_0_30px_hsl(260,100%,65%,0.3)]",
  accent: "hover:shadow-[0_0_30px_hsl(175,100%,50%,0.3)]",
  warm: "hover:shadow-[0_0_30px_hsl(35,100%,55%,0.3)]",
};

export default function GlassCard({ 
  children, 
  className = "",
  glowColor = "primary",
  interactive = true,
  delay = 0
}: GlassCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className={cn(
        "relative overflow-hidden rounded-2xl",
        "bg-card/60 backdrop-blur-xl",
        "border border-border/50",
        "transition-all duration-500 ease-out",
        interactive && glowColors[glowColor],
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Spotlight effect */}
      {interactive && isHovered && (
        <motion.div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, hsl(var(--primary) / 0.15), transparent 40%)`,
          }}
        />
      )}
      
      {/* Animated border gradient */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" 
           style={{ padding: "1px" }} />
      
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
