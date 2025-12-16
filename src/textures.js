import { BUILDING_TYPES } from './config.js';

// Create brick texture
export function createBrickTexture(baseColor) {
    const texCanvas = document.createElement('canvas');
    texCanvas.width = 32;
    texCanvas.height = 32;
    const texCtx = texCanvas.getContext('2d');

    // Base color
    texCtx.fillStyle = `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b})`;
    texCtx.fillRect(0, 0, 32, 32);

    // Brick pattern
    texCtx.strokeStyle = `rgb(${baseColor.r * 0.7}, ${baseColor.g * 0.7}, ${baseColor.b * 0.7})`;
    texCtx.lineWidth = 1;

    // Horizontal lines
    for (let y = 0; y < 32; y += 8) {
        texCtx.beginPath();
        texCtx.moveTo(0, y);
        texCtx.lineTo(32, y);
        texCtx.stroke();
    }

    // Vertical lines (offset every other row)
    for (let row = 0; row < 4; row++) {
        const offset = row % 2 === 0 ? 0 : 8;
        for (let x = offset; x < 32; x += 16) {
            texCtx.beginPath();
            texCtx.moveTo(x, row * 8);
            texCtx.lineTo(x, (row + 1) * 8);
            texCtx.stroke();
        }
    }

    // Add some variation
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * 32;
        const y = Math.random() * 32;
        const variation = (Math.random() - 0.5) * 30;
        texCtx.fillStyle = `rgba(${baseColor.r + variation}, ${baseColor.g + variation}, ${baseColor.b + variation}, 0.3)`;
        texCtx.fillRect(x, y, 2, 2);
    }

    return texCtx.getImageData(0, 0, 32, 32);
}

// Create roof texture
export function createRoofTexture(baseColor) {
    const texCanvas = document.createElement('canvas');
    texCanvas.width = 32;
    texCanvas.height = 32;
    const texCtx = texCanvas.getContext('2d');

    // Base color
    texCtx.fillStyle = `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b})`;
    texCtx.fillRect(0, 0, 32, 32);

    // Shingle pattern
    for (let row = 0; row < 8; row++) {
        const offset = row % 2 === 0 ? 0 : 4;
        for (let x = offset; x < 32; x += 8) {
            const variation = (Math.random() - 0.5) * 20;
            texCtx.fillStyle = `rgb(${baseColor.r + variation}, ${baseColor.g + variation}, ${baseColor.b + variation})`;
            texCtx.fillRect(x, row * 4, 7, 3);

            // Shadow line
            texCtx.fillStyle = `rgba(0, 0, 0, 0.2)`;
            texCtx.fillRect(x, row * 4 + 3, 8, 1);
        }
    }

    return texCtx.getImageData(0, 0, 32, 32);
}

// Create ground texture
export function createGroundTexture() {
    const texCanvas = document.createElement('canvas');
    texCanvas.width = 32;
    texCanvas.height = 32;
    const texCtx = texCanvas.getContext('2d');

    // Grass base
    texCtx.fillStyle = '#4a7c3f';
    texCtx.fillRect(0, 0, 32, 32);

    // Grass variation
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * 32;
        const y = Math.random() * 32;
        const green = 60 + Math.random() * 60;
        texCtx.fillStyle = `rgb(${40 + Math.random() * 30}, ${green}, ${30 + Math.random() * 20})`;
        texCtx.fillRect(x, y, 1, 2);
    }

    return texCtx.getImageData(0, 0, 32, 32);
}

// Pre-generate textures for each building type
export const wallTextures = {};
export const roofTextures = {};

export function initBuildingTextures() {
    for (const [key, type] of Object.entries(BUILDING_TYPES)) {
        wallTextures[key] = createBrickTexture(type.wallColor);
        roofTextures[key] = createRoofTexture(type.roofColor);
    }
}

// Ground texture (generated once)
export const groundTexture = createGroundTexture();

// Sky texture state
export let skyTexture = null;

