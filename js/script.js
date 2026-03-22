document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       Mobile Menu Toggle Logic
       ========================================================================== */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinksList = document.querySelectorAll('.nav-link');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking a link
        navLinksList.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    /* ==========================================================================
       Services Carousel Logic
       ========================================================================== */
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.next-btn');
    const prevButton = document.querySelector('.prev-btn');
    const dotsNav = document.querySelector('.carousel-nav');

    // Make it responsive: determine how many slides fit per view
    function getSlidesPerView() {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 992) return 2;
        return 3;
    }

    let slidesPerView = getSlidesPerView();
    let currentIndex = 0;

    // Create dots based on the number of pages needed
    function updateDots() {
        dotsNav.innerHTML = '';
        const totalPages = slides.length - slidesPerView + 1;
        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-indicator');
            if (i === currentIndex) dot.classList.add('current-indicator');
            dotsNav.appendChild(dot);
        }

        // Add event listeners to newly created dots
        const dots = Array.from(dotsNav.children);
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
        });
    }

    function setSlideWidths() {
        slidesPerView = getSlidesPerView();
        const slideWidth = 100 / slidesPerView;
        slides.forEach(slide => {
            slide.style.minWidth = `${slideWidth}%`;
        });
        // Adjust track position if resizing window breaks index
        if (currentIndex > slides.length - slidesPerView) {
            currentIndex = slides.length - slidesPerView;
        }
        if(currentIndex < 0) currentIndex = 0;
        
        goToSlide(currentIndex);
        updateDots();
    }

    function goToSlide(index) {
        if(index < 0 || index > slides.length - slidesPerView) return;
        
        currentIndex = index;
        const slideWidthPercentage = 100 / slidesPerView;
        const transformValue = -(slideWidthPercentage * currentIndex);
        track.style.transform = `translateX(${transformValue}%)`;

        // Update dots
        const dots = Array.from(dotsNav.children);
        dots.forEach(d => d.classList.remove('current-indicator'));
        if(dots[currentIndex]) {
            dots[currentIndex].classList.add('current-indicator');
        }

        // Update buttons state
        prevButton.style.opacity = currentIndex === 0 ? '0.5' : '1';
        prevButton.style.cursor = currentIndex === 0 ? 'not-allowed' : 'pointer';
        
        const isAtEnd = currentIndex === slides.length - slidesPerView;
        nextButton.style.opacity = isAtEnd ? '0.5' : '1';
        nextButton.style.cursor = isAtEnd ? 'not-allowed' : 'pointer';
    }

    // Initialize
    setSlideWidths();
    window.addEventListener('resize', setSlideWidths);

    nextButton.addEventListener('click', () => {
        if (currentIndex < slides.length - slidesPerView) {
            goToSlide(currentIndex + 1);
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
        }
    });


    /* ==========================================================================
       Modal Open / Close Logic
       ========================================================================== */
    const modal = document.getElementById('inquiry-modal');
    const heroStartBtn = document.getElementById('hero-start-btn');
    const navContactBtn = document.getElementById('nav-contact-btn');
    const ctaStartBtn = document.getElementById('cta-start-btn');
    
    const closeBtn = document.getElementById('modal-close-icon');
    const cancelBtn = document.getElementById('modal-cancel-btn');

    function openModal(e) {
        if(e) e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Event Listeners for opening
    if(heroStartBtn) heroStartBtn.addEventListener('click', openModal);
    if(navContactBtn) navContactBtn.addEventListener('click', openModal);
    if(ctaStartBtn) ctaStartBtn.addEventListener('click', openModal);

    // Event Listeners for closing
    if(closeBtn) closeBtn.addEventListener('click', closeModal);
    if(cancelBtn) cancelBtn.addEventListener('click', closeModal);
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });


    /* ==========================================================================
       Dynamic Requested Features Logic
       ========================================================================== */
    const featuresContainer = document.getElementById('features-container');
    const addFeatureBtn = document.getElementById('add-feature-btn');

    function createFeatureRow() {
        const row = document.createElement('div');
        row.className = 'feature-row';
        row.innerHTML = `
            <input type="text" name="features[]" placeholder="Enter Another Feature" class="feature-input" required>
            <button type="button" class="btn-icon remove-feature"><i class="fa-solid fa-trash"></i></button>
        `;
        return row;
    }

    function updateRemoveButtons() {
        const rows = featuresContainer.querySelectorAll('.feature-row');
        const removeBtns = featuresContainer.querySelectorAll('.remove-feature');
        
        // Disable remove button if there's only one row left
        if (rows.length === 1) {
            removeBtns[0].disabled = true;
        } else {
            removeBtns.forEach(btn => btn.disabled = false);
        }
    }

    addFeatureBtn.addEventListener('click', () => {
        const newRow = createFeatureRow();
        featuresContainer.appendChild(newRow);
        
        // Setup remove event for new button
        const removeBtn = newRow.querySelector('.remove-feature');
        removeBtn.addEventListener('click', () => {
            featuresContainer.removeChild(newRow);
            updateRemoveButtons();
        });
        
        updateRemoveButtons();
        
        // Focus the new input
        newRow.querySelector('input').focus();
    });

    // Setup initial remove button logic (even though it's disabled initially)
    updateRemoveButtons();


    /* ==========================================================================
       Form Submission Simulation
       ========================================================================== */
    const form = document.getElementById('inquiry-form');
    const successMessage = document.getElementById('success-message');
    const closeSuccessBtn = document.getElementById('close-success-btn');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simulate loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Simulate network request delay
        setTimeout(() => {
            form.style.display = 'none';
            successMessage.classList.remove('hidden');
            
            // Reset button state for next time
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });

    closeSuccessBtn.addEventListener('click', () => {
        closeModal();
        // Reset form after closing
        setTimeout(() => {
            form.reset();
            form.style.display = 'block';
            successMessage.classList.add('hidden');
            
            // Reset feature rows to just 1
            const rows = featuresContainer.querySelectorAll('.feature-row');
            for(let i = 1; i < rows.length; i++) {
                featuresContainer.removeChild(rows[i]);
            }
            updateRemoveButtons();
        }, 300); // Wait for modal animation to finish
    });
});
