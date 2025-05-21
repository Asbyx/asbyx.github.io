class Particle {
    constructor(x, y, radius = 5, color = 'white', maxLinks = 3) {
        this.pos = { x, y };
        this.vel = { x: random(-1, 1), y: random(-1, 1) };
        this.acc = { x: 0, y: 0 }; // Acceleration
        this.radius = radius;
        this.color = getColor(color);
        this.mass = Math.PI * radius * radius; // Mass proportional to area
        this.links = [];
        this.maxLinks = maxLinks;
        this.id = Math.random().toString(36).substr(2, 9); // Unique ID
    }

    applyForce(force) {
        // F = ma => a = F/m
        let f = divVector(force, this.mass);
        this.acc = addVectors(this.acc, f);
    }

    update(deltaTime = 1/60) { // Assuming 60 FPS, deltaTime is 1/60 seconds
        // Update velocity
        this.vel = addVectors(this.vel, multVector(this.acc, deltaTime));
        
        // Update position
        this.pos = addVectors(this.pos, multVector(this.vel, deltaTime));

        // Reset acceleration for the next frame
        this.acc = { x: 0, y: 0 };

        // Screen boundary collision (rigid walls with bounce)
        const restitution = 0.9; // Coefficient of restitution (0 = no bounce, 1 = perfect bounce)

        // Right wall
        if (this.pos.x + this.radius > canvas.width) {
            this.pos.x = canvas.width - this.radius;
            this.vel.x *= -restitution;
        }
        // Left wall
        if (this.pos.x - this.radius < 0) {
            this.pos.x = this.radius;
            this.vel.x *= -restitution;
        }
        // Bottom wall
        if (this.pos.y + this.radius > canvas.height) {
            this.pos.y = canvas.height - this.radius;
            this.vel.y *= -restitution;
        }
        // Top wall
        if (this.pos.y - this.radius < 0) {
            this.pos.y = this.radius;
            this.vel.y *= -restitution;
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();

        // Draw number of links
        // ctx.fillStyle = 'black';
        // ctx.font = '10px Arial';
        // ctx.textAlign = 'center';
        // ctx.fillText(this.links.length.toString(), this.pos.x, this.pos.y + 3);
    }

    collidesWith(otherParticle) {
        const d = distance(this.pos, otherParticle.pos);
        return d < this.radius + otherParticle.radius;
    }

    canLink() {
        return this.links.length < this.maxLinks;
    }

    addLink(link) {
        if (this.canLink()) {
            this.links.push(link);
            return true;
        }
        return false;
    }

    removeLink(linkToRemove) {
        this.links = this.links.filter(link => link.id !== linkToRemove.id);
    }

    removeAllLinks() {
        const linksToRemove = [...this.links]; // Create a copy to iterate over
        linksToRemove.forEach(link => {
            const otherParticle = link.p1 === this ? link.p2 : link.p1;
            otherParticle.removeLink(link);
            this.removeLink(link); // remove from current particle's links
             // Potentially, we might want to notify a global link manager to remove this link
        });
    }
}

class GreenParticle extends Particle {
    constructor(x, y, radius = 6) {
        super(x, y, radius, 'green');
        // Green particles have a constant forward thrust
        this.thrustForce = 100; // Adjust magnitude as needed
    }

    update(deltaTime) {
        // Apply a constant force in the direction of its velocity
        const direction = normalizeVector(this.vel);
        const force = multVector(direction, this.thrustForce);
        if (magVector(this.vel) < 0.1) { // If it's almost still, give it a nudge
             this.applyForce({x: random(-1,1) * this.thrustForce, y: random(-1,1) * this.thrustForce});
        } else {
            this.applyForce(force);
        }
        super.update(deltaTime);
    }
}

class BlueLagonParticle extends Particle {
    constructor(x, y, radius = 7) {
        super(x, y, radius, 'blue lagon');
        this.rotationSpeed = 0.05; // Radians per update
    }

    update(deltaTime) {
        super.update(deltaTime);
        // Rotates liaisons around itself
        this.links.forEach(link => {
            const otherParticle = (link.p1 === this) ? link.p2 : link.p1;
            const relativePos = subVectors(otherParticle.pos, this.pos);
            const angle = Math.atan2(relativePos.y, relativePos.x);
            const newAngle = angle + this.rotationSpeed;
            const dist = magVector(relativePos);
            
            const newRelativePos = {
                x: Math.cos(newAngle) * dist,
                y: Math.sin(newAngle) * dist
            };
            
            otherParticle.pos = addVectors(this.pos, newRelativePos);
            // Ensure the other particle's velocity is also updated to reflect this movement
            // This is a simplification; a proper physics update would involve forces.
            // For now, we directly set position. This might lead to jittering or instability if not handled carefully.
        });
    }
}

class RedParticle extends Particle {
    constructor(x, y, radius = 8) {
        super(x, y, radius, 'red');
    }

    // Specific behavior for RedParticle will be handled during collision in the main simulation logic,
    // as it needs to interact with the global list of links and other particles.
}

class GreyParticle extends Particle {
    constructor(x, y, radius = 5) {
        super(x, y, radius, 'grey', 5); // Can have 5 liaisons
    }
}

class YellowParticle extends Particle {
    constructor(x, y, radius = 6) {
        super(x, y, radius, 'yellow', 1); // Max 1 link, color yellow
    }

    // Special interaction logic will be in main.js handleCollisions
} 