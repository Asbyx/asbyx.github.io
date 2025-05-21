class PurpleParticle extends Particle {
    constructor(x, y, radius) {
        super(x, y, radius);
        this.maxLinks = 3; // Max number of links
        this.isActive = false;
        this.pushForce = 5; //  Stronger push force when active
    }

    draw() {
        super.draw(); // Draw state indicator
        fill(128, 0, 128); // Purple color
        circle(this.position.x, this.position.y, this.radius);
    }

    computeInputs() {
        // Active if at least 2 linked particles are active
        const activeLinks = this.links.filter(link => link.particle.isActive).length;
        return activeLinks >= 2 || this.links.length == this.maxLinks;
    }

    updateLinks() {
        // It's important to call super.updateLinks() if you want the default link behavior (like spring forces)
        // to still apply in addition to the new push behavior.
        // If PurpleParticle's active state should ONLY push and not have springy links,
        // then you might conditionally call super.updateLinks() or structure it differently.

        // For now, let's assume the push is an additional force.
        super.updateLinks(); 

        if (this.isActive) {
            for (const link of this.links) {
                const dx = link.particle.position.x - this.position.x;
                const dy = link.particle.position.y - this.position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance === 0) continue;

                // Apply a strong repulsive force (push)
                const force = -this.pushForce; // Negative for repulsion (pushing away)
                const forceX = (dx / distance) * force;
                const forceY = (dy / distance) * force;

                // Adjust velocity. The 0.1 factor is a simple mass/damping consideration.
                // You might want to make this configurable or base it on particle properties.
                this.velocity.x += forceX * 0.1; 
                this.velocity.y += forceY * 0.1;
                
                // The linked particle also experiences the push.
                link.particle.velocity.x -= forceX * 0.1;
                link.particle.velocity.y -= forceY * 0.1;
            }
        }
    }

    onTouch(otherParticle) {
        super.onTouch(otherParticle); // Handle basic collision physics

        // Add a link if not already linked and below max links
        if (this.links.length < this.maxLinks && !this.links.some(link => link.particle === otherParticle)) {
            this.addLink(otherParticle, LINK_REST_LENGTH, LINK_STIFFNESS);
            otherParticle.addLink(this, LINK_REST_LENGTH, LINK_STIFFNESS);
        }
    }
} 