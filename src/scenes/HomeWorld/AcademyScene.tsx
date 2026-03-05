import { useFrame } from "@react-three/fiber";
import { RoundedBox, Text, useCursor } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

type Props = {
  onSelect: (id: string) => void;
  onHover: (id: string) => void;
  onLeave: () => void;
};

type Portal = {
  id: string;
  label: string;
  emoji: string;
  color: string;
  position: [number, number, number];
};

export default function AcademyScene({ onSelect, onHover, onLeave }: Props) {
  const portals = useMemo<Portal[]>(
    () => [
      { id: "pattern", label: "Pattern", emoji: "🧩", color: "#7cf3ff", position: [-3, 1, -1] },
      { id: "classifier", label: "Classifier", emoji: "🎯", color: "#48ff92", position: [0, 1, -2] },
      { id: "label", label: "Labeling", emoji: "🏷️", color: "#ffcf5a", position: [3, 1, -1] },
      { id: "tree", label: "Decision Tree", emoji: "🌳", color: "#a78bfa", position: [-1.8, 1, 2.1] },
      { id: "chat", label: "Chat Buddy", emoji: "💬", color: "#ff6b9e", position: [1.8, 1, 2.1] },
      { id: "dashboard", label: "Progress", emoji: "📊", color: "#ffffff", position: [0, 1, 3.9] }
    ],
    []
  );

  return (
    <group>
      <Floor />
      <Building />

      {portals.map((p) => (
        <PortalDoor
          key={p.id}
          portal={p}
          onSelect={onSelect}
          onHover={onHover}
          onLeave={onLeave}
        />
      ))}
    </group>
  );
}

function Floor() {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#0b1a36" />
    </mesh>
  );
}

function Building() {
  return (
    <group position={[0, 0, 0]}>
      <RoundedBox args={[8, 3.2, 6]} radius={0.25} smoothness={4} position={[0, 1.6, 0]}>
        <meshStandardMaterial color="#0e2550" />
      </RoundedBox>

      <Text position={[0, 2.7, 2.9]} fontSize={0.45} color="#eaf2ff" anchorX="center">
        AI ACADEMY
      </Text>

      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[1.6, 0.25, 1.6]} />
        <meshStandardMaterial color="#0a1733" />
      </mesh>
    </group>
  );
}

function PortalDoor({
  portal,
  onSelect,
  onHover,
  onLeave
}: {
  portal: { id: string; label: string; emoji: string; color: string; position: [number, number, number] };
  onSelect: (id: string) => void;
  onHover: (id: string) => void;
  onLeave: () => void;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  useFrame((_, dt) => {
    const target = hovered ? 1.12 : 1.0;
    ref.current.scale.lerp(new THREE.Vector3(target, target, target), 1 - Math.pow(0.001, dt));
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = hovered ? 0.55 : 0.2;
  });

  return (
    <group position={portal.position}>
      <RoundedBox
        ref={ref}
        args={[1.6, 2.2, 0.3]}
        radius={0.25}
        smoothness={8}
        onPointerEnter={() => {
          setHovered(true);
          onHover(portal.id);
        }}
        onPointerLeave={() => {
          setHovered(false);
          onLeave();
        }}
        onClick={() => onSelect(portal.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onSelect(portal.id);
        }}
        tabIndex={0 as unknown as number}
      >
        <meshStandardMaterial
          color="#0f1d3a"
          emissive={new THREE.Color(portal.color)}
          emissiveIntensity={0.2}
        />
      </RoundedBox>

      <Text position={[0, 0.55, 0.22]} fontSize={0.38} color="#eaf2ff" anchorX="center">
        {portal.emoji}
      </Text>
      <Text position={[0, -0.5, 0.22]} fontSize={0.18} color="#eaf2ff" anchorX="center">
        {portal.label}
      </Text>
    </group>
  );
}