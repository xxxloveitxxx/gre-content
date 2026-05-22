"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingIconProps {
  icon: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  color?: "primary" | "accent" | "warm";
}

const colorClasses = {
  primary: "text-primary bg-primary/20 shadow-[0_0_20px_hsl(260,100%,65%,0.4)]",
  accent: "text-accent bg-accent/20 shadow-[0_0_20px_hsl(175,100%,50%,0.4)]",
  warm: "text-amber-400 bg-amber-500/20 shadow-[0_0_20px_hsl(35,100%,55%,0.4)]",
};

export default function FloatingIcon({ 
  icon, 
  className = "",
  delay = 0,
  duration = 3,
  color = "primary"
}: FloatingIconProps) {
  return (
    <motion.div
      className={cn(
        "flex items-center justify-center rounded-2xl p-4",
        colorClasses[color],
        className
      )}
      initial={{ y: 0, rotate: 0 }}
      animate={{
        y: [0, -15, 0],
        rotate: [0, 5, 0, -5, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      whileHover={{
        scale: 1.2,
        rotate: 15,
        transition: { duration: 0.3 },
      }}
    >
      {icon}
    </motion.div>
  );
}
