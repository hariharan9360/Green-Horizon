// Sample challenges data
const sampleChallenges = [
    {
        id: 1,
        title: "Plant a Tree Today",
        description: "Plant a native tree in your garden or community space to help absorb CO₂.",
        impact: 30,
        completed: false,
        category: "outdoor",
        dateAdded: new Date().toISOString()
    },
    {
        id: 2,
        title: "Meat-Free Monday",
        description: "Go vegetarian or vegan for the day to reduce your carbon footprint.",
        impact: 15,
        completed: false,
        category: "diet",
        dateAdded: new Date().toISOString()
    },
    {
        id: 3,
        title: "Use Reusable Bags",
        description: "Bring your own bags when shopping to avoid single-use plastics.",
        impact: 5,
        completed: false,
        category: "shopping",
        dateAdded: new Date().toISOString()
    },
    {
        id: 4,
        title: "5-Minute Shower Challenge",
        description: "Limit your shower time to conserve water and energy.",
        impact: 10,
        completed: false,
        category: "home",
        dateAdded: new Date().toISOString()
    },
    {
        id: 5,
        title: "Bike or Walk Instead of Driving",
        description: "Choose active transportation for short trips today.",
        impact: 20,
        completed: false,
        category: "transport",
        dateAdded: new Date().toISOString()
    },
    {
        id: 6,
        title: "Zero Waste Lunch",
        description: "Pack a lunch with reusable containers and no disposable items.",
        impact: 8,
        completed: false,
        category: "diet",
        dateAdded: new Date().toISOString()
    }
];

// Motivational messages
const motivationalMessages = [
    "Every small action makes a difference! Keep up the great work!",
    "You're helping create a greener future with each challenge completed!",
    "Sustainability is a journey, and you're making great progress!",
    "The Earth thanks you for your efforts today!",
    "Small steps lead to big changes - you're doing amazing!",
    "Your actions inspire others to live more sustainably!",
    "Remember why you started - every challenge makes an impact!",
    "You're not just changing habits, you're changing the world!",
    "Consistency is key - keep building those eco-friendly habits!",
    "Proud of you for taking steps toward a healthier planet!"
];

// DOM Elements
const challengesGrid = document.getElementById('challengesGrid');
const completedCount = document.getElementById('completedCount');
const impactScore = document.getElementById('impactScore');
const avatarMessage = document.getElementById('avatarMessage');
const addChallengeBtn = document.getElementById('addChallengeBtn');
const modalOverlay = document.getElementById('modalOverlay');
const closeModalBtn = document.getElementById('closeModalBtn');
const submitChallengeBtn = document.getElementById('submitChallengeBtn');
const challengeTitle = document.getElementById('challengeTitle');
const challengeDescription = document.getElementById('challengeDescription');
const challengeImpact = document.getElementById('challengeImpact');

// State variables
let challenges = JSON.parse(localStorage.getItem('challenges')) || sampleChallenges;
let customChallenges = JSON.parse(localStorage.getItem('customChallenges')) || [];
let completedChallenges = JSON.parse(localStorage.getItem('completedChallenges')) || [];
let totalImpact = 0;

// Chart instance
let progressChart;

// Initialize the page
function init() {
    renderChallenges();
    updateProgress();
    setupChart();
    showRandomMotivation();
    
    // Set up event listeners
    addChallengeBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    submitChallengeBtn.addEventListener('click', addCustomChallenge);
    
    // Close modal when clicking outside
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
}

// Render challenges to the page
function renderChallenges() {
    challengesGrid.innerHTML = '';
    
    const allChallenges = [...challenges, ...customChallenges]
        .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    
    allChallenges.forEach(challenge => {
        const isCompleted = completedChallenges.some(c => c.id === challenge.id && isSameDay(new Date(c.dateCompleted), new Date()));
        
        const challengeCard = document.createElement('div');
        challengeCard.className = 'challenge-card';
        challengeCard.innerHTML = `
            <div class="challenge-header">
                <h3 class="challenge-title">${challenge.title}</h3>
                <span class="challenge-impact">${challenge.impact} CO₂ kg</span>
                <p class="challenge-description">${challenge.description}</p>
            </div>
            <div class="challenge-body">
                <div class="challenge-stats">
                    <div class="stat-item">
                        <div class="stat-value">${challenge.impact}</div>
                        <div class="stat-label">CO₂ Reduced</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${isCompleted ? '1' : '0'}/1</div>
                        <div class="stat-label">Completed</div>
                    </div>
                </div>
                <button class="complete-btn ${isCompleted ? 'completed' : ''}" data-id="${challenge.id}">
                    ${isCompleted ? 'Completed' : 'Mark Complete'}
                </button>
            </div>
        `;
        
        challengesGrid.appendChild(challengeCard);
    });
    
    // Add event listeners to complete buttons
    document.querySelectorAll('.complete-btn:not(.completed)').forEach(btn => {
        btn.addEventListener('click', completeChallenge);
    });
}

