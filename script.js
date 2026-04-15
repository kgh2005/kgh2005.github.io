/**
 * GeunHyeong Kim Portfolio Script v12
 * Handles dynamic data loading and UI interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Fetch data from JSON
  fetch('./data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      renderPortfolio(data);
      initializeInteractions();
    })
    .catch(error => {
      console.error('Error loading portfolio data:', error);
    });
});

function renderPortfolio(data) {
  // 1. Profile & Hero
  const profile = data.profile;
  setText('hero-name', profile.name);
  setText('hero-subtitle', `✨${profile.title} | ${profile.email}`);
  setText('footer-name', profile.name);
  setText('footer-subtitle', `✨${profile.title} | ${profile.email}`);
  
  const profileImg = document.getElementById('profile-image');
  if (profileImg) profileImg.src = profile.profile_image;
  
  const aboutQuote = document.getElementById('about-quote');
  if (aboutQuote) {
    aboutQuote.innerHTML = profile.about_quote.replace(
      'legged robotic systems', 
      '<strong>legged robotic systems</strong>'
    );
  }
  
  setText('current-year', new Date().getFullYear());

  // 2. Social Icons Rendering (Using Font Awesome)
  const socialLinks = [
    { iconClass: 'fa-regular fa-envelope', link: `mailto:${profile.email}`, title: 'Email' },
    { iconClass: 'fa-brands fa-linkedin', link: profile.linkedin, title: 'LinkedIn' },
    { iconClass: 'fa-brands fa-github', link: profile.github, title: 'GitHub' }
  ];

  const iconTemplate = (item) => `
    <a href="${item.link}" target="_blank" rel="noopener" aria-label="${item.title}" title="${item.title}">
      <i class="${item.iconClass}"></i>
    </a>
  `;

  renderList('nav-icons-container', socialLinks, iconTemplate);
  renderList('hero-social-container', socialLinks, iconTemplate);
  renderList('footer-icons-container', socialLinks, iconTemplate);

  // 3. Interests & Skills
  renderList('interests-container', data.interests, (item) => `<span class="tag-interest">${item}</span>`);
  renderList('skills-container', data.skills, (item) => `<span class="tag-skill">${item}</span>`);

  // 4. Featured Experience
  const featured = data.featured_experience;
  const featuredContainer = document.getElementById('featured-card-container');
  if (featuredContainer) {
    featuredContainer.innerHTML = `
      <div class="featured-logo-wrap">
        <img src="${featured.logo}" alt="${featured.title}" class="featured-logo" />
      </div>
      <div class="featured-content">
        <h3>${featured.title}</h3>
        <p class="featured-role">${featured.role}</p>
        <span class="featured-period">${featured.period}</span>
        <p class="featured-desc">${featured.description}</p>
        <ul class="featured-list">
          ${featured.highlights.map(h => `<li>${h}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  // 5. Integrated Competition Awards & Projects
  renderList('competitions-container', data.competition_awards, (comp) => `
    <a href="${comp.link}" target="_blank" class="project-card animate-on-scroll">
      <div class="award-badge">${comp.award}</div>
      <div class="project-img-wrap">
        <img src="${comp.image}" alt="${comp.title}" class="project-img" />
      </div>
      <div class="project-body">
        <h3 class="project-title">${comp.title} (${comp.year})</h3>
        <div class="project-tags">
          ${comp.tags.map(tag => `<span class="tag-tech">${tag}</span>`).join('')}
        </div>
        <p class="project-desc">${comp.description}</p>
      </div>
    </a>
  `);

  // 6. General Projects
  renderList('general-projects-container', data.general_projects, (proj) => `
    <a href="${proj.link}" target="_blank" class="project-card animate-on-scroll">
      <div class="project-img-wrap">
        <img src="${proj.image}" alt="${proj.title}" class="project-img" />
      </div>
      <div class="project-body">
        <h3 class="project-title">${proj.title}</h3>
        <div class="project-tags">
          ${proj.tags.map(tag => `<span class="tag-tech">${tag}</span>`).join('')}
        </div>
        <p class="project-desc">${proj.description}</p>
      </div>
    </a>
  `);

  // 7. Experience (Timeline)
  renderList('experience-container', data.other_experience, (exp) => `
    <div class="timeline-item">
      <div class="timeline-header">
        <div>
          <h3 class="timeline-role">${exp.role}</h3>
          <p class="timeline-company">${exp.company}</p>
        </div>
        <span class="timeline-period">${exp.period}</span>
      </div>
      <ul class="timeline-list">
        ${exp.details.map(d => `<li>${d}</li>`).join('')}
      </ul>
    </div>
  `);

  // 8. Education
  renderList('education-container', data.education, (edu) => `
    <div class="edu-card">
      <div class="edu-header">
        <div>
          <h3 class="edu-degree">${edu.degree}</h3>
          <p class="edu-school">${edu.school}</p>
        </div>
        <span class="edu-period">${edu.period}</span>
      </div>
      <ul class="edu-list">
        ${edu.details.map(d => `<li>${d}</li>`).join('')}
      </ul>
    </div>
  `);
}

/**
 * Helper: Set text content safely
 */
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

/**
 * Helper: Render a list of items to a container using a template
 */
function renderList(containerId, items, templateFn) {
  const container = document.getElementById(containerId);
  if (container && items) {
    container.innerHTML = items.map(templateFn).join('');
  }
}

/**
 * Initialize Scroll & Nav interactions
 */
function initializeInteractions() {
  const header = document.getElementById('header');
  
  // Scroll Effect for Header
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // Active Nav Link Highlight
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-list a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.pageYOffset >= sectionTop - 150) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // Intersection Observer for Animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-on-scroll, .project-card, .timeline-item, .edu-card').forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
  });
}
