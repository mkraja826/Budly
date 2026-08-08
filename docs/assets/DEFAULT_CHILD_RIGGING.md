# Budly Default Child — Mobile Rigging Checklist

## Approved assets

- Master source: `wings_of_freedom-child-3741.glb`
- Verified mobile candidate: `budly-default-child-mobile-v1.glb`
- Mobile candidate size: 16,136,548 bytes (~15.4 MiB)
- Mobile candidate keeps the original mesh/material structure and reduces embedded textures from 2048x2048 to 1024x1024.

## Current geometry status

The current model is static and high density:

- approximately 350,952 vertices
- approximately 498,849 triangles
- no skin
- no humanoid skeleton
- no embedded animation clips

Do not ship this geometry unchanged as the final animated mobile character.

## Required external optimization pass

Use Blender, Meshy, AccuRig, Mixamo-compatible tooling, or another production 3D pipeline.

Target the following while preserving the approved face, silhouette, clothing, UVs, and materials:

1. Reduce geometry substantially using quality-preserving decimation/retopology.
2. Preserve facial silhouette, eyes, hands, shoes, and the Budly sunshine chest mark.
3. Preserve UV seams and material assignments.
4. Remove hidden/unnecessary geometry if present.
5. Keep texture resolution around 1024px for V1 unless a specific material clearly needs more.
6. Add a humanoid skeleton and skin weights.
7. Ensure neutral rest pose is suitable for animation retargeting.
8. Export as GLB/glTF 2.0.

## Animation clips required for V1

Use stable clip names where possible:

- `idle`
- `wave`
- `point`
- `listen`
- `celebrate`
- `tryAgain`

Optional next clips:

- `walk`
- `jump`
- `clap`
- `think`
- `dance`

Keep clips short and loopable where appropriate. Avoid exaggerated or frightening motion.

## Mobile targets

Preferred final GLB target:

- ideally 5–8 MiB or lower
- materially lower geometry than the current source
- no unnecessary 4K/2K textures
- no duplicate materials/textures
- no unused animation tracks

Quality is more important than hitting a specific number. Do not damage the approved character to meet the file-size target.

## Validation before Budly integration

Verify:

- GLB opens successfully in a standards-compliant viewer
- one humanoid skin/skeleton is present
- expected animation clips are present
- no missing textures
- no black materials
- no broken normals
- no visible UV damage
- eyes/hands/feet deform acceptably
- file size recorded in `characterManifest.ts`
- animation names mapped to `CharacterPose`

## Architecture rule

Screens must never import the raw GLB directly. They should render through Budly's character component/renderer boundary so asset versions can be upgraded without changing learning logic.
