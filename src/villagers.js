import { WORLD_SIZE } from './config.js';
import { player } from './player.js';
import { buildings } from './buildings.js';

// Villager texture
export let villagerTexture = null;

export function loadVillagerTexture() {
    const villagerImg = new Image();
    villagerImg.crossOrigin = 'anonymous';
    villagerImg.src = 'assets/worker.png';

    villagerImg.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = villagerImg.width;
        canvas.height = villagerImg.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(villagerImg, 0, 0);

        villagerTexture = {
            width: villagerImg.width,
            height: villagerImg.height,
            imageData: ctx.getImageData(0, 0, villagerImg.width, villagerImg.height),
            canvas: canvas
        };
        console.log('Villager texture loaded:', villagerTexture.width, 'x', villagerTexture.height);

        // Assign texture to sprites once loaded
        for (const sprite of sprites) {
            sprite.texture = villagerTexture;
        }
    };
}

// Villager class - moves around the village
export class Villager {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.speed = 0.8 + Math.random() * 0.4;
        this.changeDirectionTimer = 0;
        this.changeInterval = 60 + Math.random() * 120;
    }

    update() {
        this.changeDirectionTimer++;
        if (this.changeDirectionTimer > this.changeInterval) {
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = (Math.random() - 0.5) * 2;
            this.changeDirectionTimer = 0;
            this.changeInterval = 60 + Math.random() * 120;
        }

        const newX = this.x + this.vx * this.speed;
        const newY = this.y + this.vy * this.speed;

        // Check world boundaries
        const margin = 30;
        if (newX < margin || newX > WORLD_SIZE - margin) {
            this.vx *= -1;
        }
        if (newY < margin || newY > WORLD_SIZE - margin) {
            this.vy *= -1;
        }

        // Check building collisions
        const villagerRadius = 15;
        let canMove = true;

        for (const building of buildings) {
            const left = building.x - villagerRadius;
            const right = building.x + building.width + villagerRadius;
            const top = building.y - villagerRadius;
            const bottom = building.y + building.depth + villagerRadius;

            if (newX > left && newX < right && newY > top && newY < bottom) {
                canMove = false;
                // Reverse direction when hitting a building
                this.vx *= -1;
                this.vy *= -1;
                break;
            }
        }

        if (canMove) {
            this.x = Math.max(margin, Math.min(WORLD_SIZE - margin, newX));
            this.y = Math.max(margin, Math.min(WORLD_SIZE - margin, newY));
        }
    }
}

// Sprite class for rendering villagers in 3D
export class Sprite {
    constructor(villager, texture, width = 30, height = 45) {
        this.villager = villager;
        this.texture = texture;
        this.width = width;
        this.height = height;
        this.pixelData = { r: 0, g: 0, b: 0, a: 0 };
    }

    get x() { return this.villager.x; }
    get y() { return this.villager.y; }

    getScreenPosition() {
        const dx = this.x - player.x;
        const dy = this.y - player.y;

        const dist = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        let relativeAngle = angle - player.angle;

        while (relativeAngle > Math.PI) relativeAngle -= Math.PI * 2;
        while (relativeAngle < -Math.PI) relativeAngle += Math.PI * 2;

        return { dx, dy, dist, angle, relativeAngle };
    }

    isVisible() {
        const pos = this.getScreenPosition();
        const fovHalf = player.fov / 2;

        if (Math.abs(pos.relativeAngle) > fovHalf + 0.2) {
            return false;
        }

        if (pos.dist < 10 || pos.dist > 1500) {
            return false;
        }

        return true;
    }

