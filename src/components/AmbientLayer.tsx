"use client";

import { useTheme } from "@/lib/theme-provider";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Generates a random number between min and max
const random = (min: number, max: number) => Math.random() * (max - min) + min;

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export default function AmbientLayer() {
  const { theme, animationEnabled, animationIntensity } = useTheme();
  const [particles, setParticles] = useState<Particle[]>([]);
  
  useEffect(() => {
    if (!animationEnabled || animationIntensity === "low") {
      setParticles([]);
      return;
    }

    // Adjust particle count based on intensity
    const count = animationIntensity === "high" ? 30 : 15;
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: random(0, 100),
      y: random(0, 100),
      size: random(10, 40),
      duration: random(10, 30),
      delay: random(0, 5),
      opacity: random(0.1, 0.4),
    }));

    setParticles(newParticles);
  }, [theme.id, animationEnabled, animationIntensity]);

  // Different rendering based on ambient type
  const renderParticles = () => {
    const { type, direction } = theme.ambient;

    return particles.map((p) => {
      let animateProps = {};
      
      if (direction === "up") {
        animateProps = {
          y: ["110vh", "-10vh"],
          x: [`${p.x}vw`, `${p.x + random(-10, 10)}vw`]
        };
      } else if (direction === "down") {
        animateProps = {
          y: ["-10vh", "110vh"],
          x: [`${p.x}vw`, `${p.x + random(-20, 20)}vw`],
          rotate: [0, 360]
        };
      } else {
        // Drift
        animateProps = {
          y: [`${p.y}vh`, `${p.y + random(-20, 20)}vh`, `${p.y}vh`],
          x: [`${p.x}vw`, `${p.x + random(-20, 20)}vw`, `${p.x}vw`],
        };
      }

      let shapeClass = "";
      if (type === "bubbles") shapeClass = "rounded-full border border-pink-300 bg-transparent";
      else if (type === "petals") shapeClass = "rounded-tl-full rounded-br-full bg-pink-200";
      else if (type === "gold-dust") shapeClass = "rounded-full bg-yellow-400 blur-sm";
      else if (type === "stars") shapeClass = "rounded-sm bg-white rotate-45";
      else shapeClass = "rounded-tl-full rounded-br-full bg-green-200"; // leaves
      
      return (
        <motion.div
          key={`${theme.id}-${p.id}`}
          className={`absolute ${shapeClass}`}
          style={{
            width: p.size,
            height: type === 'stars' ? p.size : p.size * 1.5,
            opacity: p.opacity,
          }}
          initial={{
            x: `${p.x}vw`,
            y: direction === "down" ? "-10vh" : direction === "up" ? "110vh" : `${p.y}vh`,
          }}
          animate={animateProps}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      );
    });
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Dynamic Gradients specific to themes */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-20"
        style={{
          background: theme.tokens["--color-primary"],
          top: "-10%",
          right: "-5%",
          transition: "background 1s ease",
        }}
      />
      <div 
        className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-15"
        style={{
          background: theme.tokens["--color-accent-1"],
          bottom: "-10%",
          left: "-10%",
          transition: "background 1s ease",
        }}
      />
      <div 
        className="absolute w-[300px] h-[300px] rounded-full blur-[100px] opacity-10"
        style={{
          background: theme.tokens["--color-accent-2"],
          top: "40%",
          left: "50%",
          transition: "background 1s ease",
        }}
      />
      
      <AnimatePresence>
        {animationEnabled && animationIntensity !== "low" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            {renderParticles()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
