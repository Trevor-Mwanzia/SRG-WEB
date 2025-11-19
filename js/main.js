// Configuration object for editable content
const defaultConfig = {
    hero_tagline: "Committed to the Community – Empowering Neurodiverse Kids for a Brighter Future",
    hero_subtitle: "Supporting children with autism, cerebral palsy, epilepsy, and related neurological conditions in Nairobi, Kenya and beyond",
    mission_text: "Founded in 2019 by Kate Mwanzia-Kagema, SRG is dedicated to spreading hope, creating awareness, and fostering independence for children with neurological conditions.",
    contact_email: "info@stemresourcegroup.org",
    contact_phone: "+254 733 213 063",
    closing_quote: "I am different, not less."
};

// Initialize Element SDK
async function initializeElementSDK() {
    if (window.elementSdk) {
        await window.elementSdk.init({
            defaultConfig: defaultConfig,
            onConfigChange: async (config) => {
                // Update hero section
                const heroTagline = document.getElementById('hero-tagline');
                const heroSubtitle = document.getElementById('hero-subtitle');
                const missionText = document.getElementById('mission-text');
                const contactEmail = document.getElementById('contact-email');
                const contactPhone = document.getElementById('contact-phone');
                const closingQuote = document.getElementById('closing-quote');

                if (heroTagline) heroTagline.textContent = config.hero_tagline || defaultConfig.hero_tagline;
                if (heroSubtitle) heroSubtitle.textContent = config.hero_subtitle || defaultConfig.hero_subtitle;
                if (missionText) missionText.textContent = config.mission_text || defaultConfig.mission_text;
                if (contactEmail) contactEmail.textContent = config.contact_email || defaultConfig.contact_email;
                if (contactPhone) contactPhone.textContent = config.contact_phone || defaultConfig.contact_phone;
                if (closingQuote) closingQuote.textContent = `"${config.closing_quote || defaultConfig.closing_quote}"`;
            },
            mapToCapabilities: (config) => ({
                recolorables: [],
                borderables: [],
                fontEditable: undefined,
                fontSizeable: undefined
            }),
            mapToEditPanelValues: (config) => new Map([
                ["hero_tagline", config.hero_tagline || defaultConfig.hero_tagline],
                ["hero_subtitle", config.hero_subtitle || defaultConfig.hero_subtitle],
                ["mission_text", config.mission_text || defaultConfig.mission_text],
                ["contact_email", config.contact_email || defaultConfig.contact_email],
                ["contact_phone", config.contact_phone || defaultConfig.contact_phone],
                ["closing_quote", config.closing_quote || defaultConfig.closing_quote]
            ])
        });
    }
}

const CALENDAR_ID = 'e2241266cda49530aa6cdfb4411e28642c1ef9e7dfff066a9a5d430e6afaca37@group.calendar.google.com';

let events = [];

// Function to fetch upcoming events from Google Calendar
async function fetchUpcomingEvents() {
    try {
        const response = await fetch('/.netlify/functions/fetch-events');
        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }

        const data = await response.json();
        events = data.items.map(event => ({
            date: new Date(event.start.dateTime || event.start.date),
            title: event.summary || 'Untitled Event',
            location: event.location || 'Location TBD',
            rsvpLink: event.htmlLink || '#'
        }));

        renderEvents();
    } catch (error) {
        console.error('Error fetching events:', error);
        // Fallback to static events if API fails
        events = JSON.parse(localStorage.getItem('events')) || [
            {
                date: new Date(2025, 11, 15), // December 15, 2025
                title: 'Autism Awareness Workshop',
                location: 'Nairobi, Kenya',
                rsvpLink: '#'
            },
            {
                date: new Date(2025, 11, 20), // December 20, 2025
                title: 'Parent Support Group Meeting',
                location: 'Online (Zoom)',
                rsvpLink: '#'
            },
            {
                date: new Date(2025, 11, 25), // December 25, 2025
                title: 'Holiday Special Program',
                location: 'SRG Center, Nairobi',
                rsvpLink: '#'
            },
            {
                date: new Date(2026, 0, 10), // January 10, 2026
                title: 'Facebook Live: Understanding Autism',
                location: 'Facebook Live',
                rsvpLink: 'https://www.facebook.com/stemresourcegroup'
            },
            {
                date: new Date(2026, 0, 17), // January 17, 2026
                title: 'Facebook Q&A: Cerebral Palsy',
                location: 'Facebook Live',
                rsvpLink: 'https://www.facebook.com/stemresourcegroup'
            }
        ].map(event => ({ ...event, date: new Date(event.date) }));
        renderEvents();
    }
}