export function loadSkyTexture() {
    const skyImg = new Image();
    skyImg.onload = () => {
        // Create a canvas with original + horizontally flipped version for seamless wrapping
        const canvas = document.createElement('canvas');
        canvas.width = skyImg.width * 2;
        canvas.height = skyImg.height;
        const ctx = canvas.getContext('2d');

        // Draw original image on the left
        ctx.drawImage(skyImg, 0, 0);

        // Draw horizontally flipped image on the right
        ctx.save();
        ctx.translate(skyImg.width * 2, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(skyImg, 0, 0);
        ctx.restore();

        skyTexture = canvas;
        console.log('Sky texture loaded:', skyTexture.width, 'x', skyTexture.height);
    };
    skyImg.src = 'assets/night_sky_2.png';
}

export function getSkyTexture() {
    return skyTexture;
}

// Tree textures
export const TREE_VARIATIONS = 4;
export const treeTextures = [];

export function generateTreeTexture(variation) {
    const width = 64;
    const height = 96;
    const texCanvas = document.createElement('canvas');
    texCanvas.width = width;
    texCanvas.height = height;
    const texCtx = texCanvas.getContext('2d');

    // Clear with transparency
    texCtx.clearRect(0, 0, width, height);

    // Variation parameters
    const trunkWidth = 8 + (variation % 2) * 4;
    const trunkHeight = 25 + (variation % 3) * 5;
    const foliageStyle = variation % 2; // 0 = pine, 1 = round

    // Draw trunk
    const trunkX = width / 2 - trunkWidth / 2;
    const trunkY = height - trunkHeight;

    // Trunk gradient
    const trunkGrad = texCtx.createLinearGradient(trunkX, 0, trunkX + trunkWidth, 0);
    trunkGrad.addColorStop(0, '#3d2817');
    trunkGrad.addColorStop(0.3, '#5c4033');
    trunkGrad.addColorStop(0.7, '#4a3525');
    trunkGrad.addColorStop(1, '#2d1810');
    texCtx.fillStyle = trunkGrad;
    texCtx.fillRect(trunkX, trunkY, trunkWidth, trunkHeight);

    // Trunk texture lines
    texCtx.strokeStyle = 'rgba(0,0,0,0.2)';
    texCtx.lineWidth = 1;
    for (let i = 0; i < trunkHeight; i += 6) {
        texCtx.beginPath();
        texCtx.moveTo(trunkX + 2, trunkY + i);
        texCtx.lineTo(trunkX + trunkWidth - 2, trunkY + i + 3);
        texCtx.stroke();
    }

    // Draw foliage
    const foliageBottom = trunkY + 5;
    const foliageTop = 5;

    if (foliageStyle === 0) {
        // Pine tree - triangular layers
        const layers = 3 + (variation % 2);
        const layerHeight = (foliageBottom - foliageTop) / layers;

        for (let i = 0; i < layers; i++) {
            const layerY = foliageTop + i * layerHeight * 0.7;
            const layerWidth = 15 + i * 12 + (variation * 3);
            const baseGreen = 30 + (variation * 10);

            // Layer shadow
            texCtx.fillStyle = `rgb(${baseGreen - 15}, ${60 + variation * 5}, ${baseGreen - 10})`;
            texCtx.beginPath();
            texCtx.moveTo(width / 2, layerY);
            texCtx.lineTo(width / 2 - layerWidth / 2, layerY + layerHeight + 10);
            texCtx.lineTo(width / 2 + layerWidth / 2, layerY + layerHeight + 10);
            texCtx.closePath();
            texCtx.fill();

            // Layer main
            const foliageGrad = texCtx.createLinearGradient(0, layerY, 0, layerY + layerHeight);
            foliageGrad.addColorStop(0, `rgb(${baseGreen + 20}, ${90 + variation * 8}, ${baseGreen})`);
            foliageGrad.addColorStop(1, `rgb(${baseGreen}, ${65 + variation * 5}, ${baseGreen - 10})`);
            texCtx.fillStyle = foliageGrad;
            texCtx.beginPath();
            texCtx.moveTo(width / 2, layerY - 5);
            texCtx.lineTo(width / 2 - layerWidth / 2 + 3, layerY + layerHeight + 5);
            texCtx.lineTo(width / 2 + layerWidth / 2 - 3, layerY + layerHeight + 5);
            texCtx.closePath();
            texCtx.fill();
        }
    } else {
        // Round/deciduous tree - circular foliage
        const centerX = width / 2;
        const radius = 22 + variation * 4;
        const centerY = foliageTop + radius;
        const baseGreen = 40 + variation * 8;

        // Multiple overlapping circles for organic look
        const circles = [
            { x: 0, y: 0, r: radius, dark: false },
            { x: -10, y: 5, r: radius * 0.7, dark: true },
            { x: 10, y: 5, r: radius * 0.7, dark: true },
            { x: 0, y: -8, r: radius * 0.6, dark: false },
            { x: -6, y: 10, r: radius * 0.5, dark: true },
            { x: 8, y: 8, r: radius * 0.5, dark: true },
        ];

        for (const circle of circles) {
            const grad = texCtx.createRadialGradient(
                centerX + circle.x, centerY + circle.y, 0,
                centerX + circle.x, centerY + circle.y, circle.r
            );
            if (circle.dark) {
                grad.addColorStop(0, `rgb(${baseGreen + 10}, ${75 + variation * 6}, ${baseGreen - 5})`);
                grad.addColorStop(1, `rgba(${baseGreen - 10}, ${55 + variation * 4}, ${baseGreen - 15}, 0.8)`);
            } else {
                grad.addColorStop(0, `rgb(${baseGreen + 25}, ${95 + variation * 6}, ${baseGreen + 5})`);
                grad.addColorStop(0.7, `rgb(${baseGreen + 5}, ${70 + variation * 5}, ${baseGreen - 5})`);
                grad.addColorStop(1, `rgba(${baseGreen - 5}, ${60 + variation * 4}, ${baseGreen - 10}, 0.9)`);
            }
            texCtx.fillStyle = grad;
            texCtx.beginPath();
            texCtx.arc(centerX + circle.x, centerY + circle.y, circle.r, 0, Math.PI * 2);
            texCtx.fill();
        }
    }

    // Get image data
    return {
        width: width,
        height: height,
        imageData: texCtx.getImageData(0, 0, width, height),
        canvas: texCanvas
    };
}

export function initTreeTextures() {
    for (let i = 0; i < TREE_VARIATIONS; i++) {
        treeTextures.push(generateTreeTexture(i));
    }
}
