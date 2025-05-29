// js/index/carousel.js

export function initializeCarousel() {
    const mainCarouselWrapper = document.querySelector('.mainCarouselWrapper');
    const mainCarouselSlide = document.querySelector('.mainCarouselSlide');
    const mainCarouselContainer = document.querySelector('.mainCarouselContainer');
    const carouselImages = document.querySelectorAll('.mainCarouselSlide img');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // Si no se encuentran los elementos necesarios, no inicializar el carrusel
    if (!mainCarouselWrapper || !mainCarouselSlide || !prevBtn || !nextBtn || carouselImages.length === 0) {
        console.warn('Carousel elements not found. Skipping carousel initialization.');
        return;
    }

    const mainCarouselDotsContainer = document.createElement('div');
    mainCarouselDotsContainer.classList.add('mainCarouseldots');
    // Asegurarse de que mainCarouselContainer exista antes de adjuntar el contenedor de puntos
    if (mainCarouselContainer) {
        mainCarouselContainer.appendChild(mainCarouselDotsContainer);
    } else {
        console.warn('mainCarouselContainer not found. Carousel dots will not be appended.');
    }
    

    let counter = 0;
    let imageWidth;
    let autoSlideInterval;

    function createMainDots() {
        mainCarouselDotsContainer.innerHTML = ''; // Limpiar puntos existentes antes de crear
        carouselImages.forEach((_, index) => {
            const mainDot = document.createElement('span');
            mainDot.classList.add('mainDot');
            if (index === 0) {
                mainDot.classList.add('active');
            }
            mainDot.dataset.index = index;
            mainDot.addEventListener('click', () => {
                counter = index;
                slideCarousel();
                updateMainDots();
                resetAutoSlide(); // Reiniciar el carrusel automático al hacer clic en un punto
            });
            mainCarouselDotsContainer.appendChild(mainDot);
        });
    }

    function updateMainDots() {
        document.querySelectorAll('.mainDot').forEach((mainDot, index) => {
            if (index === counter) {
                mainDot.classList.add('active');
            } else {
                mainDot.classList.remove('active');
            }
        });
    }

    function calculateImageWidth() {
        imageWidth = mainCarouselContainer.clientWidth;
        slideCarousel();
    }

    function slideCarousel() {
        mainCarouselSlide.style.transform = `translateX(${-counter * imageWidth}px)`;
    }

    function plusSlides(n) {
        counter += n;
        if (counter >= carouselImages.length) {
            counter = 0;
        } else if (counter < 0) {
            counter = carouselImages.length - 1;
        }
        slideCarousel();
        updateMainDots();
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            plusSlides(1);
        }, 5000); // Cambia cada 5 segundos
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // Event Listeners para botones de navegación
    prevBtn.addEventListener('click', () => {
        plusSlides(-1);
        resetAutoSlide(); // Reiniciar al hacer clic en botón
    });

    nextBtn.addEventListener('click', () => {
        plusSlides(1);
        resetAutoSlide(); // Reiniciar al hacer clic en botón
    });

    // Lógica para mostrar/ocultar los botones en la zona extendida
    prevBtn.style.opacity = '0';
    prevBtn.style.pointerEvents = 'none';
    nextBtn.style.opacity = '0';
    nextBtn.style.pointerEvents = 'none';

    mainCarouselWrapper.addEventListener('mouseenter', () => {
        prevBtn.style.opacity = '0.7';
        prevBtn.style.pointerEvents = 'auto';
        nextBtn.style.opacity = '0.7';
        nextBtn.style.pointerEvents = 'auto';
    });

    mainCarouselWrapper.addEventListener('mouseleave', () => {
        prevBtn.style.opacity = '0';
        prevBtn.style.pointerEvents = 'none';
        nextBtn.style.opacity = '0';
        nextBtn.style.pointerEvents = 'none';
    });

    mainCarouselContainer.addEventListener('mouseenter', () => {
        prevBtn.style.opacity = '0';
        prevBtn.style.pointerEvents = 'none';
        nextBtn.style.opacity = '0';
        nextBtn.style.pointerEvents = 'none';
    });

    mainCarouselContainer.addEventListener('mouseleave', (event) => {
        if (mainCarouselWrapper.contains(event.relatedTarget)) {
            prevBtn.style.opacity = '0.7';
            prevBtn.style.pointerEvents = 'auto';
            nextBtn.style.opacity = '0.7';
            nextBtn.style.pointerEvents = 'auto';
        }
    });

    // Inicialización al cargar
    createMainDots();
    calculateImageWidth();
    updateMainDots();
    startAutoSlide(); // Iniciar el carrusel automático
    window.addEventListener('resize', calculateImageWidth);
}