/**
 * Sport News - Interactive Functionality
 * Matches the Figma design interactions & modern responsive UX
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------
  // 1. Mobile Navigation Toggle
  // -------------------------------------------------------------
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileNavToggle && navMenu) {
    mobileNavToggle.addEventListener('click', () => {
      const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
      mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking any nav link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // -------------------------------------------------------------
  // 2. Active Nav Link on Scroll
  // -------------------------------------------------------------
  const sections = document.querySelectorAll('main section[id]');
  const navItems = document.querySelectorAll('.nav-item');

  function updateActiveNav() {
    let currentId = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navItems.forEach(item => {
        const link = item.querySelector('a');
        if (link && link.getAttribute('href') === `#${currentId}`) {
          navItems.forEach(i => i.classList.remove('active'));
          item.classList.add('active');
        }
      });
    }
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // -------------------------------------------------------------
  // 3. Search Modal & Live Filter
  // -------------------------------------------------------------
  const searchModal = document.getElementById('searchModal');
  const openSearchBtn = document.getElementById('openSearchBtn');
  const closeSearchBtn = document.getElementById('closeSearchBtn');
  const modalSearchInput = document.getElementById('modalSearchInput');
  const searchResults = document.getElementById('searchResults');

  function openSearch() {
    searchModal.classList.add('open');
    setTimeout(() => modalSearchInput.focus(), 100);
  }

  function closeSearch() {
    searchModal.classList.remove('open');
    modalSearchInput.value = '';
    filterSearchResults('');
  }

  if (openSearchBtn && searchModal) {
    openSearchBtn.addEventListener('click', openSearch);
    closeSearchBtn.addEventListener('click', closeSearch);

    // Close when clicking outside card
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) {
        closeSearch();
      }
    });

    // Keyboard navigation (Escape to close)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchModal.classList.contains('open')) {
        closeSearch();
      }
    });

    // Live search filter
    function filterSearchResults(query) {
      const items = searchResults.querySelectorAll('.search-result-item');
      const q = query.trim().toLowerCase();
      let hasVisible = false;

      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(q)) {
          item.style.display = 'flex';
          hasVisible = true;
        } else {
          item.style.display = 'none';
        }
      });

      let noMatchMsg = searchResults.querySelector('.no-results-msg');
      if (!hasVisible) {
        if (!noMatchMsg) {
          noMatchMsg = document.createElement('div');
          noMatchMsg.className = 'no-results-msg';
          noMatchMsg.style.padding = '12px';
          noMatchMsg.style.color = '#94A3B8';
          noMatchMsg.style.fontSize = '14px';
          noMatchMsg.style.textAlign = 'center';
          noMatchMsg.textContent = 'No matching sports or articles found.';
          searchResults.appendChild(noMatchMsg);
        }
      } else if (noMatchMsg) {
        noMatchMsg.remove();
      }
    }

    modalSearchInput.addEventListener('input', (e) => {
      filterSearchResults(e.target.value);
    });

    // Handle clicking a search result
    searchResults.addEventListener('click', (e) => {
      const item = e.target.closest('.search-result-item');
      if (item) {
        const target = item.getAttribute('data-target');
        closeSearch();
        if (target) {
          const el = document.querySelector(target);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    });
  }

  // -------------------------------------------------------------
  // 4. Featured Banner Carousel / Pagination
  // -------------------------------------------------------------
  const bannerStories = [
    {
      badge: 'Football',
      meta: 'Agence France-Presse - 04 June 2023',
      title: 'LIONEL MESSI LEAVING LIGUE 1 TEAM PARIS SAINT-GERMAIN, CLUB CONFIRMS',
      desc: 'The EuroLeague Finals Top Scorer is the individual award for the player that gained the highest points in the EuroLeague Finals'
    },
    {
      badge: 'Basketball',
      meta: 'Sports Illustrated - 05 June 2023',
      title: 'DENVER NUGGETS CLINCH HISTORIC NBA FINALS CHAMPIONSHIP VICTORY',
      desc: 'Nikola Jokic leads dominant performance to secure franchise first ever Larry O’Brien Championship Trophy with record triple-double run.'
    },
    {
      badge: 'Formula 1',
      meta: 'Motorsport Wire - 06 June 2023',
      title: 'RED BULL RACING EXTENDS DOMINANT STREAK AT CANADIAN GRAND PRIX',
      desc: 'Max Verstappen claims 41st career victory equalling Ayrton Senna record in front of 300,000 passionate Montreal spectators.'
    },
    {
      badge: 'Tennis',
      meta: 'Roland Garros Daily - 07 June 2023',
      title: 'NOVAK DJOKOVIC WINS RECORD-BREAKING 23RD GRAND SLAM TITLE IN PARIS',
      desc: 'Historic triumph on Court Philippe-Chatrier places Djokovic alone atop men’s tennis all-time major championships leaderboard.'
    }
  ];

  let currentBannerPage = 1;
  const bannerPrevBtn = document.getElementById('bannerPrevBtn');
  const bannerNextBtn = document.getElementById('bannerNextBtn');
  const bannerNumbers = document.querySelectorAll('#bannerPageNumbers .page-number');
  const bannerCard = document.getElementById('bannerCard');

  function updateBannerStory(pageIndex) {
    currentBannerPage = pageIndex;
    const story = bannerStories[pageIndex - 1];

    if (bannerCard && story) {
      const badgeEl = bannerCard.querySelector('.badge-outline');
      const metaEl = bannerCard.querySelector('.meta-tag');
      const titleEl = bannerCard.querySelector('.hero-banner-title');
      const descEl = bannerCard.querySelector('.hero-banner-desc');

      // Subtle fade effect
      titleEl.style.opacity = '0';
      descEl.style.opacity = '0';

      setTimeout(() => {
        badgeEl.textContent = story.badge;
        metaEl.textContent = story.meta;
        titleEl.textContent = story.title;
        descEl.textContent = story.desc;
        titleEl.style.opacity = '1';
        descEl.style.opacity = '1';
      }, 150);
    }

    // Update active number
    bannerNumbers.forEach(btn => {
      const btnPage = parseInt(btn.getAttribute('data-page'), 10);
      btn.classList.toggle('active', btnPage === currentBannerPage);
    });
  }

  if (bannerPrevBtn && bannerNextBtn) {
    bannerPrevBtn.addEventListener('click', () => {
      const prev = currentBannerPage > 1 ? currentBannerPage - 1 : bannerStories.length;
      updateBannerStory(prev);
    });

    bannerNextBtn.addEventListener('click', () => {
      const next = currentBannerPage < bannerStories.length ? currentBannerPage + 1 : 1;
      updateBannerStory(next);
    });

    bannerNumbers.forEach(btn => {
      btn.addEventListener('click', () => {
        const p = parseInt(btn.getAttribute('data-page'), 10);
        updateBannerStory(p);
      });
    });
  }

  // -------------------------------------------------------------
  // 5. Sports Articles Carousel Controls
  // -------------------------------------------------------------
  const articlesPrevBtn = document.getElementById('articlesPrevBtn');
  const articlesNextBtn = document.getElementById('articlesNextBtn');
  const articlesGrid = document.getElementById('articlesGrid');

  if (articlesPrevBtn && articlesNextBtn && articlesGrid) {
    const cards = articlesGrid.querySelectorAll('.article-card');

    articlesNextBtn.addEventListener('click', () => {
      // Reorder cards with smooth transition
      articlesGrid.style.opacity = '0.6';
      articlesGrid.style.transform = 'translateX(-6px)';
      setTimeout(() => {
        articlesGrid.appendChild(articlesGrid.firstElementChild);
        articlesGrid.style.opacity = '1';
        articlesGrid.style.transform = 'translateX(0)';
      }, 150);
    });

    articlesPrevBtn.addEventListener('click', () => {
      articlesGrid.style.opacity = '0.6';
      articlesGrid.style.transform = 'translateX(6px)';
      setTimeout(() => {
        articlesGrid.insertBefore(articlesGrid.lastElementChild, articlesGrid.firstElementChild);
        articlesGrid.style.opacity = '1';
        articlesGrid.style.transform = 'translateX(0)';
      }, 150);
    });
  }

  // -------------------------------------------------------------
  // 6. Newsletter Form Submission
  // -------------------------------------------------------------
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterEmail = document.getElementById('newsletterEmail');
  const newsletterFeedback = document.getElementById('newsletterFeedback');

  if (newsletterForm && newsletterEmail && newsletterFeedback) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterEmail.value.trim();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        newsletterFeedback.textContent = 'Please enter a valid email address.';
        newsletterFeedback.className = 'newsletter-feedback error';
        newsletterEmail.focus();
        return;
      }

      newsletterFeedback.textContent = 'Thank you for subscribing! Stay tuned for breaking sports updates.';
      newsletterFeedback.className = 'newsletter-feedback success';
      newsletterEmail.value = '';

      setTimeout(() => {
        newsletterFeedback.textContent = '';
        newsletterFeedback.className = 'newsletter-feedback';
      }, 5000);
    });
  }

  // -------------------------------------------------------------
  // 7. Footer Pagination
  // -------------------------------------------------------------
  let footerCurrentPage = 1;
  const footerPrevBtn = document.getElementById('footerPrevBtn');
  const footerNextBtn = document.getElementById('footerNextBtn');
  const footerNumbers = document.querySelectorAll('#footerPageNumbers .page-number');

  function updateFooterPage(p) {
    footerCurrentPage = p;
    footerNumbers.forEach(btn => {
      const btnPage = parseInt(btn.getAttribute('data-page'), 10);
      btn.classList.toggle('active', btnPage === footerCurrentPage);
    });
    // Smooth scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (footerPrevBtn && footerNextBtn) {
    footerPrevBtn.addEventListener('click', () => {
      const prev = footerCurrentPage > 1 ? footerCurrentPage - 1 : 4;
      updateFooterPage(prev);
    });

    footerNextBtn.addEventListener('click', () => {
      const next = footerCurrentPage < 4 ? footerCurrentPage + 1 : 1;
      updateFooterPage(next);
    });

    footerNumbers.forEach(btn => {
      btn.addEventListener('click', () => {
        const p = parseInt(btn.getAttribute('data-page'), 10);
        updateFooterPage(p);
      });
    });
  }
});

