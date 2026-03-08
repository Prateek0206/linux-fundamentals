/* shared/nav.js — injected into every page */

const NAV_PAGES = [
  { href: 'index.html',         icon: '⌂',  label: 'Home'           },
  { href: 'fundamentals.html',  icon: '🐧', label: 'Fundamentals'   },
  { href: 'distros.html',       icon: '📦', label: 'Distros'        },
  { href: 'cheatsheet.html',    icon: '⚡', label: 'Cheatsheets'    },
  { href: 'glossary.html',      icon: '📖', label: 'Glossary'       },
  { href: 'my-server.html',     icon: '🖥', label: 'My Server'      },
  { href: 'advanced.html',      icon: '🔬', label: 'Advanced'       },
  { href: 'scripting.html',     icon: '✦',  label: 'Scripting'      },
  { href: 'how-to-search.html', icon: '🔍', label: 'How to Search'  },
];

function buildNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';

  // Top nav
  const nav = document.getElementById('topnav');
  if (!nav) return;

  const logoHref = current === 'index.html' ? '#' : 'index.html';
  nav.innerHTML = `
    <a class="nav-logo" href="${logoHref}">
      <div class="nav-logo-mark">λ</div>
      <div class="nav-logo-text">linux<span>.docs</span></div>
    </a>
    <div class="nav-links" id="nav-links">
      ${NAV_PAGES.map(p => `
        <a class="nav-link ${p.href === current ? 'active' : ''}" href="${p.href}">
          <span class="nav-link-icon">${p.icon}</span>${p.label}
        </a>
      `).join('')}
    </div>
    <div class="nav-right">
      <div class="nav-badge on">● Ubuntu 24.04</div>
      <button class="hamburger" onclick="toggleMobileNav()">☰</button>
    </div>
  `;

  // Mobile drawer
  const drawer = document.getElementById('mobile-drawer');
  if (drawer) {
    drawer.innerHTML = `
      <div id="mobile-drawer-bg" onclick="toggleMobileNav()"></div>
      <div id="mobile-drawer-panel">
        ${NAV_PAGES.map(p => `
          <a class="mobile-nav-link ${p.href === current ? 'active' : ''}" href="${p.href}">
            <span>${p.icon}</span>${p.label}
          </a>
        `).join('')}
      </div>
    `;
  }
}

function toggleMobileNav() {
  const drawer = document.getElementById('mobile-drawer');
  if (drawer) drawer.classList.toggle('open');
}

// Progress bar
function initProgressBar() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total = document.body.scrollHeight - window.innerHeight;
    if (total > 0) bar.style.width = (window.scrollY / total * 100) + '%';
  }, { passive: true });
}

// Sidebar TOC active tracking
function initTOC() {
  const toc = document.getElementById('toc');
  if (!toc) return;
  const links = toc.querySelectorAll('.toc-link[href^="#"]');
  const sections = Array.from(links).map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const id = e.target.id;
        const match = toc.querySelector(`.toc-link[href="#${id}"]`);
        if (match) match.classList.add('active');
      }
    });
  }, { rootMargin: '-10% 0px -75% 0px' });

  sections.forEach(s => obs.observe(s));
}

// Copy buttons
function doCopy(btn, text) {
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.textContent;
    btn.textContent = '✓ copied'; btn.classList.add('ok');
    setTimeout(() => { btn.textContent = orig; btn.classList.remove('ok'); }, 2000);
  });
}
function doCopyInline(btn, text) {
  navigator.clipboard.writeText(text).then(() => {
    const o = btn.textContent; btn.textContent = '✓';
    setTimeout(() => btn.textContent = o, 1800);
  });
}

// FAQ toggle
function toggleFaq(el) { el.parentElement.classList.toggle('open'); }

// Glossary toggle
function toggleGloss(el) { el.closest('.gloss-item').classList.toggle('open'); }

// Init all
document.addEventListener('DOMContentLoaded', () => {
  buildNav();
  initProgressBar();
  initTOC();
});
