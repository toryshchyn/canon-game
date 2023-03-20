import store from './store';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const groundHeight = 50;
const gravity = 0.1;
const maxVelocity = 13;
const velocityChangeStep = maxVelocity / 100;
const cannonX = 50;
const cannonY = canvas.height - groundHeight - 10;

function checkCollision(projectile, target) {
    if (projectile == null || target == null) {
        return false;
    }

    const dx = projectile.x - target.x;
    const dy = projectile.y - target.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
  
    console.log(`${dx.toFixed()}:${dy.toFixed()}, Distance: ${distance}, projectile.r: ${projectile.radius}, target.r:${target.radius}`);
    return distance <= projectile.radius + target.radius;
}

function generateRandomTargetData() {
    const radius = 10;
    const x = Math.random() * (canvas.width / 2) + canvas.width / 2;
    const y = Math.random() * (canvas.height - groundHeight - 2 * radius) + radius;
    return { x, y, radius };
}

function drawCannon() {
    const state = store.getState();
    ctx.beginPath();
    ctx.rect(cannonX - 10, cannonY - 10, 20, 20);
    ctx.fillStyle = 'gray';
    ctx.fill();
    ctx.closePath();
  
    ctx.beginPath();
    ctx.moveTo(cannonX, cannonY);
    ctx.lineTo(cannonX + 30 * Math.cos(state.angle * Math.PI / 180), cannonY - 30 * Math.sin(state.angle * Math.PI / 180));
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.closePath();
}

function drawText() {
    const state = store.getState();
    ctx.font = '16px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`Velocity: ${state.velocity.toFixed(1)} units`, 10, 20);
    ctx.fillText(`Angle: ${state.angle.toFixed(1)}°`, 10, 40);
}

function drawVelocityBar() {
    const state = store.getState();
    const barWidth = 200;
    const barHeight = 10;
    const padding = 5;
    const barX = Math.max(Math.min(cannonX - barWidth / 2, canvas.width - barWidth - padding), padding);
    const barY = cannonY + 20;

    ctx.beginPath();
    ctx.rect(barX, barY, barWidth, barHeight);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(barX, barY, (state.velocity / maxVelocity) * barWidth, barHeight);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

function drawGround() {
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - groundHeight);
    ctx.lineTo(canvas.width, canvas.height - groundHeight);
    ctx.strokeStyle = 'brown';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
}

function drawProjectile(projectileData) {
    if (projectileData == null) {
        return;
    }

    ctx.beginPath();
    ctx.arc(projectileData.x, projectileData.y, projectileData.radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.closePath();
}

function drawTarget(targetData) {
    if (targetData == null) {
        return;
    }

    ctx.beginPath();
    ctx.arc(targetData.x, targetData.y, targetData.radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.closePath();
}

function gameLoopFrame() {
    update();
    draw();
    requestAnimationFrame(gameLoopFrame);
}

function update() {
    updateProjectile();
    updateTarget();
}

function updateProjectile() {
    const state = store.getState();
    if (state.projectile == null) {
        return;
    }
    const updatedProjectile = {
        ...state.projectile,
        x: state.projectile.x + state.projectile.vx,
        y: state.projectile.y + state.projectile.vy,
        vy: state.projectile.vy + gravity,
    };
    store.dispatch({ type: 'UPDATE_PROJECTILE', payload: updatedProjectile });
}

function updateTarget() {
    const state = store.getState();

    if (state.target == null) {
        store.dispatch({ type: 'UPDATE_TARGET', payload: generateRandomTargetData(canvas) });
        return;
    }

    if (state.target == null || state.projectile == null) {
        return;
    }

    const targetWasHit = checkCollision(state.projectile, state.target);
    targetWasHit && console.log('HTI!');
    if (state.projectile.y >= canvas.height - groundHeight || targetWasHit) {
        if (targetWasHit) {
            const newTarget = generateRandomTargetData(canvas);
            store.dispatch({ type: 'UPDATE_TARGET', payload: newTarget });
        }
        store.dispatch({ type: 'UPDATE_PROJECTILE', payload: null });
    }
}

function draw() {
    const state = store.getState();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawCannon();
    drawText();
    drawVelocityBar();
    drawGround();
    drawProjectile(state.projectile);
    drawTarget(state.target);
}

function keyDownHandler(e) {
    const state = store.getState();

    if (e.key === 'ArrowUp') {
        store.dispatch({ type: 'UPDATE_ANGLE', payload: state.angle + 1 });
    } else if (e.key === 'ArrowDown') {
        store.dispatch({ type: 'UPDATE_ANGLE', payload: state.angle - 1 });
    } else if (e.key === 'ArrowRight') {
        const newVelocity = Math.min(state.velocity + velocityChangeStep, maxVelocity);
        store.dispatch({ type: 'UPDATE_VELOCITY', payload: newVelocity });
    } else if (e.key === 'ArrowLeft') {
        const newVelocity = Math.max(state.velocity - velocityChangeStep, 0);
        store.dispatch({ type: 'UPDATE_VELOCITY', payload: newVelocity });
    } else if (e.key === ' ' && !state.projectile) {
        const newProjectileData = {
            x: cannonX,
            y: cannonY,
            angle: state.angle,
            velocity: state.velocity,
            vx: state.velocity * Math.cos(state.angle * Math.PI / 180),
            vy: -state.velocity * Math.sin(state.angle * Math.PI / 180),
            radius: 5,
        };
        store.dispatch({ type: 'UPDATE_PROJECTILE', payload: newProjectileData });
    }
}

document.addEventListener('keydown', keyDownHandler);

gameLoopFrame();