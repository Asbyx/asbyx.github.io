class RedParticle extends Particle {
    constructor(x, y, radius) {
        super(x, y, radius);
        this.maxLinks = 2; // Max number of links for red particle
        this.isActive = false; // Red particles can be active or inactive based on logic
    }

    draw() {
        super.draw(); // Draw state indicator
        fill(255, 0, 0); // Red color
        circle(this.position.x, this.position.y, this.radius);
    }

    onTouch(otherParticle) {
        super.onTouch(otherParticle); // Handle basic collision physics

        if (this.isActive) {
            while (otherParticle.links.length > 0) {
                const linkedParticle = otherParticle.links[0].particle;
                otherParticle.removeLink(linkedParticle);
            }
        } else if (this.links.length < this.maxLinks) {
            this.addLink(otherParticle, LINK_REST_LENGTH, LINK_STIFFNESS);
            otherParticle.addLink(this, LINK_REST_LENGTH, LINK_STIFFNESS);
        }
    }

    removeLink(particleToRemove) {
        this.links = this.links.filter(link => link.particle !== particleToRemove);
    }

    computeInputs() {
        return this.links.some(link => link.particle.isActive)
    }
} 