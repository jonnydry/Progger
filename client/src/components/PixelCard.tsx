import React from "react";

interface PixelCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  noAnimate?: boolean;
  cornerColor?: "primary" | "accent" | "secondary"; // Themeable corner color
}

export const PixelCard: React.FC<PixelCardProps> = ({
  children,
  className = "",
  noAnimate = false,
  cornerColor = "primary",
  ...props
}) => {
  const cornerClass = `bg-${cornerColor}`;

  return (
    <div
      {...props}
      className={`bg-surface border-2 border-border p-4 md:p-8 shadow-lg relative ${!noAnimate ? "animate-fade-scale-in" : ""} ${className}`}
    >
      {/* Pixel corners decoration - positioned inside border to prevent clipping */}
      <div className={`absolute top-0 left-0 w-2 h-2 ${cornerClass}`}></div>
      <div className={`absolute top-0 right-0 w-2 h-2 ${cornerClass}`}></div>
      <div className={`absolute bottom-0 left-0 w-2 h-2 ${cornerClass}`}></div>
      <div className={`absolute bottom-0 right-0 w-2 h-2 ${cornerClass}`}></div>

      {children}
    </div>
  );
};
