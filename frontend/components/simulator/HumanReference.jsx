'use client';
/**
 * HumanReference.jsx — Billboard 2D, repère d'échelle 1.75 m
 *
 * Utilise l'image low-poly `/human-reference.png` (vue de face, fond supprimé)
 * comme texture d'un THREE.Sprite qui fait toujours face à la caméra.
 *
 * Chargement : `useLoader(TextureLoader)` → R3F gère le cache et la Suspense.
 * Cleanup : pas nécessaire, R3F dispose les ressources useLoader automatiquement.
 *
 * Proportion image : 470 × 985 px → ASPECT ≈ 0.477
 * Scale sprite : [1.75 × 0.477, 1.75, 1] = [0.835 m, 1.75 m, 1]
 *
 * Position : le centre du sprite est décalé de +HUMAN_HEIGHT/2 en Y
 * pour que les pieds touchent exactement `position.y`.
 */
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

const HUMAN_HEIGHT = 1.75;   // mètres
const IMG_W = 470;            // px — largeur image cropée
const IMG_H = 985;            // px — hauteur image cropée
const ASPECT = IMG_W / IMG_H; // 0.4772

export function HumanReference({ position = [0, 0, 0], visible = true }) {
  const texture = useLoader(THREE.TextureLoader, '/human-reference.png');

  const [px, py, pz] = position;
  /* Centre du sprite = milieu du personnage → pieds à py */
  const spritePos = [px, py + HUMAN_HEIGHT / 2, pz];

  return (
    <sprite
      position={spritePos}
      scale={[HUMAN_HEIGHT * ASPECT, HUMAN_HEIGHT, 1]}
      visible={visible}
    >
      <spriteMaterial
        map={texture}
        transparent
        alphaTest={0.05}
        depthWrite={false}
        sizeAttenuation
      />
    </sprite>
  );
}
