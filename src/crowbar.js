import { keys } from './input.js';

// Crowbar state
export const crowbar = {
    swinging: false,
    swingProgress: 0,
    swingSpeed: 0.099,
    restAngle: -0.2,
    swingAngle: -1.0,
    currentAngle: -0.2,
    bobOffset: 0,
    cooldown: false,
    cooldownTime: 500
};

// Crowbar attack function
export function swingCrowbar() {
    if (!crowbar.swinging && !crowbar.cooldown) {
        crowbar.swinging = true;
        crowbar.swingProgress = 0;
        crowbar.cooldown = true;

        // Reset cooldown after delay
        setTimeout(() => {
            crowbar.cooldown = false;
        }, crowbar.cooldownTime);
    }
}

// Draw the first-person crowbar
export function drawCrowbar(ctx, canvas) {
    ctx.save();

    // Bob effect based on movement
    const bobAmount = (keys['w'] || keys['s'] || keys['a'] || keys['d']) ?
        Math.sin(Date.now() * 0.008) * 10 : 0;
    crowbar.bobOffset = bobAmount;

    // Position crowbar more towards center
    const baseX = canvas.width - 350;
    const baseY = canvas.height + 80 + bobAmount;

    // Calculate current angle based on swing
    if (crowbar.swinging) {
        crowbar.swingProgress += crowbar.swingSpeed;
        if (crowbar.swingProgress >= 1) {
            crowbar.swingProgress = 0;
            crowbar.swinging = false;
        }
        // Swing arc: rest -> swing -> rest
        const swingCurve = Math.sin(crowbar.swingProgress * Math.PI);
        crowbar.currentAngle = crowbar.restAngle + (crowbar.swingAngle - crowbar.restAngle) * swingCurve;
    } else {
        crowbar.currentAngle = crowbar.restAngle;
    }

    ctx.translate(baseX, baseY);
    ctx.rotate(crowbar.currentAngle - 0.15);

    // Crowbar dimensions
    const shaftLength = 520;
    const shaftWidth = 24;

    // Shadow for entire crowbar
    ctx.save();
    ctx.translate(5, 5);
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(-shaftWidth/2, -shaftLength + 100, shaftWidth, shaftLength - 100);
    ctx.restore();

    // Main shaft gradient (darker burgundy/maroon)
    const shaftGradient = ctx.createLinearGradient(-shaftWidth/2, 0, shaftWidth/2, 0);
    shaftGradient.addColorStop(0, '#3d0f0f');
    shaftGradient.addColorStop(0.15, '#5c1515');
    shaftGradient.addColorStop(0.3, '#7a1a1a');
    shaftGradient.addColorStop(0.5, '#8a1e1e');
    shaftGradient.addColorStop(0.7, '#7a1a1a');
    shaftGradient.addColorStop(0.85, '#5c1515');
    shaftGradient.addColorStop(1, '#3d0f0f');

    // Draw main shaft
    ctx.fillStyle = shaftGradient;
    ctx.fillRect(-shaftWidth/2, -shaftLength + 100, shaftWidth, shaftLength - 100);

    // Wear/scratch marks on shaft
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    const scratchPositions = [
        { y: -120, w: 12, h: 4 },
        { y: -180, w: 8, h: 3 },
        { y: -250, w: 15, h: 3 },
        { y: -300, w: 10, h: 4 },
        { y: -350, w: 14, h: 3 },
        { y: -400, w: 9, h: 4 }
    ];
    for (const scratch of scratchPositions) {
        ctx.fillRect(-shaftWidth/2 + 2, scratch.y, scratch.w, scratch.h);
    }

    // Subtle highlight on shaft
    ctx.fillStyle = 'rgba(255,100,100,0.15)';
    ctx.fillRect(-shaftWidth/2 + 3, -shaftLength + 100, 5, shaftLength - 120);

    // === TOP HOOK ===
    const hookY = -shaftLength + 100;

    // Hook shadow
    ctx.save();
    ctx.translate(4, 4);
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.moveTo(shaftWidth/2, hookY + 20);
    ctx.lineTo(shaftWidth/2, hookY - 30);
    ctx.quadraticCurveTo(shaftWidth/2 - 5, hookY - 70, -20, hookY - 85);
    ctx.quadraticCurveTo(-55, hookY - 95, -75, hookY - 70);
    ctx.quadraticCurveTo(-85, hookY - 50, -80, hookY - 30);
    ctx.lineTo(-70, hookY - 35);
    ctx.quadraticCurveTo(-65, hookY - 55, -50, hookY - 65);
    ctx.quadraticCurveTo(-20, hookY - 60, -shaftWidth/2, hookY - 20);
    ctx.lineTo(-shaftWidth/2, hookY + 20);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Hook gradient (dark metal)
    const hookGradient = ctx.createLinearGradient(-80, hookY - 80, 10, hookY);
    hookGradient.addColorStop(0, '#1a1a1a');
    hookGradient.addColorStop(0.3, '#3a3a3a');
    hookGradient.addColorStop(0.5, '#4a4a4a');
    hookGradient.addColorStop(0.7, '#3a3a3a');
    hookGradient.addColorStop(1, '#2a2a2a');

    // Draw curved hook
    ctx.fillStyle = hookGradient;
    ctx.beginPath();
    ctx.moveTo(shaftWidth/2, hookY + 20);
    ctx.lineTo(shaftWidth/2, hookY - 30);
    ctx.quadraticCurveTo(shaftWidth/2 - 5, hookY - 70, -20, hookY - 85);
    ctx.quadraticCurveTo(-55, hookY - 95, -75, hookY - 70);
    ctx.quadraticCurveTo(-85, hookY - 50, -80, hookY - 30);
    ctx.lineTo(-70, hookY - 35);
    ctx.quadraticCurveTo(-65, hookY - 55, -50, hookY - 65);
    ctx.quadraticCurveTo(-20, hookY - 60, -shaftWidth/2, hookY - 20);
    ctx.lineTo(-shaftWidth/2, hookY + 20);
    ctx.closePath();
    ctx.fill();

    // Hook edge highlight
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-78, hookY - 35);
    ctx.quadraticCurveTo(-83, hookY - 50, -73, hookY - 68);
    ctx.stroke();

    // === BOTTOM CHISEL END ===
    const chiselY = 0;

    // Chisel shadow
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.moveTo(-shaftWidth/2 - 8 + 4, chiselY + 4);
    ctx.lineTo(-shaftWidth/2 - 20 + 4, chiselY + 45 + 4);
    ctx.lineTo(shaftWidth/2 + 20 + 4, chiselY + 45 + 4);
    ctx.lineTo(shaftWidth/2 + 8 + 4, chiselY + 4);
    ctx.closePath();
    ctx.fill();

    // Chisel gradient
    const chiselGradient = ctx.createLinearGradient(-30, chiselY, 30, chiselY + 45);
    chiselGradient.addColorStop(0, '#2a2a2a');
    chiselGradient.addColorStop(0.4, '#4a4a4a');
    chiselGradient.addColorStop(0.6, '#3a3a3a');
    chiselGradient.addColorStop(1, '#252525');

    ctx.fillStyle = chiselGradient;
    ctx.beginPath();
    ctx.moveTo(-shaftWidth/2 - 8, chiselY);
    ctx.lineTo(-shaftWidth/2 - 20, chiselY + 45);
    ctx.lineTo(shaftWidth/2 + 20, chiselY + 45);
    ctx.lineTo(shaftWidth/2 + 8, chiselY);
    ctx.closePath();
    ctx.fill();

    // Chisel notch/slot
    ctx.fillStyle = '#151515';
    ctx.beginPath();
    ctx.moveTo(-4, chiselY + 15);
    ctx.lineTo(-6, chiselY + 43);
    ctx.lineTo(6, chiselY + 43);
    ctx.lineTo(4, chiselY + 15);
    ctx.closePath();
    ctx.fill();

    // Chisel edge highlight
    ctx.strokeStyle = '#606060';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-shaftWidth/2 - 18, chiselY + 43);
    ctx.lineTo(shaftWidth/2 + 18, chiselY + 43);
    ctx.stroke();

    // === HAND/GLOVE holding the crowbar ===
    const handY = -80;

    // Glove/arm base (brown leather sleeve)
    ctx.fillStyle = '#5c4033';
    ctx.fillRect(shaftWidth/2 + 5, handY + 60, 80, 50);

    // Sleeve ridges
    ctx.fillStyle = '#4a3328';
    for (let i = 0; i < 4; i++) {
        ctx.fillRect(shaftWidth/2 + 5, handY + 65 + i * 12, 80, 3);
    }

    // Glove main part (dark gray/black)
    ctx.fillStyle = '#2a2a2a';
    ctx.beginPath();
    ctx.moveTo(-shaftWidth/2 - 25, handY);
    ctx.lineTo(-shaftWidth/2 - 30, handY + 80);
    ctx.lineTo(shaftWidth/2 + 30, handY + 80);
    ctx.lineTo(shaftWidth/2 + 25, handY);
    ctx.closePath();
    ctx.fill();

    // Glove gradient overlay
    const gloveGradient = ctx.createLinearGradient(-30, handY, 30, handY);
    gloveGradient.addColorStop(0, 'rgba(60,60,60,0.8)');
    gloveGradient.addColorStop(0.5, 'rgba(40,40,40,0.8)');
    gloveGradient.addColorStop(1, 'rgba(30,30,30,0.8)');
    ctx.fillStyle = gloveGradient;
    ctx.beginPath();
    ctx.moveTo(-shaftWidth/2 - 25, handY);
    ctx.lineTo(-shaftWidth/2 - 30, handY + 80);
    ctx.lineTo(shaftWidth/2 + 30, handY + 80);
    ctx.lineTo(shaftWidth/2 + 25, handY);
    ctx.closePath();
    ctx.fill();

    // Fingers wrapped around crowbar
    ctx.fillStyle = '#222';
    // Finger 1
    ctx.beginPath();
    ctx.ellipse(-shaftWidth/2 - 12, handY + 15, 12, 18, 0.2, 0, Math.PI * 2);
    ctx.fill();
    // Finger 2
    ctx.beginPath();
    ctx.ellipse(-shaftWidth/2 - 10, handY + 40, 11, 16, 0.15, 0, Math.PI * 2);
    ctx.fill();
    // Finger 3
    ctx.beginPath();
    ctx.ellipse(-shaftWidth/2 - 8, handY + 62, 10, 14, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Finger highlights
    ctx.fillStyle = '#3a3a3a';
    ctx.beginPath();
    ctx.ellipse(-shaftWidth/2 - 14, handY + 12, 5, 8, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-shaftWidth/2 - 12, handY + 37, 4, 7, 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Thumb on other side
    ctx.fillStyle = '#252525';
    ctx.beginPath();
    ctx.ellipse(shaftWidth/2 + 15, handY + 30, 14, 22, -0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}
