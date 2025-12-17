// Blog slider - Su dung thu vien Swiper.js
const blogsSwiper = new Swiper(".blogs-swiper", {
    slidesPerView: 3,
    spaceBetween: 30,

    loop: true,
    speed: 600,

    autoplay: false,
    allowTouchMove: true,
    grabCursor: true,
})


// Brand slider - K dung thu vien ho tro, thuan JS
const slider = document.querySelector('.brand-swiper');
const track = document.querySelector('.brand-wrapper');

let items = Array.from(track.children);
const totalWidth = track.scrollWidth;

// ===== clone 2 lần =====
items.forEach(item => track.appendChild(item.cloneNode(true))); // clone phía sau
// clone phía trước → duyệt ngược
for (let i = items.length - 1; i >= 0; i--) {
    track.insertBefore(items[i].cloneNode(true), track.firstChild);
}

let position = -totalWidth; // start ở track gốc
let speed = 0.4;
let rafId = null;

// ===== chạy auto =====
function run() {
    position -= speed;

    if (position <= -totalWidth * 2) position += totalWidth;
    if (position >= 0) position -= totalWidth;

    track.style.transform = `translateX(${position}px)`;
    rafId = requestAnimationFrame(run);
}

run();

// ===== drag =====
let isDragging = false;
let startX = 0;
let lastX = 0;
let moved = false;

slider.addEventListener('mousedown', e => {
    isDragging = true;
    moved = false;
    startX = lastX = e.pageX;
    slider.classList.add('dragging');
    cancelAnimationFrame(rafId);
});

window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const dx = e.pageX - lastX;
    lastX = e.pageX;

    if (Math.abs(e.pageX - startX) > 5) moved = true;
    position += dx;
    track.style.transform = `translateX(${position}px)`;
});

window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    slider.classList.remove('dragging');

    if (moved) {
        // kéo xong → không click link
        track.addEventListener('click', preventClickOnce, { once: true });
    }

    rafId = requestAnimationFrame(run); // auto tiep
});

// block click khi drag
track.addEventListener('click', e => {
    if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
    }
});

// chặn click nếu kéo
function preventClickOnce(e) {
    e.preventDefault();
    e.stopPropagation();
}
