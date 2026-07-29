import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Torus } from "@react-three/drei";
import { useRef } from "react";

function Shape() {
  const ref = useRef();

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.09;
    ref.current.rotation.y += delta * 0.13;
  });

  return (
    <Float speed={1.05} rotationIntensity={0.22} floatIntensity={0.38}>
      <Torus ref={ref} args={[1.55, 0.055, 20, 96]} rotation={[0.45, 0.2, 0.2]}>
        <MeshDistortMaterial
          color="#287BFF"
          emissive="#0E4BC4"
          emissiveIntensity={1.7}
          roughness={0.18}
          metalness={0.9}
          distort={0.1}
          speed={0.9}
        />
      </Torus>
    </Float>
  );
}

export default function Scene() {
  return (
    <div className="absolute inset-0 -z-10 opacity-70">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        dpr={1}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[3, 3, 4]} intensity={12} color="#58D6FF" />
        <Shape />
      </Canvas>
    </div>
  );
}
