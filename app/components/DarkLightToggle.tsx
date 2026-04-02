"use client";
import Switch from "@mui/material/Switch";
import { useState, useEffect } from "react";

function DarkLightToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: light)");
    setIsLight(media.matches);
    if (localStorage.getItem("theme") === "light") {
      setIsLight(true);
    } else if (localStorage.getItem("theme") === "dark") {
      setIsLight(false);
    }
  }, []);

  return (
    <span className="theme-toggle-container">
      <span className="theme-toggle">Dark Mode{" "}
      <Switch
        checked={isLight}
        onChange={(e) => {
          setIsLight(e.target.checked);
          localStorage.setItem("theme", e.target.checked ? "light" : "dark");
        }}
        slotProps={{
          input: { "aria-label": "Light Mode toggle" },
        }}
      />{" "}
      Light Mode</span>
      <button
        onClick={() => {
          localStorage.removeItem("theme");
          const media = window.matchMedia("(prefers-color-scheme: light)");
          setIsLight(media.matches);
        }}
      >
        Reset to System Preference
      </button>
    </span>
  );
}

export default DarkLightToggle;