// Static upcoming events rendering
function renderEvents() {
    const container = document.getElementById('upcoming-events-list');
    if (!container) return;

    container.innerHTML = '';
    if (events.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-600">No upcoming events.</p>';
        return;
    }

    events.forEach(ev => {
        const item = document.createElement('div');
        item.className = 'bg-white rounded-lg p-6 flex items-center justify-between';

        const left = document.createElement('div');
        left.className = 'flex items-center';

        const dateBox = document.createElement('div');
        dateBox.className = 'w-16 h-16 bg-blue-100 rounded-lg flex flex-col items-center justify-center mr-4';

        const monthEl = document.createElement('span');
        monthEl.className = 'text-xs text-blue-600 font-semibold';
        monthEl.textContent = ev.date.toLocaleString(undefined, { month: 'short' }).toUpperCase();

        const dayEl = document.createElement('span');
        dayEl.className = 'text-lg font-bold text-blue-600';
        dayEl.textContent = ev.date.getDate();

        dateBox.appendChild(monthEl);
        dateBox.appendChild(dayEl);

        const meta = document.createElement('div');
        const title = document.createElement('h4');
        title.className = 'font-bold text-gray-800';
        title.textContent = ev.title;

        const desc = document.createElement('p');
        desc.className = 'text-gray-600';
        desc.textContent = `${ev.date.toLocaleDateString(undefined, { dateStyle: 'medium' })} — ${ev.location}`;

        meta.appendChild(title);
        meta.appendChild(desc);

        left.appendChild(dateBox);
        left.appendChild(meta);

        const rightDiv = document.createElement('div');
        rightDiv.className = 'flex flex-col gap-2';

        const rightBtn = document.createElement('a');
        rightBtn.href = ev.rsvpLink;
        rightBtn.className = 'bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors';
        rightBtn.textContent = 'RSVP';

        rightDiv.appendChild(rightBtn);

        item.appendChild(left);
        item.appendChild(rightDiv);
        container.appendChild(item);
    });
}

function renderStaticCalendar() {
    const calendarContainer = document.getElementById('static-calendar');
    if (!calendarContainer) return;

    calendarContainer.innerHTML = '';

    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const daysInMonth = lastDayOfMonth.getDate();
    const startingDay = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.

    const monthName = now.toLocaleString('default', { month: 'long' });

    const calendarHeader = document.createElement('div');
    calendarHeader.className = 'text-center text-xl font-bold text-gray-800 mb-4';
    calendarHeader.textContent = `${monthName} ${year}`;
    calendarContainer.appendChild(calendarHeader);

    const daysOfWeekContainer = document.createElement('div');
    daysOfWeekContainer.className = 'grid grid-cols-7 gap-2 text-sm font-semibold text-gray-600 mb-2';
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysOfWeek.forEach(day => {
        const dayEl = document.createElement('div');
        dayEl.className = 'text-center';
        dayEl.textContent = day;
        daysOfWeekContainer.appendChild(dayEl);
    });
    calendarContainer.appendChild(daysOfWeekContainer);

    const daysGrid = document.createElement('div');
    daysGrid.className = 'grid grid-cols-7 gap-2';

    for (let i = 0; i < startingDay; i++) {
        const emptyDay = document.createElement('div');
        daysGrid.appendChild(emptyDay);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'flex items-center justify-center h-10 w-10 rounded-full border border-gray-300 bg-white';
        dayEl.textContent = i;

        const currentDate = new Date(year, month, i);
        const hasEvent = events.some(event => {
            return event.date.getFullYear() === currentDate.getFullYear() &&
                event.date.getMonth() === currentDate.getMonth() &&
                event.date.getDate() === currentDate.getDate();
        });

        if (hasEvent) {
            dayEl.classList.add('bg-blue-500', 'text-white', 'font-bold', 'border-blue-500');
        } else {
            dayEl.classList.add('text-gray-700');
        }

        daysGrid.appendChild(dayEl);
    }
    calendarContainer.appendChild(daysGrid);
}

