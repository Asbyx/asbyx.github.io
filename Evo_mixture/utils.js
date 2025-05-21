// Utility functions

// Vector operations
function addVectors(v1, v2) {
    return { x: v1.x + v2.x, y: v1.y + v2.y };
}

function subVectors(v1, v2) {
    return { x: v1.x - v2.x, y: v1.y - v2.y };
}

function multVector(v, scalar) {
    return { x: v.x * scalar, y: v.y * scalar };
}

function divVector(v, scalar) {
    if (scalar === 0) return { x: 0, y: 0 }; // Avoid division by zero
    return { x: v.x / scalar, y: v.y / scalar };
}

function magVector(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
}

function normalizeVector(v) {
    const m = magVector(v);
    if (m === 0) return { x: 0, y: 0 };
    return { x: v.x / m, y: v.y / m };
}

function dotProduct(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
}

function distance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

// Randomness
function random(min, max) {
    if (max === undefined) {
        max = min;
        min = 0;
    }
    return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
    if (max === undefined) {
        max = min;
        min = 0;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomColor() {
    const r = randomInt(255);
    const g = randomInt(255);
    const b = randomInt(255);
    return `rgb(${r},${g},${b})`;
}

// Function to get a color by name or hex (simple version)
function getColor(name) {
    const colors = {
        green: 'rgb(0, 255, 0)',
        'blue lagon': 'rgb(0, 127, 255)', // A nice blue
        blue: 'rgb(0, 0, 255)',
        red: 'rgb(255, 0, 0)',
        grey: 'rgb(128, 128, 128)',
        gray: 'rgb(128, 128, 128)',
        white: 'rgb(255, 255, 255)',
        black: 'rgb(0, 0, 0)'
    };
    return colors[name.toLowerCase()] || name; // return hex/rgb if name not found
}

// Clamp function
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
} 