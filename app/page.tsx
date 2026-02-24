"use client";
import sty from "./page.module.css";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import Critter from "./components/Critter";

export default function Home() {
  const [mainColor, setMainColor] = useState(() => {
    try {
      return localStorage.getItem("mainColor") ?? "#555";
    } catch {
      return "#555";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("mainColor", mainColor);
    } catch {}
  }, [mainColor]);

  return (
    <div className="page">
      <main className="main">
        <div className="header">
          <h1 className="title">3D CritterMaker</h1>
          <div className="subtitle">Inspired by Animal Crossing</div>
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
            <Suspense fallback={null}>
              <Critter mainColor={mainColor} />
            </Suspense>
          </Canvas>
          <form className={sty.controls}>
            <label htmlFor="main-color">Main Color</label>
            <input
              type="color"
              id="main-color"
              value={mainColor}
              onChange={(e) => setMainColor(e.target.value)}
            />
          </form>
        </div>
      </main>
    </div>
  );
}
