function Accrobate() {
	this.isAlive = true;
	this.x = 50; // Starting position on the bar
	this.y = height / 4; // Starting height on the bar
	this.vx = 0; // Velocity x
	this.vy = 0; // Velocity y
	this.angle = 0; // Angle of the acrobat
	this.angularVelocity = 0;
	this.onBar = true; // Starts on the bar
	this.totalRotation = 0; // For tracking flips

	// DNA: timings for muscle activations.
	// Example: [time1_muscleA, duration1_muscleA, strength1_muscleA, time2_muscleB, duration2_muscleB, strength2_muscleB, ...]
	// For simplicity, let's start with a few timed impulses (e.g., jump, tuck, extend)
	// DNA will be an array of objects: { startTime, duration, forceX, forceY, torque }
	this.dna = [];
	this.dnaLength = 5; // Number of "muscle activations" in DNA
	for (let i = 0; i < this.dnaLength; i++) {
		this.dna.push({
			startTime: Math.random() * 100, // Start time of activation (in frames)
			duration: Math.random() * 20 + 5,  // Duration of activation
			forceX: (Math.random() - 0.5) * 0.5, // Horizontal force
			torque: (Math.random() - 0.5) * 0.03 // Decreased initial torque
		});
	}
	// Sort DNA by startTime
	this.dna.sort((a, b) => a.startTime - b.startTime);

	this.internalClock = 0;
	this.currentDnaIndex = 0;

	this.score = 0; // Will store fitness
	this.isOneOfTheBests = false; // For selection in genetic algorithm
	this.landedProperly = false;
	this.numFlips = 0;


	this.applyMuscleForce = function(forceX, torque) {
		if (!this.onBar) { // No force application if still on bar, except for jump
			 this.vx += forceX;
			 this.angularVelocity += torque;
			 // bound the angular velocity
			 this.angularVelocity = Math.max(-0.5, Math.min(0.5, this.angularVelocity));
		}
	};

	this.jumpOffBar = function() {
		if (this.onBar) {
			this.onBar = false;
			this.vy = -5; // Initial jump velocity
			this.vx = 2;  // Initial forward velocity
		}
	}

	this.update = function() {
		if (!this.isAlive) return;

		this.internalClock++;

		// Apply DNA actions
		if (this.currentDnaIndex < this.dna.length) {
			let currentAction = this.dna[this.currentDnaIndex];
			if (this.internalClock >= currentAction.startTime) {
				if (this.internalClock < currentAction.startTime + currentAction.duration) {
					if (this.currentDnaIndex === 0 && this.onBar) { // First action could be the jump
						this.jumpOffBar();
					}
					this.applyMuscleForce(currentAction.forceX, currentAction.torque);
				}
				if (this.internalClock >= currentAction.startTime + currentAction.duration) {
					this.currentDnaIndex++;
				}
			}
		}


		if (this.onBar) {
			// Stick to bar, maybe slight animation later
			this.vy = 0;
			this.angularVelocity = 0;
		} else {
			// Apply gravity
			this.vy += 0.2; // Gravity

			// Update position and angle
			this.x += this.vx;
			this.y += this.vy;
			this.angle += this.angularVelocity;
			this.totalRotation += this.angularVelocity; // Accumulate rotation for flip counting

			// Air resistance/damping (simple)
			this.vx *= 0.99;
			this.vy *= 0.99;
			this.angularVelocity *= 0.97; // Increased angular damping

			// Collision Detection (only if off the bar and alive)
            let bodyHalfHeight = 15; // Acrobat body is 30px high, centered

            let acrobatBottomY = this.y + bodyHalfHeight;

            let landingPlatformTopY = height - 20; // Platform is 20px high, its top is at height - 20
            let landingPlatformX_start = 150;
            let landingPlatformX_end = 250;

            // 1. Check for landing on the platform
            if (acrobatBottomY >= landingPlatformTopY && 
                this.x >= landingPlatformX_start && this.x <= landingPlatformX_end &&
                this.vy >= 0) { // Moving downwards or already still
                
                this.y = landingPlatformTopY - bodyHalfHeight; // Position on platform
                this.vy = 0;
                this.vx = 0; // Stop completely for scoring
                this.angularVelocity = 0; // Stop rotation for scoring
                this.isAlive = false; // End of attempt

                let angleError = Math.abs(this.angle % (2 * Math.PI));
                if (angleError > Math.PI) angleError = 2 * Math.PI - angleError;
                
                let angleQuality = 1 - (angleError / Math.PI);
                let rotationQuality = 1.0; // Assuming stop means stable rotationally.
                let quality = Math.max(0, angleQuality * 0.7 + rotationQuality * 0.3);
                
                this.numFlips = Math.floor(Math.abs(this.totalRotation) / (2 * Math.PI));
                this.landedProperly = quality > 0.65; // Still useful for display

                let onPlatformBonus = 50; // Bonus points for landing on the platform
                this.score = (quality * 100) + onPlatformBonus*5 + (this.numFlips * 2); // New fitness function

            } 
            // 2. Check for hitting the general floor (if not on platform)
            else if (acrobatBottomY >= height) {
                this.y = height - bodyHalfHeight; // Position on floor
                this.vy = 0; // Stop vertical motion
                this.vx *= 0.7; // Apply some friction
                this.angularVelocity *= 0.7; // Dampen rotation
                this.isAlive = false;
                this.landedProperly = false;
                this.score = Math.max(0, this.x / 3); // Score is less if they just hit the floor
            }
            // 4. Check for hitting side walls (simplistic check on x center)
            else if (this.x <= 0 || this.x >= width) {
                this.isAlive = false;
                this.landedProperly = false;
                // Keep a small part of x as score if they went far before hitting side AFTER platform X range
                this.score = (this.x > landingPlatformX_end) ? this.x / 4 : 0; 
            }
		}
	};

	this.show = function() {
		this.update(); // Call update from show

		// Assuming ctx is a global reference to the 2D canvas context
		ctx.save(); // Changed from push()
		ctx.translate(this.x, this.y); // Changed from translate()
		ctx.rotate(this.angle); // Changed from rotate()

		// Simple acrobat representation (a rectangle for body, circle for head)
		fill(200, 0, 0); // Red body - assuming fill() is a global libyx.js function
		// rectMode(CENTER); // Removed - assuming libyx.js doesn't have global rectMode or its rect() doesn't use it.
		                   // Manually adjust for centered rectangle:
		rect(-10/2, -30/2, 10, 30); // Body, adjusted for center. Assuming rect() is global libyx.js

		fill(255, 200, 150); // Head color - assuming fill() is a global libyx.js function
		// ellipse(0, -20, 15, 15); // Head (relative to body center)
		ctx.beginPath();
		ctx.ellipse(0, -20, 15/2, 15/2, 0, 0, 2 * Math.PI); // x, y, radiusX, radiusY, rotation, startAngle, endAngle
		ctx.fill();
		
		ctx.restore(); // Changed from pop()

		// Draw the bar
		fill(100);
		rect(0, height / 4 + 15, 100, 10); // Bar position and size

		// Draw landing platform
		fill(50, 200, 50);
		rect(150, height - 20, 100, 20); // Platform position and size
	};
}

