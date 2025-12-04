const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
let mouse = {
  x: null,
  y: null,
  radius: 150
};

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Handle resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

// Mouse interaction
window.addEventListener('mousemove', (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

// Particle class with wave motion
class Particle {
  constructor(x, y, size, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.baseX = x;
    this.baseY = y;
    this.size = size;
    this.speedX = speedX;
    this.speedY = speedY;
    this.density = (Math.random() * 30) + 1;
    this.angle = Math.random() * Math.PI * 2;
    this.angleSpeed = (Math.random() * 0.02) - 0.01;
  }

  draw() {
    ctx.fillStyle = 'rgba(25, 109, 112, 0.6)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  update() {
    // Wave motion
    this.angle += this.angleSpeed;
    this.x = this.baseX + Math.sin(this.angle) * 20;
    this.y = this.baseY + Math.cos(this.angle) * 20;

    // Move base position
    this.baseX += this.speedX;
    this.baseY += this.speedY;

    // Bounce off edges
    if (this.baseX > canvas.width || this.baseX < 0) {
      this.speedX = -this.speedX;
    }
    if (this.baseY > canvas.height || this.baseY < 0) {
      this.speedY = -this.speedY;
    }

    // Mouse interaction - attract particles
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let forceDirectionX = dx / distance;
    let forceDirectionY = dy / distance;
    let maxDistance = mouse.radius;
    let force = (maxDistance - distance) / maxDistance;
    let directionX = forceDirectionX * force * this.density;
    let directionY = forceDirectionY * force * this.density;

    if (distance < mouse.radius) {
      this.x -= directionX;
      this.y -= directionY;
    }

    this.draw();
  }
}

// Initialize particles
function init() {
  particlesArray = [];
  let numberOfParticles = (canvas.width * canvas.height) / 8000;

  for (let i = 0; i < numberOfParticles; i++) {
    let size = (Math.random() * 2) + 0.5;
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    let speedX = (Math.random() * 0.5) - 0.25;
    let speedY = (Math.random() * 0.5) - 0.25;

    particlesArray.push(new Particle(x, y, size, speedX, speedY));
  }
}

// Connect nearby particles
function connect() {
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      let dx = particlesArray[a].x - particlesArray[b].x;
      let dy = particlesArray[a].y - particlesArray[b].y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 120) {
        let opacity = 1 - (distance / 120);
        ctx.strokeStyle = `rgba(25, 109, 112, ${opacity * 0.2})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}

// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
  }

  connect();
  requestAnimationFrame(animate);
}

init();
animate();