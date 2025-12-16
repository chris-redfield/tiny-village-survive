import { WORLD_SIZE } from './config.js';
import { player } from './player.js';
import { treeTextures, TREE_VARIATIONS } from './textures.js';

// Tree class (static billboard sprite) - uses fast drawImage rendering
export class Tree {
    constructor(x, y, variation, scale = 1) {
        this.x = x;
        this.y = y;
        this.texture = treeTextures[variation % TREE_VARIATIONS];
        this.scale = scale;
        this.width = 40 * scale;
        this.height = 60 * scale;
    }

    // Fast check if tree is potentially visible (used for culling)
    isVisible(fovHalf) {
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distSq = dx * dx + dy * dy;

        if (distSq > 1500 * 1500) return false;

        const angle = Math.atan2(dy, dx);
        let relAngle = angle - player.angle;
        while (relAngle > Math.PI) relAngle -= Math.PI * 2;
        while (relAngle < -Math.PI) relAngle += Math.PI * 2;

        return Math.abs(relAngle) <= fovHalf + 0.3;
    }

    render(ctx, canvas, wallDistances) {
        if (!this.texture || !this.texture.canvas) return;

        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        let relativeAngle = angle - player.angle;
        while (relativeAngle > Math.PI) relativeAngle -= Math.PI * 2;
        while (relativeAngle < -Math.PI) relativeAngle += Math.PI * 2;

        const fovHalf = player.fov / 2;
        const correctedDist = dist * Math.cos(relativeAngle);
        if (correctedDist <= 0) return;

        // Check center column for wall occlusion
        const screenCenterX = (canvas.width / 2) + (relativeAngle / fovHalf) * (canvas.width / 2);
        const rayIndex = Math.floor((screenCenterX / canvas.width) * player.rayCount);
        const wallDist = wallDistances[rayIndex] || Infinity;

        if (wallDist < correctedDist) return; // Behind a wall

        const pitchOffset = player.pitch * 300;

        // Calculate sprite size based on distance
        const spriteScale = 600 / correctedDist;
        const spriteHeight = this.height * spriteScale;
        const spriteWidth = this.width * spriteScale;

        // Tree bottom at ground level
        const horizon = canvas.height / 2 + pitchOffset;
        const groundY = horizon + (player.z - 0) * spriteScale;
        const spriteTop = groundY - spriteHeight;

        const spriteLeft = screenCenterX - spriteWidth / 2;

        // Skip if off screen
        if (spriteLeft + spriteWidth < 0 || spriteLeft > canvas.width) return;

        // Use hardware-accelerated drawImage (MUCH faster than fillRect per pixel)
        ctx.drawImage(
            this.texture.canvas,
            spriteLeft,
            spriteTop,
            spriteWidth,
            spriteHeight
        );
    }
}

// Trees array
export const trees = [];

// Create forest trees around the northern entrance
export function createForestTrees() {
    // Forest OUTSIDE the city walls (negative y values)
    // The northern entrance gap is at x=900 to x=1100, y=0
    // Trees start at y=-280 to avoid "leaking" over the tall wall

    // Dense forest outside - spans the full width, multiple rows deep
    for (let x = 100; x < WORLD_SIZE - 100; x += 30 + Math.random() * 25) {
        for (let y = -800; y < -280; y += 25 + Math.random() * 20) {
            const tx = x + (Math.random() - 0.5) * 20;
            const ty = y + (Math.random() - 0.5) * 15;
            const variation = Math.floor(Math.random() * TREE_VARIATIONS);
            const scale = 0.9 + Math.random() * 0.4;
            trees.push(new Tree(tx, ty, variation, scale));
        }
    }

    // Extra dense trees framing the entrance from outside (pushed back)
    // Left side of entrance
    for (let i = 0; i < 10; i++) {
        trees.push(new Tree(
            820 + Math.random() * 60,
            -300 - i * 40 + Math.random() * 20,
            Math.floor(Math.random() * TREE_VARIATIONS),
            1.0 + Math.random() * 0.3
        ));
    }
    // Right side of entrance
    for (let i = 0; i < 10; i++) {
        trees.push(new Tree(
            1120 + Math.random() * 60,
            -300 - i * 40 + Math.random() * 20,
            Math.floor(Math.random() * TREE_VARIATIONS),
            1.0 + Math.random() * 0.3
        ));
    }

    console.log(`Created ${trees.length} trees outside the walls`);
}
