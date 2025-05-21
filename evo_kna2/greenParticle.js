class GreenParticle extends Particle {
    constructor(x, y, radius) {
        super(x, y, radius);
        this.maxSpeed = 20;
        this.acceleration = 1;
        this.lastDirection = { x: 1, y: 0 }; // Default direction
        this.maxLinks = 3; // Max number of links for green particle
        this.isActive = false;
    }

    draw() {
        super.draw();
        fill(0, 255, 0);
        circle(this.position.x, this.position.y, this.radius);
    }

    onTouch(otherParticle) {
        super.onTouch(otherParticle); // Call base class onTouch for collision physics

        // Add a link if not already linked and below max links
        if (this.links.length < this.maxLinks && !this.links.some(link => link.particle === otherParticle)) {
            this.addLink(otherParticle, LINK_REST_LENGTH, LINK_STIFFNESS);
            otherParticle.addLink(this, LINK_REST_LENGTH, LINK_STIFFNESS);
        }
    }

    computeInputs() {
        // Green particle is active if it has at least one link and any linked particle is active,
        const hasActiveInput = this.links.some(link => link.particle.isActive);

        if (hasActiveInput) {
            // Accelerate in the last known direction
            const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);

            if (speed < this.maxSpeed) {
                this.velocity.x += this.lastDirection.x * this.acceleration;
                this.velocity.y += this.lastDirection.y * this.acceleration;
            }

            // Update last direction if moving
            if (speed > 0.1) {
                this.lastDirection.x = this.velocity.x / speed;
                this.lastDirection.y = this.velocity.y / speed;
            }
        }

        return hasActiveInput
    }
} 