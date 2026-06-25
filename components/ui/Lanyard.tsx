/* eslint-disable react/no-unknown-property */
'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame, useThree, type ThreeElement, type ThreeEvent } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
  type RigidBodyProps
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

const cardGLB = '/card.glb';
const lanyard = '/lanyard.png';

import './Lanyard.css';

extend({ MeshLineGeometry, MeshLineMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    meshLineMaterial: ThreeElement<typeof MeshLineMaterial>;
  }
}

// 1x1 transparent pixel — lets useTexture be called unconditionally when a
// front/back image isn't supplied.
const BLANK_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

// The card model's front face is UV-mapped to the LEFT half of the texture
// atlas and the back face to the RIGHT half (measured from card.glb). Each
// custom image is composited into its own half so the two faces render
// independently, aspect-preserving (no stretching).
const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: 'cover' | 'contain';
  lanyardImage?: string | null;
  lanyardWidth?: number;
}

// Helper function to draw a premium high-fidelity Vector VIP Badge dynamically on the client canvas
function drawLogoCard(isBack: boolean): string {
  if (typeof window === 'undefined') return '';
  const width = 512;
  const height = 755;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // 1. Draw solid background
  ctx.fillStyle = '#0c0a09';
  ctx.fillRect(0, 0, width, height);

  // 2. Draw subtle tech dot grid
  ctx.fillStyle = 'rgba(249, 115, 22, 0.045)';
  const dotSpacing = 20;
  for (let x = 10; x < width; x += dotSpacing) {
    for (let y = 10; y < height; y += dotSpacing) {
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 3. Draw gradient border (orange to amber/light orange)
  const borderGradient = ctx.createLinearGradient(0, 0, width, height);
  borderGradient.addColorStop(0, '#ea580c');
  borderGradient.addColorStop(0.5, '#f97316');
  borderGradient.addColorStop(1, '#fdba74');
  ctx.strokeStyle = borderGradient;
  ctx.lineWidth = 6;
  ctx.strokeRect(10, 10, width - 20, height - 20);

  // Draw corner brackets / viewpoint marks for hi-tech feel
  ctx.strokeStyle = '#fdba74';
  ctx.lineWidth = 2;
  // Top left
  ctx.beginPath(); ctx.moveTo(25, 15); ctx.lineTo(15, 15); ctx.lineTo(15, 25); ctx.stroke();
  // Top right
  ctx.beginPath(); ctx.moveTo(width - 25, 15); ctx.lineTo(width - 15, 15); ctx.lineTo(width - 15, 25); ctx.stroke();
  // Bottom left
  ctx.beginPath(); ctx.moveTo(25, height - 15); ctx.lineTo(15, height - 15); ctx.lineTo(15, height - 25); ctx.stroke();
  // Bottom right
  ctx.beginPath(); ctx.moveTo(width - 25, height - 15); ctx.lineTo(width - 15, height - 15); ctx.lineTo(width - 15, height - 25); ctx.stroke();

  if (!isBack) {
    // --- FRONT FACE ---
    // 4. Draw Header
    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = '#f97316';
    ctx.textAlign = 'center';
    ctx.fillText('V E C T O R   P A S S', width / 2, 55);

    // 5. Draw Glowing V Logo (Matching the AIBrainIcon layout)
    ctx.save();
    ctx.shadowColor = '#f97316';
    ctx.shadowBlur = 18;

    // Draw V shape lines
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    
    // Left leg
    ctx.beginPath();
    ctx.moveTo(190, 160);
    ctx.lineTo(256, 270);
    ctx.stroke();
    
    // Right leg
    ctx.beginPath();
    ctx.moveTo(322, 160);
    ctx.lineTo(256, 270);
    ctx.stroke();

    // Inner glowing core line
    ctx.strokeStyle = '#fdba74';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(190, 160);
    ctx.lineTo(256, 270);
    ctx.lineTo(322, 160);
    ctx.stroke();

    // Center glow tip
    ctx.fillStyle = '#fdba74';
    ctx.beginPath();
    ctx.arc(256, 270, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // 6. Access details and branding
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 38px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('VECTOR', width / 2, 385);

    ctx.fillStyle = '#a8a29e';
    ctx.font = '14px monospace';
    ctx.fillText('AI CAREER CO-PILOT', width / 2, 415);

    // Dynamic smart card chip
    ctx.fillStyle = 'rgba(253, 186, 116, 0.12)';
    ctx.strokeStyle = '#fdba74';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(45, 490, 75, 52, 8);
    ctx.fill();
    ctx.stroke();
    // Inner chip circuit markings
    ctx.beginPath();
    ctx.moveTo(82.5, 490); ctx.lineTo(82.5, 542);
    ctx.moveTo(45, 516); ctx.lineTo(120, 516);
    ctx.stroke();

    // Credentials labels
    ctx.fillStyle = '#e8e1df';
    ctx.font = 'bold 17px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('PILOT ACCESS KEY', 140, 510);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('● CO-PILOT STATUS: ONLINE', 140, 532);

    // Separator line
    ctx.strokeStyle = 'rgba(251, 146, 60, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(45, 590);
    ctx.lineTo(width - 45, 590);
    ctx.stroke();

    // Bottom auth variables
    ctx.fillStyle = '#78716c';
    ctx.font = '12px monospace';
    ctx.fillText('AUTH CHANNEL: SECURE_LINK_DIRECT', 45, 620);
    ctx.fillText('SYSTEM REVISION: VP-8.2.4', 45, 645);
    ctx.fillText('USER ROLE: VIP TEST PILOT', 45, 670);

    // Tech Barcode overlay on front
    ctx.fillStyle = '#e8e1df';
    ctx.fillRect(width - 125, 610, 80, 4);
    ctx.fillRect(width - 125, 618, 80, 2);
    ctx.fillRect(width - 125, 624, 80, 7);
    ctx.fillRect(width - 125, 635, 80, 3);
    ctx.fillRect(width - 125, 642, 80, 6);
    ctx.fillRect(width - 125, 652, 80, 4);

  } else {
    // --- BACK FACE ---
    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = '#78716c';
    ctx.textAlign = 'center';
    ctx.fillText('SECURITY COMPLIANCE ENVELOPE', width / 2, 65);

    // Small glowing V Logo on back
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(238, 100);
    ctx.lineTo(256, 126);
    ctx.lineTo(274, 100);
    ctx.stroke();

    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(256, 126, 3, 0, Math.PI * 2);
    ctx.fill();

    // Barcode region
    const barcodeX = 60;
    const barcodeY = 170;
    const barcodeW = width - 120;
    const barcodeH = 170;

    // Draw Barcode lines
    ctx.fillStyle = '#ffffff';
    let currentX = barcodeX;
    const barPattern = [
      4, 2, 8, 2, 4, 6, 2, 4, 8, 4, 2, 6, 2, 2, 4, 8, 2, 4, 6, 4, 8, 2, 4,
      2, 4, 8, 2, 4, 6, 2, 4, 8, 4, 2, 6, 2, 2, 4, 8, 2, 4, 6, 4, 8, 2, 4
    ];
    for (let i = 0; i < barPattern.length; i++) {
      const w = barPattern[i];
      if (i % 2 === 0) {
        ctx.fillRect(currentX, barcodeY, w, barcodeH);
      }
      currentX += w + 2;
      if (currentX > barcodeX + barcodeW) break;
    }

    // Barcode code string
    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = '#e8e1df';
    ctx.textAlign = 'center';
    ctx.fillText('VECTOR-992-X5-COACH', width / 2, barcodeY + barcodeH + 32);

    // Disclaimer text in small clean font
    ctx.fillStyle = '#78716c';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    
    const lines = [
      "NOTICE: This access card connects directly to the Vector placement",
      "engine. Do not disclose credential keys. System telemetry and AI",
      "voice coaches are active. Access is governed under secure protocol",
      "VP-8.2.4. Unauthorized duplication or testing is logged by host.",
      "",
      "SUPPORT: dev@vector-copilot.io"
    ];

    let textY = barcodeY + barcodeH + 80;
    for (const line of lines) {
      ctx.fillText(line, 45, textY);
      textY += 22;
    }

    // Glowing green status indicator dot
    ctx.fillStyle = '#10b981';
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(60, textY + 36, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0; // reset shadow

    ctx.fillStyle = '#e8e1df';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('SECURE SHIELD COATING STABLE', 80, textY + 40);
  }

  return canvas.toDataURL();
}

export default function Lanyard({
  position = [0, 0, 20],
  gravity = [0, -40, 0],
  fov = 22,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' && window.innerWidth < 768);

  const [generatedFront, setGeneratedFront] = useState<string | null>(null);
  const [generatedBack, setGeneratedBack] = useState<string | null>(null);

  // Generate badge images on client side load
  useEffect(() => {
    setGeneratedFront(drawLogoCard(false));
    setGeneratedBack(drawLogoCard(true));
  }, []);

  useEffect(() => {
    const handleResize = (): void => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="lanyard-wrapper">
      <Canvas
        camera={{ position, fov }}
        dpr={[1, isMobile ? 1.5 : 1.5]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity}>
          <Band
            isMobile={isMobile}
            frontImage={frontImage || generatedFront}
            backImage={backImage || generatedBack}
            imageFit={imageFit}
            lanyardImage={lanyardImage}
            lanyardWidth={lanyardWidth}
          />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: 'cover' | 'contain';
  lanyardImage?: string | null;
  lanyardWidth?: number;
}

type LanyardRigidBody = RapierRigidBody & {
  lerped?: THREE.Vector3;
};

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1
}: BandProps) {
  const { size } = useThree();
  const band = useRef<THREE.Mesh<InstanceType<typeof MeshLineGeometry>, InstanceType<typeof MeshLineMaterial>>>(null!);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<LanyardRigidBody>(null!);
  const j2 = useRef<LanyardRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps: RigidBodyProps = {
    type: 'dynamic',
    canSleep: true,
    colliders: false,
    angularDamping: 2,
    linearDamping: 2
  };

  const getLerped = (body: LanyardRigidBody): THREE.Vector3 => {
    if (!body.lerped) {
      body.lerped = new THREE.Vector3().copy(body.translation());
    }

    return body.lerped;
  };

  const { nodes, materials } = useGLTF(cardGLB) as any;
  const texture = useTexture(lanyardImage || lanyard);
  // useTexture must be called unconditionally; use a blank pixel when an image
  // isn't supplied for a given face, then skip compositing it below.
  const frontTex = useTexture(frontImage || BLANK_PIXEL);
  const backTex = useTexture(backImage || BLANK_PIXEL);

  // Composite the front/back images into the card's texture atlas (front = left
  // half, back = right half). Each image is drawn aspect-preserving (no stretch).
  const cardMap = useMemo(() => {
    const baseMap = materials.base.map as THREE.Texture;
    if (!frontImage && !backImage) return baseMap;

    const baseImg = baseMap.image as any;
    const W = baseImg.width;
    const H = baseImg.height;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return baseMap;
    // Keep the original baked atlas for the card edges and any untouched face.
    ctx.drawImage(baseImg, 0, 0, W, H);

    const drawFitted = (img: any, rect: typeof FRONT_UV_RECT) => {
      const rx = rect.x * W;
      const ry = rect.y * H;
      const rw = rect.w * W;
      const rh = rect.h * H;
      const pick = imageFit === 'contain' ? Math.min : Math.max;
      const scale = pick(rw / img.width, rh / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = rx + (rw - dw) / 2;
      const dy = ry + (rh - dh) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.rect(rx, ry, rw, rh);
      ctx.clip();
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
    };

    if (frontImage && frontTex.image) drawFitted(frontTex.image, FRONT_UV_RECT);
    if (backImage && backTex.image) drawFitted(backTex.image, BACK_UV_RECT);

    const composite = new THREE.CanvasTexture(canvas);
    composite.colorSpace = THREE.SRGBColorSpace;
    composite.flipY = baseMap.flipY;
    composite.anisotropy = 16;
    composite.needsUpdate = true;
    return composite;
  }, [frontImage, backImage, imageFit, frontTex, backTex, materials.base.map]);
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  );
  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.8, 0]
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => {
        document.body.style.cursor = 'auto';
      };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged && typeof dragged !== 'boolean') {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z
      });
    }
    if (fixed.current) {
      [j1, j2].forEach(ref => {
        const lerped = getLerped(ref.current);
        const clampedDistance = Math.max(0.1, Math.min(1, lerped.distanceTo(ref.current.translation())));
        const alpha = Math.min(1, Math.max(0, delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))));
        lerped.lerp(ref.current.translation(), alpha);
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(getLerped(j2.current));
      curve.points[2].copy(getLerped(j1.current));
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
    }
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[1.5, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0, -0.5, 0]} ref={j1} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -1, 0]} ref={j2} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -1.5, 0]} ref={j3} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[0, -3.3, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[1.0, 1.4, 0.012]} />
          <group
            scale={2.8}
            position={[0, -1.5, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: ThreeEvent<PointerEvent>) => {
              (e.target as Element).releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e: ThreeEvent<PointerEvent>) => {
              (e.target as Element).setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardMap}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={[size.width, size.height]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={lanyardWidth}
        />
      </mesh>
    </>
  );
}

// Preload GLB at module level so the fetch starts before the component mounts.
useGLTF.preload('/card.glb');
