// CUSTOM CURSOR
const cursorDot = document.getElementById('cursorDot');
const cursorOutline = document.getElementById('cursorOutline');
let outlineX = 0,
    outlineY = 0,
    targetX = 0,
    targetY = 0;
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
    });
    const animateOutline = () => {
        outlineX += (targetX - outlineX) * 0.18;
        outlineY += (targetY - outlineY) * 0.18;
        cursorOutline.style.left = outlineX + 'px';
        cursorOutline.style.top = outlineY + 'px';
        requestAnimationFrame(animateOutline);
    };
    animateOutline();
    document.querySelectorAll('a, button, .faq-item, .portfolio-item').forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovering'));
    });
}

// SCROLL PROGRESS BAR
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = pct + '%';
});

// NAVBAR ACTIVE STATE (scroll-spy)
const navAnchorLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const spySections = Array.from(navAnchorLinks)
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
const setActiveLink = () => {
    let currentId = null;
    const scrollPos = window.scrollY + 120;
    spySections.forEach(section => {
        if (section.offsetTop <= scrollPos) currentId = section.id;

    });
    navAnchorLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });
};
window.addEventListener('scroll', setActiveLink);
setActiveLink();

// NAVBAR SCROLL
window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
});

// ===== HAMBURGER (animasi + tutup dengan klik di mana aja) =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

function openMenu() {
    navLinks.classList.remove('closing');
    navLinks.classList.add('open');
    hamburger.classList.add('open');
}

function closeMenu() {
    if (!navLinks.classList.contains('open')) return;
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    navLinks.classList.add('closing');
    navLinks.addEventListener('animationend', function handler() {
        navLinks.classList.remove('closing');
        navLinks.removeEventListener('animationend', handler);
    }, { once: true });
}

hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (navLinks.classList.contains('open')) {
        closeMenu();
    } else {
        openMenu();
    }
});

// klik di mana aja di dalam menu (link ataupun bukan) langsung nutup
navLinks.addEventListener('click', closeMenu);

// klik di luar hamburger & menu juga nutup
document.addEventListener('click', (e) => {
    if (!navLinks.classList.contains('open')) return;
    const clickedInsideMenu = navLinks.contains(e.target);
    const clickedHamburger = hamburger.contains(e.target);
    if (!clickedInsideMenu && !clickedHamburger) {
        closeMenu();
    }
});

// tutup otomatis kalau layar di-resize balik ke ukuran desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 640) closeMenu();
});

// FAQ ACCORDION
document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-question').addEventListener('click', () => {
        item.classList.toggle('open');
    });
});

// SCROLL REVEAL
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
});
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// BACK TO TOP
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 500);
});
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// COUNT-UP HERO STATS
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const statEls = document.querySelectorAll('.hero-stats .num');
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const raw = el.textContent.trim();
        const match = raw.match(/^([\d.]+)(.*)$/);
        if (!match) return;
        const targetVal = parseFloat(match[1]);
        const suffix = match[2];
        const isDecimal = match[1].includes('.');
        if (prefersReducedMotion) {
            statObserver.unobserve(el);
            return;
        }
        let start = null;
        const duration = 1000;
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * targetVal;
            el.textContent = (isDecimal ? current.toFixed(1) : Math.round(current)) +
                suffix;
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = raw;
        };
        requestAnimationFrame(step);
        statObserver.unobserve(el);
    });
}, {
    threshold: 0.5
});
statEls.forEach(el => statObserver.observe(el));

// WHATSAPP TOOLTIP — muncul 5 detik setelah web dibuka
const waTooltip = document.getElementById('waTooltip');
const waTooltipClose = document.getElementById('waTooltipClose');
let waTooltipTimer = null;
let waTooltipHideTimer = null;

if (waTooltip) {
    waTooltipTimer = setTimeout(() => {
        waTooltip.classList.add('show');
        // auto-hide setelah 8 detik supaya tidak mengganggu terus-terusan
        waTooltipHideTimer = setTimeout(() => {
            waTooltip.classList.remove('show');
        }, 8000);
    }, 5000);
}

if (waTooltipClose) {
    waTooltipClose.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        waTooltip.classList.remove('show');
        clearTimeout(waTooltipTimer);
        clearTimeout(waTooltipHideTimer);
    });
}

// ===== PORTFOLIO — TAMPILKAN LEBIH BANYAK =====
const portfolioGrid = document.getElementById('portfolioGrid');
const portfolioMoreBtn = document.getElementById('portfolioMoreBtn');

if (portfolioGrid && portfolioMoreBtn) {
    const extraItems = portfolioGrid.querySelectorAll('.portfolio-extra');
    if (extraItems.length === 0) {
        portfolioMoreBtn.style.display = 'none';
    } else {
        portfolioMoreBtn.addEventListener('click', () => {
            const isExpanded = portfolioGrid.classList.toggle('expanded');
            portfolioMoreBtn.classList.toggle('is-open', isExpanded);

            if (isExpanded) {
                portfolioMoreBtn.childNodes[0].nodeValue = 'Tampilkan Lebih Sedikit ';
                extraItems.forEach(item => revealObserver.observe(item));
            } else {
                portfolioMoreBtn.childNodes[0].nodeValue = 'Tampilkan Lebih Banyak ';
                // scroll balik ke atas section portfolio biar rapi
                document.getElementById('portfolio').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}


// kirim ke wa bagian kontak
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const nama = document.getElementById('nama').value;
    const email = document.getElementById('email').value;
    const wa = document.getElementById('wa').value;
    const subjek = document.getElementById('subjek').value;
    const pesan = document.getElementById('pesan').value;

    const text = `
Halo Fathahaz, saya ingin menghubungi Anda.

Nama: ${nama}
Email: ${email}
WhatsApp: ${wa}
Topik: ${subjek}

Pesan:
${pesan}
    `;

    window.open(
        `https://wa.me/6282110757763?text=${encodeURIComponent(text)}`,
        '_blank'
    );
});
