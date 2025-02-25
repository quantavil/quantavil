// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    initNav();
    
    // Initialize form events
    initFormEvents();
    
    // Initialize history
    initHistory();
    
    // Initialize export buttons
    initExport();
    
    // Calculate the initial calculator (Simple Interest)
    calculateSimpleInterest();
});

// Navigation Initialization
function initNav() {
    const navBtns = document.querySelectorAll('.nav-btn');
    
    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            navBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Hide all calculator forms
            const calculatorForms = document.querySelectorAll('.calculator-form');
            calculatorForms.forEach(form => form.classList.remove('active'));
            
            // Show the selected calculator form
            const calculatorId = this.getAttribute('data-calc');
            document.getElementById(calculatorId).classList.add('active');
        });
    });
}

// Form Events Initialization
function initFormEvents() {
    // Add input validation
    const numericInputs = document.querySelectorAll('input[type="number"]');
    
    numericInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value < 0) {
                this.value = 0;
            }
        });
    });
    
    // Formula toggles
    const toggleButtons = document.querySelectorAll('.toggle-formula');
    
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const formulaId = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            const formulaContent = document.getElementById(formulaId);
            
            if (formulaContent.style.display === 'block') {
                formulaContent.style.display = 'none';
                this.textContent = 'Show Formula';
            } else {
                formulaContent.style.display = 'block';
                this.textContent = 'Hide Formula';
            }
        });
    });
}

// History Initialization
function initHistory() {
    // Load history from localStorage
    loadHistory();
    
    // Clear history button
    document.getElementById('clear-history-btn').addEventListener('click', function() {
        clearHistory();
    });
}

// Export Functions Initialization
function initExport() {
    document.getElementById('print-btn').addEventListener('click', function() {
        window.print();
    });
    
    document.getElementById('download-btn').addEventListener('click', function() {
        alert('PDF download functionality would be implemented here with a library like jsPDF.');
        // In a real implementation, we would use jsPDF or another library
        // to generate and download the PDF
    });
}

// Simple Interest Calculator
function calculateSimpleInterest() {
    const principal = parseFloat(document.getElementById('si-principal').value);
    const rate = parseFloat(document.getElementById('si-rate').value) / 100;
    let time = parseFloat(document.getElementById('si-time').value);
    const timeUnit = document.getElementById('si-time-unit').value;
    
    // Convert time to years if needed
    if (timeUnit === 'months') {
        time = time / 12;
    }
    
    // Calculate simple interest
    const interest = principal * rate * time;
    const total = principal + interest;
    
    // Display results
    document.getElementById('si-interest').textContent = formatCurrency(interest);
    document.getElementById('si-total').textContent = formatCurrency(total);
    
    // Add to history
    addToHistory('Simple Interest', {
        'Principal': formatCurrency(principal),
        'Interest Rate': rate * 100 + '%',
        'Time Period': time + (timeUnit === 'years' ? ' years' : ' months'),
        'Interest Earned': formatCurrency(interest),
        'Total Amount': formatCurrency(total)
    });
}

// Compound Interest Calculator
function calculateCompoundInterest() {
    const principal = parseFloat(document.getElementById('ci-principal').value);
    const rate = parseFloat(document.getElementById('ci-rate').value) / 100;
    let time = parseFloat(document.getElementById('ci-time').value);
    const timeUnit = document.getElementById('ci-time-unit').value;
    const frequency = parseInt(document.getElementById('ci-frequency').value);
    
    // Convert time to years if needed
    if (timeUnit === 'months') {
        time = time / 12;
    }
    
    // Calculate compound interest
    const amount = principal * Math.pow(1 + (rate / frequency), frequency * time);
    const interest = amount - principal;
    
    // Display results
    document.getElementById('ci-interest').textContent = formatCurrency(interest);
    document.getElementById('ci-total').textContent = formatCurrency(amount);
    
    // Add to history
    addToHistory('Compound Interest', {
        'Principal': formatCurrency(principal),
        'Interest Rate': rate * 100 + '%',
        'Time Period': time + (timeUnit === 'years' ? ' years' : ' months'),
        'Compounding Frequency': getCompoundingFrequencyText(frequency),
        'Interest Earned': formatCurrency(interest),
        'Total Amount': formatCurrency(amount)
    });
}

