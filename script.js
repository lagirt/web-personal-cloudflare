document.addEventListener('DOMContentLoaded', () => {
    // 1. Año actual en el footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Cambio de Tema (Claro / Oscuro)
    const themeToggle = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        htmlEl.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        htmlEl.setAttribute('data-theme', 'dark');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            htmlEl.setAttribute('data-theme', currentTheme);
            localStorage.setItem('theme', currentTheme);
        });
    }

    // 3. Menú móvil responsive
    const menuToggle = document.getElementById('menu-toggle');
    const navLinksContainer = document.getElementById('nav-links');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener('click', () => {
            const isOpen = navLinksContainer.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', String(isOpen));
        });

        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // 4. Resaltar sección activa al hacer scroll
    const sections = document.querySelectorAll('section[id]');
    const updateActiveNav = () => {
        const scrollY = window.scrollY + 120;
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach((link) => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
                });
            }
        });
    };
    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // 5. Animación de aparición al hacer scroll (IntersectionObserver)
    const revealElements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );

        revealElements.forEach((el) => revealObserver.observe(el));
    } else {
        revealElements.forEach((el) => el.classList.add('visible'));
    }

    // 6. Botón para copiar correo electrónico al portapapeles
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const copyEmailText = document.getElementById('copy-email-text');

    if (copyEmailBtn && copyEmailText) {
        copyEmailBtn.addEventListener('click', async () => {
            const email = copyEmailBtn.getAttribute('data-email') || 'olivatrigal@gmail.com';
            try {
                await navigator.clipboard.writeText(email);
                copyEmailText.textContent = '¡Correo copiado al portapapeles!';
                setTimeout(() => {
                    copyEmailText.textContent = 'Copiar correo electrónico';
                }, 2600);
            } catch {
                window.location.href = `mailto:${email}`;
            }
        });
    }

    // 7. Formulario de contacto rápido (abre cliente de correo con datos listos)
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            const mailtoSubject = encodeURIComponent(`${subject} - Contacto de ${name}`);
            const mailtoBody = encodeURIComponent(
                `Hola Trigal,\n\n${message}\n\n---\nEnviado por: ${name}\nCorreo de contacto: ${email}`
            );

            window.location.href = `mailto:olivatrigal@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

            if (formFeedback) {
                formFeedback.textContent = 'Abriendo tu aplicación de correo para enviar el mensaje...';
            }
            contactForm.reset();
        });
    }
});
