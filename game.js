const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

class Projectile {
    constructor(x, y, angle, velocity) {
        this.x = x;
        this.y = y;
        this.radius = 5;
        this.vx = velocity * Math.cos(angle * Math.PI / 180);
        this.vy = -velocity * Math.sin(angle * Math.PI / 180);
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += gravity;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.closePath();
    }
}

class Target {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'green';
        ctx.fill();
        ctx.closePath();
    }
}


let groundHeight = 50;
let cannonX = 50;
let cannonY = canvas.height - groundHeight - 10;
let angle = 45;
let velocity = 10;
let projectile = null;
let gravity = 0.1;
let maxVelocity = 13;
let velocityChangeStep = maxVelocity / 100;
let target = generateRandomTarget();


function checkCollision(projectile, target) {
    const dx = projectile.x - target.x;
    const dy = projectile.y - target.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    console.log(`${dx.toFixed()}:${dy.toFixed()}, Distance: ${distance}, projectile.r: ${projectile.radius}, target.r:${target.radius}`);
    return distance <= projectile.radius + target.radius;
}

function generateRandomTarget() {
    const radius = 10;
    const x = Math.random() * (canvas.width / 2) + canvas.width / 2;
    const y = Math.random() * (canvas.height - groundHeight - 2 * radius) + radius;
    return new Target(x, y, radius);
}

function drawCannon() {
    ctx.beginPath();
    ctx.rect(cannonX - 10, cannonY - 10, 20, 20);
    ctx.fillStyle = 'gray';
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(cannonX, cannonY);
    ctx.lineTo(cannonX + 30 * Math.cos(angle * Math.PI / 180), cannonY - 30 * Math.sin(angle * Math.PI / 180));
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.closePath();
}

function drawText() {
    ctx.font = '16px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`Velocity: ${velocity.toFixed(1)} units`, 10, 20);
    ctx.fillText(`Angle: ${angle.toFixed(1)}°`, 10, 40);
}

function drawVelocityBar() {
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
    ctx.rect(barX, barY, (velocity / maxVelocity) * barWidth, barHeight);
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

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawCannon();
    drawText();
    drawVelocityBar();
    drawGround();
    
    if (projectile) {
        projectile.update();
        projectile.draw();

        const targetWasHit = checkCollision(projectile, target);
        targetWasHit && console.log('HTI!');
        if (projectile.y >= canvas.height - groundHeight || targetWasHit) {
            if (targetWasHit) {
                target = generateRandomTarget();
            }
            projectile = null;
        }
    }
    
    target.draw();

    requestAnimationFrame(draw);
}

function keyDownHandler(e) {
    if (e.key === 'ArrowUp') {
        angle += 1;
    } else if (e.key === 'ArrowDown') {
        angle -= 1;
    } else if (e.key === 'ArrowRight') {
        velocity = Math.min(velocity + velocityChangeStep, maxVelocity);
    } else if (e.key === 'ArrowLeft') {
        velocity = Math.max(velocity - velocityChangeStep, 0);
    } else if (e.key === ' ' && !projectile) {
        projectile = new Projectile(cannonX, cannonY, angle, velocity);
    }
}

document.addEventListener('keydown', keyDownHandler);

draw();