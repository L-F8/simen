// Xu ly chung cho cac menu item khi hover vao cac menu item 
// thi hien thi cac dropdown su dung chung transition 
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


const menuBottomCart = document.querySelector('.menu-bottom__cart')
const productsList = menuBottomCart.querySelector('.transition-default')
menuBottomCart.addEventListener('mouseenter', () => {
    productsList.classList.add('transition-hover')
})
menuBottomCart.addEventListener('mouseleave', () => {
    productsList.classList.remove('transition-hover')
})


// Xu ly khi load trang thi se hien overlay
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.overlay')?.classList.add('active')
})

// Dong overlay
// document.querySelector('.overlay__btn-close').addEventListener('click', () => {
//     document.querySelector('.overlay').classList.remove('active')
// })


// // Xu ly hien nut tro ve dau trang khi cuon trang
// const returnBtn = document.querySelector('.return-btn')

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