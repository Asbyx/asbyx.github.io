document.addEventListener('DOMContentLoaded', () => {
    console.log('Main page script loaded.');
    // Placeholder for any main page specific animations or interactions

    const navCards = document.querySelectorAll('.nav-card');
    navCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 15; // Adjusted sensitivity
            const rotateY = (centerX - x) / 15; // Adjusted sensitivity

            // Apply hover effects + 3D rotation
            card.style.transform = `perspective(1000px) translateY(-10px) scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            card.style.transition = 'transform 0.1s linear'; // Faster transition for mousemove
        });

        card.addEventListener('mouseleave', () => {
            // Remove inline styles to revert to CSS-defined hover or base state
            card.style.transform = '';
            card.style.transition = ''; // Revert to CSS transition
        });

        // No explicit mouseenter needed if CSS handles initial hover and mouseleave resets to CSS control
    });
}); 