// Mobile menu functionality
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    if (btn) {
        btn.addEventListener('click', function () {
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu) mobileMenu.classList.toggle('hidden');
        });
    }
}

// Smooth scrolling for navigation links
function initSmoothScroll() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            // Close mobile menu if open
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu) mobileMenu.classList.add('hidden');
        });
    });
}

// Contact form handling
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const formMessage = document.getElementById('form-message');
        if (!formMessage) return;
        formMessage.className = 'mt-4 p-4 rounded-lg bg-green-100 text-green-700';
        formMessage.textContent = 'Thank you for your message! We will get back to you soon.';
        formMessage.classList.remove('hidden');
        this.reset();
        setTimeout(() => {
            formMessage.classList.add('hidden');
        }, 5000);
    });
}

// Intersection Observer for fade-in animations
function initObservers() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-fade').forEach(section => {
        observer.observe(section);
    });
}

// Hero CTA buttons on the homepage
function initHeroCTAs() {
    const learnBtn = document.getElementById('cta-learn');
    const joinBtn = document.getElementById('cta-join');
    const eventsBtn = document.getElementById('cta-events');

    if (learnBtn) {
        learnBtn.addEventListener('click', function (e) {
            e.preventDefault();
            scrollToSection('about');
        });
    }

    if (joinBtn) {
        joinBtn.addEventListener('click', function (e) {
            e.preventDefault();
            scrollToSection('contact');
        });
    }

    if (eventsBtn) {
        eventsBtn.addEventListener('click', function (e) {
            e.preventDefault();
            scrollToSection('events');
        });
    }
}

// Utility functions for interactive features
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function showModal(title, content) {
    const overlay = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');
    if (!overlay || !modalContent) return;
    modalContent.innerHTML = `
        <div class="p-8">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-2xl font-bold text-gray-800">${title}</h3>
                <button onclick="closeModal()" class="text-gray-500 hover:text-gray-700" aria-label="Close modal">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            ${content}
        </div>
    `;
    overlay.classList.remove('hidden');
}

function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) overlay.classList.add('hidden');
}

function showProgramDetails(title, description) {
    const content = `
        <div class="mb-6">
            <p class="text-gray-600 mb-4">${description}</p>
            <div class="bg-blue-50 p-4 rounded-lg mb-4">
                <h4 class="font-semibold text-blue-800 mb-2">How to Get Involved:</h4>
                <ul class="text-blue-700 text-sm space-y-1">
                    <li>• Contact us to learn more about this program</li>
                    <li>• Volunteer your time and skills</li>
                    <li>• Support through donations</li>
                    <li>• Spread awareness in your community</li>
                </ul>
            </div>
        </div>
        <div class="flex space-x-3">
            <button onclick="scrollToSection('contact'); closeModal();" class="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Contact Us
            </button>
            <button onclick="closeModal()" class="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                Close
            </button>
        </div>
    `;
    showModal(title, content);
}

function showDonationModal() {
    const content = `
        <div class="mb-6">
            <p class="text-gray-600 mb-4">Your donation helps us provide essential services to neurodiverse children and their families.</p>
            <div class="bg-green-50 p-4 rounded-lg mb-4">
                <h4 class="font-semibold text-green-800 mb-2">Your Impact:</h4>
                <ul class="text-green-700 text-sm space-y-1">
                    <li>• Provides therapy materials for one child</li>
                    <li>• Supports a family through our caregiver program</li>
                    <li>• Funds a community awareness workshop</li>
                    <li>• Sponsors a child's therapy sessions for a month</li>
                </ul>
            </div>
            <p class="text-sm text-gray-500 mb-4">This is a demonstration. In a real implementation, this would connect to a secure payment processor.</p>
        </div>
        <div class="flex space-x-3">
            <button onclick="scrollToSection('contact'); closeModal();" class="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                Contact for Donations
            </button>
            <button onclick="closeModal()" class="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                Close
            </button>
        </div>
    `;
    showModal('Make a Donation', content);
}

