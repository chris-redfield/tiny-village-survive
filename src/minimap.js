import { WORLD_SIZE } from './config.js';
import { player } from './player.js';
import { buildings } from './buildings.js';
import { trees } from './trees.js';
import { villagers } from './villagers.js';

// Minimap canvas references
let minimapCanvas, minimapCtx;

export function initMinimap(canvas, ctx) {
    minimapCanvas = canvas;
    minimapCtx = ctx;
}

// Draw minimap
export function drawMinimap() {
    const mapSize = minimapCanvas.width;

    minimapCtx.fillStyle = '#1a1a2e';
    minimapCtx.fillRect(0, 0, mapSize, mapSize);

    const scale = mapSize / WORLD_SIZE;

    // Draw ground
    minimapCtx.fillStyle = '#4a7c3f';
    minimapCtx.fillRect(0, 0, mapSize, mapSize);

    // Draw buildings
    for (const building of buildings) {
        const type = building.type;
        minimapCtx.fillStyle = `rgb(${type.wallColor.r}, ${type.wallColor.g}, ${type.wallColor.b})`;
        minimapCtx.fillRect(
            building.x * scale,
            building.y * scale,
            building.width * scale,
            building.depth * scale
        );

        minimapCtx.strokeStyle = '#333';
        minimapCtx.lineWidth = 1;
        minimapCtx.strokeRect(
            building.x * scale,
            building.y * scale,
            building.width * scale,
            building.depth * scale
        );
    }

    // Draw trees on minimap (only if within minimap bounds)
    minimapCtx.fillStyle = '#2d5a27';
    for (const tree of trees) {
        if (tree.y >= 0 && tree.y <= WORLD_SIZE) {
            minimapCtx.beginPath();
            minimapCtx.arc(tree.x * scale, tree.y * scale, 1.5, 0, Math.PI * 2);
            minimapCtx.fill();
        }
    }

    // Draw villagers on minimap
    minimapCtx.fillStyle = '#ffcc00';
    for (const villager of villagers) {
        minimapCtx.beginPath();
        minimapCtx.arc(villager.x * scale, villager.y * scale, 2, 0, Math.PI * 2);
        minimapCtx.fill();
    }

    // Draw player
    minimapCtx.fillStyle = '#ff3366';
    minimapCtx.beginPath();
    minimapCtx.arc(player.x * scale, player.y * scale, 4, 0, Math.PI * 2);
    minimapCtx.fill();

    // Draw view direction
    minimapCtx.strokeStyle = '#ff3366';
    minimapCtx.lineWidth = 2;
    minimapCtx.beginPath();
    minimapCtx.moveTo(player.x * scale, player.y * scale);
    minimapCtx.lineTo(
        (player.x + Math.cos(player.angle) * 80) * scale,
        (player.y + Math.sin(player.angle) * 80) * scale
    );
    minimapCtx.stroke();

    // Draw FOV cone
    minimapCtx.strokeStyle = 'rgba(255, 51, 102, 0.3)';
    minimapCtx.lineWidth = 1;
    minimapCtx.beginPath();
    minimapCtx.moveTo(player.x * scale, player.y * scale);
    minimapCtx.lineTo(
        (player.x + Math.cos(player.angle - player.fov / 2) * 150) * scale,
        (player.y + Math.sin(player.angle - player.fov / 2) * 150) * scale
    );
    minimapCtx.stroke();
    minimapCtx.beginPath();
    minimapCtx.moveTo(player.x * scale, player.y * scale);
    minimapCtx.lineTo(
        (player.x + Math.cos(player.angle + player.fov / 2) * 150) * scale,
        (player.y + Math.sin(player.angle + player.fov / 2) * 150) * scale
    );
    minimapCtx.stroke();
}
