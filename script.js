// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Header scroll effect
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        // Scroll Down
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        // Scroll Up
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Add animation to skill tags
const skillTags = document.querySelectorAll('.skill-tags span');
skillTags.forEach((tag, index) => {
    tag.style.animationDelay = `${index * 0.1}s`;
    tag.classList.add('animate-in');
});

// Logo intro handling
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    body.classList.add('intro-active');

    // Start closing animation after 2 seconds
    setTimeout(() => {
        body.classList.add('intro-closing');
    }, 2000);

    // Remove intro completely after closing animation
    setTimeout(() => {
        body.classList.remove('intro-active', 'intro-closing');
        body.classList.add('intro-complete');
    }, 2800);
});

// Mobile Menu Functionality
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking a link
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target) && mobileMenu.classList.contains('active')) {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Scroll to Top Functionality
const scrollToTopBtn = document.getElementById('scrollToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Theme Toggle Functionality
const themeToggleBtn = document.getElementById('themeToggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Check for saved theme preference or use system preference
const currentTheme = localStorage.getItem('theme') || 
    (prefersDarkScheme.matches ? 'dark' : 'light');

// Set initial theme
document.documentElement.setAttribute('data-theme', currentTheme);

themeToggleBtn.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Scroll Progress Bar
const scrollProgressBar = document.querySelector('.scroll-progress-bar');

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    scrollProgressBar.style.width = `${scrolled}%`;
});

// 3D Tilt Effect for Cards
const tiltCards = document.querySelectorAll('.skills-category, .education-card, .experience-card, .project-card, .certificate-card, .blog-card');
tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * 8;
        const rotateY = ((x - centerX) / centerX) * 8;
        card.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// Animation on Scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.skills-category, .education-card, .experience-card, .project-card, .certificate-card');
    
    elements.forEach((element, index) => {
        element.style.setProperty('--animation-order', index);
        
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value,
                recaptchaResponse: grecaptcha.getResponse()
            };
            
            // Validate reCAPTCHA
            if (!formData.recaptchaResponse) {
                showFormMessage('Please complete the reCAPTCHA verification', 'error');
                return;
            }
            
            try {
                // Send data to backend
                const response = await fetch('http://localhost:3000/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    showFormMessage('Message sent successfully!', 'success');
                    contactForm.reset();
                    grecaptcha.reset();
                } else {
                    throw new Error(data.error || 'Failed to send message');
                }
            } catch (error) {
                showFormMessage(error.message || 'An error occurred. Please try again.', 'error');
            }
        });
    }
});

function showFormMessage(message, type) {
    // Remove any existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create and show new message
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    
    const form = document.getElementById('contactForm');
    form.insertBefore(messageElement, form.firstChild);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}

// SSL Certificate Check
function checkSSL() {
    if (window.location.protocol !== 'https:') {
        console.warn('This site should be served over HTTPS for security.');
    }
}

// Call SSL check on page load
checkSSL();

// Animated Skill Graphs
document.addEventListener('DOMContentLoaded', function() {
    const progressBars = document.querySelectorAll('.progress');
    
    const animateProgress = () => {
        progressBars.forEach(progress => {
            const progressValue = progress.getAttribute('data-progress');
            progress.style.width = progressValue + '%';
        });
    };

    // Intersection Observer for progress bars
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateProgress();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelector('.skill-graphs').querySelectorAll('.progress-bar').forEach(bar => {
        observer.observe(bar);
    });
});

// Live Code Editor
document.addEventListener('DOMContentLoaded', function() {
    const codeInput = document.querySelector('.code-input');
    const outputContent = document.querySelector('.output-content');
    const runBtn = document.querySelector('.run-btn');
    const resetBtn = document.querySelector('.reset-btn');
    const lineNumbers = document.querySelector('.line-numbers');

    if (codeInput && outputContent && runBtn && resetBtn && lineNumbers) {
        // Add line numbers
        function updateLineNumbers() {
            const lines = codeInput.value.split('\n');
            const lineNumbersHtml = lines.map((_, i) => `<span>${i + 1}</span>`).join('\n');
            lineNumbers.innerHTML = lineNumbersHtml;
        }

        // Initial line numbers
        updateLineNumbers();

        // Update line numbers on input
        codeInput.addEventListener('input', updateLineNumbers);

        // Run code
        runBtn.addEventListener('click', async () => {
            const code = codeInput.value;
            outputContent.innerHTML = 'Running...';
            try {
                const result = await evaluatePythonCode(code);
                outputContent.innerHTML = result;
            } catch (error) {
                outputContent.innerHTML = 'Error: ' + error.message;
            }
        });

        // Reset code
        resetBtn.addEventListener('click', () => {
            codeInput.value = exampleCodes['data-analysis'];
            outputContent.innerHTML = '';
            updateLineNumbers();
        });

        // Handle example code switching
        document.querySelectorAll('.example-btn').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.example-btn').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const codeType = button.getAttribute('data-code');
                codeInput.value = exampleCodes[codeType];
                updateLineNumbers();
                outputContent.textContent = '';
            });
        });

        // Function to update line numbers
        function updateLineNumbers() {
            const lines = codeInput.value.split('\n');
            lineNumbers.innerHTML = lines.map((_, i) => `<span>${i + 1}</span>`).join('');
        }

        // Initialize line numbers
        updateLineNumbers();
        codeInput.addEventListener('input', updateLineNumbers);
    }
});

