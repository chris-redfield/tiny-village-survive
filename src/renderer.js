import { skyColors } from './config.js';
import { player } from './player.js';
import { castRay } from './raycaster.js';
import { wallTextures, roofTextures, groundTexture, getSkyTexture } from './textures.js';
import { trees } from './trees.js';
import { sprites, villagerTexture } from './villagers.js';
import { drawCrowbar } from './crowbar.js';

// Canvas references (set during init)
let canvas, ctx;
let offCanvas, offCtx;
let renderImageData, renderData;
let columnFilled;

// Wall distances array for sprite occlusion
export const wallDistances = [];

export function initRenderer(gameCanvas, gameCtx) {
    canvas = gameCanvas;
    ctx = gameCtx;

    // Initialize wall distances array
    wallDistances.length = player.rayCount;
    wallDistances.fill(Infinity);

    // Off-screen canvas for compositing (reused each frame)
    offCanvas = document.createElement('canvas');
    offCanvas.width = canvas.width;
    offCanvas.height = canvas.height;
    offCtx = offCanvas.getContext('2d');

    // Pre-allocated arrays for render loop (avoid per-frame allocation)
    renderImageData = ctx.createImageData(canvas.width, canvas.height);
    renderData = renderImageData.data;
    columnFilled = new Uint8Array(canvas.height);
}

// Draw sky with texture
function drawSky() {
    const pitchOffset = player.pitch * 300;
    const horizonY = canvas.height / 2 + pitchOffset;
    const skyTexture = getSkyTexture();

    if (skyTexture) {
        const width = skyTexture.width;
        const height = skyTexture.height;

        let angleRatio = player.angle / (2 * Math.PI);
        let xOffset = (angleRatio * width) % width;
        if (xOffset < 0) xOffset += width;

        // Fill entire sky area with dark color first
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(0, 0, canvas.width, Math.max(0, horizonY));

        // Use larger sky height to reduce empty space
        const fixedSkyHeight = canvas.height * 0.95;
        const skyHeight = Math.max(0, Math.min(fixedSkyHeight, horizonY));

        if (skyHeight > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(0, 0, canvas.width, skyHeight);
            ctx.clip();

            // Draw sky with seamless wrapping
            ctx.drawImage(skyTexture,
                xOffset, 0, width - xOffset, height,
                0, 0, canvas.width * (1 - xOffset/width), fixedSkyHeight
            );

            if (xOffset > 0) {
                ctx.drawImage(skyTexture,
                    0, 0, xOffset, height,
                    canvas.width * (1 - xOffset/width), 0, canvas.width * (xOffset/width), fixedSkyHeight
                );
            }

            ctx.restore();
        }
    } else {
        // Fallback gradient sky
        const gradient = ctx.createLinearGradient(0, 0, 0, horizonY);
        gradient.addColorStop(0, `rgb(${skyColors.top.r}, ${skyColors.top.g}, ${skyColors.top.b})`);
        gradient.addColorStop(1, `rgb(${skyColors.bottom.r}, ${skyColors.bottom.g}, ${skyColors.bottom.b})`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, Math.max(0, horizonY));
    }
}

