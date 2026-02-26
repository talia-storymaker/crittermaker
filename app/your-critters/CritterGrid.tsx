"use client";
import sty from "./your-critters.module.css";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import Critter from "../components/Critter";
import Link from "next/link";

interface Critter {
  name: string;
  mainColor: string;
}

export default function CritterGrid() {
  const [critters, setCritters] = useState<Critter[]>([]);

  useEffect(() => {
    try {
      const storedCritters = JSON.parse(
        localStorage.getItem("critters") || "[]",
      );
      setCritters(storedCritters);
    } catch (error) {
      console.error("Failed to load critters:", error);
      setCritters([]);
    }
  }, []);

  function deleteCritter(index: number) {
    const updatedCritters = critters.filter((_, i) => i !== index);
    localStorage.setItem("critters", JSON.stringify(updatedCritters));
    setCritters(updatedCritters);
  }

  return (
    <div className={sty.critters}>
      {critters.length === 0 ? (
        <p>
          You haven't saved any critters yet.
          <Link href="/">Create one!</Link>
        </p>
      ) : null}
      {critters.map(
        (critter: Critter, index: number) => (
          <div key={index} className={`subtle-bg ${sty.critter}`}>
            <h2>{critter.name}</h2>
            <Canvas 
              style={{ width: '10rem', height: '10rem' }}
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
                <Critter mainColor={critter.mainColor} />
              </Suspense>
            </Canvas>
            <button onClick={() => deleteCritter(index)}>Delete</button>
          </div>
        ),
      )}
    </div>
  );
}
