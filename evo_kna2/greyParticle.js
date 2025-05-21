class GreyParticle extends Particle {
    constructor(x, y, radius) {
        super(x, y, radius);
        this.maxLinks = 4; // Max number of links for grey particle
        this.isActive = false;
    }

    draw() {
        super.draw(); // Draw state indicator
        fill(128, 128, 128); // Grey color
        circle(this.position.x, this.position.y, this.radius);
    }

    onTouch(otherParticle) {
        super.onTouch(otherParticle); // Handle basic collision physics

        // Add a link if not already linked and below max links
        if (this.links.length < this.maxLinks && !this.links.some(link => link.particle === otherParticle)) {
            this.addLink(otherParticle, LINK_REST_LENGTH, LINK_STIFFNESS);
            otherParticle.addLink(this, LINK_REST_LENGTH, LINK_STIFFNESS);
        }
    }

    computeInputs() {
        return false;
    }
} 