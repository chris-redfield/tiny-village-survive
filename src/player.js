import { WORLD_SIZE } from './config.js';
import { buildings } from './buildings.js';

// Player state
export const player = {
    x: 1000,
    y: 700,
    z: 30, // Eye height
    angle: Math.PI / 2,
    pitch: 0,
    moveSpeed: 4,
    fov: Math.PI / 3,
    rayCount: 400
};

// Player movement with collision
export function movePlayer(dx, dy) {
    const newX = player.x + dx;
    const newY = player.y + dy;

    // Check world bounds
    const margin = 10;
    if (newX < margin || newX > WORLD_SIZE - margin || newY < margin || newY > WORLD_SIZE - margin) {
        return;
    }

    // Check building collision
    const playerRadius = 8;
    for (const building of buildings) {
        // Expanded bounds for collision
        const left = building.x - playerRadius;
        const right = building.x + building.width + playerRadius;
        const top = building.y - playerRadius;
        const bottom = building.y + building.depth + playerRadius;

        if (newX > left && newX < right && newY > top && newY < bottom) {
            // Try sliding along walls
            const testX = player.x + dx;
            const testY = player.y + dy;

            // Check if only X movement collides
            if (!(testX > left && testX < right && player.y > top && player.y < bottom)) {
                player.x = testX;
            }
            // Check if only Y movement collides
            if (!(player.x > left && player.x < right && testY > top && testY < bottom)) {
                player.y = testY;
            }
            return;
        }
    }

    player.x = newX;
    player.y = newY;
}