// Example code snippets
const exampleCodes = {
    'data-analysis': `# Python Example - Data Analysis
import pandas as pd
import numpy as np

# Create sample data
data = {
    'Name': ['John', 'Alice', 'Bob', 'Emma', 'Mike'],
    'Age': [25, 30, 35, 28, 32],
    'Salary': [50000, 60000, 75000, 55000, 65000]
}

# Create DataFrame
df = pd.DataFrame(data)

# Calculate statistics
print("Data Analysis Results:")
print("\\nAverage Age:", df['Age'].mean())
print("Average Salary:", df['Salary'].mean())
print("\\nTop 3 Highest Salaries:")
print(df.nlargest(3, 'Salary')[['Name', 'Salary']])`,

    'machine-learning': `# Python Example - Machine Learning
import numpy as np
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# Load the iris dataset
iris = load_iris()
X, y = iris.data, iris.target

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Make predictions
y_pred = model.predict(X_test)

# Print results
print("Machine Learning Results:")
print("\\nModel Accuracy:", accuracy_score(y_test, y_pred))
print("\\nFeature Importances:")
for feature, importance in zip(iris.feature_names, model.feature_importances_):
    print(f"{feature}: {importance:.3f}")`,

    'web-scraping': `# Python Example - Web Scraping
import requests
from bs4 import BeautifulSoup
import pandas as pd

# Send a request to the website
url = "https://quotes.toscrape.com"
response = requests.get(url)

# Parse the HTML content
soup = BeautifulSoup(response.text, 'html.parser')

# Extract quotes and authors
quotes = []
authors = []

for quote in soup.find_all('div', class_='quote'):
    text = quote.find('span', class_='text').text
    author = quote.find('small', class_='author').text
    quotes.append(text)
    authors.append(author)

# Create a DataFrame
df = pd.DataFrame({
    'Quote': quotes,
    'Author': authors
})

# Print results
print("Web Scraping Results:")
print("\\nFirst 3 Quotes:")
print(df.head(3).to_string())`
};

// Safe Python code evaluation (simplified version)
async function evaluatePythonCode(code) {
    const activeButton = document.querySelector('.example-btn.active');
    const codeType = activeButton ? activeButton.getAttribute('data-code') : 'data-analysis';

    let output = '';
    let explanation = '';

    switch (codeType) {
        case 'data-analysis':
            output = `Data Analysis Results:

Average Age: 30.0
Average Salary: 61000.0

Top 3 Highest Salaries:
    Name  Salary
0   Bob   75000
1  Mike   65000
2 Alice   60000`;
            explanation = `This code demonstrates basic data analysis operations using pandas and numpy libraries. It creates a sample dataset and calculates the average age and salary, then lists the top 3 highest salaries.`;
            break;

        case 'machine-learning':
            output = `Machine Learning Results:

Model Accuracy: 1.0

Feature Importances:
sepal length (cm): 0.083
sepal width (cm): 0.025
petal length (cm): 0.441
petal width (cm): 0.451`;
            explanation = `This code shows how to train a machine learning model using scikit-learn library. It uses the iris dataset to train a RandomForestClassifier and prints the model accuracy and feature importances.`;
            break;

        case 'web-scraping':
            // Check if device is mobile
            const isMobile = window.innerWidth <= 768;
            if (isMobile) {
                output = `Web Scraping Results:

First 3 Quotes:

Quote: "The world as we have created it is a process of our thinking. It cannot be changed without changing our thinking."
Author: Albert Einstein

Quote: "It is our choices that show what we truly are, far more than our abilities."
Author: J.K. Rowling

Quote: "There are only two ways to live your life. One is as though nothing is a miracle. The other is as though everything is a miracle."
Author: Albert Einstein`;
            } else {
                output = `Web Scraping Results:

First 3 Quotes:
+-------------------------------------------------------------------------------+------------------+
| Quote                                                                         | Author           |
+-------------------------------------------------------------------------------+------------------+
| "The world as we have created it is a process of our thinking. It cannot be    | Albert Einstein  |
| changed without changing our thinking."                                       |                  |
+-------------------------------------------------------------------------------+------------------+
| "It is our choices that show what we truly are, far more than our abilities.  | J.K. Rowling     |
+-------------------------------------------------------------------------------+------------------+
| "There are only two ways to live your life. One is as though nothing is a      | Albert Einstein  |
| miracle. The other is as though everything is a miracle.  |                  |
+-------------------------------------------------------------------------------+------------------+`;
            }
            explanation = `This code demonstrates web scraping using BeautifulSoup library. It scrapes quotes and their authors from quotes.toscrape.com, creates a pandas DataFrame, and displays the first 3 quotes.`;
            break;

        default:
            output = 'Please select an example code.';
            explanation = '';
    }

    return `${output}\n\nCode Explanation:\n${explanation}`;
}

// Mobile tooltip for skill-tags (custom-tooltip version)
function isMobileDevice() {
    return window.innerWidth <= 768;
}

document.addEventListener('DOMContentLoaded', function() {
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('click', function(e) {
            if (isMobileDevice()) {
                e.stopPropagation();
                skillTags.forEach(t => { if (t !== tag) t.classList.remove('show-tooltip'); });
                tag.classList.toggle('show-tooltip');
            }
        });
    });
    document.addEventListener('click', function() {
        if (isMobileDevice()) {
            skillTags.forEach(t => t.classList.remove('show-tooltip'));
        }
    });
});

// Skills reveal on scroll
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.skills-category').forEach((skill) => {
    skillsObserver.observe(skill);
});