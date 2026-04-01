"use client";
import sty from "./page.module.css";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useRef } from "react";
import Critter from "./components/Critter";
import { OrbitControls } from "@react-three/drei";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { EyeVariant, MouthVariant, critterConfig } from "./critterConfig";

interface CritterData {
  name: string;
  mainColor: string;
  eyes: EyeVariant;
  mouth: MouthVariant;
}

const Maker: React.FC = () => {
  const searchParams = useSearchParams();
  const loadedCritterId = searchParams.get("critterindex");
  const editing =
    typeof parseInt(loadedCritterId || "") === "number" &&
    loadedCritterId !== null;
  const [critter, setCritter] = useState<CritterData>(() => {
    try {
      const critters = JSON.parse(localStorage.getItem("critters") || "[]");
      if (critters.length) {
        const index = loadedCritterId
          ? parseInt(loadedCritterId)
          : critters.length - 1;
        if (index >= 0 && index < critters.length) {
          return {
            name: critters[index].name,
            mainColor: critters[index].mainColor,
            eyes: critters[index].eyes || "tangy",
            mouth: critters[index].mouth || "tangy",
          };
        }
      }
      return {
        name: "Critter",
        mainColor: "#fff",
        eyes: "tangy",
        mouth: "tangy",
      };
    } catch {
      return {
        name: "Critter",
        mainColor: "#fff",
        eyes: "tangy",
        mouth: "tangy",
      };
    }
  });
  const [showSavedStatus, setShowSavedStatus] = useState(false);
  const [showSavedAsStatus, setShowSavedAsStatus] = useState(false);

  const downloadLink = useRef<HTMLAnchorElement>(null);

  function saveCritter(as: boolean = false) {
    try {
      const critters = JSON.parse(localStorage.getItem("critters") || "[]");
      if (editing && !as) {
        critters[loadedCritterId] = {
          name: critter.name,
          mainColor: critter.mainColor,
          eyes: critter.eyes,
          mouth: critter.mouth,
        };
      } else {
        critters.push({
          name: critter.name,
          mainColor: critter.mainColor,
          eyes: critter.eyes,
          mouth: critter.mouth,
        });
      }
      localStorage.setItem("critters", JSON.stringify(critters));

      if (editing && as) {
        setShowSavedAsStatus(true);
      } else {
        setShowSavedStatus(true);
      }
      setTimeout(() => {
        setShowSavedStatus(false);
        setShowSavedAsStatus(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to save critter:", error);
    }
  }

  function downloadImg() {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvas.toBlob((blob) => {
        if (blob && downloadLink.current) {
          downloadLink.current.href = URL.createObjectURL(blob);
          downloadLink.current.click();
        } else {
          console.error("Error downloading image.");
        }
      }, "image/png");
    } else {
      console.error("No canvas found.");
    }
  }

  return (
    <div className="page">
      <main className="main">
        <h1>
          <div>3D CritterMaker</div>
          <div className="subtitle">aka Animal Crossing Villager NPC Maker</div>
        </h1>
        <div className={sty.critterContainer}>
          <Canvas
            gl={{ preserveDrawingBuffer: true }}
            className={sty.critter}
            style={{ width: "30rem", height: "35rem" }}
            camera={{
              position: [0, 1.5, 10],
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
              <Critter
                mainColor={critter.mainColor}
                eyes={critter.eyes}
                mouth={critter.mouth}
              />
            </Suspense>
          </Canvas>
          <form className={sty.controls}>
            <label>
              Name
              <input
                type="text"
                id="name"
                value={critter.name}
                onChange={(e) =>
                  setCritter((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </label>
            <label>
              Main Color
              <input
                type="color"
                id="main-color"
                value={critter.mainColor}
                onChange={(e) =>
                  setCritter((prev) => ({ ...prev, mainColor: e.target.value }))
                }
              />
            </label>
            <fieldset className={sty.variants}>
              <legend>
                <span>Eyes</span>
              </legend>
              {critterConfig.eyes.options.map((option) => (
                <label key={option}>
                  <input
                    type="radio"
                    name="eyes"
                    value={option}
                    onChange={(e) =>
                      setCritter((prev) => ({
                        ...prev,
                        eyes: e.target.value as EyeVariant,
                      }))
                    }
                  ></input>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </label>
              ))}
            </fieldset>
            <fieldset className={sty.variants}>
              <legend>
                <span>Mouth</span>
              </legend>
              {critterConfig.mouth.options.map((option) => (
                <label key={option}>
                  <input
                    type="radio"
                    name="mouth"
                    value={option}
                    onChange={(e) =>
                      setCritter((prev) => ({
                        ...prev,
                        mouth: e.target.value as MouthVariant,
                      }))
                    }
                  ></input>
                  <img
                    src={`/variant-icons/cat-mouths/mouth-${option}.png`}
                    title={option.charAt(0).toUpperCase() + option.slice(1)}
                    alt={`${option.charAt(0).toUpperCase() + option.slice(1)}-style mouth`}
                  />
                </label>
              ))}
            </fieldset>
            <button type="button" onClick={() => saveCritter()}>
              Save{showSavedStatus ? "d!" : ""}
            </button>
            {editing && (
              <button type="button" onClick={() => saveCritter(true)}>
                Save{showSavedAsStatus ? "d" : ""} as New Critter
                {showSavedAsStatus ? "!" : ""}
              </button>
            )}
            <button type="button" onClick={() => downloadImg()}>
              Download .png
            </button>
            <Link href="" download ref={downloadLink} className="display-none">
              Invisible download link (script-activated)
            </Link>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Maker;