// Check if two dates are the same day
function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

// Complete a challenge
function completeChallenge(e) {
    const challengeId = parseInt(e.target.getAttribute('data-id'));
    const allChallenges = [...challenges, ...customChallenges];
    const challenge = allChallenges.find(c => c.id === challengeId);
    
    if (!challenge) return;
    
    // Check if already completed today
    const alreadyCompleted = completedChallenges.some(c => 
        c.id === challengeId && isSameDay(new Date(c.dateCompleted), new Date())
    );
    
    if (!alreadyCompleted) {
        completedChallenges.push({
            id: challengeId,
            dateCompleted: new Date().toISOString(),
            impact: challenge.impact
        });
        localStorage.setItem('completedChallenges', JSON.stringify(completedChallenges));
        
        // Update UI
        e.target.classList.add('completed');
        e.target.textContent = 'Completed';
        e.target.removeEventListener('click', completeChallenge);
        
        // Update progress
        updateProgress();
        showRandomMotivation();
    }
}

// Update progress counters
function updateProgress() {
    // Calculate completed count for current month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const completedThisMonth = completedChallenges.filter(c => {
        const date = new Date(c.dateCompleted);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length;
    
    completedCount.textContent = completedThisMonth;
    
    // Calculate total impact
    totalImpact = completedChallenges.reduce((total, challenge) => {
        return total + (challenge.impact || 0);
    }, 0);
    
    impactScore.textContent = totalImpact;
    
    // Update chart
    updateChart();
}

// Set up the progress chart
function setupChart() {
    const ctx = document.getElementById('progressChart').getContext('2d');
    
    progressChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Challenges Completed',
                data: [0, 0, 0, 0, 0, 0, 0],
                backgroundColor: 'rgba(42, 157, 143, 0.7)',
                borderColor: 'rgba(42, 157, 143, 1)',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
    
    updateChart();
}

// Update chart with actual data
function updateChart() {
    // Get current week's completions
    const weekData = [0, 0, 0, 0, 0, 0, 0]; // Sunday to Saturday
    
    completedChallenges.forEach(challenge => {
        const date = new Date(challenge.dateCompleted);
        const today = new Date();
        const dayOfWeek = date.getDay(); // 0 (Sunday) to 6 (Saturday)
        
        // Check if this completion was in the current week
        const diffTime = Math.abs(today - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 7 && date <= today) {
            weekData[dayOfWeek]++;
        }
    });
    
    // Reorder data to start with Monday
    const reorderedData = [...weekData.slice(1), weekData[0]];
    
    progressChart.data.datasets[0].data = reorderedData;
    progressChart.update();
}

// Show random motivational message
function showRandomMotivation() {
    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    avatarMessage.textContent = randomMessage;
}

// Modal functions
function openModal() {
    modalOverlay.classList.add('active');
    challengeTitle.focus();
}

function closeModal() {
    modalOverlay.classList.remove('active');
    // Reset form
    challengeTitle.value = '';
    challengeDescription.value = '';
    challengeImpact.value = '15';
}

function addCustomChallenge() {
    if (!challengeTitle.value.trim()) {
        alert('Please enter a challenge title');
        return;
    }
    
    const newChallenge = {
        id: Date.now(), // Use timestamp as unique ID
        title: challengeTitle.value.trim(),
        description: challengeDescription.value.trim() || 'Custom sustainability challenge',
        impact: parseInt(challengeImpact.value),
        completed: false,
        category: 'custom',
        dateAdded: new Date().toISOString()
    };
    
    customChallenges.push(newChallenge);
    localStorage.setItem('customChallenges', JSON.stringify(customChallenges));
    
    closeModal();
    renderChallenges();
}

// Initialize the page when loaded
document.addEventListener('DOMContentLoaded', init);

// If challenges array doesn't exist in localStorage, initialize it
if (!localStorage.getItem('challenges')) {
    localStorage.setItem('challenges', JSON.stringify(sampleChallenges));
}