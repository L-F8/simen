/** 
 * Xu ly chung cho cac menu item khi hover vao cac menu item 
 * thi hien thi cac dropdown su dung chung transition 
 */
// Language and Currency unit dropdown
const selectGroups = document.querySelectorAll('.select-group')
selectGroups.forEach((select) => {
    const dropdown = select.querySelector('.transition-default')

    if (!dropdown) return

    select.addEventListener('mouseenter', () => {
        dropdown.classList.add('transition-hover')
    })

    select.addEventListener('mouseleave', () => {
        dropdown.classList.remove('transition-hover')
    })
})


// Items Cart
const menuBottomCart = document.querySelector('.menu-bottom__cart')
const productsList = menuBottomCart.querySelector('.transition-default')
menuBottomCart.addEventListener('mouseenter', () => {
    productsList.classList.add('transition-hover')
})
menuBottomCart.addEventListener('mouseleave', () => {
    productsList.classList.remove('transition-hover')
})


// Quick access for menu-top__right dropdown on medium screen
const quickAccess = document.querySelector('.quick-access')
const quickAccessDropdown = quickAccess.querySelector('.transition-default')
quickAccess.addEventListener('mouseenter', () => {
    quickAccessDropdown.classList.add('transition-hover')
})
quickAccess.addEventListener('mouseleave', () => {
    quickAccessDropdown.classList.remove('transition-hover')
})


/**
 * Xu ly cho overlay khi tai trang lan dau tien 
 */
// Xu ly khi load trang thi se hien overlay
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.overlay')?.classList.add('active')
})

// Dong overlay
document.querySelector('.overlay__btn-close').addEventListener('click', () => {
    document.querySelector('.overlay').classList.remove('active')
})


/**
 * Xu ly display nut tro lai dau trang khi cuon trang xuong
 */
// Xu ly hien nut tro ve dau trang khi cuon trang
const returnBtn = document.querySelector('.return-btn')

// window.addEventListener("scroll", () => {
//     const scrollTop = window.scrollY;
//     const windowHeight = window.innerHeight;
//     const documentHeight = document.documentElement.scrollHeight;

//     if (scrollTop + windowHeight >= documentHeight - 300) {
//         returnBtn.classList.add('show')
//     } else {
//         returnBtn.classList.remove('show')
//     }

//     if (scrollTop < 200) {
//         returnBtn.classList.remove('show')
//     }
// })

// returnBtn.addEventListener('click', () => {
//     window.scrollTo({
//         top: 0,
//         behavior: "smooth"
//     })

//     returnBtn.classList.remove('show')
// })


/**
 * Xu ly hover vao phan search o menu-bottom
 */
// Xu ly khi hover vao icon search thi hien input visible transition
const wrapper = document.querySelector('.menu-bottom__wrapper')
const iconSearch = wrapper.querySelector('.menu-bottom__search-icon')
const navbar = wrapper.querySelector('.menu-bottom__navbar')
const hiddenSearch = wrapper.querySelector('.menu-bottom__hidden-search')

function openSearch() {
    navbar.classList.add('is-hidden')
    hiddenSearch.classList.add('is-hover')
}

function closeSearch() {
    navbar.classList.remove('is-hidden')
    hiddenSearch.classList.remove('is-hover')
}

// mở khi hover icon
iconSearch.addEventListener('mouseenter', openSearch)

// giữ mở khi rê vào search
hiddenSearch.addEventListener('mouseenter', openSearch)

// đóng khi chuột rời search
hiddenSearch.addEventListener('mouseleave', closeSearch)

// đóng khi rời icon nhưng KHÔNG đi vào search
iconSearch.addEventListener('mouseleave', (e) => {
    if (hiddenSearch.contains(e.relatedTarget)) return
    closeSearch()
})


/**
 * Xu ly cho phan tac vu tren mobile, tablet
 */
// Process in sidebar menu on mobile, tablet
const sidebar = document.querySelector('.menu-bottom__sidebar');
const menuRoot = document.querySelector('.sidebar-menu');

menuRoot.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn_accor');
    if (!btn) return;

    const header = btn.closest('.accr_header');
    const content = header.nextElementSibling;
    if (!content || !content.classList.contains('accr_content')) return;

    const parentUL = header.closest('ul');
    const isOpening = !content.classList.contains('open');

    // 👉 đóng các submenu cùng cấp
    parentUL.querySelectorAll(':scope > li > .accr_content.open')
        .forEach(el => {
            if (el !== content) closeSubmenu(el);
        });

    // 👉 toggle submenu hiện tại
    isOpening ? openSubmenu(content) : closeSubmenu(content);

    // 👉 toggle icon
    const icon = btn.querySelector('i');
    icon.classList.toggle('fa-plus-circle', !isOpening);
    icon.classList.toggle('fa-minus-circle', isOpening);

    // 👉 xử lý scroll CHỈ KHI mở menu cấp 3+
    handleSidebarScroll();
});

function openSubmenu(el) {
    el.classList.add('open');
    el.style.height = el.scrollHeight + 'px';

    el.addEventListener('transitionend', function handler() {
        el.style.height = 'auto';
        el.removeEventListener('transitionend', handler);
        handleSidebarScroll();
    });
}

function closeSubmenu(el) {
    el.style.height = el.scrollHeight + 'px';
    requestAnimationFrame(() => {
        el.style.height = '0px';
        el.classList.remove('open');
        handleSidebarScroll();
    });

    const icon = el.previousElementSibling?.querySelector('i');
    icon?.classList.add('fa-plus-circle');
    icon?.classList.remove('fa-minus-circle');
}

function handleSidebarScroll() {
    requestAnimationFrame(() => {
        if (sidebar.scrollHeight > sidebar.clientHeight) {
            sidebar.classList.add('has-scroll');
        } else {
            sidebar.classList.remove('has-scroll');
        }
    });
}


// Open/Close sidebar menu on mobile, tablet
const barOpenMenu = document.querySelector('.mobile-bar__open-sidebar');
const overlaySidebar = document.querySelector('.menu-bottom__overlay');

barOpenMenu.addEventListener('click', () => {
    sidebar.classList.add('open');
    overlaySidebar.classList.add('open');
})

overlaySidebar.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlaySidebar.classList.remove('open');
})