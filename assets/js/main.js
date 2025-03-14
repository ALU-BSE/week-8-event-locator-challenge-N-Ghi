document.addEventListener('DOMContentLoaded', function() {
    // Load featured events on the home page
    loadFeaturedEvents();
    
    // Initialize the search form
    initSearchForm();
    
    // Load category cards
    loadCategoryCards();
});

// Load featured events (showing 4 random events)
function loadFeaturedEvents() {
    const featuredEventsContainer = document.getElementById('featuredEvents');
    if (!featuredEventsContainer) return "No featured events container found";
    
    // Get 4 random events from the events data
    const shuffledEvents = [...eventsData].sort(() => 0.5 - Math.random());
    const featuredEvents = shuffledEvents.slice(0, 4);
    
    // Generate HTML for each featured event
    featuredEvents.forEach(event => {
        const eventCard = createEventCard(event);
        featuredEventsContainer.appendChild(eventCard);
    });
}

// Initialize the search form
function initSearchForm() {
    const searchForm = document.getElementById('searchForm');
    if (!searchForm) return;
    
    // Set the min date to today for the date input
    const dateInput = document.getElementById('dateInput');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
    
    // Handle form submission
    searchForm.addEventListener('submit', function(e) {
        // Form will submit normally to events.html with query parameters
    });
}

// Load category cards on the home page
function loadCategoryCards() {
    const categories = [
        { name: 'Music', icon: 'bi-music-note-beamed' },
        { name: 'Technology', icon: 'bi-laptop' },
        { name: 'Food', icon: 'bi-cup-hot' },
        { name: 'Sports', icon: 'bi-trophy' },
        { name: 'Art', icon: 'bi-palette' },
        { name: 'Business', icon: 'bi-briefcase' },
        { name: 'Education', icon: 'bi-book' },
        { name: 'Entertainment', icon: 'bi-film' }
    ];
    
    const categoriesContainer = document.querySelector('.categories-section .row');
    if (!categoriesContainer) return;
    
    categories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'col-6 col-md-4 col-lg-3';
        categoryCard.innerHTML = `
            <a href="events.html?category=${category.name}" class="category-card">
                <i class="bi ${category.icon} category-icon"></i>
                <h3 class="h5">${category.name}</h3>
            </a>
        `;
        categoriesContainer.appendChild(categoryCard);
    });
}

// Create an event card element
function createEventCard(event) {
    const colDiv = document.createElement('div');
    colDiv.className = 'col-md-6 col-lg-3';
    
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