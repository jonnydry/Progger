import React from "react";

export const BackgroundTexture: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, hsl(var(--color-text) / 0.025) 0px, hsl(var(--color-text) / 0.025) 1px, transparent 1px, transparent 20px)",
        }}
      />

      <div
        className="absolute rounded-full"
        style={{
          width: "700px",
          height: "700px",
          top: "-180px",
          left: "-180px",
          background: "hsl(var(--color-primary) / 0.09)",
          filter: "blur(140px)",
        }}
      />

      <div
        className="absolute rounded-full"
        style={{
          width: "650px",
          height: "650px",
          bottom: "-160px",
          right: "-160px",
          background: "hsl(var(--color-accent) / 0.08)",
          filter: "blur(130px)",
        }}
      />

      <div
        className="absolute rounded-full"
        style={{
          width: "500px",
          height: "500px",
          top: "-100px",
          right: "10%",
          background: "hsl(var(--color-secondary) / 0.07)",
          filter: "blur(120px)",
        }}
      />
    </div>
  );
};
