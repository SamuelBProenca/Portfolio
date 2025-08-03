// app/components/LogoComponent.tsx
import React from "react";
import Image from "next/image";

type LogoProps = {
  theme?: "light" | "dark";
  className?: string;
  width?: number;
  height?: number;
};

const LogoComponent: React.FC<LogoProps> = ({
  theme = "light",
  className = "",
  width = 40,
  height = 40,
}) => {
  const logoSrc =
    theme === "dark"
      ? "/assets/VectorLogoPortfolioLight.svg"
      : "/assets/VectorLogoPortfolioDark.svg";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src={logoSrc}
        alt="SP Logo"
        width={width}
        height={height}
        priority
      />
    </div>
  );
};

export default LogoComponent;
