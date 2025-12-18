import { player, movePlayer } from './player.js';
import { initBuildings } from './buildings.js';
import { initBuildingTextures, loadSkyTexture, initTreeTextures } from './textures.js';
import { createForestTrees } from './trees.js';
import { createVillagers, loadVillagerTexture, villagers } from './villagers.js';
import { initRenderer, render } from './renderer.js';
import { initMinimap, drawMinimap } from './minimap.js';
import { initInput, keys } from './input.js';

// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 1600;
canvas.height = 900;

const minimapCanvas = document.getElementById('minimapCanvas');
const minimapCtx = minimapCanvas.getContext('2d');
minimapCanvas.width = 250;
minimapCanvas.height = 250;

// Cache DOM elements to avoid lookups every frame
const posInfoEl = document.getElementById('posInfo');
const fpsInfoEl = document.getElementById('fpsInfo');

// Initialize all systems
function init() {
    // Initialize textures first
    initBuildingTextures();
    initTreeTextures();
    loadSkyTexture();
    loadVillagerTexture();

    // Initialize buildings (pre-compute walls)
    initBuildings();

    // Create forest and villagers
    createForestTrees();
    createVillagers(20);

    // Initialize renderer and minimap
    initRenderer(canvas, ctx);
    initMinimap(minimapCanvas, minimapCtx);

    // Initialize input handling
    initInput(canvas);

    // Start game loop
    gameLoop();
}

// Game loop
let lastTime = performance.now();
let frameCount = 0;
let fps = 0;
let lastFpsUpdate = performance.now();

function gameLoop() {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    const deltaMultiplier = deltaTime / (1000 / 60);

    // FPS counter
    frameCount++;
    if (currentTime - lastFpsUpdate >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastFpsUpdate = currentTime;
    }

    // Handle input - movement always works, mouse look requires pointer lock
    const moveX = Math.cos(player.angle) * player.moveSpeed * deltaMultiplier;
    const moveY = Math.sin(player.angle) * player.moveSpeed * deltaMultiplier;
    const strafeX = Math.cos(player.angle + Math.PI / 2) * player.moveSpeed * deltaMultiplier;
    const strafeY = Math.sin(player.angle + Math.PI / 2) * player.moveSpeed * deltaMultiplier;

    if (keys['w'] || keys['arrowup']) movePlayer(moveX, moveY);
    if (keys['s'] || keys['arrowdown']) movePlayer(-moveX, -moveY);
    if (keys['a']) movePlayer(-strafeX, -strafeY);
    if (keys['d']) movePlayer(strafeX, strafeY);

    // Arrow keys for turning (when not using mouse)
    if (keys['arrowleft']) player.angle -= 0.04 * deltaMultiplier;
    if (keys['arrowright']) player.angle += 0.04 * deltaMultiplier;

    // Q/E for looking up/down
    if (keys['q']) player.pitch = Math.min(0.8, player.pitch + 0.02 * deltaMultiplier);
    if (keys['e']) player.pitch = Math.max(-0.8, player.pitch - 0.02 * deltaMultiplier);

    // Jump physics
    if (keys[' '] && player.z === player.groundZ) {
        player.velocityZ = player.jumpStrength;
    }
    player.velocityZ -= player.gravity * deltaMultiplier;
    player.z += player.velocityZ * deltaMultiplier;
    if (player.z <= player.groundZ) {
        player.z = player.groundZ;
        player.velocityZ = 0;
    }

    // Update villagers
    for (const villager of villagers) {
        villager.update();
    }

    // Render
    render();
    drawMinimap();

    // Update UI (use cached elements)
    posInfoEl.textContent = `Position: (${Math.floor(player.x)}, ${Math.floor(player.y)})`;
    fpsInfoEl.textContent = `FPS: ${fps}`;

    requestAnimationFrame(gameLoop);
}

// Start the game
init();
