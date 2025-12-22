// ----------- For banner image auto slider with pagination -----------
const transitions = [
    't-fade', 't-wipe', 't-reveal', 't-cover', 't-split',
    't-rotate', 't-flip', 't-cube', 't-doors', 't-window',
    't-blinds', 't-comb', 't-box', 't-gallery', 't-clock',
    't-bars', 't-switch'
];

let lastTransition = null;
const imageSlider = document.querySelector('.image-show');

function getNextTransition() {
    let next;
    do {
        next = transitions[Math.floor(Math.random() * transitions.length)];
    } while (next === lastTransition);
    lastTransition = next;
    return next;
}

const swiper = new Swiper(imageSlider, {
    loop: true,
    speed: 800,

    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },

    pagination: {
        el: '.custom-pagination',
        clickable: true,
    },

    on: {
        slideChangeTransitionStart() {
            imageSlider.classList.remove(...transitions);
            imageSlider.classList.add(getNextTransition());
        }
    }
});


// Blog slider - Su dung thu vien Swiper.js
const blogsSwiper = new Swiper(".blogs-swiper", {
    slidesPerView: 3,
    spaceBetween: 30,

    loop: true,
    speed: 600,

    autoplay: false,
    allowTouchMove: true,
    grabCursor: true,

    breakpoints: {
        0: {
            slidesPerView: 2,
        },
        576: {
            slidesPerView: 2,
        },
        768: {
            slidesPerView: 2,
        },
        992: {
            slidesPerView: 3,
        },
        1200: {
            slidesPerView: 3,
        },
        1400: {
            slidesPerView: 3,
        },
    }
})


// Brand slider - Su dung Swiper.js
const brandSwiper = new Swiper('.brand-swiper', {
    slidesPerView: 5,
    spaceBetween: 0,

    loop: true,
    speed: 600,

    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    allowTouchMove: true,
    grabCursor: true,

    breakpoints: {
        0: {
            slidesPerView: 4,
        },
        576: {
            slidesPerView: 4,
        },
        768: {
            slidesPerView: 4,
        },
        992: {
            slidesPerView: 5,
        },
        1200: {
            slidesPerView: 5,
        },
        1400: {
            slidesPerView: 5,
        },
    },
});