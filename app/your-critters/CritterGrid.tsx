"use client";
import sty from "./your-critters.module.css";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import Critter from "../components/Critter";
import Link from "next/link";
import { CritterData } from "../critterConfig";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

const CRITTERS_PER_PAGE = 6;

export default function CritterGrid() {
  const [critters, setCritters] = useState<CritterData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [critterToDelete, setCritterToDelete] = useState<null | number>(null);

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

  function deleteCritterDialog(index: number) {
    setDeleteDialogOpen(true);
    setCritterToDelete(index);
  }

  function deleteCritter(index: number) {
    const updatedCritters = critters.filter((_, i) => i !== index);
    localStorage.setItem("critters", JSON.stringify(updatedCritters));
    setCritters(updatedCritters);
    setCurrentPage(1);
  }

  function dynamicFontSize(length: number) {
    if (length < 11) return "";
    if (length > 15) return sty.nameLong;
    return sty.nameMed;
  }

  const totalPages = Math.ceil(critters.length / CRITTERS_PER_PAGE);
  const startIndex = (currentPage - 1) * CRITTERS_PER_PAGE;
  const endIndex = startIndex + CRITTERS_PER_PAGE;
  const paginatedCritters = critters.slice(startIndex, endIndex);

  return (
    <>
      <Dialog
        open={deleteDialogOpen}
        role="alertdialog"
        onClose={() => {
          setDeleteDialogOpen(false);
        }}
      >
        <DialogContent>
          <span className="destructive-warning">Permanently</span> delete this
          critter?
          <div className={sty.deleteControls}>
            <button
              className={sty.delete}
              onClick={() => {
                if (critterToDelete) deleteCritter(critterToDelete);
                setCritterToDelete(null);
                setDeleteDialogOpen(false);
              }}
            >
              Yes
            </button>
            <button
              onClick={() => {
                setDeleteDialogOpen(false);
                setCritterToDelete(null);
              }}
            >
              No
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <div className={sty.critters}>
        {critters.length === 0 ? (
          <p>
            You haven't saved any critters yet.
            <Link href="/">Create one!</Link>
          </p>
        ) : null}
        {critters.length > 0 && (
          <>
            {paginatedCritters.map((critter: CritterData, index: number) => {
              const actualIndex = startIndex + index;
              return (
                <div key={actualIndex} className={`subtle-bg ${sty.critter}`}>
                  <div className={sty.loadingIndicatorOuter}>
                    <div className={sty.loadingIndicator}></div>
                  </div>
                  <h2
                    className={`${sty.name} ${dynamicFontSize(critter.name.length)}`}
                  >
                    {critter.name}
                  </h2>
                  <div className={sty.critterInner}>
                    <Canvas
                      style={{ width: "10rem", height: "10rem" }}
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
                        <Critter
                          mainColor={critter.mainColor}
                          eyes={critter.eyes}
                          mouth={critter.mouth}
                          top={critter.top}
                        />
                      </Suspense>
                    </Canvas>
                    <div className={sty.critterControls}>
                      <Link
                        href={`/?critterindex=${actualIndex}`}
                        className="button"
                      >
                        Load
                      </Link>
                      <button
                        onClick={() => deleteCritterDialog(actualIndex)}
                        className={sty.delete}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
      {totalPages > 1 && (
        <div className={sty.pagination}>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            ◀ Prev
          </button>
          <span>
            {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
          >
            Next ▶
          </button>
        </div>
      )}
    </>
  );
}
