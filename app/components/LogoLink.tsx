"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LogoLink: React.FC = () => {
  const pathname = usePathname();

  if (pathname === "/") {
    return (
      <a className="logo" href="/">
        3D CritterMaker
      </a>
    );
  }
  return (
    <Link className="logo" href="/">
      3D CritterMaker
    </Link>
  );
};

export default LogoLink;
