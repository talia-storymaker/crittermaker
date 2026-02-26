import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
  mainColor?: string;
};

function Critter({ mainColor = "#555" }: Props) {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const loader = new FBXLoader();
    loader.load("/models/Cat.fbx", (model) => {
      if (groupRef.current) {
        groupRef.current.clear();
        groupRef.current.add(model);

        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshPhysicalMaterial({ color: mainColor });
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
      }
    });
  }, [mainColor]);

  return (
    <group ref={groupRef} position={[0, -7, 0]} receiveShadow castShadow />
  );
}

export default Critter;