// DNA mutation function for an Accrobate instance
Accrobate.prototype.mutate = function(mutationRate) {
	for (let i = 0; i < this.dna.length; i++) {
		if (Math.random() < mutationRate) {
			this.dna[i].startTime = Math.max(0, this.dna[i].startTime + (Math.random() - 0.5) * 20); // Mutate by +/- 10 frames
		}
		if (Math.random() < mutationRate) {
			this.dna[i].duration = Math.max(5, this.dna[i].duration + (Math.random() - 0.5) * 10); // Mutate by +/- 5 frames
		}
		if (Math.random() < mutationRate) {
			this.dna[i].forceX += (Math.random() - 0.5) * 0.1;
		}
		if (Math.random() < mutationRate) {
			this.dna[i].torque += (Math.random() - 0.5) * 0.5;
		}
	}
	// Re-sort DNA by startTime after mutation
	this.dna.sort((a, b) => a.startTime - b.startTime);

	// Chance to add or remove a DNA action
	if (Math.random() < mutationRate * 0.1 && this.dna.length < 10) { // Max 10 actions
		this.dna.push({
			startTime: Math.random() * 100 + (this.dna.length > 0 ? this.dna[this.dna.length-1].startTime : 0), // Add towards the end
			duration: Math.random() * 20 + 5,
			forceX: (Math.random() - 0.5) * 0.5,
			torque: (Math.random() - 0.5) * 0.03
		});
		this.dna.sort((a, b) => a.startTime - b.startTime);
	}
	if (Math.random() < mutationRate * 0.1 && this.dna.length > 1) { // Min 1 action
		this.dna.splice(Math.floor(Math.random() * this.dna.length), 1);
	}
};

// Function to create a new Accrobate by crossing over DNA from two parents
function crossover(parentA, parentB) {
	let child = new Accrobate();
	child.dna = [];
	let shorterDnaLength = Math.min(parentA.dna.length, parentB.dna.length);
	let longerParent = parentA.dna.length > parentB.dna.length ? parentA : parentB;

	// Mix DNA up to the length of the shorter parent
	for (let i = 0; i < shorterDnaLength; i++) {
		if (Math.random() < 0.5) {
			child.dna.push(_.cloneDeep(parentA.dna[i]));
		} else {
			child.dna.push(_.cloneDeep(parentB.dna[i]));
		}
	}
	// Add remaining DNA from the longer parent
	for (let i = shorterDnaLength; i < longerParent.dna.length; i++) {
		 child.dna.push(_.cloneDeep(longerParent.dna[i]));
	}
	
	child.dna.sort((a, b) => a.startTime - b.startTime);
	return child;
} 