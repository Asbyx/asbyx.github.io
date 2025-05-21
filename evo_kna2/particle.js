const LINK_REST_LENGTH = 20;
const LINK_STIFFNESS = 0.1;

class Particle {
    constructor(x, y, radius) {
        this.position = { x, y };
        this.velocity = { x: 0, y: 0 };
        this.radius = radius;
        this.isActive = false;
        this.links = [];
    }

    // Abstract methods to be implemented by subclasses
    draw() {
        // Draw the particle state indicator (outer circle)
        fill(this.isActive ? 255 : 128, this.isActive ? 255 : 128, 0, 0.5);
        circle(this.position.x, this.position.y, this.radius * 1.5);
    }

    drawLinks() {
        // Draw links between particles
        fill(255, 255, 255, 0.2); // Semi-transparent white
        for (const link of this.links) {
            line(this.position.x, this.position.y, link.particle.position.x, link.particle.position.y);
        }
    }

    onTouch(otherParticle) {
        // Handle collision with other particles
        const dx = otherParticle.position.x - this.position.x;
        const dy = otherParticle.position.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance === 0) return;

        // Normalize collision vector
        const nx = dx / distance;
        const ny = dy / distance;

        // Calculate relative velocity
        const relativeVelocityX = this.velocity.x - otherParticle.velocity.x;
        const relativeVelocityY = this.velocity.y - otherParticle.velocity.y;

        // Calculate impulse
        const impulse = (relativeVelocityX * nx + relativeVelocityY * ny) * 0.8;

        // Apply impulse
        this.velocity.x -= impulse * nx;
        this.velocity.y -= impulse * ny;
        otherParticle.velocity.x += impulse * nx;
        otherParticle.velocity.y += impulse * ny;
    }

    computeInputs() {
        // To be implemented by subclasses
        return false;
    }

    // Common methods
    update(deltaTime) {
        // Update position based on velocity
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;

        // Wall collisions
        if (this.position.x - this.radius < 0) {
            this.position.x = this.radius;
            this.velocity.x *= -0.8;
        }
        if (this.position.x + this.radius > width) {
            this.position.x = width - this.radius;
            this.velocity.x *= -0.8;
        }
        if (this.position.y - this.radius < 0) {
            this.position.y = this.radius;
            this.velocity.y *= -0.8;
        }
        if (this.position.y + this.radius > height) {
            this.position.y = height - this.radius;
            this.velocity.y *= -0.8;
        }
    }

    addLink(particle, restLength, stiffness) {
        if (this.links.some(link => link.particle === particle)) {
            return;
        }
        this.links.push({
            particle,
            restLength,
            stiffness
        });
    }

    updateLinks() {
        for (const link of this.links) {
            const dx = link.particle.position.x - this.position.x;
            const dy = link.particle.position.y - this.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance === 0) continue;

            const force = (distance - link.restLength) * link.stiffness;
            const forceX = (dx / distance) * force;
            const forceY = (dy / distance) * force;

            // Apply forces (with mass consideration)
            this.velocity.x += forceX * 0.1;
            this.velocity.y += forceY * 0.1;
            link.particle.velocity.x -= forceX * 0.1;
            link.particle.velocity.y -= forceY * 0.1;
        }
    }

    removeLink(particleToRemove) {
        this.links = this.links.filter(link => link.particle !== particleToRemove);
        particleToRemove.links = particleToRemove.links.filter(link => link.particle !== this);
    }
} 