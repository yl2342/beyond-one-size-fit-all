// Navigation functionality
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Smooth scrolling for navigation links
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Sticky navigation
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        
        if (window.scrollY > 100) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
    });
    
    // BMI Calculator toggle
    const bmiCalculatorToggle = document.getElementById('bmi-calculator-toggle');
    const bmiCalculator = document.getElementById('bmi-calculator');
    
    if (bmiCalculatorToggle && bmiCalculator) {
        bmiCalculatorToggle.addEventListener('click', (e) => {
            e.preventDefault();
            bmiCalculator.classList.toggle('hidden');
            
            // Change text based on visibility
            if (bmiCalculator.classList.contains('hidden')) {
                bmiCalculatorToggle.textContent = 'Calculate your BMI';
            } else {
                bmiCalculatorToggle.textContent = 'Hide BMI calculator';
            }
        });
    }
    
    // BMI calculation
    const calculateBmiBtn = document.getElementById('calculate-bmi');
    
    if (calculateBmiBtn) {
        calculateBmiBtn.addEventListener('click', () => {
            const height = parseFloat(document.getElementById('height').value);
            const weight = parseFloat(document.getElementById('weight').value);
            
            if (height && weight && height > 0 && weight > 0) {
                // BMI formula: weight (kg) / (height (m))²
                const heightInMeters = height / 100;
                const bmi = weight / (heightInMeters * heightInMeters);
                
                document.getElementById('bmi').value = bmi.toFixed(1);
                
                // Optionally hide the calculator after calculation
                bmiCalculator.classList.add('hidden');
                bmiCalculatorToggle.textContent = 'Calculate your BMI';
            } else {
                alert('Please enter valid height and weight values.');
            }
        });
    }
    
    // Risk calculator form
    const riskForm = document.getElementById('risk-calculator');
    const riskResult = document.getElementById('risk-result');
    
    if (riskForm) {
        riskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate form inputs before proceeding
            try {
                // Get form values with validation
                const age = parseInt(document.getElementById('age').value);
                if (isNaN(age) || age < 18) {
                    throw new Error('Please enter a valid age (18 or older).');
                }
                
                // Check for radio button selections
                const genderSelection = document.querySelector('input[name="gender"]:checked');
                if (!genderSelection) {
                    throw new Error('Please select your gender.');
                }
                const gender = genderSelection.value;
                
                const bmi = parseFloat(document.getElementById('bmi').value) || 0;
                if (bmi === 0) {
                    throw new Error('Please enter your BMI or use the BMI calculator.');
                }
                
                const waist = parseInt(document.getElementById('waist').value) || 0;
                const systolic = parseInt(document.getElementById('systolic').value) || 0;
                const cholesterol = parseInt(document.getElementById('cholesterol').value) || 0;
                
                // Check for radio button selections
                const smokerSelection = document.querySelector('input[name="smoker"]:checked');
                if (!smokerSelection) {
                    throw new Error('Please indicate whether you smoke.');
                }
                const isSmoker = smokerSelection.value === 'yes';
                
                const diabetesSelection = document.querySelector('input[name="diabetes"]:checked');
                if (!diabetesSelection) {
                    throw new Error('Please indicate whether you have diabetes.');
                }
                const hasDiabetes = diabetesSelection.value === 'yes';
                
                const medicationSelection = document.querySelector('input[name="weight_meds"]:checked');
                if (!medicationSelection) {
                    throw new Error('Please indicate whether you have tried weight loss medications.');
                }
                const hasTriedMedications = medicationSelection.value === 'yes';
                
                // Calculate risk (expanded for obesity focus)
                let riskScore = 0;
                let obesityRiskScore = 0;
                
                // Age factor
                if (age < 40) riskScore += 0;
                else if (age < 50) riskScore += 5;
                else if (age < 60) riskScore += 10;
                else if (age < 70) riskScore += 15;
                else riskScore += 20;
                
                // Gender factor
                if (gender === 'male') riskScore += 5;
                
                // BMI factor
                if (bmi < 25) obesityRiskScore += 0;
                else if (bmi < 30) obesityRiskScore += 5;
                else if (bmi < 35) obesityRiskScore += 10;
                else if (bmi < 40) obesityRiskScore += 15;
                else obesityRiskScore += 20;
                
                // Waist circumference factor
                if (gender === 'male') {
                    if (waist > 102) obesityRiskScore += 10;
                } else {
                    if (waist > 88) obesityRiskScore += 10;
                }
                
                // Blood pressure factor
                if (systolic < 120) riskScore += 0;
                else if (systolic < 140) riskScore += 5;
                else if (systolic < 160) riskScore += 10;
                else riskScore += 15;
                
                // Cholesterol factor
                if (cholesterol < 200) riskScore += 0;
                else if (cholesterol < 240) riskScore += 5;
                else riskScore += 10;
                
                // Smoking factor
                if (isSmoker) riskScore += 10;
                
                // Diabetes factor
                if (hasDiabetes) {
                    riskScore += 10;
                    obesityRiskScore += 10;
                }
                
                // Calculate overall risk (max score is 65 + 40 = 105)
                const totalRiskScore = riskScore + obesityRiskScore;
                const riskPercentage = Math.min(Math.round((totalRiskScore / 105) * 100), 100);
                
                // Set risk indicator width
                document.querySelector('.risk-indicator').style.width = `${riskPercentage}%`;
                
                // Set risk message
                const riskMessage = document.getElementById('risk-message');
                const medicationMessage = document.getElementById('medication-message');
                const recommendations = document.getElementById('recommendations');
                
                // Set standard risk messages
                if (riskPercentage < 30) {
                    riskMessage.textContent = 'Your overall cardiovascular risk appears to be LOW based on the provided information.';
                } else if (riskPercentage < 60) {
                    riskMessage.textContent = 'Your overall cardiovascular risk appears to be MODERATE based on the provided information.';
                } else {
                    riskMessage.textContent = 'Your overall cardiovascular risk appears to be HIGH based on the provided information.';
                }
                
                // Set medication message based on obesity factors and medication history
                if (bmi >= 30) {
                    if (hasTriedMedications) {
                        medicationMessage.textContent = 'You\'ve indicated previous experience with weight loss medications. While these can be helpful tools, they work differently for each person and should be part of a comprehensive approach tailored to your specific health profile.';
                    } else {
                        medicationMessage.textContent = 'Your BMI indicates obesity, which increases cardiovascular risk. While weight loss medications might be an option to discuss with your healthcare provider, they\'re not appropriate for everyone and should be considered as just one potential component of a personalized treatment plan.';
                    }
                } else if (bmi >= 25) {
                    medicationMessage.textContent = 'Your BMI indicates overweight status. Focus on lifestyle modifications with medical guidance is typically recommended before considering weight loss medications.';
                } else {
                    medicationMessage.textContent = 'Your BMI is within normal range. Maintaining this through healthy lifestyle habits is important for cardiovascular health.';
                }
                
                // Set personalized recommendations
                let recommendationsList = [];
                
                // Core recommendations for everyone
                recommendationsList.push('Schedule a comprehensive health assessment with your healthcare provider to discuss your cardiovascular risk factors in detail.');
                
                // BMI and obesity specific recommendations
                if (bmi >= 30) {
                    recommendationsList.push('Work with a healthcare provider experienced in obesity medicine for a personalized approach beyond just weight loss.');
                    recommendationsList.push('Consider consulting with a registered dietitian for individualized nutrition guidance rather than following restrictive diets.');
                    
                    if (riskPercentage >= 60) {
                        recommendationsList.push('Ask your provider about comprehensive cardiovascular risk assessment tests beyond standard screenings.');
                    }
                    
                    if (waist >= (gender === 'male' ? 102 : 88)) {
                        recommendationsList.push('Your waist circumference suggests abdominal obesity, which particularly impacts heart health. Discuss specific strategies to address this with your provider.');
                    }
                }
                
                // Medication-specific recommendations
                if (bmi >= 30 && riskPercentage >= 30) {
                    recommendationsList.push('If considering weight loss medications, discuss with your provider how they might specifically impact your cardiovascular risk factors, not just weight.');
                    recommendationsList.push('Ask about the complete risk/benefit profile of any medication options based on your specific health history.');
                }
                
                // Other risk factor recommendations
                if (systolic >= 140) {
                    recommendationsList.push('Your blood pressure is elevated. Prioritize monitoring and management strategies with your healthcare provider.');
                }
                
                if (cholesterol >= 240) {
                    recommendationsList.push('Your cholesterol level indicates potential concerns. Discuss testing for a complete lipid panel and management options.');
                }
                
                if (isSmoker) {
                    recommendationsList.push('Smoking significantly increases cardiovascular risk. Ask about smoking cessation programs and support resources.');
                }
                
                if (hasDiabetes) {
                    recommendationsList.push('Having diabetes alongside obesity requires specialized care. Discuss how these conditions interact and comprehensive management approaches.');
                }
                
                // Build HTML for recommendations
                recommendations.innerHTML = recommendationsList.map(rec => `<li>${rec}</li>`).join('');
                
                // Show results
                riskResult.classList.remove('hidden');
                
                // Scroll to results
                window.scrollTo({
                    top: riskResult.offsetTop + riskForm.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Clear any previous error messages
                const errorElement = document.getElementById('assessment-error');
                if (errorElement) {
                    errorElement.remove();
                }
                
            } catch (error) {
                // Display error message to user
                const errorElement = document.getElementById('assessment-error');
                
                if (errorElement) {
                    errorElement.textContent = error.message;
                } else {
                    const newErrorElement = document.createElement('div');
                    newErrorElement.id = 'assessment-error';
                    newErrorElement.className = 'error-message';
                    newErrorElement.textContent = error.message;
                    
                    // Insert error message before the submit button
                    const submitButton = riskForm.querySelector('.cta-button');
                    riskForm.insertBefore(newErrorElement, submitButton);
                }
                
                // Hide results if they were previously shown
                if (!riskResult.classList.contains('hidden')) {
                    riskResult.classList.add('hidden');
                }
            }
        });
    }
    
    // Contact form
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // In a real application, you would send the form data to a server
            // For this demo, we'll just simulate a successful submission
            
            const formData = new FormData(contactForm);
            let formValues = {};
            
            formData.forEach((value, key) => {
                formValues[key] = value;
            });
            
            console.log('Form submitted with values:', formValues);
            
            // Show success message
            contactForm.innerHTML = `
                <div class="success-message">
                    <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--success-color); margin-bottom: 20px;"></i>
                    <h3>Message Sent Successfully!</h3>
                    <p>Thank you for contacting us. We'll get back to you as soon as possible.</p>
                </div>
            `;
        });
    }
    
    // Animation on scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.risk-card, .resource-card, .step, .stat-box, .medication-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Set initial styles for animation
    const animatedElements = document.querySelectorAll('.risk-card, .resource-card, .step, .stat-box, .medication-card');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Add scroll event listener
    window.addEventListener('scroll', animateOnScroll);
    
    // Run once to check initial state
    animateOnScroll();
}); 