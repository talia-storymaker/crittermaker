"use client";
import sty from "./page.module.css";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import Critter from "./components/Critter";
import { OrbitControls } from "@react-three/drei";

export default function Home() {
  const [mainColor, setMainColor] = useState(() => {
    try {
      const critters = JSON.parse(localStorage.getItem("critters") || "[]");
      if (critters.length) {
        return critters[critters.length - 1].mainColor;
      }
      return "#555";
    } catch {
      return "#555";
    }
  });
  const [name, setName] = useState(() => {
    try {
      const critters = JSON.parse(localStorage.getItem("critters") || "[]");
      if (critters.length) {
        return critters[critters.length - 1].name;
      }
      return "Critter";
    } catch {
      return "Critter";
    }
  });
  const [showSavedStatus, setShowSavedStatus] = useState(false);

  function saveCritter(name: string, mainColor: string) {
    try {
      const critters = JSON.parse(localStorage.getItem("critters") || "[]");
      critters.push({ name, mainColor });
      localStorage.setItem("critters", JSON.stringify(critters));
      setShowSavedStatus(true);
      setTimeout(() => setShowSavedStatus(false), 2000);
    } catch (error) {
      console.error("Failed to save critter:", error);
    }
  }

  return (
    <div className="page">
      <main className="main">
        <div className="header">
          <h1>
            3D CritterMaker 
            <div className="subtitle">Inspired by Animal Crossing</div>
          </h1>
        </div>
        <div className={sty.critterContainer}>
          <Canvas 
            className={sty.critter}
            style={{ width: '30rem', height: '35rem' }}
            camera={{
              position: [0, 0, 10],
            }}
            shadows
          >
            <ambientLight color={"#fff"} intensity={3} />
            <spotLight 
              position={[10, 10, 10]} 
              angle={0.15} 
              penumbra={3} 
              decay={0} 
              intensity={Math.PI} 
              castShadow 
            />
            <OrbitControls />
            <Suspense fallback={null}>
              <Critter mainColor={mainColor} />
            </Suspense>
          </Canvas>
          <form className={sty.controls}>
            <label>
              Name
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label>
              Main Color
              <input
                type="color"
                id="main-color"
                value={mainColor}
                onChange={(e) => setMainColor(e.target.value)}
              />
            </label>
            <button onClick={() => saveCritter(name, mainColor)}>
              Save{showSavedStatus ? "d!" : ""}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
