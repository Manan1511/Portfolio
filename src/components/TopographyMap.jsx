import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const VertexShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform float uHover;

varying float vElevation;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  
  // Base Flowing Topography (Liquid metal effect)
  // Slower, smoother waves
  float elevation = sin(modelPosition.x * 0.3 + uTime * 0.3) * 0.3
                  + sin(modelPosition.y * 0.3 + uTime * 0.2) * 0.3;
                  
  // Mouse Interaction (Magnetic Mountain)
  float dist = distance(modelPosition.xy, uMouse);
  float interaction = smoothstep(4.0, 0.0, dist); // Larger radius
  elevation += interaction * 2.0 * uHover;

  modelPosition.z += elevation;
  vElevation = elevation;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
}
`;

const FragmentShader = `
uniform vec3 uColor;
varying float vElevation;

void main() {
  // Darker at bottom, brighter at peaks
  float alpha = smoothstep(-1.0, 1.5, vElevation); 
  vec3 color = mix(uColor * 0.1, uColor, alpha);
  
  gl_FragColor = vec4(color, alpha); // Use alpha for additive blending
}
`;

const TopographyMap = () => {
    const meshRef = useRef();
    const { viewport } = useThree();

    // Target mouse position for lerping
    const targetMouse = useRef(new THREE.Vector2(0, 0));

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(0, 0) },
            uHover: { value: 0 },
            uColor: { value: new THREE.Color('#D000FF') }
        }),
        []
    );

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();

            // Calculate target position
            const x = (state.mouse.x * viewport.width) / 2;
            const y = (state.mouse.y * viewport.height) / 2;
            targetMouse.current.set(x, y);

            // Smoothly interpolate current uMouse to targetMouse
            meshRef.current.material.uniforms.uMouse.value.lerp(targetMouse.current, 0.05);

            // Simple hover effect intensity
            meshRef.current.material.uniforms.uHover.value = THREE.MathUtils.lerp(
                meshRef.current.material.uniforms.uHover.value,
                1.0,
                0.05
            );
        }
    });

    return (
        <mesh ref={meshRef} rotation={[-Math.PI / 3, 0, 0]} position={[0, -2, -5]}>
            {/* Increased geometry segments for smoother visuals */}
            <planeGeometry args={[40, 40, 128, 128]} />
            <shaderMaterial
                vertexShader={VertexShader}
                fragmentShader={FragmentShader}
                uniforms={uniforms}
                wireframe={true}
                transparent={true}
                blending={THREE.AdditiveBlending}
                depthWrite={false} // Fixes z-fighting glitches
            />
        </mesh>
    );
};

export default TopographyMap;
