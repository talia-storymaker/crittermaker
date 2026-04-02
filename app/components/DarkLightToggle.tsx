"use client";
import Switch from "@mui/material/Switch";
import { useState, useEffect } from "react";

function DarkLightToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: light)");
    setIsLight(media.matches);
  }, []);

  return (
    <>
      Dark Mode{" "}
      <Switch
        checked={isLight}
        onChange={(e) => setIsLight(e.target.checked)}
        slotProps={{
          input: { "aria-label": "Light Mode toggle" },
        }}
      />{" "}
      Light Mode
    </>
  );
}

export default DarkLightToggle;
