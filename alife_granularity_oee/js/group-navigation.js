document.addEventListener('DOMContentLoaded', () => {
    const sectionsWrapper = document.querySelector('.scroll-sections-wrapper');
    const sections = Array.from(document.querySelectorAll('.scroll-section'));
    const scrollIndicator = document.querySelector('.scroll-indicator');
    let currentSectionIndex = 0;
    let isThrottled = false;
    const throttleDuration = 1000; // ms, adjust to match CSS transition

    if (!sectionsWrapper || sections.length === 0) {
        // Not a group page or no sections, so do nothing.
        if(scrollIndicator) scrollIndicator.style.display = 'none';
        return;
    }

    function updateIndicator() {
        if (!scrollIndicator) return;
        if (currentSectionIndex >= sections.length - 1) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '1';
        }
    }

    function scrollToSection(index) {
        if (index < 0 || index >= sections.length) return;

        // Remove 'active' from current section
        if (sections[currentSectionIndex]) {
            sections[currentSectionIndex].classList.remove('active');
        }
        
        // Add 'active' to new section
        sections[index].classList.add('active');
        
        currentSectionIndex = index;
        updateIndicator();
    }

    function changeSection(direction) {
        if (isThrottled) return;
        isThrottled = true;

        const nextIndex = currentSectionIndex + direction;
        if (nextIndex >= 0 && nextIndex < sections.length) {
            scrollToSection(nextIndex);
        }

        setTimeout(() => {
            isThrottled = false;
        }, throttleDuration);
    }

    // Initial setup
    if (sections.length > 0) {
        sections.forEach((sec, i) => {
            if (i === 0) {
                sec.classList.add('active'); // Activate the first section
            } else {
                sec.classList.remove('active'); // Ensure others are not active
            }
        });
        currentSectionIndex = 0; // Explicitly set after loop
        updateIndicator(); // Update indicator based on the initial active section
    } else {
       if(scrollIndicator) scrollIndicator.style.display = 'none';
    }


    // Event Listeners
    document.addEventListener('wheel', (event) => {
        if (Math.abs(event.deltaY) < 20) return; // Ignore small wheel movements
        changeSection(event.deltaY > 0 ? 1 : -1);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            changeSection(1);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            changeSection(-1);
        }
    });

    // Touch navigation (simple swipe up/down)
    let touchstartY = 0;
    let touchendY = 0;

    document.addEventListener('touchstart', function(event) {
        touchstartY = event.changedTouches[0].screenY;
    }, {passive: true});

    document.addEventListener('touchend', function(event) {
        touchendY = event.changedTouches[0].screenY;
        handleSwipe();
    }, {passive: true});

    function handleSwipe() {
        if (isThrottled) return;
        const swipeThreshold = 50; // Minimum pixels for a swipe
        if (touchstartY - touchendY > swipeThreshold) { // Swiped up
            changeSection(1);
        }
        if (touchendY - touchstartY > swipeThreshold) { // Swiped down
            changeSection(-1);
        }
    }
}); 