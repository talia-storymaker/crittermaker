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

const CRITTERS_PER_PAGE = 6;

export default function CritterGrid() {
  const [critters, setCritters] = useState<Critter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

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
    setCurrentPage(1);
  }

  const totalPages = Math.ceil(critters.length / CRITTERS_PER_PAGE);
  const startIndex = (currentPage - 1) * CRITTERS_PER_PAGE;
  const endIndex = startIndex + CRITTERS_PER_PAGE;
  const paginatedCritters = critters.slice(startIndex, endIndex);

  return (
    <div className={sty.critters}>
      {critters.length === 0 ? (
        <p>
          You haven't saved any critters yet.
          <Link href="/">Create one!</Link>
        </p>
      ) : null}
      {critters.length > 0 && (
        <>
          {paginatedCritters.map(
            (critter: Critter, index: number) => {
              const actualIndex = startIndex + index;
              return (
                <div key={actualIndex} className={`subtle-bg ${sty.critter}`}>
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
                  <button onClick={() => deleteCritter(actualIndex)}>Delete</button>
                  <Link href={`/?critterindex=${actualIndex}`} className="button">Load</Link>
                </div>
              );
            },
          )}
          {totalPages > 1 && (
            <div className={sty.pagination}>
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>{currentPage} of {totalPages}</span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