function showMonthlyGivingModal() {
    const content = `
        <div class="mb-6">
            <p class="text-gray-600 mb-4">Join our monthly giving program to provide sustained support for our programs.</p>
            <div class="bg-green-50 p-4 rounded-lg mb-4">
                <h4 class="font-semibold text-green-800 mb-2">Monthly Impact:</h4>
                <ul class="text-green-700 text-sm space-y-1">
                    <li>• Ongoing therapy support</li>
                    <li>• Family support services</li>
                    <li>• Community program funding</li>
                    <li>• Comprehensive child sponsorship</li>
                </ul>
            </div>
            <p class="text-sm text-gray-500 mb-4">This is a demonstration. In a real implementation, this would connect to a secure payment processor.</p>
        </div>
        <div class="flex space-x-3">
            <button onclick="scrollToSection('contact'); closeModal();" class="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                Contact for Monthly Giving
            </button>
            <button onclick="closeModal()" class="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                Close
            </button>
        </div>
    `;
    showModal('Monthly Giving Program', content);
}

function showVolunteerForm() {
    const content = `
        <div class="mb-6">
            <p class="text-gray-600 mb-4">We welcome volunteers who are passionate about supporting neurodiverse children and families.</p>
            <div class="bg-blue-50 p-4 rounded-lg mb-4">
                <h4 class="font-semibold text-blue-800 mb-2">Volunteer Opportunities:</h4>
                <ul class="text-blue-700 text-sm space-y-1">
                    <li>• Event support and coordination</li>
                    <li>• Educational workshop assistance</li>
                    <li>• Community outreach programs</li>
                    <li>• Administrative and social media support</li>
                    <li>• Fundraising campaign assistance</li>
                </ul>
            </div>
        </div>
        <div class="flex space-x-3">
            <button onclick="scrollToSection('contact'); closeModal();" class="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Apply to Volunteer
            </button>
            <button onclick="closeModal()" class="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                Close
            </button>
        </div>
    `;
    showModal('Volunteer with SRG', content);
}

function showPartnershipForm() {
    const content = `
        <div class="mb-6">
            <p class="text-gray-600 mb-4">Partner with us to expand our impact and create more opportunities for neurodiverse children.</p>
            <div class="bg-yellow-50 p-4 rounded-lg mb-4">
                <h4 class="font-semibold text-yellow-800 mb-2">Partnership Types:</h4>
                <ul class="text-yellow-700 text-sm space-y-1">
                    <li>• Educational institutions and schools</li>
                    <li>• Healthcare providers and therapy centers</li>
                    <li>• Corporate social responsibility programs</li>
                    <li>• Other NGOs and community organizations</li>
                    <li>• International development partners</li>
                </ul>
            </div>
        </div>
        <div class="flex space-x-3">
            <button onclick="scrollToSection('contact'); closeModal();" class="flex-1 bg-yellow-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-yellow-700 transition-colors">
                Discuss Partnership
            </button>
            <button onclick="closeModal()" class="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                Close
            </button>
        </div>
    `;
    showModal('Partnership Opportunities', content);
}

function showRSVPForm(eventName) {
    const content = `
        <div class="mb-6">
            <p class="text-gray-600 mb-4">Reserve your spot for: <strong>${eventName}</strong></p>
            <div class="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 class="font-semibold text-gray-800 mb-2">Event Details:</h4>
                <ul class="text-gray-700 text-sm space-y-1">
                    <li>• Free attendance for all participants</li>
                    <li>• Light refreshments will be provided</li>
                    <li>• Materials and resources included</li>
                    <li>• Certificate of participation available</li>
                </ul>
            </div>
        </div>
        <div class="flex space-x-3">
            <button onclick="scrollToSection('contact'); closeModal();" class="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                RSVP via Contact Form
            </button>
            <button onclick="closeModal()" class="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                Close
            </button>
        </div>
    `;
    showModal('Event RSVP', content);
}

