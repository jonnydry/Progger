import React from "react";

interface BackgroundTextureProps {
  isDark: boolean;
}

export const BackgroundTexture: React.FC<BackgroundTextureProps> = ({ isDark }) => {
  const orb = isDark
    ? {
        hatchOpacity: 0.025,
        primary: { opacity: 0.09, blur: "140px", size: "700px" },
        accent:  { opacity: 0.08, blur: "130px", size: "650px" },
        secondary: { opacity: 0.07, blur: "120px", size: "500px" },
      }
    : {
        hatchOpacity: 0.035,
        primary: { opacity: 0.06, blur: "200px", size: "800px" },
        accent:  { opacity: 0.05, blur: "190px", size: "750px" },
        secondary: { opacity: 0.04, blur: "180px", size: "600px" },
      };

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, hsl(var(--color-text) / ${orb.hatchOpacity}) 0px, hsl(var(--color-text) / ${orb.hatchOpacity}) 1px, transparent 1px, transparent 20px)`,
        }}
      />

      <div
        className="absolute rounded-full"
        style={{
          width: orb.primary.size,
          height: orb.primary.size,
          top: "-180px",
          left: "-180px",
          background: `hsl(var(--color-primary) / ${orb.primary.opacity})`,
          filter: `blur(${orb.primary.blur})`,
        }}
      />

      <div
        className="absolute rounded-full"
        style={{
          width: orb.accent.size,
          height: orb.accent.size,
          bottom: "-160px",
          right: "-160px",
          background: `hsl(var(--color-accent) / ${orb.accent.opacity})`,
          filter: `blur(${orb.accent.blur})`,
        }}
      />

      <div
        className="absolute rounded-full"
        style={{
          width: orb.secondary.size,
          height: orb.secondary.size,
          top: "-100px",
          right: "10%",
          background: `hsl(var(--color-secondary) / ${orb.secondary.opacity})`,
          filter: `blur(${orb.secondary.blur})`,
        }}
      />
    </div>
  );
};
