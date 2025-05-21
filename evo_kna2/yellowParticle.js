class YellowParticle extends Particle {
    constructor(x, y, radius) {
        super(x, y, radius);
        this.isActive = true; // Always active
        this.maxLinks = 2; // Max number of links for yellow particle
    }

    draw() {
        super.draw();
        fill(255, 255, 0);
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
        return true; // Always active
    }
} 