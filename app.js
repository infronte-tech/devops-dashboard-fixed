// Application data from provided JSON
const dashboardData = {
  "ukJobData": {
    "2023": 2442,
    "2024": 1075,
    "2025": 589
  },
  "salaryData": {
    "percentiles": {
      "10th": 47231,
      "25th": 56745,
      "50th": 74870,
      "75th": 87500,
      "90th": 109750
    },
    "regional": {
      "London": 82500,
      "Outside London": 66200
    },
    "byExperience": {
      "Junior": 35750,
      "Mid": 74870,
      "Senior": 85000
    }
  },
  "skillsData": {
    "technologies": [
      {"name": "Terraform", "demand": 88, "growth": 9},
      {"name": "Python", "demand": 80, "growth": 8},
      {"name": "Kubernetes", "demand": 76, "growth": 3},
      {"name": "AWS", "demand": 72, "growth": -2},
      {"name": "Docker", "demand": 68, "growth": 1},
      {"name": "Azure", "demand": 60, "growth": 5},
      {"name": "Grafana", "demand": 54, "growth": 7},
      {"name": "Prometheus", "demand": 48, "growth": 6},
      {"name": "GitHub Actions", "demand": 32, "growth": 6},
      {"name": "Golang", "demand": 18, "growth": 13}
    ],
    "certifications": [
      {"name": "AWS Certified", "demand": 17, "change": -14},
      {"name": "Azure Certified", "demand": 14, "change": -13},
      {"name": "Kubernetes Certified", "demand": 22, "change": -3}
    ]
  },
  "marketForecast": {
    "globalMarket": [
      {"year": 2024, "size": 13.16},
      {"year": 2025, "size": 15.06},
      {"year": 2026, "size": 18.21},
      {"year": 2027, "size": 21.88},
      {"year": 2028, "size": 25.5},
      {"year": 2029, "size": 38.11}
    ],
    "cagr": 26.1,
    "regionalShare": {
      "North America": 38.5,
      "Europe": 28.2,
      "Asia Pacific": 24.1,
      "Others": 9.2
    }
  },
  "industryInsights": {
    "adoptionRate": 77,
    "successRate": 99,
    "qualityImprovement": 61,
    "deliverySpeed": 58,
    "organizationsWithPositiveOutcomes": 99,
    "gartnerProjection2027": 80
  },
  "regionalJobs": {
    "UK": 589,
    "Germany": 3000,
    "Netherlands": 810,
    "LinkedIn EU": 109000
  },
  "keyMetrics": {
    "ukJobs2025": 589,
    "ukJobsChange": -45.2,
    "medianSalary": 74870,
    "salaryGrowth": 6.96,
    "marketSize2025": 15.06,
    "marketGrowth": 20.1,
    "cagr": 26.1
  }
};

// Chart colors
const chartColors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];

// Global chart instances
let charts = {};

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing dashboard...');
  
  // Initialize core functionality
  initializeTabs();
  initializeCounters();
  
  // Initialize charts after DOM is ready
  setTimeout(() => {
    initializeCharts();
    animateSkillBars();
    console.log('Dashboard initialized');
  }, 100);
});

// Tab navigation - Fixed implementation
function initializeTabs() {
  console.log('Initializing tabs...');
  
  const tabButtons = document.querySelectorAll('.nav-tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  console.log('Found tab buttons:', tabButtons.length);
  console.log('Found tab contents:', tabContents.length);

  tabButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetTab = this.getAttribute('data-tab');
      console.log('Switching to tab:', targetTab);
      
      // Remove active class from all buttons
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      
      // Add active class to clicked button
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');
      
      // Hide all tab contents
      tabContents.forEach(content => {
        content.classList.remove('active');
        content.setAttribute('aria-hidden', 'true');
        content.style.display = 'none';
      });
      
      // Show target tab content
      const targetContent = document.getElementById(targetTab);
      if (targetContent) {
        targetContent.classList.add('active');
        targetContent.setAttribute('aria-hidden', 'false');
        targetContent.style.display = 'block';
        console.log('Successfully switched to tab:', targetTab);
        
        // Refresh charts after tab switch
        setTimeout(() => {
          refreshCharts();
          if (targetTab === 'skills-trends') {
            animateSkillBars();
          }
        }, 100);
      } else {
        console.error('Target content not found:', targetTab);
      }
    });
  });
  
  // Initialize the first tab properly
  const firstTab = document.getElementById('overview');
  if (firstTab) {
    firstTab.style.display = 'block';
  }
}

// Refresh charts function
function refreshCharts() {
  Object.values(charts).forEach(chart => {
    if (chart && chart.canvas && chart.canvas.offsetParent !== null) {
      try {
        chart.update();   // Ensure layout updates
        chart.resize();   // Fix size if container has changed
      } catch (error) {
        console.error('Error refreshing chart:', error);
      }
    }
  });
}


