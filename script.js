/* -------------------------------------------------------------
 * Balaji Solar Interaction Scripts
 * handles mobile menu, sticky nav, FAQ accordion, testimonials slider,
 * gallery filters, lightbox preview, scroll reveal, scrollspy,
 * and contact form validation.
 * ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Sticky Header scroll detector
    const header = document.getElementById('main-header');
    
    const handleHeaderScroll = () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll(); // Trigger immediately in case page is refreshed scrolled down

    // 2. Mobile Drawer Navigation Controller
    const mobileToggle = document.getElementById('mobile-toggle');
    const drawerClose = document.getElementById('drawer-close');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    const openDrawer = () => {
        mobileDrawer.classList.add('open');
        drawerOverlay.classList.add('open');
        document.body.style.overflow = 'hidden'; // prevent background scrolling
        // Update bar toggle color to dark on overlay open
        mobileToggle.querySelectorAll('.bar').forEach(bar => bar.style.backgroundColor = '#FFFFFF');
    };

    const closeDrawer = () => {
        mobileDrawer.classList.remove('open');
        drawerOverlay.classList.remove('open');
        document.body.style.overflow = ''; // restore scrolling
    };

    mobileToggle.addEventListener('click', openDrawer);
    drawerClose.addEventListener('click', closeDrawer);
    drawerOverlay.addEventListener('click', closeDrawer);

    // Close drawer when any nav link inside it is clicked
    drawerLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });

    // 3. Scroll Reveal Animation (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Reveal once
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        const revealOnScroll = () => {
            revealElements.forEach(el => {
                const elementTop = el.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                if (elementTop < windowHeight - 50) {
                    el.classList.add('visible');
                }
            });
        };
        window.addEventListener('scroll', revealOnScroll);
        revealOnScroll();
    }

    // 4. Product CTA Selection Helper (Form Autocomplete)
    const productCtas = document.querySelectorAll('.product-cta');
    const interestSelect = document.getElementById('form-interest');

    productCtas.forEach(cta => {
        cta.addEventListener('click', (e) => {
            const product = e.target.getAttribute('data-product');
            if (product) {
                // Find matching value inside select dropdown options
                if (product.includes('Water Heater')) {
                    interestSelect.value = 'Solar Water Heater (ETC)'; // Default to ETC
                } else if (product.includes('Solar Panels')) {
                    interestSelect.value = 'Residential Solar Panels';
                }
            }
        });
    });

    // 5. Filterable Gallery Logic
    const filterBtns = document.querySelectorAll('.gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from other buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            e.target.classList.add('active');

            const filterValue = e.target.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    // Show item
                    item.classList.remove('hide');
                    // Add subtle entry animation
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                        item.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                    }, 50);
                } else {
                    // Hide item
                    item.classList.add('hide');
                }
            });
        });
    });

    // 6. Interactive Lightbox Preview Modal
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const galleryImages = document.querySelectorAll('.gallery-img-box');

    galleryImages.forEach(box => {
        box.addEventListener('click', () => {
            const img = box.querySelector('.gallery-img');
            const title = box.querySelector('.gallery-item-title').innerText;
            const location = box.querySelector('.gallery-item-loc').innerText;
            
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxCaption.innerText = `${title} - ${location}`;
            
            lightboxModal.classList.add('show');
            lightboxModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Lock scrolling
        });
    });

    const closeLightbox = () => {
        lightboxModal.classList.remove('show');
        lightboxModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Unlock scrolling
    };

    lightboxClose.addEventListener('click', closeLightbox);
    
    // Close lightbox on clicking dark backdrop overlay
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            closeLightbox();
        }
    });

    // Close lightbox on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxModal.classList.contains('show')) {
            closeLightbox();
        }
    });

    // 7. FAQ Accordion Collapse/Expand Logic
    const accordionHeaders = document.querySelectorAll('.accordion-title');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isOpen = item.classList.contains('active');

            // Collapse other accordion items
            document.querySelectorAll('.accordion-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.accordion-title').setAttribute('aria-expanded', 'false');
            });

            if (!isOpen) {
                item.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // 8. Testimonial Slider Transitions
    const testimonialsSlider = document.getElementById('testimonials-slider');
    const sliderNavBtns = document.querySelectorAll('.slider-nav-btn');
    let currentSlide = 0;
    let autoPlayInterval;

    const goToSlide = (slideIndex) => {
        currentSlide = slideIndex;
        // Translate slider container
        testimonialsSlider.style.transform = `translateX(-${slideIndex * 33.3333}%)`;
        
        // Highlight active nav indicator
        sliderNavBtns.forEach((btn, idx) => {
            if (idx === slideIndex) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    };

    // Nav dot clicks
    sliderNavBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            clearInterval(autoPlayInterval); // pause autoplay on interaction
            const slideIndex = parseInt(e.target.getAttribute('data-slide'));
            goToSlide(slideIndex);
            startAutoplay(); // resume autoplay
        });
    });

    const startAutoplay = () => {
        autoPlayInterval = setInterval(() => {
            let nextSlide = (currentSlide + 1) % 3;
            goToSlide(nextSlide);
        }, 6000); // Change slides every 6 seconds
    };

    startAutoplay();

    // 9. Lead Generation Form Submission and Input Validation
    const contactForm = document.getElementById('lead-contact-form');
    const toastSuccess = document.getElementById('form-toast');
    const submitBtn = document.getElementById('form-submit-btn');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Fetch inputs
        const nameInput = document.getElementById('form-name');
        const phoneInput = document.getElementById('form-phone');
        const cityInput = document.getElementById('form-city');
        const interestInput = document.getElementById('form-interest');
        const messageInput = document.getElementById('form-msg');

        let isValid = true;

        // Reset errors
        document.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.form-control').forEach(el => {
            el.style.borderColor = '';
            el.style.boxShadow = '';
        });

        // Name Validation (at least 3 characters)
        if (nameInput.value.trim().length < 3) {
            showError(nameInput, 'name-error');
            isValid = false;
        }

        // Phone Validation (exactly 10 digits check)
        const cleanPhone = phoneInput.value.replace(/[^0-9]/g, '');
        if (cleanPhone.length !== 10) {
            showError(phoneInput, 'phone-error');
            isValid = false;
        }

        // City Validation (required)
        if (cityInput.value.trim() === '') {
            showError(cityInput, 'city-error');
            isValid = false;
        }

        // Product Selection Validation
        if (interestInput.value === '') {
            showError(interestInput, 'interest-error');
            isValid = false;
        }

        if (isValid) {
            // Simulated submission with loading state
            const originalText = submitBtn.innerText;
            submitBtn.disabled = true;
            submitBtn.innerText = 'Sending Request...';

            setTimeout(() => {
                // Show Success Overlay Toast inside card
                toastSuccess.classList.add('show');
                submitBtn.disabled = false;
                submitBtn.innerText = originalText;
                
                // Clear Form
                contactForm.reset();
                
                // Optional: Fade out success message after 7 seconds to allow refilling
                setTimeout(() => {
                    toastSuccess.classList.remove('show');
                }, 7000);
            }, 1200);
        }
    });

    const showError = (inputEl, errorId) => {
        const errorEl = document.getElementById(errorId);
        if (errorEl) {
            errorEl.style.display = 'block';
        }
        inputEl.style.borderColor = '#DC2626';
        inputEl.style.boxShadow = '0 0 0 4px rgba(220, 38, 38, 0.1)';
    };

    // 10. Scrollspy: Active Link Highlight on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const scrollSpy = () => {
        const scrollPosition = window.scrollY + 120; // offset for header height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', scrollSpy);
    scrollSpy();

});
