// =============================================
// SERVICE CONFIGURATOR - Minimal 8-Step Flow
// Code by Leon
// =============================================

class ServiceConfigurator {
    constructor() {
        // Step flow: 1, feedback-1, 2, 3, feedback-2, 4, 5, feedback-3, 6, 7, processing, 8
        this.stepFlow = [
            '1', 'feedback-1',
            '2', '3', 'feedback-2',
            '4', '5', 'feedback-3',
            '6', '7', 'processing', '8'
        ];
        this.currentIndex = 0;
        this.totalDataSteps = 8; // For progress calculation
        this.answers = {};
        this.additionalNeeds = [];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSavedProgress();
        this.updateUI();
    }

    setupEventListeners() {
        // Option cards (single select)
        document.querySelectorAll('.option-card:not(.multi-select)').forEach(card => {
            card.addEventListener('click', () => this.selectOption(card));
        });

        // Multi-select cards (Step 6)
        document.querySelectorAll('.option-card.multi-select').forEach(card => {
            card.addEventListener('click', () => this.toggleMultiSelect(card));
        });

        // Continue button
        const continueBtn = document.getElementById('btnContinue');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => this.nextStep());
        }

        // Back link
        const backLink = document.querySelector('.back-link');
        if (backLink) {
            backLink.addEventListener('click', (e) => {
                if (this.currentIndex > 0) {
                    e.preventDefault();
                    this.previousStep();
                }
            });
        }

        // Form validation for Step 7
        const form = document.getElementById('contactForm');
        if (form) {
            form.addEventListener('input', () => this.validateForm());
        }

        // Close button
        const closeBtn = document.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleClose();
            });
        }

        // Modal buttons
        const saveAndExitBtn = document.getElementById('saveAndExitBtn');
        if (saveAndExitBtn) {
            saveAndExitBtn.addEventListener('click', () => this.handleSaveAndExit());
        }

        const exitAndResetBtn = document.getElementById('exitAndResetBtn');
        if (exitAndResetBtn) {
            exitAndResetBtn.addEventListener('click', () => this.handleExitAndReset());
        }

        const cancelModalBtn = document.getElementById('cancelModalBtn');
        if (cancelModalBtn) {
            cancelModalBtn.addEventListener('click', () => this.hideSaveInfoModal());
        }

        // Close modal on backdrop click
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
            modalBackdrop.addEventListener('click', () => this.hideSaveInfoModal());
        }
    }

    selectOption(card) {
        const step = card.closest('.step');
        const stepId = step.dataset.step;

        // Deselect other cards in this step
        step.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));

        // Select this card
        card.classList.add('selected');

        // Save answer
        this.answers[stepId] = card.dataset.value;
        this.saveProgress();

        // Enable continue button
        this.enableContinue();
    }

    toggleMultiSelect(card) {
        card.classList.toggle('selected');

        // Update additionalNeeds array
        const value = card.dataset.value;
        if (card.classList.contains('selected')) {
            if (!this.additionalNeeds.includes(value)) {
                this.additionalNeeds.push(value);
            }
        } else {
            this.additionalNeeds = this.additionalNeeds.filter(v => v !== value);
        }

        this.saveProgress();
        // Multi-select step always allows continue (even with 0 selections)
        this.enableContinue();
    }

    validateForm() {
        const name = document.getElementById('userName')?.value.trim();
        const email = document.getElementById('userEmail')?.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (name && email && emailRegex.test(email)) {
            this.enableContinue();
        } else {
            this.disableContinue();
        }
    }

    enableContinue() {
        const btn = document.getElementById('btnContinue');
        if (btn) btn.disabled = false;
    }

    disableContinue() {
        const btn = document.getElementById('btnContinue');
        if (btn) btn.disabled = true;
    }

    nextStep() {
        const currentStepId = this.stepFlow[this.currentIndex];

        // If on contact form, save the data
        if (currentStepId === '7') {
            this.answers.contact = {
                name: document.getElementById('userName')?.value.trim(),
                email: document.getElementById('userEmail')?.value.trim(),
                phone: document.getElementById('userPhone')?.value.trim(),
                business: document.getElementById('businessName')?.value.trim()
            };
            this.saveProgress();
        }

        // Move to next step
        if (this.currentIndex < this.stepFlow.length - 1) {
            this.currentIndex++;
            this.updateUI();

            // If we're now on processing, run the animation
            if (this.stepFlow[this.currentIndex] === 'processing') {
                this.runProcessingAnimation();
            }
        }
    }

    previousStep() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateUI();
        }
    }

    updateUI() {
        const currentStepId = this.stepFlow[this.currentIndex];

        // Hide all steps
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active');
        });

        // Show current step
        const currentStep = document.querySelector(`.step[data-step="${currentStepId}"]`);
        if (currentStep) {
            currentStep.classList.add('active');
        }

        // Update progress bar
        this.updateProgress();

        // Update back link text
        const backLink = document.querySelector('.back-link');
        if (backLink) {
            if (this.currentIndex === 0) {
                backLink.textContent = '← Back';
                backLink.href = 'index.html';
            } else {
                backLink.textContent = '← Back';
                backLink.href = '#';
            }
        }

        // Update continue button state
        this.updateContinueState(currentStepId);

        // Hide nav controls on certain steps
        const navControls = document.querySelector('.nav-controls');
        if (navControls) {
            if (currentStepId === '8' || currentStepId === 'processing') {
                navControls.style.display = 'none';
            } else {
                navControls.style.display = 'flex';
            }
        }

        // Update tooltip visibility based on step
        this.updateCloseButtonTooltip();
    }

    updateCloseButtonTooltip() {
        const closeBtn = document.querySelector('.close-btn');
        const tooltip = document.querySelector('.close-btn-tooltip');
        if (!closeBtn || !tooltip) return;

        const currentDataStep = this.getCurrentDataStep();
        
        // Show tooltip only for steps 1-6
        if (currentDataStep <= 6) {
            closeBtn.setAttribute('data-tooltip', 'true');
            closeBtn.setAttribute('title', 'Your progress will be saved');
            tooltip.style.display = 'block';
        } else {
            closeBtn.removeAttribute('data-tooltip');
            closeBtn.removeAttribute('title');
            tooltip.style.display = 'none';
        }
    }

    updateProgress() {
        const progressFill = document.getElementById('progressFill');
        if (!progressFill) return;

        // Calculate progress based on data steps completed
        const dataStepIndex = this.getDataStepIndex();
        const progress = (dataStepIndex / this.totalDataSteps) * 100;
        progressFill.style.width = `${Math.min(progress, 100)}%`;
    }

    getDataStepIndex() {
        // Map current position to data step (1-8)
        const stepId = this.stepFlow[this.currentIndex];
        const dataStepMapping = {
            '1': 1, 'feedback-1': 1,
            '2': 2, '3': 3, 'feedback-2': 3,
            '4': 4, '5': 5, 'feedback-3': 5,
            '6': 6, '7': 7, 'processing': 7, '8': 8
        };
        return dataStepMapping[stepId] || 1;
    }

    getCurrentDataStep() {
        // Returns the actual data step number (1-8) for close button logic
        return this.getDataStepIndex();
    }

    updateContinueState(stepId) {
        const btn = document.getElementById('btnContinue');
        if (!btn) return;

        // Check if it's a feedback step (auto-enable)
        if (stepId.startsWith('feedback')) {
            this.enableContinue();
            return;
        }

        // Check if it's the multi-select step (always enabled)
        if (stepId === '6') {
            this.enableContinue();
            return;
        }

        // Check if it's the form step
        if (stepId === '7') {
            this.validateForm();
            return;
        }

        // Check if selection exists for this step
        if (this.answers[stepId]) {
            this.enableContinue();
            // Re-select the card
            const step = document.querySelector(`.step[data-step="${stepId}"]`);
            const card = step?.querySelector(`.option-card[data-value="${this.answers[stepId]}"]`);
            if (card) card.classList.add('selected');
        } else {
            this.disableContinue();
        }
    }

    runProcessingAnimation() {
        const items = document.querySelectorAll('.checklist-item');
        let index = 0;

        const animate = () => {
            if (index < items.length) {
                const icon = items[index].querySelector('.checklist-icon');
                icon.textContent = '✓';
                icon.classList.remove('pending');
                icon.classList.add('complete');
                index++;
                setTimeout(animate, 800);
            } else {
                // All done, show recommendation
                setTimeout(() => {
                    this.generateRecommendation();
                    this.currentIndex++;
                    this.updateUI();
                }, 600);
            }
        };

        setTimeout(animate, 500);
    }

    generateRecommendation() {
        // Package recommendation logic
        const presence = this.answers['2'];
        const goal = this.answers['3'];
        const timeline = this.answers['4'];
        const budget = this.answers['5'];

        let packageName = '';
        let priceRange = '';
        let whyReasons = [];
        let features = [];

        // Determine package based on budget primarily
        if (budget === 'budget-low') {
            packageName = '10-Day Launch Site';
            priceRange = 'KES 35,000 - KES 45,000';
            features = [
                '✓ 3-5 Page Custom Site',
                '✓ Mobile-Responsive Design',
                '✓ Contact Forms & WhatsApp',
                '✓ Google Maps & Social Links',
                '✓ 1 Month Free Support'
            ];
        } else if (budget === 'budget-mid') {
            packageName = 'Brand Refresh Package';
            priceRange = 'KES 60,000 - KES 90,000';
            features = [
                '✓ 5-8 Page Custom Site',
                '✓ Brand Identity Consultation',
                '✓ SEO Optimization',
                '✓ Analytics Dashboard',
                '✓ 3 Months Support'
            ];
        } else if (budget === 'budget-high') {
            packageName = 'Premium Solution';
            priceRange = 'KES 120,000+';
            features = [
                '✓ Full Custom Development',
                '✓ E-Commerce Integration',
                '✓ Advanced SEO & Marketing',
                '✓ Admin Dashboard',
                '✓ 6 Months Priority Support'
            ];
        } else {
            packageName = 'Custom Consultation';
            priceRange = "Let's discuss!";
            features = [
                '✓ Free 20-Minute Strategy Call',
                '✓ Personalized Quote',
                '✓ Flexible Payment Options',
                '✓ No Obligation'
            ];
        }

        // Generate why reasons
        if (presence === 'no-website') {
            whyReasons.push('Starting fresh—no old code to fix');
        } else if (presence === 'outdated') {
            whyReasons.push('Modernizing your existing presence');
        } else if (presence === 'diy-site') {
            whyReasons.push('Upgrading from DIY to professional');
        }

        if (timeline === 'asap') {
            whyReasons.push('Fast timeline with rush delivery');
        } else if (timeline === 'flexible') {
            whyReasons.push('Flexible timeline for quality focus');
        }

        if (goal === 'leads') {
            whyReasons.push('Optimized for lead generation');
        } else if (goal === 'credibility') {
            whyReasons.push('Professional design builds trust');
        } else if (goal === 'ecommerce') {
            whyReasons.push('E-commerce ready for online sales');
        } else if (goal === 'portfolio') {
            whyReasons.push('Beautiful gallery to showcase work');
        }

        // Update the UI
        document.getElementById('packageName').textContent = packageName;
        document.getElementById('packagePrice').textContent = priceRange;

        const whyList = document.getElementById('whyList');
        whyList.innerHTML = whyReasons.map(r => `<li>${r}</li>`).join('');

        const includedList = document.getElementById('includedList');
        includedList.innerHTML = features.map(f => `<li>${f}</li>`).join('');
    }

    saveProgress() {
        const data = {
            currentIndex: this.currentIndex,
            answers: this.answers,
            additionalNeeds: this.additionalNeeds
        };
        localStorage.setItem('configurator_progress', JSON.stringify(data));
    }

    loadSavedProgress() {
        const saved = localStorage.getItem('configurator_progress');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.currentIndex = data.currentIndex || 0;
                this.answers = data.answers || {};
                this.additionalNeeds = data.additionalNeeds || [];

                // Restore multi-select selections
                this.additionalNeeds.forEach(value => {
                    const card = document.querySelector(`.option-card[data-value="${value}"]`);
                    if (card) card.classList.add('selected');
                });

                // Restore contact form if on step 7
                if (this.answers.contact) {
                    const { name, email, phone, business } = this.answers.contact;
                    if (document.getElementById('userName')) {
                        document.getElementById('userName').value = name || '';
                        document.getElementById('userEmail').value = email || '';
                        document.getElementById('userPhone').value = phone || '';
                        document.getElementById('businessName').value = business || '';
                    }
                }
            } catch (e) {
                console.error('Error loading saved progress:', e);
            }
        }
    }

    handleClose() {
        const currentDataStep = this.getCurrentDataStep();
        const currentStepId = this.stepFlow[this.currentIndex];

        // Step 8: Show save modal
        if (currentDataStep === 8) {
            this.showSaveInfoModal();
            return;
        }

        // Step 7+ (not 8): Clear progress and exit
        if (currentDataStep === 7 || currentStepId === 'processing') {
            this.clearProgress();
            window.location.href = 'index.html';
            return;
        }

        // Steps 1-6: Preserve progress and exit
        this.saveProgress();
        window.location.href = 'index.html';
    }

    clearProgress() {
        localStorage.removeItem('configurator_progress');
        this.currentIndex = 0;
        this.answers = {};
        this.additionalNeeds = [];
    }

    showSaveInfoModal() {
        const modal = document.getElementById('saveInfoModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    hideSaveInfoModal() {
        const modal = document.getElementById('saveInfoModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    saveContactInfo() {
        // Save only contact information separately
        if (this.answers.contact) {
            localStorage.setItem('configurator_contact', JSON.stringify(this.answers.contact));
        }
    }

    handleSaveAndExit() {
        this.saveContactInfo();
        this.clearProgress();
        window.location.href = 'index.html';
    }

    handleExitAndReset() {
        this.clearProgress();
        window.location.href = 'index.html';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ServiceConfigurator();
});
