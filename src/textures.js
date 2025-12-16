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
// 7 tree types: 0=Pine, 1=Oak, 2=Tall Pine, 3=Willow, 4=Cypress, 5=Birch, 6=Dead
export const TREE_VARIATIONS = 7;
export const treeTextures = [];

function drawTrunk(texCtx, x, y, w, h, colors) {
    const trunkGrad = texCtx.createLinearGradient(x, 0, x + w, 0);
    trunkGrad.addColorStop(0, colors.dark);
    trunkGrad.addColorStop(0.3, colors.mid);
    trunkGrad.addColorStop(0.7, colors.light);
    trunkGrad.addColorStop(1, colors.dark);
    texCtx.fillStyle = trunkGrad;
    texCtx.fillRect(x, y, w, h);

    // Trunk texture lines
    texCtx.strokeStyle = 'rgba(0,0,0,0.2)';
    texCtx.lineWidth = 1;
    for (let i = 0; i < h; i += 6) {
        texCtx.beginPath();
        texCtx.moveTo(x + 2, y + i);
        texCtx.lineTo(x + w - 2, y + i + 3);
        texCtx.stroke();
    }
}

export function generateTreeTexture(variation) {
    const width = 64;
    const height = 96;
    const texCanvas = document.createElement('canvas');
    texCanvas.width = width;
    texCanvas.height = height;
    const texCtx = texCanvas.getContext('2d');

    texCtx.clearRect(0, 0, width, height);

    const centerX = width / 2;

    // Tree type based on variation
    switch (variation) {
        case 0: // Classic Pine - triangular layers
            {
                const trunkWidth = 10;
                const trunkHeight = 28;
                const trunkX = centerX - trunkWidth / 2;
                const trunkY = height - trunkHeight;
                drawTrunk(texCtx, trunkX, trunkY, trunkWidth, trunkHeight,
                    { dark: '#3d2817', mid: '#5c4033', light: '#4a3525' });

                const layers = 4;
                const foliageTop = 8;
                const foliageBottom = trunkY + 5;
                const layerHeight = (foliageBottom - foliageTop) / layers;

                for (let i = 0; i < layers; i++) {
                    const layerY = foliageTop + i * layerHeight * 0.7;
                    const layerWidth = 18 + i * 10;

                    texCtx.fillStyle = `rgb(25, 65, 20)`;
                    texCtx.beginPath();
                    texCtx.moveTo(centerX, layerY);
                    texCtx.lineTo(centerX - layerWidth / 2, layerY + layerHeight + 8);
                    texCtx.lineTo(centerX + layerWidth / 2, layerY + layerHeight + 8);
                    texCtx.closePath();
                    texCtx.fill();

                    const foliageGrad = texCtx.createLinearGradient(0, layerY, 0, layerY + layerHeight);
                    foliageGrad.addColorStop(0, 'rgb(50, 100, 40)');
                    foliageGrad.addColorStop(1, 'rgb(30, 70, 25)');
                    texCtx.fillStyle = foliageGrad;
                    texCtx.beginPath();
                    texCtx.moveTo(centerX, layerY - 3);
                    texCtx.lineTo(centerX - layerWidth / 2 + 3, layerY + layerHeight + 5);
                    texCtx.lineTo(centerX + layerWidth / 2 - 3, layerY + layerHeight + 5);
                    texCtx.closePath();
                    texCtx.fill();
                }
            }
            break;

        case 1: // Oak - wide round canopy
            {
                const trunkWidth = 14;
                const trunkHeight = 30;
                const trunkX = centerX - trunkWidth / 2;
                const trunkY = height - trunkHeight;
                drawTrunk(texCtx, trunkX, trunkY, trunkWidth, trunkHeight,
                    { dark: '#3d2817', mid: '#5c4033', light: '#4a3525' });

                const radius = 28;
                const foliageCenterY = 30;

                const circles = [
                    { x: 0, y: 0, r: radius },
                    { x: -12, y: 5, r: radius * 0.7 },
                    { x: 12, y: 5, r: radius * 0.7 },
                    { x: 0, y: -10, r: radius * 0.6 },
                    { x: -8, y: 12, r: radius * 0.5 },
                    { x: 10, y: 10, r: radius * 0.5 },
                ];

                for (const circle of circles) {
                    const grad = texCtx.createRadialGradient(
                        centerX + circle.x, foliageCenterY + circle.y, 0,
                        centerX + circle.x, foliageCenterY + circle.y, circle.r
                    );
                    grad.addColorStop(0, 'rgb(60, 110, 45)');
                    grad.addColorStop(0.6, 'rgb(45, 85, 35)');
                    grad.addColorStop(1, 'rgba(35, 70, 28, 0.9)');
                    texCtx.fillStyle = grad;
                    texCtx.beginPath();
                    texCtx.arc(centerX + circle.x, foliageCenterY + circle.y, circle.r, 0, Math.PI * 2);
                    texCtx.fill();
                }
            }
            break;

        case 2: // Tall Pine - narrow and tall
            {
                const trunkWidth = 8;
                const trunkHeight = 35;
                const trunkX = centerX - trunkWidth / 2;
                const trunkY = height - trunkHeight;
                drawTrunk(texCtx, trunkX, trunkY, trunkWidth, trunkHeight,
                    { dark: '#2d1810', mid: '#4a3525', light: '#3d2817' });

                const layers = 6;
                const foliageTop = 5;
                const foliageBottom = trunkY + 8;
                const layerHeight = (foliageBottom - foliageTop) / layers;

                for (let i = 0; i < layers; i++) {
                    const layerY = foliageTop + i * layerHeight * 0.75;
                    const layerWidth = 10 + i * 6;

                    const foliageGrad = texCtx.createLinearGradient(0, layerY, 0, layerY + layerHeight);
                    foliageGrad.addColorStop(0, 'rgb(35, 80, 30)');
                    foliageGrad.addColorStop(1, 'rgb(20, 55, 18)');
                    texCtx.fillStyle = foliageGrad;
                    texCtx.beginPath();
                    texCtx.moveTo(centerX, layerY - 2);
                    texCtx.lineTo(centerX - layerWidth / 2, layerY + layerHeight + 4);
                    texCtx.lineTo(centerX + layerWidth / 2, layerY + layerHeight + 4);
                    texCtx.closePath();
                    texCtx.fill();
                }
            }
            break;

        case 3: // Willow - drooping branches
            {
                const trunkWidth = 12;
                const trunkHeight = 32;
                const trunkX = centerX - trunkWidth / 2;
                const trunkY = height - trunkHeight;
                drawTrunk(texCtx, trunkX, trunkY, trunkWidth, trunkHeight,
                    { dark: '#4a3a2a', mid: '#6a5a4a', light: '#5a4a3a' });

                // Main canopy
                const grad = texCtx.createRadialGradient(centerX, 25, 0, centerX, 25, 22);
                grad.addColorStop(0, 'rgb(70, 120, 50)');
                grad.addColorStop(1, 'rgba(50, 90, 40, 0.8)');
                texCtx.fillStyle = grad;
                texCtx.beginPath();
                texCtx.arc(centerX, 25, 22, 0, Math.PI * 2);
                texCtx.fill();

                // Drooping branches
                texCtx.strokeStyle = 'rgb(55, 95, 40)';
                texCtx.lineWidth = 2;
                for (let i = 0; i < 12; i++) {
                    const startX = centerX + (Math.random() - 0.5) * 30;
                    const startY = 30 + Math.random() * 15;
                    const endX = startX + (Math.random() - 0.5) * 20;
                    const endY = startY + 20 + Math.random() * 25;
                    const ctrlX = (startX + endX) / 2 + (Math.random() - 0.5) * 10;
                    const ctrlY = startY + 15;

                    texCtx.beginPath();
                    texCtx.moveTo(startX, startY);
                    texCtx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);
                    texCtx.stroke();
                }

                // Leaves on branches
                texCtx.fillStyle = 'rgb(65, 110, 45)';
                for (let i = 0; i < 40; i++) {
                    const x = centerX + (Math.random() - 0.5) * 40;
                    const y = 35 + Math.random() * 40;
                    texCtx.beginPath();
                    texCtx.ellipse(x, y, 2, 4, Math.random() * Math.PI, 0, Math.PI * 2);
                    texCtx.fill();
                }
            }
            break;

        case 4: // Cypress - tall narrow column
            {
                const trunkWidth = 6;
                const trunkHeight = 20;
                const trunkX = centerX - trunkWidth / 2;
                const trunkY = height - trunkHeight;
                drawTrunk(texCtx, trunkX, trunkY, trunkWidth, trunkHeight,
                    { dark: '#3d2817', mid: '#5c4033', light: '#4a3525' });

                // Tall columnar shape
                const foliageGrad = texCtx.createLinearGradient(centerX - 12, 0, centerX + 12, 0);
                foliageGrad.addColorStop(0, 'rgb(25, 60, 25)');
                foliageGrad.addColorStop(0.3, 'rgb(40, 85, 35)');
                foliageGrad.addColorStop(0.7, 'rgb(35, 75, 30)');
                foliageGrad.addColorStop(1, 'rgb(20, 50, 20)');

                texCtx.fillStyle = foliageGrad;
                texCtx.beginPath();
                texCtx.moveTo(centerX, 3);
                texCtx.quadraticCurveTo(centerX + 14, 20, centerX + 12, trunkY + 5);
                texCtx.lineTo(centerX - 12, trunkY + 5);
                texCtx.quadraticCurveTo(centerX - 14, 20, centerX, 3);
                texCtx.closePath();
                texCtx.fill();

                // Texture details
                texCtx.fillStyle = 'rgba(20, 45, 18, 0.5)';
                for (let y = 10; y < trunkY; y += 8) {
                    const w = 8 + (y / trunkY) * 6;
                    texCtx.beginPath();
                    texCtx.arc(centerX, y, w, 0, Math.PI * 2);
                    texCtx.fill();
                }
            }
            break;

        case 5: // Birch - grey bark with round canopy
            {
                const trunkWidth = 8;
                const trunkHeight = 32;
                const trunkX = centerX - trunkWidth / 2;
                const trunkY = height - trunkHeight;

                // Darker grey birch bark
                const barkGrad = texCtx.createLinearGradient(trunkX, 0, trunkX + trunkWidth, 0);
                barkGrad.addColorStop(0, '#5a5a55');
                barkGrad.addColorStop(0.3, '#7a7a70');
                barkGrad.addColorStop(0.7, '#6a6a62');
                barkGrad.addColorStop(1, '#505048');
                texCtx.fillStyle = barkGrad;
                texCtx.fillRect(trunkX, trunkY, trunkWidth, trunkHeight);

                // Dark bark markings
                texCtx.fillStyle = '#2a2a25';
                for (let y = trunkY + 5; y < height - 5; y += 8 + Math.random() * 6) {
                    const markWidth = 3 + Math.random() * 4;
                    const markX = trunkX + Math.random() * (trunkWidth - markWidth);
                    texCtx.fillRect(markX, y, markWidth, 2);
                }

                // Light green foliage - positioned lower to connect with trunk
                const radius = 24;
                const foliageCenterY = 38;
                const circles = [
                    { x: 0, y: 0, r: radius },
                    { x: -10, y: 8, r: radius * 0.7 },
                    { x: 10, y: 6, r: radius * 0.7 },
                    { x: 0, y: -10, r: radius * 0.55 },
                    { x: 0, y: 15, r: radius * 0.5 },  // Bottom circle to connect to trunk
                ];

                for (const circle of circles) {
                    const grad = texCtx.createRadialGradient(
                        centerX + circle.x, foliageCenterY + circle.y, 0,
                        centerX + circle.x, foliageCenterY + circle.y, circle.r
                    );
                    grad.addColorStop(0, 'rgb(80, 130, 55)');
                    grad.addColorStop(0.6, 'rgb(60, 105, 45)');
                    grad.addColorStop(1, 'rgba(45, 85, 35, 0.85)');
                    texCtx.fillStyle = grad;
                    texCtx.beginPath();
                    texCtx.arc(centerX + circle.x, foliageCenterY + circle.y, circle.r, 0, Math.PI * 2);
                    texCtx.fill();
                }
            }
            break;

        case 6: // Dead tree - bare branches
            {
                const trunkWidth = 10;
                const trunkHeight = 45;
                const trunkX = centerX - trunkWidth / 2;
                const trunkY = height - trunkHeight;

                // Grayish dead bark
                const barkGrad = texCtx.createLinearGradient(trunkX, 0, trunkX + trunkWidth, 0);
                barkGrad.addColorStop(0, '#3a3530');
                barkGrad.addColorStop(0.5, '#5a5550');
                barkGrad.addColorStop(1, '#454540');
                texCtx.fillStyle = barkGrad;
                texCtx.fillRect(trunkX, trunkY, trunkWidth, trunkHeight);

                // Trunk texture
                texCtx.strokeStyle = 'rgba(0,0,0,0.3)';
                texCtx.lineWidth = 1;
                for (let i = 0; i < trunkHeight; i += 5) {
                    texCtx.beginPath();
                    texCtx.moveTo(trunkX, trunkY + i);
                    texCtx.lineTo(trunkX + trunkWidth, trunkY + i + 2);
                    texCtx.stroke();
                }

                // Bare branches
                texCtx.strokeStyle = '#4a4540';
                texCtx.lineWidth = 3;

                // Main branches
                const branches = [
                    { x1: centerX, y1: trunkY + 10, x2: centerX - 20, y2: trunkY - 5, cx: centerX - 10, cy: trunkY },
                    { x1: centerX, y1: trunkY + 15, x2: centerX + 22, y2: trunkY, cx: centerX + 12, cy: trunkY + 5 },
                    { x1: centerX, y1: trunkY + 25, x2: centerX - 18, y2: trunkY + 12, cx: centerX - 8, cy: trunkY + 15 },
                    { x1: centerX, y1: trunkY + 8, x2: centerX + 15, y2: trunkY - 10, cx: centerX + 8, cy: trunkY - 3 },
                ];

                for (const b of branches) {
                    texCtx.beginPath();
                    texCtx.moveTo(b.x1, b.y1);
                    texCtx.quadraticCurveTo(b.cx, b.cy, b.x2, b.y2);
                    texCtx.stroke();
                }

                // Smaller twigs
                texCtx.lineWidth = 1.5;
                texCtx.strokeStyle = '#555550';
                for (let i = 0; i < 8; i++) {
                    const startX = centerX + (Math.random() - 0.5) * 25;
                    const startY = trunkY + Math.random() * 20;
                    const endX = startX + (Math.random() - 0.5) * 15;
                    const endY = startY - 5 - Math.random() * 10;
                    texCtx.beginPath();
                    texCtx.moveTo(startX, startY);
                    texCtx.lineTo(endX, endY);
                    texCtx.stroke();
                }
            }
            break;
    }

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