    render(ctx, canvas, wallDistances) {
        if (!this.texture || !this.isVisible()) {
            return;
        }

        const pos = this.getScreenPosition();
        const correctedDist = pos.dist * Math.cos(pos.relativeAngle);

        if (correctedDist <= 0) return;

        const fovHalf = player.fov / 2;
        const pitchOffset = player.pitch * 300;

        // Calculate sprite size based on distance
        const spriteScale = 600 / correctedDist;
        const spriteHeight = this.height * spriteScale;
        const spriteWidth = this.width * spriteScale;

        // Calculate screen position
        const screenCenterX = (canvas.width / 2) +
            (pos.relativeAngle / fovHalf) * (canvas.width / 2);

        // Sprite bottom at ground level, sprite stands on ground
        const horizon = canvas.height / 2 + pitchOffset;
        const groundY = horizon + (player.z - 0) * spriteScale;
        const spriteTop = groundY - spriteHeight;
        const spriteBottom = groundY;

        const spriteLeft = screenCenterX - spriteWidth / 2;
        const spriteRight = screenCenterX + spriteWidth / 2;

        if (spriteRight < 0 || spriteLeft > canvas.width) {
            return;
        }

        // Clamp to screen bounds
        const clampedLeft = Math.max(0, Math.floor(spriteLeft));
        const clampedRight = Math.min(canvas.width, Math.ceil(spriteRight));
        const clampedTop = Math.max(0, Math.floor(spriteTop));
        const clampedBottom = Math.min(canvas.height, Math.ceil(spriteBottom));

        // Sample rate optimization - limit to ~64 samples per dimension
        const sampleRateY = Math.max(1, Math.floor((clampedBottom - clampedTop) / 64));
        const sampleRateX = Math.max(1, Math.floor((clampedRight - clampedLeft) / 64));

        // Calculate brightness based on distance
        const brightness = Math.max(0.3, 1 - correctedDist / 800);

        // Render sprite with sampling optimization
        for (let screenX = clampedLeft; screenX < clampedRight; screenX += sampleRateX) {
            // Check if this column is occluded by a wall
            const rayIndex = Math.floor((screenX / canvas.width) * player.rayCount);
            const wallDist = wallDistances[rayIndex] || Infinity;

            if (wallDist < correctedDist) {
                continue; // Wall is closer, skip this column
            }

            const spriteX = (screenX - spriteLeft) / spriteWidth;
            const texX = Math.floor(spriteX * this.texture.width);

            for (let screenY = clampedTop; screenY < clampedBottom; screenY += sampleRateY) {
                const spriteY = (screenY - spriteTop) / spriteHeight;
                const texY = Math.floor(spriteY * this.texture.height);

                this.getTexturePixel(texX, texY);

                if (this.pixelData.a > 128) {
                    ctx.fillStyle = `rgba(${Math.floor(this.pixelData.r * brightness)}, ${Math.floor(this.pixelData.g * brightness)}, ${Math.floor(this.pixelData.b * brightness)}, ${this.pixelData.a / 255})`;
                    ctx.fillRect(screenX, screenY, sampleRateX, sampleRateY);
                }
            }
        }
    }

    getTexturePixel(x, y) {
        x = Math.max(0, Math.min(x, this.texture.width - 1));
        y = Math.max(0, Math.min(y, this.texture.height - 1));

        const imageData = this.texture.imageData;
        const index = (Math.floor(y) * this.texture.width + Math.floor(x)) * 4;

        this.pixelData.r = imageData.data[index];
        this.pixelData.g = imageData.data[index + 1];
        this.pixelData.b = imageData.data[index + 2];
        this.pixelData.a = imageData.data[index + 3];
    }
}

// Villagers and sprites arrays
export const villagers = [];
export const sprites = [];

// Check if position is valid for villager
function isValidVillagerPosition(x, y) {
    const margin = 30;
    if (x < margin || x > WORLD_SIZE - margin || y < margin || y > WORLD_SIZE - margin) {
        return false;
    }

    const villagerRadius = 20;
    for (const building of buildings) {
        const left = building.x - villagerRadius;
        const right = building.x + building.width + villagerRadius;
        const top = building.y - villagerRadius;
        const bottom = building.y + building.depth + villagerRadius;

        if (x > left && x < right && y > top && y < bottom) {
            return false;
        }
    }
    return true;
}

// Create villagers at valid positions
export function createVillagers(count) {
    for (let i = 0; i < count; i++) {
        let x, y;
        let attempts = 0;
        do {
            x = 100 + Math.random() * (WORLD_SIZE - 200);
            y = 100 + Math.random() * (WORLD_SIZE - 200);
            attempts++;
        } while (!isValidVillagerPosition(x, y) && attempts < 100);

        if (attempts < 100) {
            const villager = new Villager(x, y);
            villagers.push(villager);
            // Pre-create sprite for this villager (texture assigned later when loaded)
            sprites.push(new Sprite(villager, null, 30, 45));
        }
    }
}
