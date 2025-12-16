import { player } from './player.js';
import { buildings, worldBoundaries, boundaryType } from './buildings.js';

// Ray-line segment intersection
export function rayLineIntersection(rayX, rayY, rayDirX, rayDirY, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;

    const denom = rayDirX * dy - rayDirY * dx;
    if (Math.abs(denom) < 0.0001) return null;

    const t = ((x1 - rayX) * dy - (y1 - rayY) * dx) / denom;
    const u = ((x1 - rayX) * rayDirY - (y1 - rayY) * rayDirX) / denom;

    if (t > 0.1 && u >= 0 && u <= 1) {
        return {
            x: rayX + rayDirX * t,
            y: rayY + rayDirY * t,
            dist: t
        };
    }

    return null;
}

// Ray-building intersection (uses pre-computed walls)
export function rayBuildingIntersection(rayX, rayY, rayDirX, rayDirY, building) {
    const hits = [];

    // Use pre-computed walls
    for (const wall of building.walls) {
        const hit = rayLineIntersection(rayX, rayY, rayDirX, rayDirY, wall.x1, wall.y1, wall.x2, wall.y2);
        if (hit) {
            hit.building = building;
            hit.side = wall.side;

            // Calculate texture coordinate along wall
            if (wall.x1 === wall.x2) {
                hit.texCoord = (hit.y - wall.y1) / (wall.y2 - wall.y1);
            } else {
                hit.texCoord = (hit.x - wall.x1) / (wall.x2 - wall.x1);
            }

            hits.push(hit);
        }
    }

    return hits;
}

// Cast a single ray and get all hits sorted by distance
export function castRay(angle) {
    const dirX = Math.cos(angle);
    const dirY = Math.sin(angle);

    const hits = [];

    // Check intersections with all buildings
    for (const building of buildings) {
        const buildingHits = rayBuildingIntersection(player.x, player.y, dirX, dirY, building);
        hits.push(...buildingHits);
    }

    // Check world boundaries (use pre-computed array)
    for (const bound of worldBoundaries) {
        const hit = rayLineIntersection(player.x, player.y, dirX, dirY, bound.x1, bound.y1, bound.x2, bound.y2);
        if (hit) {
            hit.isBoundary = true;
            hit.building = { type: boundaryType, textureKey: 'FENCE' };
            hits.push(hit);
        }
    }

    // Sort by distance
    hits.sort((a, b) => a.dist - b.dist);

    return hits;
}
