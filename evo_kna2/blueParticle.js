class BlueParticle extends Particle {
    constructor(x, y, radius) {
        super(x, y, radius);
        this.angle = Math.random() * Math.PI * 2; // Initial angle for circular motion
        this.angularSpeed = 0.05; // Speed of circular motion
        this.circleRadius = 2;   // Radius of the circular path
        this.isActive = false;
    }

    draw() {
        super.draw(); // Draw state indicator
        fill(0, 0, 255); // Blue color
        circle(this.position.x, this.position.y, this.radius);
    }

    update(deltaTime) {
        super.update(deltaTime); // Apply basic physics and wall collisions

        // Circular motion
        const direction = this.isActive ? 1 : -1; // Clockwise or Counter-clockwise
        this.angle += this.angularSpeed * direction;

        const circularVelocityX = -Math.sin(this.angle) * this.circleRadius * this.angularSpeed * 50 * direction;
        const circularVelocityY = Math.cos(this.angle) * this.circleRadius * this.angularSpeed * 50 * direction;

        this.velocity.x += circularVelocityX * deltaTime; 
        this.velocity.y += circularVelocityY * deltaTime;

        // Dampen overall velocity to prevent runaway speeds from circular motion addition
        this.velocity.x *= 0.98;
        this.velocity.y *= 0.98;

    }

    computeInputs() {
        return this.links.filter(link => link.particle.isActive).length >= 2;
    }

    onTouch(otherParticle) {
        super.onTouch(otherParticle); // Handle basic collision physics
    }
} 