// Render the scene
export function render() {
    const pitchOffset = player.pitch * 300;
    const horizon = canvas.height / 2 + pitchOffset;

    // Reset wall distances
    wallDistances.fill(Infinity);

    // Draw sky first using canvas API (more efficient)
    drawSky();

    // Clear image data (set all alpha to 0)
    const dataLen = renderData.length;
    for (let i = 0; i < dataLen; i += 4) {
        renderData[i + 3] = 0; // Only clear alpha
    }

    // Pre-calculate strip width (constant)
    const stripWidth = Math.ceil(canvas.width / player.rayCount);

    // For each column (ray)
    for (let col = 0; col < player.rayCount; col++) {
        const rayAngle = player.angle - player.fov / 2 + (player.fov * col / player.rayCount);
        const hits = castRay(rayAngle);

        const screenX = col * stripWidth;

        // Reset column filled array
        columnFilled.fill(0);

        // Process hits from near to far
        for (let hitIdx = 0; hitIdx < hits.length; hitIdx++) {
            const hit = hits[hitIdx];
            const correctedDist = hit.dist * Math.cos(rayAngle - player.angle);

            if (correctedDist <= 0) continue;

            // Store closest wall distance for sprite occlusion
            if (hitIdx === 0) {
                wallDistances[col] = correctedDist;
            }

            const building = hit.building;
            const type = building.type;

            // Calculate wall projection
            const wallHeight = type.wallHeight;
            const roofHeight = type.roofHeight;
            const totalHeight = wallHeight + roofHeight;

            // Project heights to screen
            const projScale = 600 / correctedDist;

            const wallBottomScreen = horizon + (player.z - 0) * projScale;
            const wallTopScreen = horizon + (player.z - wallHeight) * projScale;
            const roofTopScreen = horizon + (player.z - totalHeight) * projScale;

            // Calculate brightness based on distance and wall side
            let brightness = Math.max(0.25, 1 - correctedDist / 1200);
            if (hit.side === 'left' || hit.side === 'right') {
                brightness *= 0.8; // Side walls are darker
            }

            const textureKey = building.textureKey || 'HOUSE';
            const wallTex = wallTextures[textureKey] || wallTextures['HOUSE'];
            const roofTex = roofTextures[textureKey] || roofTextures['HOUSE'];

            // Draw wall
            const wallStartY = Math.max(0, Math.floor(wallTopScreen));
            const wallEndY = Math.min(canvas.height, Math.ceil(wallBottomScreen));

            for (let y = wallStartY; y < wallEndY; y++) {
                if (columnFilled[y]) continue;

                const wallProgress = (y - wallTopScreen) / (wallBottomScreen - wallTopScreen);
                const texY = Math.floor(wallProgress * 32) % 32;
                const texX = Math.floor((hit.texCoord || 0) * 32 * 4) % 32;

                const texIdx = (texY * 32 + texX) * 4;
                const r = wallTex.data[texIdx] * brightness;
                const g = wallTex.data[texIdx + 1] * brightness;
                const b = wallTex.data[texIdx + 2] * brightness;

                for (let sx = 0; sx < stripWidth && screenX + sx < canvas.width; sx++) {
                    const idx = ((y * canvas.width) + screenX + sx) * 4;
                    renderData[idx] = r;
                    renderData[idx + 1] = g;
                    renderData[idx + 2] = b;
                    renderData[idx + 3] = 255;
                }

                columnFilled[y] = 1;
            }

            // Draw roof (if has roof)
            if (type.roofType !== 'none' && roofHeight > 0) {
                const roofStartY = Math.max(0, Math.floor(roofTopScreen));
                const roofEndY = Math.min(canvas.height, Math.ceil(wallTopScreen));

                for (let y = roofStartY; y < roofEndY; y++) {
                    if (columnFilled[y]) continue;

                    const roofProgress = (y - roofTopScreen) / (wallTopScreen - roofTopScreen);
                    const texY = Math.floor(roofProgress * 32) % 32;
                    const texX = Math.floor((hit.texCoord || 0) * 32 * 4) % 32;

                    const texIdx = (texY * 32 + texX) * 4;

                    // Peaked roof gets lighter at top
                    let roofBrightness = brightness;
                    if (type.roofType === 'peaked') {
                        roofBrightness *= 0.8 + 0.4 * (1 - roofProgress);
                    }

                    const r = roofTex.data[texIdx] * roofBrightness;
                    const g = roofTex.data[texIdx + 1] * roofBrightness;
                    const b = roofTex.data[texIdx + 2] * roofBrightness;

                    for (let sx = 0; sx < stripWidth && screenX + sx < canvas.width; sx++) {
                        const idx = ((y * canvas.width) + screenX + sx) * 4;
                        renderData[idx] = r;
                        renderData[idx + 1] = g;
                        renderData[idx + 2] = b;
                        renderData[idx + 3] = 255;
                    }

                    columnFilled[y] = 1;
                }
            }
        }

        // Draw ground for unfilled pixels below horizon
        const cosAngle = Math.cos(rayAngle);
        const sinAngle = Math.sin(rayAngle);

        for (let y = Math.floor(horizon); y < canvas.height; y++) {
            if (columnFilled[y]) continue;

            const screenDist = y - horizon;
            if (screenDist <= 0) continue;

            const groundDist = (player.z * 600) / screenDist;
            const groundX = player.x + cosAngle * groundDist;
            const groundY = player.y + sinAngle * groundDist;

            // Sample ground texture
            const texX = Math.floor(Math.abs(groundX) / 4) % 32;
            const texY = Math.floor(Math.abs(groundY) / 4) % 32;
            const texIdx = (texY * 32 + texX) * 4;

            const brightness = Math.max(0.25, 1 - groundDist / 800);
            const r = groundTexture.data[texIdx] * brightness;
            const g = groundTexture.data[texIdx + 1] * brightness;
            const b = groundTexture.data[texIdx + 2] * brightness;

            for (let sx = 0; sx < stripWidth && screenX + sx < canvas.width; sx++) {
                const idx = ((y * canvas.width) + screenX + sx) * 4;
                renderData[idx] = r;
                renderData[idx + 1] = g;
                renderData[idx + 2] = b;
                renderData[idx + 3] = 255;
            }
        }
    }

    // Put walls/ground on off-screen canvas and composite with sky
    offCtx.putImageData(renderImageData, 0, 0);
    ctx.drawImage(offCanvas, 0, 0);

    // Render all sprites (trees + villagers) combined and sorted by distance
    const allVisibleSprites = [];
    const maxRenderDist = 1500;
    const fovHalf = player.fov / 2 + 0.3;

    // Add visible trees
    for (const tree of trees) {
        const dx = tree.x - player.x;
        const dy = tree.y - player.y;
        const distSq = dx * dx + dy * dy;

        if (distSq > maxRenderDist * maxRenderDist) continue;

        const angle = Math.atan2(dy, dx);
        let relAngle = angle - player.angle;
        while (relAngle > Math.PI) relAngle -= Math.PI * 2;
        while (relAngle < -Math.PI) relAngle += Math.PI * 2;

        if (Math.abs(relAngle) <= fovHalf) {
            tree._distSq = distSq;
            tree._isTree = true;
            allVisibleSprites.push(tree);
        }
    }

    // Add visible villagers
    if (villagerTexture) {
        for (const sprite of sprites) {
            const dx = sprite.x - player.x;
            const dy = sprite.y - player.y;
            const distSq = dx * dx + dy * dy;

            if (distSq > maxRenderDist * maxRenderDist) continue;

            const angle = Math.atan2(dy, dx);
            let relAngle = angle - player.angle;
            while (relAngle > Math.PI) relAngle -= Math.PI * 2;
            while (relAngle < -Math.PI) relAngle += Math.PI * 2;

            if (Math.abs(relAngle) <= fovHalf) {
                sprite._distSq = distSq;
                sprite._isTree = false;
                allVisibleSprites.push(sprite);
            }
        }
    }

    // Sort all sprites together (far to near)
    allVisibleSprites.sort((a, b) => b._distSq - a._distSq);

    // Render all sprites in distance order
    for (const sprite of allVisibleSprites) {
        sprite.render(ctx, canvas, wallDistances);
    }

    // Draw the crowbar on top of everything
    drawCrowbar(ctx, canvas);
}