// EMI Calculator
function calculateEMI() {
    const principal = parseFloat(document.getElementById('emi-principal').value);
    const ratePerAnnum = parseFloat(document.getElementById('emi-rate').value);
    let tenure = parseFloat(document.getElementById('emi-tenure').value);
    const tenureUnit = document.getElementById('emi-tenure-unit').value;
    
    // Convert tenure to months if needed
    if (tenureUnit === 'years') {
        tenure = tenure * 12;
    }
    
    // Monthly interest rate
    const ratePerMonth = ratePerAnnum / (12 * 100);
    
    // Calculate EMI
    const emi = principal * ratePerMonth * Math.pow(1 + ratePerMonth, tenure) / (Math.pow(1 + ratePerMonth, tenure) - 1);
    const totalPayment = emi * tenure;
    const totalInterest = totalPayment - principal;
    
    // Display results
    document.getElementById('emi-monthly').textContent = formatCurrency(emi);
    document.getElementById('emi-total-interest').textContent = formatCurrency(totalInterest);
    document.getElementById('emi-total-payment').textContent = formatCurrency(totalPayment);
    
    // Add to history
    addToHistory('EMI Calculator', {
        'Loan Amount': formatCurrency(principal),
        'Interest Rate': ratePerAnnum + '%',
        'Loan Tenure': tenure + ' months',
        'Monthly EMI': formatCurrency(emi),
        'Total Interest': formatCurrency(totalInterest),
        'Total Payment': formatCurrency(totalPayment)
    });
}

// Fixed Deposit Calculator
function calculateFixedDeposit() {
    const principal = parseFloat(document.getElementById('fd-principal').value);
    const rate = parseFloat(document.getElementById('fd-rate').value) / 100;
    let time = parseFloat(document.getElementById('fd-time').value);
    const timeUnit = document.getElementById('fd-time-unit').value;
    const frequency = parseInt(document.getElementById('fd-frequency').value);
    
    // Convert time to years if needed
    if (timeUnit === 'months') {
        time = time / 12;
    }
    
    // Calculate Fixed Deposit maturity amount
    const maturity = principal * Math.pow(1 + (rate / frequency), frequency * time);
    const interest = maturity - principal;
    
    // Display results
    document.getElementById('fd-maturity').textContent = formatCurrency(maturity);
    document.getElementById('fd-interest').textContent = formatCurrency(interest);
    
    // Add to history
    addToHistory('Fixed Deposit', {
        'Deposit Amount': formatCurrency(principal),
        'Interest Rate': rate * 100 + '%',
        'Tenure': time + (timeUnit === 'years' ? ' years' : ' months'),
        'Compounding Frequency': getCompoundingFrequencyText(frequency),
        'Maturity Amount': formatCurrency(maturity),
        'Interest Earned': formatCurrency(interest)
    });
}

// Recurring Deposit Calculator
function calculateRecurringDeposit() {
    const monthlyDeposit = parseFloat(document.getElementById('rd-monthly').value);
    const rate = parseFloat(document.getElementById('rd-rate').value) / 100;
    const months = parseInt(document.getElementById('rd-time').value);
    
    // Calculate Recurring Deposit maturity amount
    // Formula: P * n + P * (n(n+1)/2) * (r/100) * (1/12)
    const totalDeposit = monthlyDeposit * months;
    const interest = monthlyDeposit * (months * (months + 1) / 2) * (rate / 12);
    const maturity = totalDeposit + interest;
    
    // Display results
    document.getElementById('rd-maturity').textContent = formatCurrency(maturity);
    document.getElementById('rd-deposited').textContent = formatCurrency(totalDeposit);
    document.getElementById('rd-interest').textContent = formatCurrency(interest);
    
    // Add to history
    addToHistory('Recurring Deposit', {
        'Monthly Deposit': formatCurrency(monthlyDeposit),
        'Interest Rate': rate * 100 + '%',
        'Tenure': months + ' months',
        'Total Deposited': formatCurrency(totalDeposit),
        'Maturity Amount': formatCurrency(maturity),
        'Interest Earned': formatCurrency(interest)
    });
}

