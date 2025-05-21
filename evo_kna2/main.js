// Evo_mixture/main.js

// --- Simulation Configuration ---
const SIMULATION_WIDTH = 4000;
const SIMULATION_HEIGHT = 4000;
const TOTAL_PARTICLES = 2000; // Increased for more variety
const PARTICLE_RADIUS = 3;

newCanvas(SIMULATION_WIDTH, SIMULATION_HEIGHT);
let allImagesLoaded = true;

// Simulation variables
let particles = [];
let lastTime = 0;

function createParticles() {
	// Create a mix of green and yellow particles
	for (let i = 0; i < TOTAL_PARTICLES; i++) {
		const x = random(PARTICLE_RADIUS, SIMULATION_WIDTH - PARTICLE_RADIUS);
		const y = random(PARTICLE_RADIUS, SIMULATION_HEIGHT - PARTICLE_RADIUS);
		
		let particle;
		const type = i % 6; // Cycle through 6 types of particles

		switch (type) {
			case 0:
				particle = new GreenParticle(x, y, PARTICLE_RADIUS);
				break;
			case 1:
				particle = new YellowParticle(x, y, PARTICLE_RADIUS);
				break;
			case 2:
				particle = new RedParticle(x, y, PARTICLE_RADIUS);
				break;
			case 3:
				particle = new BlueParticle(x, y, PARTICLE_RADIUS);
				break;
			case 4:
				particle = new GreyParticle(x, y, PARTICLE_RADIUS);
				break;
			case 5:
				particle = new PurpleParticle(x, y, PARTICLE_RADIUS);
				break;
		}
		particles.push(particle);
	}

	// Create links between nearby particles
	for (let i = 0; i < particles.length; i++) {
		for (let j = i + 1; j < particles.length; j++) {
			const dx = particles[i].position.x - particles[j].position.x;
			const dy = particles[i].position.y - particles[j].position.y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			
			if (distance < LINK_REST_LENGTH * 1.5) {
				particles[i].addLink(particles[j], LINK_REST_LENGTH, LINK_STIFFNESS);
				particles[j].addLink(particles[i], LINK_REST_LENGTH, LINK_STIFFNESS);
			}
		}
	}
}

function checkCollisions() {
	for (let i = 0; i < particles.length; i++) {
		for (let j = i + 1; j < particles.length; j++) {
			const dx = particles[i].position.x - particles[j].position.x;
			const dy = particles[i].position.y - particles[j].position.y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			
			if (distance < particles[i].radius + particles[j].radius) {
				particles[i].onTouch(particles[j]);
			}
		}
	}
}

function updateParticles(deltaTime) {
	// Step 1: Compute the next state for all particles based on current states
	const nextActiveStates = [];
	for (let i = 0; i < particles.length; i++) {
		nextActiveStates[i] = particles[i].computeInputs();
	}

	// Step 2: Apply the computed next states to all particles
	for (let i = 0; i < particles.length; i++) {
		particles[i].isActive = nextActiveStates[i];
	}

	// Update physics (movement, links, etc.)
	for (const particle of particles) {
		particle.updateLinks();
		particle.update(deltaTime);
	}

	// Check for collisions
	checkCollisions();
}

function draw() {
	requestAnimationFrame(draw);
	
	const currentTime = performance.now();
	const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
	lastTime = currentTime;

	// Clear the canvas
	clear();
	background(0);

	// Draw links first (so they appear behind particles)
	for (const particle of particles) {
		particle.drawLinks();
	}

	// Update and draw particles
	updateParticles(deltaTime);
	for (const particle of particles) {
		particle.draw();
	}
}

// Initialize the simulation
createParticles();
// Initialize lastTime for the first frame
lastTime = performance.now(); 
draw();
