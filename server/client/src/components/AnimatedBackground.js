import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

function AnimatedSphere() {
  const mesh = useRef(null);

  // Rotate the sphere continuously
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.01;
      mesh.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={mesh} position={[0, 0, 0]}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshStandardMaterial color="#4f46e5" wireframe />
    </mesh>
  );
}

export default function AnimatedBackground() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} />
        <AnimatedSphere />
      </Canvas>
    </div>
  );
}