// SIP Calculator
function calculateSIP() {
    const monthlyInvestment = parseFloat(document.getElementById('sip-monthly').value);
    const ratePerAnnum = parseFloat(document.getElementById('sip-rate').value);
    let duration = parseFloat(document.getElementById('sip-time').value);
    const durationUnit = document.getElementById('sip-time-unit').value;
    
    // Convert duration to months if needed
    if (durationUnit === 'years') {
        duration = duration * 12;
    }
    
    // Monthly rate
    const ratePerMonth = ratePerAnnum / (12 * 100);
    
    // Calculate SIP maturity amount
    // Formula: P × (((1 + r)^n - 1) / r) × (1 + r)
    const futureValue = monthlyInvestment * (((Math.pow(1 + ratePerMonth, duration) - 1) / ratePerMonth) * (1 + ratePerMonth));
    const totalInvested = monthlyInvestment * duration;
    const wealthGained = futureValue - totalInvested;
    
    // Display results
    document.getElementById('sip-future-value').textContent = formatCurrency(futureValue);
    document.getElementById('sip-invested').textContent = formatCurrency(totalInvested);
    document.getElementById('sip-wealth-gained').textContent = formatCurrency(wealthGained);
    
    // Add to history
    addToHistory('SIP Calculator', {
        'Monthly Investment': formatCurrency(monthlyInvestment),
        'Expected Return Rate': ratePerAnnum + '%',
        'Duration': duration + ' months',
        'Total Amount Invested': formatCurrency(totalInvested),
        'Future Value': formatCurrency(futureValue),
        'Wealth Gained': formatCurrency(wealthGained)
    });
}

// Inflation Calculator
function calculateInflation() {
    const currentAmount = parseFloat(document.getElementById('inf-current').value);
    const inflationRate = parseFloat(document.getElementById('inf-rate').value) / 100;
    let years = parseFloat(document.getElementById('inf-time').value);
    const timeUnit = document.getElementById('inf-time-unit').value;
    
    // Convert time to years if needed
    if (timeUnit === 'months') {
        years = years / 12;
    }
    
    // Calculate inflation-adjusted future value
    const futureValue = currentAmount * Math.pow(1 + inflationRate, years);
    const purchasingPowerLoss = futureValue - currentAmount;
    
    // Display results
    document.getElementById('inf-future-value').textContent = formatCurrency(futureValue);
    document.getElementById('inf-loss').textContent = formatCurrency(purchasingPowerLoss);
    
    // Add to history
    addToHistory('Inflation Calculator', {
        'Current Amount': formatCurrency(currentAmount),
        'Inflation Rate': inflationRate * 100 + '%',
        'Time Period': years + (timeUnit === 'years' ? ' years' : ' months'),
        'Future Value Needed': formatCurrency(futureValue),
        'Purchasing Power Loss': formatCurrency(purchasingPowerLoss)
    });
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function getCompoundingFrequencyText(frequency) {
    switch(frequency) {
        case 1: return 'Annually';
        case 2: return 'Semi-Annually';
        case 4: return 'Quarterly';
        case 12: return 'Monthly';
        case 365: return 'Daily';
        default: return frequency + ' times per year';
    }
}

function toggleFormula(formulaId) {
    const formulaContent = document.getElementById(formulaId);
    formulaContent.style.display = formulaContent.style.display === 'none' || formulaContent.style.display === '' ? 'block' : 'none';
}

// History Functions
function addToHistory(calculatorType, details) {
    const historyContainer = document.getElementById('history-container');
    const emptyHistory = historyContainer.querySelector('.empty-history');
    
    if (emptyHistory) {
        emptyHistory.remove();
    }
    
    const timestamp = new Date().toLocaleString();
    
    // Create history item
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    
    // Create history content
    let historyContent = `<strong>${calculatorType}</strong> <span class="timestamp">(${timestamp})</span><br>`;
    
    for (const [key, value] of Object.entries(details)) {
        historyContent += `${key}: ${value}<br>`;
    }
    
    historyItem.innerHTML = historyContent;
    
    // Add to container
    historyContainer.prepend(historyItem);
    
    // Save to localStorage
    saveHistory();
}

function saveHistory() {
    const historyContainer = document.getElementById('history-container');
    localStorage.setItem('calculatorHistory', historyContainer.innerHTML);
}

function loadHistory() {
    const historyContainer = document.getElementById('history-container');
    const savedHistory = localStorage.getItem('calculatorHistory');
    
    if (savedHistory) {
        historyContainer.innerHTML = savedHistory;
    }
}

function clearHistory() {
    const historyContainer = document.getElementById('history-container');
    historyContainer.innerHTML = '<p class="empty-history">No calculations yet</p>';
    localStorage.removeItem('calculatorHistory');
}