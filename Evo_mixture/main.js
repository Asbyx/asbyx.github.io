// Evo_mixture/main.js

// --- Simulation Configuration ---
const SIMULATION_WIDTH = 4000;
const SIMULATION_HEIGHT = 3500;
const TOTAL_PARTICLES = 750; // Total number of particles to spawn

newCanvas(SIMULATION_WIDTH, SIMULATION_HEIGHT); // Use configured size
let allImagesLoaded = true; //true si pas d'images.

//var

//---------------------------

// --- Global Simulation Variables ---
let particles = [];
let links = [];
// const NUM_INITIAL_PARTICLES_PER_TYPE = 10; // Replaced by TOTAL_PARTICLES
const DEFAULT_NATURAL_LINK_LENGTH = 10;
const DEFAULT_LINK_STIFFNESS = 0.5;
const DEFAULT_MAX_LINK_LENGTH = 40; // Max allowed length before link becomes rigid
const PARTICLE_RESTITUTION = 0.75; // Bounciness for particle-particle collisions
const BASE_YELLOW_PUSH_IMPULSE = 0.4; // Base impulse for Yellow Particle push, will be doubled


// --- Initialization ---
function setup() {
	particles = []; // Clear particles array for potential restarts
	links = [];     // Clear links array for potential restarts

	const particleTypes = [GreenParticle, BlueLagonParticle, RedParticle, GreyParticle, YellowParticle];
	const numTypes = particleTypes.length;
	const particlesPerTypeBase = Math.floor(TOTAL_PARTICLES / numTypes);
	let remainderParticles = TOTAL_PARTICLES % numTypes;

	for (let i = 0; i < numTypes; i++) {
		const type = particleTypes[i];
		let countForThisType = particlesPerTypeBase;
		if (remainderParticles > 0) {
			countForThisType++;
			remainderParticles--;
		}
		for (let j = 0; j < countForThisType; j++) {
			particles.push(new type(random(canvas.width), random(canvas.height)));
		}
	}
	
	// Start the animation loop
	draw();
}

// --- Link Management ---
function createLink(p1, p2, naturalLength = DEFAULT_NATURAL_LINK_LENGTH, stiffness = DEFAULT_LINK_STIFFNESS, maxLength = DEFAULT_MAX_LINK_LENGTH) {
	if (!p1.canLink() || !p2.canLink()) {
		return null;
	}
	// Check if a link already exists between these two particles
	const existingLink = links.find(link =>
		(link.p1 === p1 && link.p2 === p2) || (link.p1 === p2 && link.p2 === p1)
	);
	if (existingLink) {
		return null; // Link already exists
	}

	const newLink = new Link(p1, p2, stiffness, naturalLength, maxLength);
	if (p1.addLink(newLink) && p2.addLink(newLink)) {
		links.push(newLink);
		return newLink;
	} else {
		// Rollback if one particle couldn\'t add the link (should not happen if canLink was checked)
		p1.removeLink(newLink);
		p2.removeLink(newLink);
		return null;
	}
}

function removeLink(linkInstance) {
	linkInstance.p1.removeLink(linkInstance);
	linkInstance.p2.removeLink(linkInstance);
	links = links.filter(l => l.id !== linkInstance.id);
}

function removeAllLinksForParticle(particle) {
	const linksToRemove = [...particle.links]; // Iterate over a copy
	linksToRemove.forEach(link => {
		removeLink(link);
	});
}


