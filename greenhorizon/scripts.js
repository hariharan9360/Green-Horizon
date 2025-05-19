        // Slider functionality
        const slides = document.querySelectorAll('.slide');
        let currentSlide = 0;

        function showSlide(n) {
            slides.forEach(slide => slide.classList.remove('active'));
            currentSlide = (n + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
        }

        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        // Change slide every 5 seconds
        setInterval(nextSlide, 5000);

        // Sidebar functionality
        const sidebar = document.getElementById('sidebar');
        const toggleSidebar = document.getElementById('toggleSidebar');
        const closeSidebar = document.getElementById('closeSidebar');

        toggleSidebar.addEventListener('click', () => {
            sidebar.classList.add('open');
        });

        closeSidebar.addEventListener('click', () => {
            sidebar.classList.remove('open');
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && e.target !== toggleSidebar) {
                sidebar.classList.remove('open');
            }
        });

        // Animation on scroll
        const animateOnScroll = () => {
            const elements = document.querySelectorAll('.feature-card, .tip-card');
            const windowHeight = window.innerHeight;
            
            elements.forEach(element => {
                const elementPosition = element.getBoundingClientRect().top;
                const animationPoint = windowHeight * 0.8;
                
                if (elementPosition < animationPoint) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        };

        // Set initial state for animation
        document.querySelectorAll('.feature-card, .tip-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        });

        // Run once on load
        animateOnScroll();

        // Run on scroll
        window.addEventListener('scroll', animateOnScroll);