// Counter animations
function initializeCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  });
  
  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
  const target = parseFloat(element.dataset.counter);
  const isPrice = element.textContent.includes('£') || element.textContent.includes('$');
  const isBillion = element.textContent.includes('B');
  const isPercentage = element.textContent.includes('%');
  
  let current = 0;
  const increment = target / 100;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    
    let displayValue = Math.floor(current);
    if (isPrice) {
      if (element.textContent.includes('£')) {
        displayValue = `£${displayValue.toLocaleString()}`;
      } else {
        displayValue = `$${displayValue.toLocaleString()}`;
      }
    } else if (isBillion) {
      displayValue = `$${current.toFixed(2)}B`;
    } else if (isPercentage) {
      displayValue = `${current.toFixed(1)}%`;
    } else {
      displayValue = displayValue.toLocaleString();
    }
    
    element.textContent = displayValue;
  }, 20);
}

// Skill bar animations
function animateSkillBars() {
  const skillBars = document.querySelectorAll('.skill-fill');
  
  skillBars.forEach(bar => {
    const width = bar.style.width;
    bar.style.width = '0%';
    bar.style.transition = 'width 1s ease-out';
    
    setTimeout(() => {
      bar.style.width = width;
    }, 200);
  });
}

// Chart initialization
function initializeCharts() {
  console.log('Starting chart initialization...');
  
  // Set global Chart.js defaults
  if (typeof Chart !== 'undefined') {
    Chart.defaults.font = Chart.defaults.font || {};
    Chart.defaults.font.family = 'var(--font-family-base)';
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#9ca3af';
    
    if (Chart.defaults.plugins && Chart.defaults.plugins.tooltip) {
      Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(26, 31, 46, 0.9)';
      Chart.defaults.plugins.tooltip.titleColor = '#e4e6ea';
      Chart.defaults.plugins.tooltip.bodyColor = '#9ca3af';
      Chart.defaults.plugins.tooltip.borderColor = '#3d4759';
      Chart.defaults.plugins.tooltip.borderWidth = 1;
    }
  }
  
  try {
    createJobTrendsChart();
    createEuropeJobsChart();
    createSalaryDistributionChart();
    createRegionalSalaryChart();
    createSkillsChart();
    createSkillGrowthChart();
    createMarketForecastChart();
    createGrowthRateChart();
    console.log('All charts initialized successfully');
  } catch (error) {
    console.error('Error initializing charts:', error);
  }
}

// Job trends chart
function createJobTrendsChart() {
  const ctx = document.getElementById('jobTrendsChart');
  if (!ctx) return;
  
  const data = dashboardData.ukJobData;
  const years = Object.keys(data).map(Number);
  const values = Object.values(data);
  
  charts.jobTrends = new Chart(ctx, {
    type: 'line',
    data: {
      labels: years,
      datasets: [{
        label: 'UK DevOps Jobs',
        data: values,
        borderColor: chartColors[0],
        backgroundColor: chartColors[0] + '20',
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#e4e6ea' }
        }
      },
      scales: {
        x: {
          ticks: { color: '#9ca3af' },
          grid: { color: '#3d4759' }
        },
        y: {
          ticks: { color: '#9ca3af' },
          grid: { color: '#3d4759' },
          title: {
            display: true,
            text: 'Number of Jobs',
            color: '#e4e6ea'
          }
        }
      }
    }
  });
}

// Europe jobs chart
function createEuropeJobsChart() {
  const ctx = document.getElementById('europeJobsChart');
  if (!ctx) return;
  
  const data = dashboardData.regionalJobs;
  const countries = Object.keys(data).filter(key => key !== 'LinkedIn EU');
  const values = countries.map(country => data[country]);
  
  charts.europeJobs = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: countries,
      datasets: [{
        label: 'Job Openings',
        data: values,
        backgroundColor: chartColors.slice(0, countries.length),
        borderColor: chartColors.slice(0, countries.length),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          ticks: { color: '#9ca3af' },
          grid: { color: '#3d4759' }
        },
        y: {
          ticks: { color: '#9ca3af' },
          grid: { color: '#3d4759' },
          title: {
            display: true,
            text: 'Number of Jobs',
            color: '#e4e6ea'
          }
        }
      }
    }
  });
}

// Salary distribution chart
function createSalaryDistributionChart() {
  const ctx = document.getElementById('salaryDistributionChart');
  if (!ctx) return;
  
  const percentiles = dashboardData.salaryData.percentiles;
  
  charts.salaryDistribution = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['10th Percentile', '25th Percentile', 'Median', '75th Percentile', '90th Percentile'],
      datasets: [{
        label: 'Salary (£)',
        data: [
          percentiles['10th'],
          percentiles['25th'],
          percentiles['50th'],
          percentiles['75th'],
          percentiles['90th']
        ],
        backgroundColor: chartColors.slice(0, 5),
        borderColor: chartColors.slice(0, 5),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          ticks: { color: '#9ca3af' },
          grid: { color: '#3d4759' }
        },
        y: {
          ticks: { 
            color: '#9ca3af',
            callback: function(value) {
              return '£' + value.toLocaleString();
            }
          },
          grid: { color: '#3d4759' },
          title: {
            display: true,
            text: 'Salary (£)',
            color: '#e4e6ea'
          }
        }
      }
    }
  });
}