// --- Collision Handling & Interaction Logic ---
function handleCollisions() {
	for (let i = 0; i < particles.length; i++) {
		for (let j = i + 1; j < particles.length; j++) {
			let p1 = particles[i]; // Use let for potential reassignment if we abstract yellow/other
			let p2 = particles[j];

			if (p1.collidesWith(p2)) {
				// 1. Basic overlap resolution (always do this first to prevent sticking)
				const dist = distance(p1.pos, p2.pos);
				const overlap = (p1.radius + p2.radius) - dist;
				if (overlap > 0) {
					const normal = normalizeVector(subVectors(p1.pos, p2.pos));
					const correction = (dist === 0) ? {x: random(-0.1, 0.1), y: random(-0.1, 0.1)} : multVector(normal, overlap / 2);
					p1.pos = addVectors(p1.pos, correction);
					p2.pos = subVectors(p2.pos, correction);
				}

				// 2. YellowParticle specific interaction
				let yellowParticle = null;
				let otherForYellow = null;

				if (p1 instanceof YellowParticle) {
					yellowParticle = p1;
					otherForYellow = p2;
				} else if (p2 instanceof YellowParticle) {
					yellowParticle = p2;
					otherForYellow = p1;
				}

				if (yellowParticle) {
					const isTargetGreen = otherForYellow instanceof GreenParticle;
					const yellowCanLink = yellowParticle.links.length === 0;
					const targetCanAcceptLink = isTargetGreen && otherForYellow.canLink();
					// Check if already linked to this specific green particle to avoid duplicate links if they stay in contact
					const notAlreadyLinkedToThisTarget = isTargetGreen && !yellowParticle.links.some(link => 
						(link.p1 === yellowParticle && link.p2 === otherForYellow) || 
						(link.p1 === otherForYellow && link.p2 === yellowParticle)
					);

					if (isTargetGreen && yellowCanLink && targetCanAcceptLink && notAlreadyLinkedToThisTarget) {
						createLink(yellowParticle, otherForYellow);
						continue; // Interaction handled for this pair
					} else {
						// Cannot form the specific Yellow-Green link. Push other particle away.
						const pushNormal = normalizeVector(subVectors(otherForYellow.pos, yellowParticle.pos)); // Direction from Yellow to Other
						const finalPushImpulseVec = multVector(pushNormal, BASE_YELLOW_PUSH_IMPULSE * 2); // "Double" the base impulse

						// Apply mass-weighted impulse
						if (otherForYellow.mass > 0) {
						   otherForYellow.vel = addVectors(otherForYellow.vel, multVector(finalPushImpulseVec, 1 / otherForYellow.mass));
						}
						if (yellowParticle.mass > 0) {
						   yellowParticle.vel = subVectors(yellowParticle.vel, multVector(finalPushImpulseVec, 1 / yellowParticle.mass)); // Recoil
						}
						continue; // Interaction handled for this pair (no standard bounce or link)
					}
				}

				// 3. RedParticle interaction (if not handled by Yellow)
				let redParticle = null;
				let otherParticleCollided = null; // Renamed to avoid conflict

				if (p1 instanceof RedParticle) {
					redParticle = p1;
					otherParticleCollided = p2;
				} else if (p2 instanceof RedParticle) {
					redParticle = p2;
					otherParticleCollided = p1;
				}

				if (redParticle) {
					if (redParticle.canLink()) {
						removeAllLinksForParticle(otherParticleCollided);
						if (redParticle.canLink() && otherParticleCollided.canLink()) {
							createLink(redParticle, otherParticleCollided, DEFAULT_NATURAL_LINK_LENGTH / 1.5, DEFAULT_LINK_STIFFNESS * 1.5, DEFAULT_MAX_LINK_LENGTH);
						}
					}
					continue; // Skip normal collision physics and link creation if red particle acted
				}

				// Particle-particle collision physics (bounce)
				const collisionNormal = normalizeVector(subVectors(p2.pos, p1.pos));
				const relativeVelocity = subVectors(p1.vel, p2.vel);
				const velAlongNormal = dotProduct(relativeVelocity, collisionNormal);

				// Do not resolve if velocities are separating
				if (velAlongNormal < 0) {
					const invMass1 = 1 / p1.mass;
					const invMass2 = 1 / p2.mass;

					const impulseScalar = -(1 + PARTICLE_RESTITUTION) * velAlongNormal / (invMass1 + invMass2);
					const impulse = multVector(collisionNormal, impulseScalar);

					p1.vel = addVectors(p1.vel, multVector(impulse, invMass1));
					p2.vel = subVectors(p2.vel, multVector(impulse, invMass2));
				}

				// Standard link creation if no red particle was involved
				if (p1.canLink() && p2.canLink()) {
					const alreadyLinked = p1.links.some(link => link.containsParticle(p2));
					if (!alreadyLinked) {
						createLink(p1, p2);
					}
				}
			}
		}
	}
}


// --- Main Simulation Loop ---
function draw() {
	requestAnimationFrame(draw);
	// if (!allImagesLoaded || !ctx) return; // User removed this line, assuming ctx is always available

	// Set background to black
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// clear(); // From libyx.js - clears the canvas. Replaced by fillRect for black background

	// 1. Apply forces from links
	links.forEach(link => link.applyForce());

	// 2. Update particles
	particles.forEach(particle => particle.update());

	// 3. Handle collisions and create/remove links
	handleCollisions();
	
	// 4. Draw links
	links.forEach(link => link.draw(ctx));

	// 5. Draw particles
	particles.forEach(particle => particle.draw(ctx));

	// Display info (optional)
	// ctx.fillStyle = \'black\';
	// ctx.font = \'12px Arial\';
	// ctx.fillText(\`Particles: \${particles.length}\`, 10, 20);
	// ctx.fillText(\`Links: \${links.length}\`, 10, 40);
}

// --- Start the simulation ---
// Ensure DOM is ready and libyx.js has initialized canvas
window.onload = () => {
	// It's safer to get canvas and ctx here if newCanvas() is synchronous
	// and libyx.js makes them global or accessible.
	// If libyx.js uses a callback or promise for canvas creation,
	// this setup call should be placed there.
	if (typeof canvas !== 'undefined' && typeof ctx !== 'undefined') {
		setup();
	} else {
		console.error("Canvas or context not initialized by libyx.js. Waiting for newCanvas...");
		// Fallback or retry mechanism might be needed if libyx.js is async
		// For now, we assume newCanvas at the top has made them available.
		// If not, the check in draw() will prevent errors.
		// A more robust solution would be to have newCanvas return the canvas/ctx
		// or fire an event when ready.
		
		// Attempt to run setup if newCanvas made them global by the time onload fired
		if (typeof canvas !== 'undefined' && typeof ctx !== 'undefined') {
			 setup();
		} else {
			 // If still not available, let's wait a bit and try once more.
			 // This is a simple workaround.
			 setTimeout(() => {
				if (typeof canvas !== 'undefined' && typeof ctx !== 'undefined') {
					setup();
				} else {
					console.error("Canvas or context still not available. Simulation cannot start.");
					alert("Error: Canvas could not be initialized. Please check libyx.js.");
				}
			}, 100); // wait 100ms
		}
	}
};
