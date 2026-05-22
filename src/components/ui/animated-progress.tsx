"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedProgressProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
  showValue?: boolean;
  glowColor?: "primary" | "accent" | "warm";
}

const gradients = {
  primary: "from-purple-500 via-violet-500 to-purple-600",
  accent: "from-cyan-400 via-teal-400 to-cyan-500",
  warm: "from-amber-400 via-orange-400 to-amber-500",
};

const glows = {
  primary: "shadow-[0_0_20px_hsl(260,100%,65%,0.5)]",
  accent: "shadow-[0_0_20px_hsl(175,100%,50%,0.5)]",
  warm: "shadow-[0_0_20px_hsl(35,100%,55%,0.5)]",
};

export default function AnimatedProgress({ 
  value, 
  max = 100,
  className = "",
  barClassName = "",
  showValue = false,
  glowColor = "primary"
}: AnimatedProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={cn("relative", className)}>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted/50 backdrop-blur-sm">
        <motion.div
          className={cn(
            "h-full rounded-full bg-gradient-to-r",
            gradients[glowColor],
            glows[glowColor],
            barClassName
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: 1.5, 
            ease: [0.34, 1.56, 0.64, 1],
            delay: 0.2 
          }}
        />
      </div>
      {showValue && (
        <motion.span
          className="absolute -top-6 text-sm font-medium text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, left: `${percentage}%` }}
          transition={{ duration: 1.5, delay: 0.2 }}
          style={{ transform: "translateX(-50%)" }}
        >
          {Math.round(percentage)}%
        </motion.span>
      )}
    </div>
  );
}
