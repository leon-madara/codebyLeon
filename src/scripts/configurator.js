// =============================================
// SERVICE CONFIGURATOR - State Management
// Code by Leon
// =============================================

class ServiceConfigurator {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 6;
        this.answers = {};

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSavedProgress();
        this.updateUI();
    }

    setupEventListeners() {
        // Option card selection
        document.querySelectorAll('.option-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.selectOption(e.currentTarget);
            });
        });

        // Navigation buttons
        document.getElementById('btnContinue').addEventListener('click', () => {
            this.nextStep();
        });

        document.getElementById('btnBack').addEventListener('click', () => {
            this.previousStep();
        });

        // Progress dots click
        document.querySelectorAll('.dot').forEach(dot => {
            dot.addEventListener('click', (e) => {
                const step = parseInt(e.target.dataset.step);
                if (step <= this.currentStep) {
                    this.goToStep(step);
                }
            });
        });
    }

    selectOption(card) {
        const step = this.currentStep;
        const stepContainer = document.querySelector(`.step[data-step="${step}"]`);

        // Remove selected class from all cards in this step
        stepContainer.querySelectorAll('.option-card').forEach(c => {
            c.classList.remove('selected');
        });

        // Add selected class to clicked card
        card.classList.add('selected');

        // Store answer
        const value = card.dataset.value;
        this.answers[`step${step}`] = value;

        // Enable continue button
        document.getElementById('btnContinue').disabled = false;

        // Save progress
        this.saveProgress();
    }

    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.updateUI();
            this.saveProgress();

            // If we're on the last step, generate recommendation
            if (this.currentStep === 6) {
                this.generateRecommendation();
            }
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateUI();
        }
    }

    goToStep(step) {
        this.currentStep = step;
        this.updateUI();
    }

    updateUI() {
        // Update step visibility
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active');
        });
        document.querySelector(`.step[data-step="${this.currentStep}"]`).classList.add('active');

        // Update progress dots
        document.querySelectorAll('.dot').forEach((dot, index) => {
            const dotStep = index + 1;
            dot.classList.remove('active', 'completed');

            if (dotStep === this.currentStep) {
                dot.classList.add('active');
            } else if (dotStep < this.currentStep) {
                dot.classList.add('completed');
            }
        });

        // Update navigation buttons
        const btnBack = document.getElementById('btnBack');
        const btnContinue = document.getElementById('btnContinue');

        btnBack.disabled = this.currentStep === 1;

        // Check if current step has a selection
        const currentAnswer = this.answers[`step${this.currentStep}`];
        btnContinue.disabled = !currentAnswer;

        // Hide continue button on last step
        if (this.currentStep === 6) {
            btnContinue.style.display = 'none';
        } else {
            btnContinue.style.display = 'block';
        }

        // Restore selected state for current step
        if (currentAnswer) {
            const stepContainer = document.querySelector(`.step[data-step="${this.currentStep}"]`);
            const selectedCard = stepContainer.querySelector(`[data-value="${currentAnswer}"]`);
            if (selectedCard) {
                selectedCard.classList.add('selected');
            }
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    generateRecommendation() {
        const { step1, step2, step3, step4, step5 } = this.answers;

        let packageName = "Custom Solution";
        let price = "Contact for Pricing";
        let whyList = [];
        let includedList = [];

        // Simple recommendation logic
        // Budget-based recommendations
        if (step5 === 'budget-low') {
            packageName = "10-Day Launch Site";
            price = "KES 35,000 - KES 45,000";
            includedList = [
                "✓ 3-5 Page Custom Site",
                "✓ Mobile-Responsive Design",
                "✓ Contact Forms & WhatsApp Integration",
                "✓ Google Maps & Social Links",
                "✓ 1 Month Free Support"
            ];
        } else if (step5 === 'budget-mid') {
            packageName = "Brand Refresh Package";
            price = "KES 65,000 - KES 85,000";
            includedList = [
                "✓ Full Brand Redesign",
                "✓ 5-10 Page Custom Site",
                "✓ Content Management System (CMS)",
                "✓ SEO Optimization",
                "✓ 2 Months Free Support"
            ];
        } else if (step5 === 'budget-high') {
            packageName = "Premium E-Commerce Solution";
            price = "KES 120,000+";
            includedList = [
                "✓ Custom E-Commerce Platform",
                "✓ Payment Gateway Integration (M-Pesa, Cards)",
                "✓ Inventory Management",
                "✓ Advanced Analytics Dashboard",
                "✓ 3 Months Premium Support"
            ];
        } else {
            packageName = "Let's Craft Your Solution";
            price = "Custom Quote";
            includedList = [
                "✓ Free 30-Minute Strategy Call",
                "✓ Tailored Proposal Based on Your Needs",
                "✓ Flexible Payment Options",
                "✓ Transparent Pricing Breakdown"
            ];
        }

        // Why it works (based on other answers)
        if (step2 === 'no-website') {
            whyList.push("Starting fresh with a clean slate");
        }
        if (step4 === 'asap') {
            whyList.push("Fast timeline with rush delivery");
        }
        if (step3 === 'leads') {
            whyList.push("Optimized for lead generation");
        }
        if (step3 === 'credibility') {
            whyList.push("Professional design builds trust");
        }
        if (step3 === 'ecommerce') {
            whyList.push("E-commerce ready with payment integration");
        }
        if (step3 === 'portfolio') {
            whyList.push("Beautiful portfolio showcase");
        }

        // Default why if none match
        if (whyList.length === 0) {
            whyList = [
                "Tailored to your business needs",
                "Professional Nairobi-based team",
                "Ongoing support included"
            ];
        }

        // Update DOM
        document.getElementById('packageName').textContent = packageName;
        document.getElementById('packagePrice').textContent = price;

        const whyListEl = document.getElementById('whyList');
        whyListEl.innerHTML = whyList.map(item => `<li>${item}</li>`).join('');

        const includedListEl = document.getElementById('includedList');
        includedListEl.innerHTML = includedList.map(item => `<li>${item}</li>`).join('');
    }

    saveProgress() {
        localStorage.setItem('configurator_progress', JSON.stringify({
            currentStep: this.currentStep,
            answers: this.answers
        }));
    }

    loadSavedProgress() {
        const saved = localStorage.getItem('configurator_progress');
        if (saved) {
            const data = JSON.parse(saved);
            this.currentStep = data.currentStep || 1;
            this.answers = data.answers || {};
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ServiceConfigurator();
});
