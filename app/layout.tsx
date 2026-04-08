import type { Metadata } from "next";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import Link from "next/link";
import LogoLink from "./components/LogoLink";
import NewCritterLink from "./components/NewCritterLink";
import DarkLightToggle from "./components/DarkLightToggle";
import muiTheme from "./muiTheme";

export const metadata: Metadata = {
  title: "Design Animal Crossing Villagers in 3D",
  description:
    "Create your own 3D animal villagers in the Animal Crossing New Horizons style, right here in your browser!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={muiTheme}>
            <header className="header subtle-bg less-subtle-bg">
              <LogoLink />
              <nav>
                <ul className="nav-list">
                  <li>
                    <NewCritterLink />
                  </li>
                  <li>
                    <Link href="/your-critters">Your Critters</Link>
                  </li>
                </ul>
              </nav>
            </header>
            {children}
            <footer className="subtle-bg less-subtle-bg">
              <div className="footer-inner">
                <p>
                  Create your own 3D animal villagers in the Animal Crossing New
                  Horizons style, right here in your browser!
                </p>
                <p>
                  This is a fan project and not endorsed by Nintendo. No
                  copyright infringement intended.
                </p>
                <p>
                  Created by{" "}
                  <Link href="https://www.taliadegisi.com/" target="_blank">
                    Talia Hatfield
                  </Link>
                  .
                </p>
                <p>
                  <DarkLightToggle />
                </p>
              </div>
            </footer>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
