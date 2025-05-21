class Link {
    constructor(p1, p2, stiffness = 0.05, naturalLength = 50, maxLength = 75) {
        this.p1 = p1;
        this.p2 = p2;
        this.stiffness = stiffness; // Spring constant
        this.naturalLength = naturalLength; // Rest length of the spring
        this.maxLength = maxLength; // Maximum allowed length before link becomes rigid
        this.id = Math.random().toString(36).substr(2, 9) + '-' + p1.id + '-' + p2.id; // Unique ID
        this.color = 'rgba(200, 200, 200, 0.5)';
    }

    applyForce() {
        let directionVec = subVectors(this.p2.pos, this.p1.pos);
        let currentLength = magVector(directionVec);

        if (currentLength === 0) return; // Avoid division by zero if particles are at the exact same spot

        let unitDirection = normalizeVector(directionVec);

        // Max length constraint handling (position and velocity correction)
        if (currentLength > this.maxLength) {
            const extensionOverlap = currentLength - this.maxLength;

            // 1. Correct positions to enforce maxLength
            // For simplicity, distribute correction equally. A mass-based distribution is also possible.
            const posCorrectionMagnitude = extensionOverlap / 2;
            this.p1.pos = addVectors(this.p1.pos, multVector(unitDirection, posCorrectionMagnitude)); // p1 moves towards p2
            this.p2.pos = subVectors(this.p2.pos, multVector(unitDirection, posCorrectionMagnitude)); // p2 moves towards p1

            // 2. Adjust velocities to prevent further separation along the link axis
            const relVel = subVectors(this.p2.vel, this.p1.vel); // Relative velocity of p2 with respect to p1
            const velAlongLink = dotProduct(relVel, unitDirection); // Component of relative velocity along the link direction (p1 to p2)

            if (velAlongLink > 0) { // If they are moving apart along the link direction
                const invMass1 = (this.p1.mass === 0) ? 0 : 1 / this.p1.mass; // Avoid division by zero if mass is zero
                const invMass2 = (this.p2.mass === 0) ? 0 : 1 / this.p2.mass;
                
                if (invMass1 + invMass2 > 0) { // Proceed only if at least one particle has mass / can move
                    const restitutionAtMaxLength = 0.0; // Make it an inelastic stop/correction at max length

                    // Calculate impulse J = -(1+e)*v_rel_normal / (1/m1 + 1/m2)
                    // Here, v_rel_normal is velAlongLink (dot(v2-v1, unitDir))
                    const impulseScalar = -(1 + restitutionAtMaxLength) * velAlongLink / (invMass1 + invMass2);

                    // Apply impulse: v1_new = v1 + (J/m1)*unitDir, v2_new = v2 - (J/m2)*unitDir
                    this.p1.vel = subVectors(this.p1.vel, multVector(unitDirection, impulseScalar * invMass1));
                    this.p2.vel = addVectors(this.p2.vel, multVector(unitDirection, impulseScalar * invMass2));
                }
            }
            // Update currentLength and directionVec for subsequent spring force calculation based on corrected positions
            directionVec = subVectors(this.p2.pos, this.p1.pos);
            currentLength = magVector(directionVec); // This should be very close to maxLength now
            if (currentLength === 0) unitDirection = {x:0, y:0}; // Avoid normalizing zero vector if somehow they overlap perfectly
            else unitDirection = normalizeVector(directionVec);
        }

        // Standard spring force calculation (always active)
        // Applied based on the (potentially) corrected length.
        if (currentLength > 0) { // only apply spring force if there is some length
            const displacement = currentLength - this.naturalLength;
            const forceMagnitude = this.stiffness * displacement;
            const springForce = multVector(unitDirection, forceMagnitude); // unitDirection from p1 to p2

            this.p1.applyForce(springForce);
            this.p2.applyForce(multVector(springForce, -1));
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.p1.pos.x, this.p1.pos.y);
        ctx.lineTo(this.p2.pos.x, this.p2.pos.y);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
    }

    containsParticle(particle) {
        return this.p1 === particle || this.p2 === particle;
    }
} 