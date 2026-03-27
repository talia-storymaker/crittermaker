import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Design Animal Crossing Villagers in 3D",
  description: "Create your own 3D animal villagers in the Animal Crossing New Horizons style, right here in your browser - no app download needed!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="header subtle-bg">
          <Link className="logo" href="/">
            3D CritterMaker
          </Link>
          <nav>
            <ul className="nav-list">
              <li>
                <Link href="/">Create</Link>
              </li>
              <li>
                <Link href="/your-critters">Your Critters</Link>
              </li>
            </ul>
          </nav>
        </header>
        {children}
        <footer className="subtle-bg">
          <div className="footer-inner">
            <p>
              Create your own 3D animal villagers in the Animal Crossing New Horizons style, right here in your browser - no app download needed!
            </p>
            <p>
              This is a fan project and not endorsed by Nintendo. No copyright
              infringement intended.
            </p>
            <p>
              Created by{" "}
              <Link href="https://www.taliadegisi.com/" target="_blank">
                Talia Hatfield
              </Link>
              .
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