function showEventSchedule() {
    const content = `
        <div class="mb-6">
            <p class="text-gray-600 mb-4">Upcoming international seminars and webinars across Africa.</p>
            <div class="space-y-3">
                <div class="bg-gray-50 p-3 rounded-lg">
                    <h5 class="font-semibold text-gray-800">April 2024 - Casablanca, Morocco</h5>
                    <p class="text-sm text-gray-600">NeuroGen Medical Seminar</p>
                </div>
                <div class="bg-gray-50 p-3 rounded-lg">
                    <h5 class="font-semibold text-gray-800">May 2024 - Tunis, Tunisia</h5>
                    <p class="text-sm text-gray-600">Autism Awareness Workshop</p>
                </div>
                <div class="bg-gray-50 p-3 rounded-lg">
                    <h5 class="font-semibold text-gray-800">June 2024 - Sfax, Tunisia</h5>
                    <p class="text-sm text-gray-600">Caregiver Support Training</p>
                </div>
            </div>
        </div>
        <div class="flex space-x-3">
            <button onclick="scrollToSection('contact'); closeModal();" class="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                Get More Info
            </button>
            <button onclick="closeModal()" class="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                Close
            </button>
        </div>
    `;
    showModal('Event Schedule', content);
}

function showEducationalMaterials() {
    const content = `
        <div class="mb-6">
            <p class="text-gray-600 mb-4">Access comprehensive guides and educational materials designed for parents and caregivers of neurodiverse children. Our resources cover topics from early intervention to school support and daily living skills.</p>
            <div class="bg-blue-50 p-4 rounded-lg mb-4">
                <h4 class="font-semibold text-blue-800 mb-2">Available Resources:</h4>
                <ul class="text-blue-700 text-sm space-y-1">
                    <li>• Early Intervention Guides</li>
                    <li>• School Support Materials</li>
                    <li>• Daily Living Skills Worksheets</li>
                    <li>• Parent Support Handbooks</li>
                    <li>• Educational Planning Templates</li>
                </ul>
            </div>
        </div>
        <div class="flex space-x-3">
            <button onclick="scrollToSection('contact'); closeModal();" class="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Request Resources
            </button>
            <button onclick="closeModal()" class="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                Close
            </button>
        </div>
    `;
    showModal('Educational Materials', content);
}

function showSupportGroups() {
    const content = `
        <div class="mb-6">
            <p class="text-gray-600 mb-4">Connect with other families and caregivers through our support groups. Find local and online communities where you can share experiences, get advice, and build lasting relationships with others on similar journeys.</p>
            <div class="bg-green-50 p-4 rounded-lg mb-4">
                <h4 class="font-semibold text-green-800 mb-2">Support Group Options:</h4>
                <ul class="text-green-700 text-sm space-y-1">
                    <li>• Weekly Online Parent Meetings</li>
                    <li>• Local Nairobi Support Groups</li>
                    <li>• Caregiver Peer Support Sessions</li>
                    <li>• Sibling Support Groups</li>
                    <li>• Professional Consultation Hours</li>
                </ul>
            </div>
        </div>
        <div class="flex space-x-3">
            <button onclick="scrollToSection('contact'); closeModal();" class="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                Join a Group
            </button>
            <button onclick="closeModal()" class="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                Close
            </button>
        </div>
    `;
    showModal('Support Groups', content);
}

function showTherapyResources() {
    const content = `
        <div class="mb-6">
            <p class="text-gray-600 mb-4">Explore professional therapy options and resources available for neurodiverse children. Learn about different therapy approaches, how to find qualified therapists, and what to expect from therapy sessions.</p>
            <div class="bg-yellow-50 p-4 rounded-lg mb-4">
                <h4 class="font-semibold text-yellow-800 mb-2">Therapy Resources:</h4>
                <ul class="text-yellow-700 text-sm space-y-1">
                    <li>• Occupational Therapy Guides</li>
                    <li>• Speech Therapy Resources</li>
                    <li>• Behavioral Therapy Information</li>
                    <li>• Physical Therapy Materials</li>
                    <li>• Therapy Provider Directory</li>
                </ul>
            </div>
        </div>
        <div class="flex space-x-3">
            <button onclick="scrollToSection('contact'); closeModal();" class="flex-1 bg-yellow-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-yellow-700 transition-colors">
                Find Therapists
            </button>
            <button onclick="closeModal()" class="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                Close
            </button>
        </div>
    `;
    showModal('Therapy Resources', content);
}

