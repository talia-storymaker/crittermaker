import { useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { useLayoutEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";

type Props = {
  mainColor?: string;
};

function Critter({ mainColor = "#555" }: Props) {
  const model = useLoader(FBXLoader, "/models/Cat.fbx");

  useLayoutEffect(() => {
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshPhysicalMaterial({ color: mainColor });
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [model, mainColor]);

  return (
    <group receiveShadow castShadow position={[0, -7, 0]}>
      <OrbitControls />
      <primitive object={model} />
    </group>
  );
}

export default Critter;