// Regional salary chart
function createRegionalSalaryChart() {
  const ctx = document.getElementById('regionalSalaryChart');
  if (!ctx) return;
  
  const regional = dashboardData.salaryData.regional;
  const regions = Object.keys(regional);
  const values = Object.values(regional);
  
  charts.regionalSalary = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: regions,
      datasets: [{
        label: 'Median Salary (£)',
        data: values,
        backgroundColor: chartColors.slice(0, regions.length),
        borderColor: chartColors.slice(0, regions.length),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          ticks: { 
            color: '#9ca3af',
            callback: function(value) {
              return '£' + value.toLocaleString();
            }
          },
          grid: { color: '#3d4759' }
        },
        y: {
          ticks: { color: '#9ca3af' },
          grid: { color: '#3d4759' }
        }
      }
    }
  });
}

// Skills chart
function createSkillsChart() {
  const ctx = document.getElementById('skillsChart');
  if (!ctx) return;
  
  const skills = dashboardData.skillsData.technologies.slice(0, 8);
  
  charts.skills = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: skills.map(s => s.name),
      datasets: [{
        label: 'Demand %',
        data: skills.map(s => s.demand),
        fill: true,
        backgroundColor: chartColors[0] + '40',
        borderColor: chartColors[0],
        pointBackgroundColor: chartColors[0],
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: chartColors[0]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#e4e6ea' }
        }
      },
      scales: {
        r: {
          angleLines: { color: '#3d4759' },
          grid: { color: '#3d4759' },
          pointLabels: { color: '#9ca3af' },
          ticks: { 
            color: '#9ca3af',
            backdropColor: 'transparent'
          }
        }
      }
    }
  });
}

// Skill growth chart
function createSkillGrowthChart() {
  const ctx = document.getElementById('skillGrowthChart');
  if (!ctx) return;
  
  const skills = dashboardData.skillsData.technologies.slice(0, 8);
  
  charts.skillGrowth = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: skills.map(s => s.name),
      datasets: [{
        label: 'Growth %',
        data: skills.map(s => s.growth),
        backgroundColor: skills.map(s => s.growth >= 0 ? chartColors[1] : chartColors[2]),
        borderColor: skills.map(s => s.growth >= 0 ? chartColors[1] : chartColors[2]),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          ticks: { color: '#9ca3af' },
          grid: { color: '#3d4759' }
        },
        y: {
          ticks: { 
            color: '#9ca3af',
            callback: function(value) {
              return value + '%';
            }
          },
          grid: { color: '#3d4759' },
          title: {
            display: true,
            text: 'Growth Rate (%)',
            color: '#e4e6ea'
          }
        }
      }
    }
  });
}

// Market forecast chart
function createMarketForecastChart() {
  const ctx = document.getElementById('marketForecastChart');
  if (!ctx) return;
  
  const data = dashboardData.marketForecast.globalMarket;
  
  charts.marketForecast = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(d => d.year),
      datasets: [{
        label: 'Market Size ($B)',
        data: data.map(d => d.size),
        borderColor: chartColors[2],
        backgroundColor: chartColors[2] + '20',
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#e4e6ea' }
        }
      },
      scales: {
        x: {
          ticks: { color: '#9ca3af' },
          grid: { color: '#3d4759' }
        },
        y: {
          ticks: { 
            color: '#9ca3af',
            callback: function(value) {
              return '$' + value + 'B';
            }
          },
          grid: { color: '#3d4759' },
          title: {
            display: true,
            text: 'Market Size ($B)',
            color: '#e4e6ea'
          }
        }
      }
    }
  });
}

// Growth rate chart (Regional Market Share)
function createGrowthRateChart() {
  const ctx = document.getElementById('growthRateChart');
  if (!ctx) return;
  
  const regionalShare = dashboardData.marketForecast.regionalShare;
  
  charts.growthRate = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(regionalShare),
      datasets: [{
        data: Object.values(regionalShare),
        backgroundColor: chartColors.slice(0, Object.keys(regionalShare).length),
        borderColor: chartColors.slice(0, Object.keys(regionalShare).length),
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#e4e6ea' }
        }
      }
    }
  });
}

// Responsive chart handling
window.addEventListener('resize', function() {
  refreshCharts();
});

// Error handling
window.addEventListener('error', function(e) {
  console.error('Dashboard error:', e.error);
});