// event-details.js - For event-details.html (Event Details Page)

document.addEventListener('DOMContentLoaded', function() {
    // Get event ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');
    
    if (eventId) {
        // Load event details
        loadEventDetails(eventId);
        
        // Load related events
        loadRelatedEvents(eventId);
    } else {
        // Show event not found message
        document.getElementById('eventDetails').classList.add('d-none');
        document.getElementById('eventNotFound').classList.remove('d-none');
    }
});

// Load event details
function loadEventDetails(eventId) {
    // Find event in data
    const event = eventsData.find(e => e.id === parseInt(eventId));
    
    if (!event) {
        // Show event not found message
        document.getElementById('eventDetails').classList.add('d-none');
        document.getElementById('eventNotFound').classList.remove('d-none');
        return;
    }
    
    // Update page title
    document.title = `${event.name} - Event Locator`;
    
    // Update breadcrumb
    document.getElementById('eventBreadcrumb').textContent = event.name;
    
    // Create event details HTML
    const eventDetailsHTML = `
        <div class="event-header" style="background-image: url('${event.image}')">
            <div class="container event-header-content">
                <span class="badge bg-primary mb-2">${event.category}</span>
                <h1 class="display-5 fw-bold mb-3">${event.name}</h1>
                <div class="event-meta">
                    <div class="event-meta-item">
                        <i class="bi bi-calendar-event"></i>
                        ${formatDate(event.date)}
                    </div>
                    <div class="event-meta-item">
                        <i class="bi bi-clock"></i>
                        ${event.time}
                    </div>
                    <div class="event-meta-item">
                        <i class="bi bi-geo-alt"></i>
                        ${event.location}, ${event.city}
                    </div>
                    <div class="event-meta-item">
                        <i class="bi bi-cash"></i>
                        ${event.price}
                    </div>
                </div>
            </div>
        </div>
        
        <div class="container mt-5">
            <div class="row">
                <div class="col-lg-8">
                    <div class="card mb-4">
                        <div class="card-body">
                            <h2 class="h4 mb-3">About This Event</h2>
                            <p>${event.fullDescription}</p>
                        </div>
                    </div>
                </div>
                
                <div class="col-lg-4">
                    <div class="card mb-4">
                        <div class="card-header bg-light">
                            <h3 class="h5 mb-0">Event Information</h3>
                        </div>
                        <div class="card-body">
                            <p class="mb-2">
                                <strong><i class="bi bi-calendar-event me-2"></i>Date:</strong>
                                ${formatDate(event.date)}
                            </p>
                            <p class="mb-2">
                                <strong><i class="bi bi-clock me-2"></i>Time:</strong>
                                ${event.time}
                            </p>
                            <p class="mb-2">
                                <strong><i class="bi bi-geo-alt me-2"></i>Location:</strong>
                                ${event.location}, ${event.city}
                            </p>
                            <p class="mb-2">
                                <strong><i class="bi bi-tag me-2"></i>Category:</strong>
                                ${event.category}
                            </p>
                            <p class="mb-2">
                                <strong><i class="bi bi-cash me-2"></i>Price:</strong>
                                ${event.price}
                            </p>
                            <p class="mb-0">
                                <strong><i class="bi bi-person me-2"></i>Organizer:</strong>
                                ${event.organizer}
                            </p>
                        </div>
                    </div>
                    
                    <div class="card mb-4">
                        <div class="card-header bg-light">
                            <h3 class="h5 mb-0">Contact Information</h3>
                        </div>
                        <div class="card-body">
                            <p class="mb-0">
                                <strong><i class="bi bi-envelope me-2"></i>Email:</strong>
                                <a href="mailto:${event.contact}">${event.contact}</a>
                            </p>
                        </div>
                    </div>
                    
                    <div class="card mb-4">
                        <div class="card-body">
                            <h3 class="h5 mb-3">Share This Event</h3>
                            <div class="d-flex">
                                <a href="#" class="btn btn-outline-primary me-2" title="Share on Facebook">
                                    <i class="bi bi-facebook"></i>
                                </a>
                                <a href="#" class="btn btn-outline-info me-2" title="Share on Twitter">
                                    <i class="bi bi-twitter"></i>
                                </a>
                                <a href="#" class="btn btn-outline-success me-2" title="Share on WhatsApp">
                                    <i class="bi bi-whatsapp"></i>
                                </a>
                                <a href="#" class="btn btn-outline-secondary" title="Copy Link">
                                    <i class="bi bi-link-45deg"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="d-grid">
                        <button class="btn btn-primary btn-lg">
                            <i class="bi bi-ticket-perforated me-2"></i>Get Tickets
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Update the DOM
    document.getElementById('eventDetails').innerHTML = eventDetailsHTML;
}

// Load related events (same category)
function loadRelatedEvents(eventId) {
    const relatedEventsContainer = document.getElementById('relatedEvents');
    if (!relatedEventsContainer) return;
    
    // Find current event
    const currentEvent = eventsData.find(e => e.id === parseInt(eventId));
    if (!currentEvent) return;
    
    // Find events in the same category
    let relatedEvents = eventsData.filter(event => 
        event.category === currentEvent.category && event.id !== parseInt(eventId)
    );
    
    // If less than 3 related events, add some random events
    if (relatedEvents.length < 3) {
        const otherEvents = eventsData.filter(event => 
            event.category !== currentEvent.category && event.id !== parseInt(eventId)
        );
        
        const shuffledOtherEvents = [...otherEvents].sort(() => 0.5 - Math.random());
        relatedEvents = [...relatedEvents, ...shuffledOtherEvents].slice(0, 3);
    } else {
        // Take only the first 3 related events
        relatedEvents = relatedEvents.slice(0, 3);
    }
    
    // Clear container
    relatedEventsContainer.innerHTML = '';
    
    // Add related events
    relatedEvents.forEach(event => {
        const eventCard = createEventCard(event);
        relatedEventsContainer.appendChild(eventCard);
    });
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