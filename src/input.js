import { player } from './player.js';
import { swingCrowbar } from './crowbar.js';

// Input state
export const keys = {};
export let pointerLocked = false;

// Canvas reference for pointer lock
let gameCanvas = null;

export function initInput(canvas) {
    gameCanvas = canvas;

    // Keyboard events
    window.addEventListener('keydown', e => {
        keys[e.key.toLowerCase()] = true;
    });

    window.addEventListener('keyup', e => {
        keys[e.key.toLowerCase()] = false;
    });

    // Mouse click - lock pointer or swing crowbar
    canvas.addEventListener('click', () => {
        if (pointerLocked) {
            // Swing crowbar when pointer is locked
            swingCrowbar();
        } else {
            // Lock pointer on first click
            canvas.requestPointerLock();
        }
    });

    // Pointer lock change
    document.addEventListener('pointerlockchange', () => {
        pointerLocked = document.pointerLockElement === canvas;
    });

    // Mouse movement for looking around
    document.addEventListener('mousemove', e => {
        if (pointerLocked) {
            player.angle += e.movementX * 0.002;
            player.pitch -= e.movementY * 0.002;

            const maxPitch = 0.8;
            player.pitch = Math.max(-maxPitch, Math.min(maxPitch, player.pitch));
        }
    });
}

export function isPointerLocked() {
    return pointerLocked;
}
