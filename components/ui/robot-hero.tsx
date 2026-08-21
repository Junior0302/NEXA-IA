"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

class HeartCurve extends THREE.Curve<THREE.Vector3> {
  getPoint(t: number, optionalTarget = new THREE.Vector3()) {
    t *= Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    return optionalTarget.set(x * 0.002, (y + 6) * 0.002, 0);
  }
}

const sharedHeartCurve = new HeartCurve();

function ResponsiveGroup({ children, scale = 1 }: { children: React.ReactNode; scale?: number }) {
  const { viewport } = useThree();
  return <group scale={Math.min(1.1, viewport.width / 3.5) * scale}>{children}</group>;
}

function GlassCapsule({ color, power, intensity }: { color: string; power: number; intensity: number }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({
    color: { value: new THREE.Color("#ffffff") },
    power: { value: 2.5 },
    intensity: { value: 0.6 },
  }), []);

  useFrame(() => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.color.value.set(color);
    materialRef.current.uniforms.power.value = power;
    materialRef.current.uniforms.intensity.value = intensity;
  });

  return (
    <mesh>
      <sphereGeometry args={[0.3, 64, 64, 0, Math.PI * 2, 0, Math.PI]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = -mvPosition.xyz;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          uniform vec3 color;
          uniform float power;
          uniform float intensity;
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          void main() {
            vec3 normal = normalize(vNormal);
            vec3 viewDir = normalize(vViewPosition);
            float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), power);
            gl_FragColor = vec4(color, fresnel * intensity);
          }
        `}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

const earBaseMat = new THREE.MeshStandardMaterial({ color: "#f0f0f0", roughness: 0.5 });
const earRingMat = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.3 });
const earCenterMat = new THREE.MeshStandardMaterial({ color: "#cccccc", roughness: 0.8 });
const antennaBaseMat = new THREE.MeshStandardMaterial({ color: "#999999", roughness: 0.4, metalness: 0.5 });
const antennaStickMat = new THREE.MeshStandardMaterial({ color: "#d0d0d0", roughness: 0.4, metalness: 0.2 });
const antennaTipMat = new THREE.MeshStandardMaterial({ color: "#ffca50", roughness: 0.2, toneMapped: false });

function RobotEar({ position, scale = 1, isLeft = false }: { position: [number, number, number]; scale?: number; isLeft?: boolean }) {
  const dir = isLeft ? -1 : 1;
  return (
    <group position={position} scale={scale}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow material={earBaseMat}>
        <cylinderGeometry args={[0.04, 0.04, 0.025, 32]} />
      </mesh>
      <mesh position={[dir * 0.012, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow material={earRingMat}>
        <torusGeometry args={[0.032, 0.008, 16, 32]} />
      </mesh>
      <mesh position={[dir * 0.012, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow material={earCenterMat}>
        <cylinderGeometry args={[0.03, 0.03, 0.005, 32]} />
      </mesh>
      <group position={[dir * 0.015, 0.035, 0]} rotation={[-0.4, 0, 0]}>
        <mesh position={[0, 0.01, 0]} castShadow receiveShadow material={antennaBaseMat}>
          <cylinderGeometry args={[0.006, 0.008, 0.02, 16]} />
        </mesh>
        <mesh position={[0, 0.06, 0]} castShadow receiveShadow material={antennaStickMat}>
          <cylinderGeometry args={[0.003, 0.003, 0.1, 8]} />
        </mesh>
        <mesh position={[0, 0.11, 0]} castShadow receiveShadow material={antennaTipMat}>
          <sphereGeometry args={[0.006, 16, 16]} />
        </mesh>
      </group>
    </group>
  );
}

const eyeMat = new THREE.MeshBasicMaterial({ color: "#fff0c9", toneMapped: false, transparent: true });
const heartMat = new THREE.MeshBasicMaterial({ color: "#ff3366", toneMapped: false });

function RobotEye({
  position,
  rotation,
  scale = 1,
  blinkDuration = 0.15,
  blinkCycle = 3,
  isLovedRef,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
  blinkDuration?: number;
  blinkCycle?: number;
  isLovedRef: React.MutableRefObject<boolean>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const normalEyesRef = useRef<THREE.Group>(null);
  const heartEyeRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current || !normalEyesRef.current || !heartEyeRef.current) return;
    const isHeart = isLovedRef.current;
    normalEyesRef.current.visible = !isHeart;
    heartEyeRef.current.visible = isHeart;
    const cycle = clock.getElapsedTime() % blinkCycle;
    let targetScaleY = 1;
    if (cycle < blinkDuration && !isHeart) targetScaleY = Math.max(0.05, 1 - Math.sin((cycle / blinkDuration) * Math.PI));
    groupRef.current.scale.set(scale, scale * targetScaleY, scale);
  });

  const { topPath, bottomPath } = useMemo(() => {
    const w = 0.025, h = 0.035, r = 0.02, g = 0.005;
    const top = new THREE.CurvePath<THREE.Vector3>();
    top.add(new THREE.LineCurve3(new THREE.Vector3(-w, g, 0), new THREE.Vector3(-w, h - r, 0)));
    top.add(new THREE.QuadraticBezierCurve3(new THREE.Vector3(-w, h - r, 0), new THREE.Vector3(-w, h, 0), new THREE.Vector3(-w + r, h, 0)));
    top.add(new THREE.LineCurve3(new THREE.Vector3(-w + r, h, 0), new THREE.Vector3(w - r, h, 0)));
    top.add(new THREE.QuadraticBezierCurve3(new THREE.Vector3(w - r, h, 0), new THREE.Vector3(w, h, 0), new THREE.Vector3(w, h - r, 0)));
    top.add(new THREE.LineCurve3(new THREE.Vector3(w, h - r, 0), new THREE.Vector3(w, g, 0)));
    const bottom = new THREE.CurvePath<THREE.Vector3>();
    bottom.add(new THREE.LineCurve3(new THREE.Vector3(-w, -g, 0), new THREE.Vector3(-w, -(h - r), 0)));
    bottom.add(new THREE.QuadraticBezierCurve3(new THREE.Vector3(-w, -(h - r), 0), new THREE.Vector3(-w, -h, 0), new THREE.Vector3(-w + r, -h, 0)));
    bottom.add(new THREE.LineCurve3(new THREE.Vector3(-w + r, -h, 0), new THREE.Vector3(w - r, -h, 0)));
    bottom.add(new THREE.QuadraticBezierCurve3(new THREE.Vector3(w - r, -h, 0), new THREE.Vector3(w, -h, 0), new THREE.Vector3(w, -(h - r), 0)));
    bottom.add(new THREE.LineCurve3(new THREE.Vector3(w, -(h - r), 0), new THREE.Vector3(w, -g, 0)));
    return { topPath: top, bottomPath: bottom };
  }, []);

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <mesh ref={heartEyeRef} visible={false} material={heartMat}>
        <tubeGeometry args={[sharedHeartCurve, 64, 0.0035, 8, true]} />
      </mesh>
      <group ref={normalEyesRef}>
        <mesh material={eyeMat}><capsuleGeometry args={[0.021, 0.035, 8, 16]} /></mesh>
      </group>
    </group>
  );
}

function generatePbrTexturesAsync(): Promise<{ colorMap: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const size = 512;
      const colorCanvas = document.createElement("canvas");
      const bumpCanvas = document.createElement("canvas");
      colorCanvas.width = bumpCanvas.width = size;
      colorCanvas.height = bumpCanvas.height = size;
      const colorContext = colorCanvas.getContext("2d");
      const bumpContext = bumpCanvas.getContext("2d");
      if (colorContext && bumpContext) {
        colorContext.fillStyle = "#dcdcdc"; colorContext.fillRect(0, 0, size, size);
        bumpContext.fillStyle = "#808080"; bumpContext.fillRect(0, 0, size, size);
        for (let i = 0; i < 10000; i++) {
          const x = Math.random() * size, y = Math.random() * size, r = 0.5 + Math.random() * 1.5;
          const dark = Math.random() > 0.15;
          colorContext.beginPath(); colorContext.arc(x, y, r, 0, Math.PI * 2); colorContext.fillStyle = dark ? "#222222" : "#dddddd"; colorContext.fill();
          bumpContext.beginPath(); bumpContext.arc(x, y, r, 0, Math.PI * 2); bumpContext.fillStyle = dark ? "#000000" : "#ffffff"; bumpContext.fill();
        }
      }
      const colorMap = new THREE.CanvasTexture(colorCanvas);
      const bumpMap = new THREE.CanvasTexture(bumpCanvas);
      colorMap.wrapS = bumpMap.wrapS = THREE.RepeatWrapping;
      colorMap.wrapT = bumpMap.wrapT = THREE.RepeatWrapping;
      colorMap.repeat.set(6, 3); bumpMap.repeat.set(6, 3);
      colorMap.needsUpdate = bumpMap.needsUpdate = true;
      resolve({ colorMap, bumpMap });
    }, 0);
  });
}

function RobotPrototype({
  neckParams = { baseR: 0.25, baseH: -0.01, midR: 0.23, midH: 0.02, lipBottomR: 0.27, lipBottomH: 0.025, lipTopR: 0.28, lipTopH: 0.05, innerR: 0.24, innerDropH: 0.03 },
  bodyParams = { bodyBevelR: 0.21, bodyBevelY: 0.38, bodyBevelT: 0.015 },
  color = "#c4c4c4",
  pantallaColor = "#00ffc6",
  pantallaBrillo = 1.2,
  blinkCycle = 3,
  metalness = 0,
}: {
  neckParams?: Record<string, number>;
  bodyParams?: Record<string, number>;
  color?: string;
  pantallaColor?: string;
  pantallaBrillo?: number;
  blinkCycle?: number;
  metalness?: number;
}) {
  const isLovedRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [textures, setTextures] = useState<{ colorMap: THREE.CanvasTexture | null; bumpMap: THREE.CanvasTexture | null }>({ colorMap: null, bumpMap: null });

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      pointerRef.current.x = THREE.MathUtils.clamp((event.clientX / window.innerWidth) * 2 - 1, -1, 1);
      pointerRef.current.y = THREE.MathUtils.clamp(-(event.clientY / window.innerHeight) * 2 + 1, -1, 1);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  useFrame((state, delta) => {
    if (!bodyRef.current || !headRef.current) return;
    const dt = Math.min(delta, 0.1);
    const time = state.clock.getElapsedTime();
    const idle = Math.sin(time * 0.72) * 0.026;
    const { x: tx, y: ty } = pointerRef.current;
    const maxMoveX = Math.min(state.viewport.width * 0.1, 0.48);
    const targetPosX = tx * maxMoveX + Math.sin(time * 0.38) * 0.045;
    bodyRef.current.position.x = THREE.MathUtils.lerp(bodyRef.current.position.x, targetPosX, 0.35 * dt);
    bodyRef.current.position.y = THREE.MathUtils.lerp(bodyRef.current.position.y, -0.3 + idle, 1.8 * dt);
    bodyRef.current.rotation.y = THREE.MathUtils.lerp(bodyRef.current.rotation.y, -tx * 0.24 + Math.sin(time * 0.48) * 0.08, 10 * dt);
    bodyRef.current.rotation.x = THREE.MathUtils.lerp(bodyRef.current.rotation.x, -ty * 0.18 + Math.cos(time * 0.6) * 0.025, 10 * dt);
    bodyRef.current.rotation.z = THREE.MathUtils.lerp(bodyRef.current.rotation.z, -tx * 0.12 + Math.sin(time * 0.42) * 0.035, 10 * dt);
    headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, tx * 0.85 + Math.sin(time * 0.55) * 0.1, 20 * dt);
    headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -ty * 0.24 + Math.cos(time * 0.68) * 0.035, 20 * dt);
  });

  useEffect(() => {
    let mounted = true;
    let generatedMaps: { colorMap: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } | null = null;
    generatePbrTexturesAsync().then((result) => {
      if (mounted) { generatedMaps = result; setTextures(result); }
      else { result.colorMap.dispose(); result.bumpMap.dispose(); }
    });
    return () => {
      mounted = false;
      if (generatedMaps) { generatedMaps.colorMap.dispose(); generatedMaps.bumpMap.dispose(); }
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handlePointerDown = (event: import("@react-three/fiber").ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    isLovedRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => { isLovedRef.current = false; }, 2000);
  };

  const neckProfile = useMemo(() => [
    new THREE.Vector2(neckParams.innerR, neckParams.baseH),
    new THREE.Vector2(neckParams.baseR, neckParams.baseH),
    new THREE.Vector2(neckParams.midR, neckParams.midH),
    new THREE.Vector2(neckParams.lipBottomR, neckParams.lipBottomH),
    new THREE.Vector2(neckParams.lipTopR, neckParams.lipTopH),
    new THREE.Vector2(neckParams.innerR, neckParams.lipTopH),
    new THREE.Vector2(neckParams.innerR, neckParams.lipTopH - neckParams.innerDropH),
  ], [neckParams]);
  const headMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#111111", roughness: 1, metalness: 0 }), []);
  if (!textures.colorMap) return null;

  const surfaceMaterial = (map: THREE.CanvasTexture, bumpMap: THREE.CanvasTexture) => ({ color, map, bumpMap, bumpScale: 0.005, roughness: 1, metalness, envMapIntensity: 0 });
  return (
    <group
      ref={bodyRef}
      position={[0, -0.3, 0]}
      onPointerDown={handlePointerDown}
      onPointerOver={() => { document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { document.body.style.cursor = "auto"; }}
    >
      <mesh castShadow receiveShadow><sphereGeometry args={[0.43, 64, 64, 0, Math.PI * 2, Math.PI * 0.15, Math.PI * 0.85]} /><meshStandardMaterial {...surfaceMaterial(textures.colorMap, textures.bumpMap)} /></mesh>
      {bodyParams.bodyBevelT > 0 && <mesh position={[0, bodyParams.bodyBevelY, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow><torusGeometry args={[bodyParams.bodyBevelR, bodyParams.bodyBevelT, 32, 64]} /><meshStandardMaterial {...surfaceMaterial(textures.colorMap, textures.bumpMap)} /></mesh>}
      <mesh position={[0, 0.38, 0]} receiveShadow castShadow><latheGeometry args={[neckProfile, 64]} /><meshStandardMaterial {...surfaceMaterial(textures.colorMap, textures.bumpMap)} /></mesh>
      <group ref={headRef} position={[0, 0.6, 0]}>
        <mesh material={headMat} castShadow receiveShadow><sphereGeometry args={[0.28, 64, 64, 0, Math.PI * 2, 0, Math.PI]} /></mesh>
        <GlassCapsule color={pantallaColor} power={3.8} intensity={pantallaBrillo} />
        <group position={[0, -0.02, 0.29]}>
          <RobotEye position={[-0.07, 0, 0]} rotation={[0, -0.2, 0]} scale={1.1} blinkDuration={0.45} blinkCycle={blinkCycle} isLovedRef={isLovedRef} />
          <RobotEye position={[0.07, 0, 0]} rotation={[0, 0.2, 0]} scale={1.1} blinkDuration={0.45} blinkCycle={blinkCycle} isLovedRef={isLovedRef} />
        </group>
        <RobotEar position={[-0.29, 0, 0]} isLeft scale={1.3} />
        <RobotEar position={[0.29, 0, 0]} scale={1.3} />
      </group>
    </group>
  );
}

export interface RobotSceneProps {
  color?: string;
  scale?: number;
  pantallaColor?: string;
  pantallaBrillo?: number;
  blinkCycle?: number;
  metalness?: number;
}

export function RobotScene({
  color = "#c4c4c4", scale = 1, pantallaColor = "#ffe2a1", pantallaBrillo = 1.35, blinkCycle = 3, metalness = 0,
}: RobotSceneProps = {}) {
  const entorno = { luzAmbiente: 0.75, sombraOpacidad: 0.85, sombraBlur: 1.7 };
  return (
    <Canvas shadows camera={{ position: [0, 0.2, 6], fov: 40 }}>
      <ambientLight intensity={entorno.luzAmbiente} color="#ffffff" />
      <Environment preset="studio" blur={0.5} />
      <ResponsiveGroup scale={scale}>
        <ContactShadows position={[0, -0.79, 0]} opacity={entorno.sombraOpacidad} scale={15} resolution={1024} blur={entorno.sombraBlur} far={2.5} color="#000000" />
        <RobotPrototype neckParams={{ baseR: 0.215, baseH: -0.05, midR: 0.28, midH: 0.02, lipBottomR: 0.295, lipBottomH: 0.045, lipTopR: 0.27, lipTopH: 0.055, innerR: 0.1, innerDropH: 0 }} bodyParams={{ bodyBevelR: 0.235, bodyBevelY: 0.34, bodyBevelT: 0.025 }} color={color} pantallaColor={pantallaColor} pantallaBrillo={pantallaBrillo} blinkCycle={blinkCycle} metalness={metalness} />
      </ResponsiveGroup>
    </Canvas>
  );
}

export default RobotScene;
