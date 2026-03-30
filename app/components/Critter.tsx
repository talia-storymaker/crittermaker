import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EyeVariant, MouthVariant } from "../critterConfig";

type Props = {
  mainColor?: string;
  eyes?: EyeVariant;
  mouth?: MouthVariant;
};

function Critter({
  mainColor = "#fff",
  eyes = "tangy",
  mouth = "tangy",
}: Props) {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const manager = new THREE.LoadingManager();

    const loader = new FBXLoader(manager);
    loader.setPath("/models/cat/");
    manager.setURLModifier((url) => {
      if (url.endsWith(".png")) {
        let readyUrl = url.replace("models/cat", `models/cat/textures/default`);
        if (url.toLowerCase().includes("eye")) {
          readyUrl = readyUrl.replace("default", `${eyes}-normalized`);
        }
        if (url.toLowerCase().includes("mouth")) {
          readyUrl = readyUrl.replace("default", `${mouth}-normalized`);
        }
        return readyUrl;
      }
      return url;
    });
    loader.load("Cat.fbx", (model) => {
      if (groupRef.current) {
        groupRef.current.clear();
        groupRef.current.add(model);

        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const originalMat = Array.isArray(child.material)
              ? child.material[0]
              : child.material;

            const map = (originalMat as any)?.map || null;
            const normalMap = (originalMat as any)?.normalMap || null;

            if (map) {
              map.colorSpace = THREE.SRGBColorSpace;
            }

            const material = new THREE.ShaderMaterial({
              uniforms: {
                baseColor: { value: new THREE.Color(mainColor) },
                map: { value: map },
                normalMap: { value: normalMap },
                hasNormalMap: { value: Boolean(normalMap) },
              },
              vertexShader: `
                varying vec2 vUv;
                varying vec3 vNormal;
                varying vec3 vPosition;
                void main() {
                  vUv = uv;
                  vNormal = normalize(normalMatrix * normal);
                  vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
              `,
              fragmentShader: `
                uniform vec3 baseColor;
                uniform sampler2D map;
                uniform sampler2D normalMap;
                uniform bool hasNormalMap;
                varying vec2 vUv;
                varying vec3 vNormal;
                varying vec3 vPosition;
                void main() {
                  vec4 tex = texture2D(map, vUv);
                  vec3 color = mix(baseColor, tex.rgb, tex.a);
                  vec3 normal = vNormal;
                  if (hasNormalMap) {
                    vec3 normalTex = texture2D(normalMap, vUv).rgb * 2.0 - 1.0;
                    normal = normalize(normalTex + vNormal);
                  }
                  vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
                  float diff = max(dot(normal, lightDir), 0.0);
                  color *= diff * 0.8 + 0.3; // ambient + diffuse
                  color = pow(color, vec3(1.0 / 2.2)); // gamma correction
                  gl_FragColor = vec4(color, 1.0);
                }
              `,
              transparent: false,
              side: THREE.DoubleSide,
            });
            child.material = material;
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
      }
    });
  }, [mainColor, eyes, mouth]);

  return (
    <group ref={groupRef} position={[0, -7.75, 0]} receiveShadow castShadow />
  );
}

export default Critter;
