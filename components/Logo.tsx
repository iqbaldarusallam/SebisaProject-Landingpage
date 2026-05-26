import Image from "next/image";
import React from "react";

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <Image
      src="/logo-sebisa.png"
      alt="Sebisa Project"
      width={120}
      height={40}
      priority
      className={`object-contain ${className}`}
    />
  );
};

export default Logo;