function showAdvocacyGuides() {
    const content = `
        <div class="mb-6">
            <p class="text-gray-600 mb-4">Get tools and guides to help advocate for your child's needs in educational and healthcare settings. Learn about your rights, how to communicate effectively with professionals, and strategies for successful advocacy.</p>
            <div class="bg-purple-50 p-4 rounded-lg mb-4">
                <h4 class="font-semibold text-purple-800 mb-2">Advocacy Resources:</h4>
                <ul class="text-purple-700 text-sm space-y-1">
                    <li>• IEP and Education Rights Guide</li>
                    <li>• Healthcare Advocacy Templates</li>
                    <li>• Communication Strategies</li>
                    <li>• Legal Rights Information</li>
                    <li>• School Accommodation Guides</li>
                </ul>
            </div>
        </div>
        <div class="flex space-x-3">
            <button onclick="scrollToSection('contact'); closeModal();" class="flex-1 bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                Get Advocacy Guides
            </button>
            <button onclick="closeModal()" class="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                Close
            </button>
        </div>
    `;
    showModal('Advocacy Guides', content);
}

function showNewsletters() {
    const content = `
        <div class="mb-6">
            <p class="text-gray-600 mb-4">Stay informed with our regular newsletters featuring the latest news, research, and resources for neurodiverse families. Subscribe to receive updates directly in your inbox.</p>
            <div class="bg-red-50 p-4 rounded-lg mb-4">
                <h4 class="font-semibold text-red-800 mb-2">Newsletter Features:</h4>
                <ul class="text-red-700 text-sm space-y-1">
                    <li>• Latest Research Updates</li>
                    <li>• Program Success Stories</li>
                    <li>• Community Event Announcements</li>
                    <li>• Resource Recommendations</li>
                    <li>• Policy and Advocacy News</li>
                </ul>
            </div>
        </div>
        <div class="flex space-x-3">
            <button onclick="scrollToSection('contact'); closeModal();" class="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                Subscribe Now
            </button>
            <button onclick="closeModal()" class="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                Close
            </button>
        </div>
    `;
    showModal('Newsletters', content);
}

function showFAQHelp() {
    const content = `
        <div class="mb-6">
            <p class="text-gray-600 mb-4">Find answers to common questions about neurological conditions, our programs, and how to get involved. Browse our comprehensive FAQ section for quick information and support.</p>
            <div class="bg-indigo-50 p-4 rounded-lg mb-4">
                <h4 class="font-semibold text-indigo-800 mb-2">FAQ Categories:</h4>
                <ul class="text-indigo-700 text-sm space-y-1">
                    <li>• Understanding Neurological Conditions</li>
                    <li>• SRG Programs and Services</li>
                    <li>• Getting Started with Support</li>
                    <li>• Volunteer and Partnership Opportunities</li>
                    <li>• Donation and Fundraising Information</li>
                </ul>
            </div>
        </div>
        <div class="flex space-x-3">
            <button onclick="scrollToSection('contact'); closeModal();" class="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                Ask a Question
            </button>
            <button onclick="closeModal()" class="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                Close
            </button>
        </div>
    `;
    showModal('FAQ & Help', content);
}

// Carousel functionality
document.addEventListener('DOMContentLoaded', function () {
    const carouselContainer = document.querySelector('.carousel-container');
    if (!carouselContainer) return;

    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const indicators = document.querySelectorAll('.carousel-indicator');

    let currentIndex = 0;
    let autoPlayInterval;

    function showSlide(index) {
        const slidesContainer = document.querySelector('.carousel-slides');
        slidesContainer.style.transform = `translateX(-${index * 100}%)`;
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
        currentIndex = index;
    }

    function nextSlide() {
        const nextIndex = (currentIndex + 1) % slides.length;
        showSlide(nextIndex);
    }

    function prevSlide() {
        const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(prevIndex);
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoPlay();
            startAutoPlay();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoPlay();
            startAutoPlay();
        });
    }

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            stopAutoPlay();
            startAutoPlay();
        });
    });

    // Pause on hover
    carouselContainer.addEventListener('mouseenter', stopAutoPlay);
    carouselContainer.addEventListener('mouseleave', startAutoPlay);

    // Start autoplay
    startAutoPlay();
});

