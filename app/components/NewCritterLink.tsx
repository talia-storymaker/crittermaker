"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NewCritterLink: React.FC = () => {
  const pathname = usePathname();

  if (pathname === "/") {
    return <a href="/?new">New Critter</a>;
  }
  return <Link href="/?new">New Critter</Link>;
};

export default NewCritterLink;
