'use client'

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Silence THREE.Clock → THREE.Timer deprecation (R3F internal, not our code)
if (typeof window !== 'undefined') {
  const origWarn = console.warn.bind(console)
  console.warn = (...a: unknown[]) => {
    if (typeof a[0] === 'string' && a[0].includes('THREE.Clock')) return
    origWarn(...a)
  }
}

// ─── Shard tiers for visual depth ───────────────────────────────────────────
// Tier 0: small  (0.10 r) — background texture
// Tier 1: medium (0.22 r) — mid-ground body
// Tier 2: accent (0.40 r) — hero highlights, most eye-catching

const TIERS = [
  { radius: 0.10, count: 180, opacity: 0.78 },
  { radius: 0.22, count: 100, opacity: 0.92 },
  { radius: 0.40, count:  40, opacity: 1.00 },
]
const TOTAL = TIERS.reduce((s, t) => s + t.count, 0)

// Colours — vivid so they cut through any background
const DARK_PALETTE = [
  new THREE.Color('#00D4FF'), // electric cyan  (55%)
  new THREE.Color('#AADDFF'), // ice blue       (20%)
  new THREE.Color('#FF6B35'), // warm orange    (15%)
  new THREE.Color('#00E676'), // emerald        (10%)
]
const LIGHT_PALETTE = [
  new THREE.Color('#0066CC'), // deep blue      (55%)
  new THREE.Color('#003D99'), // navy           (20%)
  new THREE.Color('#CC3300'), // deep orange    (15%)
  new THREE.Color('#006644'), // deep green     (10%)
]

function pickColor(i: number, palette: THREE.Color[]): THREE.Color {
  const r = (i * 37 + 13) % 100
  if (r < 55) return palette[0]
  if (r < 75) return palette[1]
  if (r < 90) return palette[2]
  return palette[3]
}

function Shards({
  mouseRef,
  isLight,
}: {
  mouseRef: React.MutableRefObject<{ x: number; y: number }>
  isLight: boolean
}) {
  // Build per-shard arrays
  const data = useMemo(() => {
    const palette = isLight ? LIGHT_PALETTE : DARK_PALETTE
    const pos: number[]    = []
    const rot: number[]    = []
    const spd: number[]    = []
    const col: number[]    = []
    const tier: number[]   = []

    let si = 0
    for (const [ti, t] of TIERS.entries()) {
      for (let i = 0; i < t.count; i++, si++) {
        // Spread: larger shards cluster closer to centre
        const spread = 14 + (2 - ti) * 10
        pos.push(
          (Math.random() - 0.5) * spread * 2.2,
          (Math.random() - 0.5) * spread,
          (Math.random() - 0.5) * (spread * 0.6)
        )
        rot.push(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2)
        // Speed: accent shards move slower (weightier), small shards dart fast
        spd.push(0.18 + Math.random() * (ti === 2 ? 0.18 : 0.38))
        const c = pickColor(si, palette)
        col.push(c.r, c.g, c.b)
        tier.push(ti)
      }
    }
    return {
      pos: new Float32Array(pos),
      rot: new Float32Array(rot),
      spd: new Float32Array(spd),
      col: new Float32Array(col),
      tier: new Int32Array(tier),
    }
  }, [isLight])

  // One InstancedMesh per tier (different geometry size)
  const refs = [
    useRef<THREE.InstancedMesh>(null),
    useRef<THREE.InstancedMesh>(null),
    useRef<THREE.InstancedMesh>(null),
  ]
  const groupRef  = useRef<THREE.Group>(null)
  const dummy     = useMemo(() => new THREE.Object3D(), [])
  const colorObj  = useMemo(() => new THREE.Color(), [])
  const startMs   = useRef(Date.now())

  useFrame(() => {
    if (!groupRef.current) return
    const t = (Date.now() - startMs.current) / 1000

    // Track per-tier index to know which shard goes to which mesh
    const tierIdx = [0, 0, 0]

    for (let i = 0; i < TOTAL; i++) {
      const ix  = i * 3
      const ti  = data.tier[i]
      const spd = data.spd[i]
      const mesh = refs[ti].current
      if (!mesh) continue
      const li = tierIdx[ti]++

      dummy.position.set(
        data.pos[ix],
        data.pos[ix + 1] + Math.sin(t * spd * 1.1 + i * 0.6) * (ti === 2 ? 0.7 : 0.35),
        data.pos[ix + 2]
      )
      dummy.rotation.set(
        data.rot[ix]     + t * spd * 0.65,
        data.rot[ix + 1] + t * spd * 0.40,
        data.rot[ix + 2] + t * spd * 0.25
      )
      dummy.updateMatrix()
      mesh.setMatrixAt(li, dummy.matrix)
      colorObj.setRGB(data.col[ix], data.col[ix + 1], data.col[ix + 2])
      mesh.setColorAt(li, colorObj)
    }

    refs.forEach((r) => {
      if (!r.current) return
      r.current.instanceMatrix.needsUpdate = true
      if (r.current.instanceColor) r.current.instanceColor.needsUpdate = true
    })

    // Mouse / touch reactive group rotation — accent shards move more
    groupRef.current.rotation.x += (mouseRef.current.y * 0.22 - groupRef.current.rotation.x) * 0.04
    groupRef.current.rotation.y += (mouseRef.current.x * 0.22 - groupRef.current.rotation.y) * 0.04
  })

  return (
    <group ref={groupRef}>
      {TIERS.map((t, ti) => (
        <instancedMesh key={ti} ref={refs[ti]} args={[undefined, undefined, t.count]}>
          <icosahedronGeometry args={[t.radius, 1]} />
          {/* meshBasicMaterial = pure vertex color, no lighting math, always vivid */}
          <meshBasicMaterial
            vertexColors
            transparent
            opacity={t.opacity}
          />
        </instancedMesh>
      ))}
    </group>
  )
}

interface HeroSceneProps {
  isLight?: boolean
}

export default function HeroScene({ isLight = false }: HeroSceneProps) {
  const mouseRef     = useRef({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onTouch = (e: TouchEvent) => {
      const touch = e.touches[0]
      if (!touch) return
      mouseRef.current = {
        x:  (touch.clientX / window.innerWidth  - 0.5) * 2,
        y: -(touch.clientY / window.innerHeight - 0.5) * 2,
      }
    }
    el.addEventListener('touchmove', onTouch, { passive: true })
    return () => el.removeEventListener('touchmove', onTouch)
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      onMouseMove={(e) => {
        mouseRef.current = {
          x:  (e.clientX / window.innerWidth  - 0.5) * 2,
          y: -(e.clientY / window.innerHeight - 0.5) * 2,
        }
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 14], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        {/* meshBasicMaterial doesn't need lights — but a single ambient helps fog */}
        <ambientLight intensity={0} />
        <Shards mouseRef={mouseRef} isLight={isLight} />
      </Canvas>
    </div>
  )
}