// Close modal when clicking outside
document.addEventListener('click', function (e) {
    // only close if click is on overlay (delegated from modal overlay in DOM)
    const overlay = document.getElementById('modal-overlay');
    if (overlay && e.target === overlay) {
        closeModal();
    }
});

function initEventEditing() {
    const editButton = document.getElementById('edit-events-btn');
    const modal = document.getElementById('edit-events-modal');
    const closeModalButton = document.getElementById('close-edit-modal-btn');
    const saveButton = document.getElementById('save-events-btn');
    const addEventButton = document.getElementById('add-event-btn');
    const formContainer = document.getElementById('edit-events-form-container');

    editButton.addEventListener('click', () => {
        const password = prompt('Enter the password to edit events:');
        if (password === 'SRGWEB') {
            populateEventForm();
            modal.classList.remove('hidden');
        } else {
            alert('Incorrect password.');
        }
    });

    closeModalButton.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    addEventButton.addEventListener('click', () => {
        const newEvent = {
            date: new Date(),
            title: 'New Event',
            location: 'Location',
            rsvpLink: '#'
        };
        events.push(newEvent);
        populateEventForm();
    });

    saveButton.addEventListener('click', () => {
        const eventForms = formContainer.querySelectorAll('.event-form');
        const newEvents = [];
        eventForms.forEach(form => {
            const title = form.querySelector('.event-title').value;
            const date = new Date(form.querySelector('.event-date').value);
            const location = form.querySelector('.event-location').value;
            const rsvpLink = form.querySelector('.event-rsvp').value;
            newEvents.push({ title, date, location, rsvpLink });
        });
        events = newEvents;
        localStorage.setItem('events', JSON.stringify(events));
        renderEvents();
        modal.classList.add('hidden');
    });

    function populateEventForm() {
        formContainer.innerHTML = '';
        events.forEach((event, index) => {
            const form = document.createElement('div');
            form.className = 'event-form border p-4 rounded-lg space-y-2';
            form.innerHTML = `
                <div class="flex justify-between items-center">
                    <h4 class="text-lg font-semibold">Event ${index + 1}</h4>
                    <button class="delete-event-btn bg-red-500 text-white px-2 py-1 rounded" data-index="${index}">Delete</button>
                </div>
                <input type="text" class="w-full p-2 border rounded event-title" value="${event.title}">
                <input type="date" class="w-full p-2 border rounded event-date" value="${event.date.toISOString().split('T')[0]}">
                <input type="text" class="w-full p-2 border rounded event-location" value="${event.location}">
                <input type="text" class="w-full p-2 border rounded event-rsvp" value="${event.rsvpLink}">
            `;
            formContainer.appendChild(form);
        });

        formContainer.querySelectorAll('.delete-event-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                events.splice(index, 1);
                populateEventForm();
            });
        });
    }
}


// Initialize SDK and UI when page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeElementSDK();
    initMobileMenu();
    initSmoothScroll();
    initContactForm();
    initObservers();
    initHeroCTAs();
    fetchUpcomingEvents(); // Fetch dynamic events from Google Calendar
    initEventEditing();
    renderStaticCalendar();
});

// Cloudflare challenge iframe script preserved from original file
(function () { function c() { var b = a.contentDocument || a.contentWindow.document; if (b) { var d = b.createElement('script'); d.innerHTML = "window.__CF$cv$params={r:'9972d67117d06936',t:'MTc2MTkxMDQwOC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);"; b.getElementsByTagName('head')[0].appendChild(d) } } if (document.body) { var a = document.createElement('iframe'); a.height = 1; a.width = 1; a.style.position = 'absolute'; a.style.top = 0; a.style.left = 0; a.style.border = 'none'; a.style.visibility = 'hidden'; document.body.appendChild(a); if ('loading' !== document.readyState) c(); else if (window.addEventListener) document.addEventListener('DOMContentLoaded', c); else { var e = document.onreadystatechange || function () { }; document.onreadystatechange = function (b) { e(b); 'loading' !== document.readyState && (document.onreadystatechange = e, c()) } } } })();