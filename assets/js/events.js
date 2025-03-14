document.addEventListener('DOMContentLoaded', function() {
    // Initialize filter form with URL parameters
    initFilterForm();
    
    // Load events based on URL parameters
    loadEvents();
    
    // Initialize event listeners
    initEventListeners();
});

// Initialize filter form with URL parameters
function initFilterForm() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Set filter values from URL parameters
    const cityFilter = document.getElementById('cityFilter');
    const dateFilter = document.getElementById('dateFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    
    if (cityFilter && urlParams.has('city')) {
        cityFilter.value = urlParams.get('city');
    }
    
    if (dateFilter && urlParams.has('date')) {
        dateFilter.value = urlParams.get('date');
    }
    
    if (categoryFilter && urlParams.has('category')) {
        categoryFilter.value = urlParams.get('category');
    }
    
    // Set min date to today
    if (dateFilter) {
        const today = new Date().toISOString().split('T')[0];
        dateFilter.setAttribute('min', today);
    }
}

// Initialize event listeners
function initEventListeners() {
    // Apply filters button
    const applyFiltersBtn = document.getElementById('applyFilters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            loadEvents();
        });
    }
    
    // Sort options
    const sortOptions = document.querySelectorAll('.sort-option');
    sortOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            const sortBy = this.getAttribute('data-sort');
            document.getElementById('sortDropdown').textContent = this.textContent;
            loadEvents(sortBy);
        });
    });
}

// Load events based on filters
function loadEvents(sortBy = 'date') {
    const eventsContainer = document.getElementById('eventsList');
    const noResultsElement = document.getElementById('noResults');
    const resultsCountElement = document.getElementById('resultsCount');
    const eventsHeadingElement = document.getElementById('eventsHeading');
    
    if (!eventsContainer) return;
    
    // Get filter values
    const city = document.getElementById('cityFilter')?.value?.trim().toLowerCase() || '';
    const date = document.getElementById('dateFilter')?.value || '';
    const category = document.getElementById('categoryFilter')?.value || '';
    
    // Filter events
    let filteredEvents = [...eventsData];
    
    if (city) {
        filteredEvents = filteredEvents.filter(event => 
            event.city.toLowerCase().includes(city)
        );
    }
    
    if (date) {
        filteredEvents = filteredEvents.filter(event => 
            new Date(event.date) >= new Date(date)
        );
    }
    
    if (category) {
        filteredEvents = filteredEvents.filter(event => 
            event.category === category
        );
    }
    
    // Sort events
    if (sortBy === 'date') {
        filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === 'name') {
        filteredEvents.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    // Clear previous results
    eventsContainer.innerHTML = '';
    
    // Update heading and results count
    let headingText = 'All Events';
    if (category) headingText = `${category} Events`;
    if (city) headingText = `Events in ${city.charAt(0).toUpperCase() + city.slice(1)}`;
    if (category && city) headingText = `${category} Events in ${city.charAt(0).toUpperCase() + city.slice(1)}`;
    
    eventsHeadingElement.textContent = headingText;
    resultsCountElement.textContent = `Showing ${filteredEvents.length} event${filteredEvents.length !== 1 ? 's' : ''}`;
    
    // Display events or no results message
    if (filteredEvents.length === 0) {
        eventsContainer.classList.add('d-none');
        noResultsElement.classList.remove('d-none');
    } else {
        eventsContainer.classList.remove('d-none');
        noResultsElement.classList.add('d-none');
        
        // Generate HTML for each event
        filteredEvents.forEach(event => {
            const eventCard = createEventCard(event);
            eventsContainer.appendChild(eventCard);
        });
    }
}

// Create an event card element
function createEventCard(event) {
    const colDiv = document.createElement('div');
    colDiv.className = 'col-md-6 col-lg-4';
    
    colDiv.innerHTML = `
        <div class="card event-card h-100">
            <img src="${event.image}" class="card-img-top" alt="${event.name}">
            <div class="card-body">
                <span class="badge bg-primary category-badge">${event.category}</span>
                <h5 class="card-title">${event.name}</h5>
                <p class="card-text event-date">
                    <i class="bi bi-calendar"></i> ${formatDate(event.date)}
                </p>
                <p class="card-text event-location">
                    <i class="bi bi-geo-alt"></i> ${event.location}, ${event.city}
                </p>
                <p class="card-text">${truncateText(event.description, 100)}</p>
            </div>
            <div class="card-footer bg-white border-top-0">
                <a href="event-details.html?id=${event.id}" class="btn btn-outline-primary">View Details</a>
            </div>
        </div>
    `;
    
    return colDiv;
}

// Helper function to format date
function formatDate(dateString) {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}

// Helper function to truncate text
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}