"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"

export default function WorkspaceScene() {
  const sceneRef = useRef()

  // ในอนาคตเมื่อคุณมีโมเดล 3D ของตัวละคร คุณสามารถโหลดได้ที่นี่
  // const { scene: characterScene } = useGLTF("/path-to-your-character.glb")
  const { scene: duckScene } = useGLTF("/assets/3d/duck.glb")
  const characterRef = useRef()

  useFrame((state) => {
    if (characterRef.current) {
      // เพิ่มการเคลื่อนไหวเล็กน้อยให้กับตัวละคร
      characterRef.current.position.y = 0.7 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05
    }

    if (sceneRef.current) {
      // การหมุนของฉากทั้งหมดตามตำแหน่งของเมาส์
      const target = new THREE.Vector3(
        state.mouse.x * 0.1,
        Math.max(0, state.mouse.y * 0.05),
        -0.5 + state.mouse.y * 0.1,
      )
      sceneRef.current.rotation.y = THREE.MathUtils.lerp(sceneRef.current.rotation.y, target.x, 0.025)
      sceneRef.current.rotation.x = THREE.MathUtils.lerp(sceneRef.current.rotation.x, target.z, 0.025)
    }
  })

  return (
    <group ref={sceneRef} position={[0, -1, 0]}>
      {/* พื้น/พรม */}
      <mesh receiveShadow position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#f9a825" />
      </mesh>

      {/* พรมด้านใน */}
      <mesh receiveShadow position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 5]} />
        <meshStandardMaterial color="#fbc02d" />
      </mesh>

      {/* โต๊ะทำงาน */}
      <mesh receiveShadow castShadow position={[0, 0.4, 0]}>
        <boxGeometry args={[4, 0.1, 2]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* ขาโต๊ะ */}
      {[
        [-1.8, 0, -0.8],
        [1.8, 0, -0.8],
        [-1.8, 0, 0.8],
        [1.8, 0, 0.8],
      ].map((pos, i) => (
        <mesh key={i} receiveShadow castShadow position={pos}>
          <cylinderGeometry args={[0.05, 0.05, 0.8]} />
          <meshStandardMaterial color="#e0e0e0" />
        </mesh>
      ))}

      {/* จอคอมพิวเตอร์ */}
      <mesh receiveShadow castShadow position={[0.8, 0.9, -0.5]} rotation={[0, -0.2, 0]}>
        <boxGeometry args={[1.2, 0.8, 0.05]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* หน้าจอคอมพิวเตอร์ */}
      <mesh receiveShadow position={[0.8, 0.9, -0.47]} rotation={[0, -0.2, 0]}>
        <boxGeometry args={[1.1, 0.7, 0.01]} />
        <meshStandardMaterial color="#1a1a2e" emissive="#4a5568" emissiveIntensity={0.5} />
      </mesh>

      {/* โค้ดบนหน้าจอ */}
      <mesh receiveShadow position={[0.8, 0.9, -0.46]} rotation={[0, -0.2, 0]}>
        <planeGeometry args={[1, 0.6]} />
        <meshBasicMaterial transparent opacity={0.7}>
          <canvasTexture attach="map" args={[createCodeTexture()]} />
        </meshBasicMaterial>
      </mesh>

      {/* ขาตั้งจอ */}
      <mesh receiveShadow castShadow position={[0.8, 0.5, -0.5]} rotation={[0, -0.2, 0]}>
        <boxGeometry args={[0.2, 0.1, 0.2]} />
        <meshStandardMaterial color="#555555" />
      </mesh>

      {/* คีย์บอร์ด */}
      <mesh receiveShadow castShadow position={[0.3, 0.46, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.8, 0.02, 0.3]} />
        <meshStandardMaterial color="#dddddd" />
      </mesh>

      {/* เมาส์ */}
      <mesh receiveShadow castShadow position={[1.2, 0.46, 0.2]} rotation={[0, -0.3, 0]}>
        <capsuleGeometry args={[0.03, 0.1, 4, 8]} />
        <meshStandardMaterial color="#dddddd" />
      </mesh>

      {/* ต้นไม้ */}
      <group position={[1.8, 0.46, 0.8]}>
        <mesh receiveShadow castShadow>
          <cylinderGeometry args={[0.15, 0.2, 0.3]} />
          <meshStandardMaterial color="#d4c9be" />
        </mesh>

        <mesh receiveShadow castShadow position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.25, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#4caf50" />
        </mesh>

        {/* ใบไม้เพิ่มเติม */}
        <mesh receiveShadow castShadow position={[0.1, 0.4, 0]}>
          <sphereGeometry args={[0.15, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#66bb6a" />
        </mesh>

        <mesh receiveShadow castShadow position={[-0.1, 0.35, 0.1]}>
          <sphereGeometry args={[0.12, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#81c784" />
        </mesh>
      </group>

      {/* บอร์ดติดประกาศ */}
      <mesh receiveShadow castShadow position={[0, 1.5, -1]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[2, 1, 0.05]} />
        <meshStandardMaterial color="#b38b6d" />
      </mesh>

      {/* โน้ตบนบอร์ด */}
      {[
        { pos: [-0.5, 1.5, -0.97], rot: [0.1, 0, 0.1], color: "#ffffff" },
        { pos: [0.4, 1.6, -0.97], rot: [0.1, 0, -0.05], color: "#e3f2fd" },
        { pos: [0, 1.3, -0.97], rot: [0.1, 0, 0.02], color: "#fff8e1" },
      ].map((note, i) => (
        <mesh key={i} receiveShadow castShadow position={note.pos} rotation={note.rot}>
          <boxGeometry args={[0.3, 0.3, 0.01]} />
          <meshStandardMaterial color={note.color} />
        </mesh>
      ))}

      {/* หมุดปักบอร์ด */}
      {[
        [-0.5, 1.65, -0.95],
        [0.4, 1.75, -0.95],
        [0, 1.45, -0.95],
      ].map((pos, i) => (
        <mesh key={i} receiveShadow castShadow position={pos}>
          <sphereGeometry args={[0.03]} />
          <meshStandardMaterial color="#f44336" />
        </mesh>
      ))}

      {/* ที่ใส่ดินสอ */}
      <mesh receiveShadow castShadow position={[-1.5, 0.55, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.08, 0.2]} />
        <meshStandardMaterial color="#795548" />
      </mesh>

      {/* ดินสอและปากกา */}
      {[
        { pos: [-1.53, 0.7, 0], rot: [0.1, 0, 0.2], color: "#fdd835", height: 0.3 },
        { pos: [-1.48, 0.7, 0], rot: [0.05, 0, -0.1], color: "#f44336", height: 0.3 },
        { pos: [-1.45, 0.7, 0.05], rot: [0.02, 0.1, 0.05], color: "#2196f3", height: 0.3 },
      ].map((pencil, i) => (
        <mesh key={i} receiveShadow castShadow position={pencil.pos} rotation={pencil.rot}>
          <cylinderGeometry args={[0.01, 0.01, pencil.height]} />
          <meshStandardMaterial color={pencil.color} />
        </mesh>
      ))}

      {/* รูปภาพ */}
      <mesh receiveShadow castShadow position={[-1, 0.46, -0.5]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.5, 0.3, 0.02]} />
        <meshStandardMaterial color="#bbdefb" />
      </mesh>

      {/* ลูกบาศก์รูบิค */}
      <mesh receiveShadow castShadow position={[1.5, 0.55, -0.3]} rotation={[0.3, 0.5, 0.2]}>
        <boxGeometry args={[0.15, 0.15, 0.15]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* ตัวละคร (ใช้เป็ดเป็นตัวแทนชั่วคราว) */}
      <group ref={characterRef} position={[0, 0.7, 0.5]} rotation={[0, Math.PI / 4, 0]}>
        <primitive object={duckScene.clone()} scale={0.5} />
      </group>
    </group>
  )
}

// สร้างพื้นผิวที่มีโค้ดจำลอง
function createCodeTexture() {
  const canvas = document.createElement("canvas")
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext("2d")

  if (ctx) {
    ctx.fillStyle = "#1a1a2e"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // สร้างเส้นโค้ดจำลอง
    ctx.fillStyle = "#a855f7"
    for (let i = 0; i < 15; i++) {
      const y = 30 + i * 20
      const width = Math.random() * 150 + 50
      ctx.fillRect(20, y, width, 6)
    }

    // สร้างเส้นโค้ดสีอื่น
    ctx.fillStyle = "#22d3ee"
    for (let i = 0; i < 10; i++) {
      const y = 40 + i * 30
      const width = Math.random() * 100 + 30
      ctx.fillRect(180, y, width, 6)
    }

    // สร้างเส้นโค้ดสีอื่น
    ctx.fillStyle = "#fb923c"
    for (let i = 0; i < 8; i++) {
      const y = 50 + i * 40
      const width = Math.random() * 80 + 20
      ctx.fillRect(100, y, width, 6)
    }
  }

  return canvas
}
