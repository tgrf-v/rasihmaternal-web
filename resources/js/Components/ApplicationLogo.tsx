import React from 'react';

interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  variant?: "color" | "white";
}

export default function ApplicationLogo({
  className = "h-8 w-8",
  variant = "color",
  alt = "RASIH Maternal Logo",
  ...props
}: LogoProps) {
  return (
    <img
      src="/images/logo.png"
      alt={alt}
      className={`shrink-0 object-contain transition-all duration-300 ${
        variant === "white" ? "brightness-0 invert drop-shadow-sm" : ""
      } ${className}`}
      {...props}
    />
  );
}

