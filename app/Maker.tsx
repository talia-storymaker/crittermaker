"use client";
import sty from "./page.module.css";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useRef, useEffect } from "react";
import Critter from "./components/Critter";
import { OrbitControls } from "@react-three/drei";
import Link from "next/link";
import { useSearchParams, redirect } from "next/navigation";
import {
  EyeVariant,
  MouthVariant,
  TopVariant,
  critterConfig,
  CritterData,
} from "./critterConfig";

const Maker: React.FC = () => {
  const searchParams = useSearchParams();
  const loadedCritterId = searchParams.has("new")
    ? null
    : searchParams.get("critterindex");
  const blankCritter = {
    name: "Critter",
    mainColor: "#fff",
    eyes: "tangy",
    mouth: "tangy",
    top: critterConfig.tops.options[0],
  };
  const editing =
    !Number.isNaN(loadedCritterId || "") && loadedCritterId !== null;
  const [critter, setCritter] = useState<CritterData>(() => {
    try {
      if (searchParams.has("new")) return blankCritter;
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
            top: critters[index].top || critterConfig.tops.options[0],
          };
        }
      }
      return blankCritter;
    } catch {
      return blankCritter;
    }
  });

  const [showSavedStatus, setShowSavedStatus] = useState(false);
  const [showSavedAsStatus, setShowSavedAsStatus] = useState(false);

  const [currentFeatureTab, setCurrentFeatureTab] = useState<"eyes" | "mouth">(
    "eyes",
  );
  const [currentClothesTab, setCurrentClothesTab] = useState("tops");

  useEffect(() => {
    if (searchParams.has("new")) return;
    if (loadedCritterId !== null) return; // prevent redirect loop
    let index = -1;
    const critters = JSON.parse(localStorage.getItem("critters") || "[]");
    if (critters.length) {
      index = critters.length - 1;
    }
    if (index >= 0 && index < critters.length) {
      redirect(`/?critterindex=${index}`);
    }
  }, []);

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
          top: critter.top,
        };
      } else {
        critters.push({
          name: critter.name,
          mainColor: critter.mainColor,
          eyes: critter.eyes,
          mouth: critter.mouth,
          top: critter.top,
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
          <div>
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
                  top={critter.top}
                />
              </Suspense>
            </Canvas>
            <small className={sty.critterNote}>
              Drag to rotate. Scroll to zoom.
            </small>
          </div>
          <form className={sty.controls}>
            <label>
              Name
              <input
                type="text"
                id="name"
                value={critter.name}
                onChange={(e) =>
                  setCritter((prev) => ({
                    ...prev,
                    name: e.target.value.slice(0, 25),
                  }))
                }
                // slice is in case user circumvents maxLength (unlikely)
                maxLength={25}
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
            <section className={sty.variantsCategory}>
              {currentFeatureTab === "eyes" ? (
                <fieldset className={sty.variants}>
                  <legend>
                    <span>Eyes</span>
                  </legend>
                  <button
                    onClick={() => setCurrentFeatureTab("mouth")}
                    className={sty.tabButton}
                  >
                    Mouth
                  </button>
                  {critterConfig.eyes.options.map((option) => (
                    <label className="button" key={option}>
                      <input
                        type="radio"
                        name="eyes"
                        value={option}
                        checked={critter.eyes === option}
                        onChange={(e) =>
                          setCritter((prev) => ({
                            ...prev,
                            eyes: e.target.value as EyeVariant,
                          }))
                        }
                      ></input>
                      <img
                        src={`/variant-icons/cat-eyes/eye-${option}.png`}
                        title={option.charAt(0).toUpperCase() + option.slice(1)}
                        alt={`${option.charAt(0).toUpperCase() + option.slice(1)}-style eye`}
                        className={sty.eyeIcon}
                      />
                    </label>
                  ))}
                </fieldset>
              ) : (
                ""
              )}
              {currentFeatureTab === "mouth" ? (
                <fieldset className={sty.variants}>
                  <legend>
                    <span>Mouth</span>
                  </legend>
                  <button
                    onClick={() => setCurrentFeatureTab("eyes")}
                    className={sty.tabButton}
                  >
                    Eyes
                  </button>
                  {critterConfig.mouth.options.map((option) => (
                    <label className="button" key={option}>
                      <input
                        type="radio"
                        name="mouth"
                        value={option}
                        checked={critter.mouth === option}
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
              ) : (
                ""
              )}
            </section>
            <section className={sty.variantsCategory}>
              {currentClothesTab === "tops" ? (
                <fieldset className={sty.variants}>
                  <legend>
                    <span>Tops</span>
                  </legend>
                  {critterConfig.tops.options.map((option) => (
                    <label className="button" key={option.name}>
                      <input
                        type="radio"
                        name="tops"
                        value={JSON.stringify(option)}
                        checked={
                          JSON.stringify(critter.top) === JSON.stringify(option)
                        }
                        onChange={(e) =>
                          setCritter((prev) => ({
                            ...prev,
                            top: JSON.parse(e.target.value) as TopVariant,
                          }))
                        }
                      ></input>
                      <img
                        src={`/variant-icons/tops/${option.name}.png`}
                        title={
                          option.name.charAt(0).toUpperCase() +
                          option.name.slice(1)
                        }
                        alt={`${option.name.charAt(0).toUpperCase() + option.name.slice(1)}`}
                      />
                    </label>
                  ))}
                </fieldset>
              ) : (
                ""
              )}
            </section>

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
