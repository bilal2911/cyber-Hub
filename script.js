/* ==========================================================================
   Cyber Hub Services - Interactive JS Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Preloader Handler ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }, 600); // Premium smooth delay
    });


    // --- 2. Sticky Header Toggles ---
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });


    // --- 3. Mobile Navigation Drawer ---
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mobileDrawer = document.querySelector('.mobile-drawer');
    const drawerOverlay = document.querySelector('.drawer-overlay');
    const drawerClose = document.querySelector('.drawer-close');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    function openDrawer() {
        mobileDrawer.classList.add('open');
        drawerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scroll
    }

    function closeDrawer() {
        mobileDrawer.classList.remove('open');
        drawerOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Unlock scroll
    }

    if (navToggle) navToggle.addEventListener('click', openDrawer);
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);
    
    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeDrawer();
        });
    });


    // --- 4. Services Tab Filters ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const serviceCards = document.querySelectorAll('.service-card');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');

            serviceCards.forEach(card => {
                const cardCat = card.getAttribute('data-cat');
                
                if (category === 'all' || cardCat === category) {
                    card.style.display = 'flex';
                    // Retrigger entrance animations smoothly
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                }
            });
        });
    });


    // --- 5. Accordion Interactive Engine (Required Docs & FAQs) ---
    function setupAccordions(headerSelector, itemSelector, contentSelector, iconClassActive) {
        const headers = document.querySelectorAll(headerSelector);

        headers.forEach(header => {
            header.addEventListener('click', () => {
                const item = header.closest(itemSelector);
                const content = item.querySelector(contentSelector);
                const isOpen = item.classList.contains('active');

                // Close siblings of the same group for a clean layout
                const siblings = item.parentNode.querySelectorAll(itemSelector);
                siblings.forEach(sib => {
                    sib.classList.remove('active');
                    const sibContent = sib.querySelector(contentSelector);
                    if (sibContent) sibContent.style.maxHeight = null;
                });

                if (!isOpen) {
                    item.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + 'px';
                } else {
                    item.classList.remove('active');
                    content.style.maxHeight = null;
                }
            });
        });
    }

    // Initialize required documents list accordions
    setupAccordions('.accordion-header', '.accordion-item', '.accordion-content');
    
    // Initialize FAQs list accordions
    setupAccordions('.faq-header', '.faq-item', '.faq-content');


    // --- 6. Services Directory Smart Search Engine ---
    const servicesIndex = [
        { name: "Aadhaar Name Change", id: "aadhaar-name", tags: ["aadhaar", "name", "correction", "update", "spelling", "identity"] },
        { name: "Aadhaar DOB Correction", id: "aadhaar-dob", tags: ["aadhaar", "dob", "birth", "marksheet", "date", "age"] },
        { name: "Aadhaar Photo Update", id: "aadhaar-photo", tags: ["aadhaar", "photo", "biometric", "face", "fingerprint"] },
        { name: "New PAN Card Application", id: "new-pan", tags: ["pan", "new pan", "nsdl", "tax number", "identity"] },
        { name: "PAN Card Correction", id: "pan-correction", tags: ["pan", "correction", "change pan", "update pan", "signature"] },
        { name: "Home Loan Assistance", id: "home-loan", tags: ["home loan", "housing", "flat loan", "makan", "property"] },
        { name: "Car/Bike Vehicle Loan", id: "vehicle-loan", tags: ["car loan", "bike loan", "vehicle", "two wheeler", "auto"] },
        { name: "Business/Personal Loan", id: "business-loan", tags: ["business loan", "personal loan", "collateral", "capital", "cash"] },
        { name: "Loan Against Property", id: "property-loan", tags: ["property loan", "lap", "registry", "plot loan", "commercial"] }
    ];

    const heroSearchInput = document.getElementById('hero-search-input');
    const searchSuggestions = document.getElementById('search-suggestions');

    if (heroSearchInput) {
        heroSearchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            searchSuggestions.innerHTML = '';

            if (query.length < 2) {
                searchSuggestions.classList.remove('active');
                return;
            }

            const matches = servicesIndex.filter(service => 
                service.name.toLowerCase().includes(query) || 
                service.tags.some(tag => tag.includes(query))
            );

            if (matches.length > 0) {
                searchSuggestions.classList.add('active');
                matches.forEach(match => {
                    const item = document.createElement('div');
                    item.className = 'suggestion-item';
                    
                    let catName = 'Cyber Cafe';
                    if (match.id.includes('loan')) catName = 'Loans';
                    else if (match.id.includes('aadhaar') || match.id.includes('pan')) catName = 'Govt Doc';

                    item.innerHTML = `
                        <span>${match.name}</span>
                        <span class="s-badge">${catName}</span>
                    `;
                    
                    item.addEventListener('click', () => {
                        triggerAccordionFocus(match.id);
                        searchSuggestions.classList.remove('active');
                        heroSearchInput.value = '';
                    });

                    searchSuggestions.appendChild(item);
                });
            } else {
                const noMatchItem = document.createElement('div');
                noMatchItem.className = 'suggestion-item';
                noMatchItem.style.cursor = 'default';
                noMatchItem.innerHTML = '<span>No matching service found</span>';
                searchSuggestions.appendChild(noMatchItem);
                searchSuggestions.classList.add('active');
            }
        });

        // Hide search suggestion box when clicking outside
        document.addEventListener('click', (e) => {
            if (!heroSearchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
                searchSuggestions.classList.remove('active');
            }
        });
    }

    // Global utility to scroll, open, and highlight document accordions
    function triggerAccordionFocus(serviceId) {
        const accordionItem = document.getElementById(`accordion-${serviceId}`);
        if (accordionItem) {
            // Scroll to container
            const offsetTop = accordionItem.getBoundingClientRect().top + window.pageYOffset - 120;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            // Expand accordion
            const headerBtn = accordionItem.querySelector('.accordion-header');
            const content = accordionItem.querySelector('.accordion-content');
            
            // Close other accordions
            const allItems = document.querySelectorAll('.accordion-item');
            allItems.forEach(item => {
                item.classList.remove('active');
                const c = item.querySelector('.accordion-content');
                if (c) c.style.maxHeight = null;
            });

            accordionItem.classList.add('active');
            content.style.maxHeight = content.scrollHeight + 'px';

            // Glow micro-animation reveal
            accordionItem.classList.add('highlight-focus');
            setTimeout(() => {
                accordionItem.classList.remove('highlight-focus');
            }, 2500);
        }
    }

    // Set trigger bindings on Service Card "Check Documents" anchors
    const selectAccordionTriggers = document.querySelectorAll('.select-accordion-trigger');
    selectAccordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const serviceId = trigger.getAttribute('data-service');
            if (serviceId) {
                triggerAccordionFocus(serviceId);
            }
        });
    });


    // --- 7. Multi-Step Loan Inquiry Modal Wizard ---
    const openModalBtns = document.querySelectorAll('.open-modal-btn');
    const loanModal = document.getElementById('loan-modal');
    const modalClose = document.querySelector('.modal-close');
    const formSteps = document.querySelectorAll('.step-pane');
    const stepDots = document.querySelectorAll('.step-dot');
    const stepLines = document.querySelectorAll('.step-line');
    const modalForm = document.getElementById('modal-loan-form');
    const btnNexts = document.querySelectorAll('.btn-next');
    const btnPrevs = document.querySelectorAll('.btn-prev');
    const selectLoanType = document.getElementById('modal-loan-type');

    let currentStep = 1;

    function openModal(preSelectedCategory = null) {
        loanModal.classList.add('open');
        document.body.style.overflow = 'hidden';
        resetModalWizard();
        
        if (preSelectedCategory && selectLoanType) {
            selectLoanType.value = preSelectedCategory;
        }
    }

    function closeModal() {
        loanModal.classList.remove('open');
        document.body.style.overflow = '';
    }

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            openModal();
        });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    
    // Also allow closing modal by clicking greyed overlay directly
    if (loanModal) {
        loanModal.addEventListener('click', (e) => {
            if (e.target === loanModal) {
                closeModal();
            }
        });
    }

    function resetModalWizard() {
        currentStep = 1;
        updateStepUI();
        modalForm.reset();
    }

    function updateStepUI() {
        formSteps.forEach((pane, idx) => {
            if (idx + 1 === currentStep) {
                pane.classList.add('active');
            } else {
                pane.classList.remove('active');
            }
        });

        // Update Dots
        stepDots.forEach((dot, idx) => {
            const stepNum = idx + 1;
            dot.classList.remove('active', 'completed');
            if (stepNum === currentStep) {
                dot.classList.add('active');
            } else if (stepNum < currentStep) {
                dot.classList.add('completed');
            }
        });

        // Update lines
        stepLines.forEach((line, idx) => {
            const stepNum = idx + 1;
            line.classList.remove('completed');
            if (stepNum < currentStep) {
                line.classList.add('completed');
            }
        });
    }

    // Step verification validation check before continuing
    function validateStep(step) {
        const activePane = document.querySelector(`.step-pane[data-step="${step}"]`);
        const inputs = activePane.querySelectorAll('input, select, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.checkValidity()) {
                input.reportValidity();
                isValid = false;
            }
        });

        return isValid;
    }

    btnNexts.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                currentStep++;
                updateStepUI();
            }
        });
    });

    btnPrevs.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                updateStepUI();
            }
        });
    });


    // --- 8. Dynamic Toast Notifications ---
    const toast = document.getElementById('toast');
    const toastTitle = document.getElementById('toast-title');
    const toastBody = document.getElementById('toast-body');

    function triggerSuccessToast(title, body) {
        toastTitle.textContent = title;
        toastBody.textContent = body;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 5000);
    }


    // --- 9. Bilingual Form Submit Redirection and WhatsApp Compilers ---
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('form-name').value;
            const phone = document.getElementById('form-phone').value;
            const service = document.getElementById('form-service').value;
            const message = document.getElementById('form-message').value;

            // Trigger beautiful offline toast simulation
            triggerSuccessToast(
                "Inquiry Received!",
                "Our Delhi office will review requirements and call you soon."
            );

            // Redirect user to WhatsApp with a prefilled template of their exact credentials!
            setTimeout(() => {
                const whatsappText = encodeURIComponent(
                    `*Cyber Hub Services Inquiry*\n\n` +
                    `*Client Name:* ${name}\n` +
                    `*Mobile No:* ${phone}\n` +
                    `*Required Service:* ${service}\n` +
                    `*Specific Query:* ${message}\n\n` +
                    `Please advise on next steps and document filings.`
                );
                window.open(`https://wa.me/919891067013?text=${whatsappText}`, '_blank');
            }, 1200);

            contactForm.reset();
        });
    }

    if (modalForm) {
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('modal-name').value;
            const phone = document.getElementById('modal-phone').value;
            const loanType = document.getElementById('modal-loan-type').value;
            const amount = document.getElementById('modal-amount').value;
            const occupation = document.getElementById('modal-occupation').value;

            closeModal();
            triggerSuccessToast(
                "Loan Application Filed!",
                "We are checking eligibility criteria now."
            );

            // Formulate WhatsApp message to bank operators
            setTimeout(() => {
                const whatsappText = encodeURIComponent(
                    `*New Loan Pre-Approval Request*\n\n` +
                    `*Name:* ${name}\n` +
                    `*Contact Number:* ${phone}\n` +
                    `*Loan Category:* ${loanType}\n` +
                    `*Estimated Amount:* ${amount}\n` +
                    `*Occupation Type:* ${occupation}\n\n` +
                    `Please check bank tie-up eligibility profiles for me.`
                );
                window.open(`https://wa.me/919891067013?text=${whatsappText}`, '_blank');
            }, 1200);

            resetModalWizard();
        });
    }


    // --- 10. CSS Intersection Scroll Reveal Observer ---
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Once revealed, no need to keep observing
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before scrolling onto screen
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

});
