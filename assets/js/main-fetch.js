// Common data fetching
const fetchBase = async () => {
    const res = await fetch('/simen/assets/data/products.json');

    if (!res.ok) {
        throw new Error(`Fetch failed: ${res.status}`);
    }

    return res.json();
};

let products = [];
let currentIndex = 0;
let currentFilter = 'latest';
let filteredProducts = [];
const LIMIT = 5;

// =========== Latest, Best Seller, Featured ===========
const productWrapper = document.getElementById("product-wrapper");
const productChooseItems = document.querySelectorAll('.product-choose__link');
const loadMoreBtn = document.getElementById("loadMoreBtn");

async function fetchProducts() {
    products = await fetchBase();
    loadMore();
};

fetchProducts();

// Handle for button "Load More Items"
function loadMore() {
    setButtonState({ text: "Loading...", disabled: true });

    setTimeout(() => {
        const source = filteredProducts.length ? filteredProducts : products;

        const nextProducts = source.slice(
            currentIndex,
            currentIndex + LIMIT
        );

        productWrapper.insertAdjacentHTML(
            "beforeend",
            nextProducts.map((p, i) => renderProduct(p, currentIndex + i))
                .join("")
        );

        handleImageLoading(productWrapper);

        currentIndex += LIMIT;

        if (currentIndex >= source.length) {
            loadMoreBtn.textContent = "All Ready";
            loadMoreBtn.classList.add("is-done");
            loadMoreBtn.disabled = true;
        } else {
            setButtonState({ text: "Load More Items", disabled: false });
        }
    }, 500);
};

loadMoreBtn.addEventListener('click', loadMore);

// Manage State of button
function setButtonState({ text, disabled }) {
    loadMoreBtn.textContent = text;
    loadMoreBtn.disabled = disabled;
};

// Handle render product for Latest, Best Seller, Featured
function renderProduct(p, index) {
    return `
        <div class="product-item fade-item" style="--delay:${index * 0.1}s">
            ${p.isSale ? `<span class="on-sale">Sale!</span>` : ""}
            <div class="product-image">
                <a class="product-image__wrap" href="#">
                    <img src="${p.path}" alt="${p.name}" />
                </a>
                <div class="product-actions">
                    <a class="product-action__group add-to-cart" href="#">
                        <i class="fa-solid fa-shopping-cart"></i>
                        Add To Cart
                    </a>
                    <div class="product-action__group emoji-action">
                        <a class="emoji-action__btn add-to-wishlist-btn" href="#">
                            <i class="fa-solid fa-heart"></i>
                            <span class="emoji-title">Add to Wishlist</span>
                        </a>
                        <a class="emoji-action__btn compare-btn" href="#">
                            <i class="fa-solid fa-shuffle"></i>
                            <span class="emoji-title">Compare</span>
                        </a>
                        <a class="emoji-action__btn quick-view-btn" href="#">
                            <i class="fa-solid fa-eye"></i>
                            <span class="emoji-title">Quick View</span>
                        </a>
                    </div>
                </div>
            </div>

            <div class="product-text-group">
                <a href="#" class="product-name">${p.name}</a>

                <p class="product-price">
                    ${renderPrice(p)}
                </p>

                <span class="product-rating">
                    ${Array.from({ length: 5 })
            .map((_, i) =>
                `<i class="fa-${i < p.rating ? "solid" : "regular"} fa-star"></i>`
            )
            .join("")}
                </span>
            </div>
        </div>
    `;
};

productChooseItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();

        productChooseItems.forEach(i => {
            i.classList.remove('active')
        })
        item.classList.add('active');

        currentFilter = item.dataset.type;

        currentIndex = 0;
        productWrapper.innerHTML = "";
        filteredProducts = getProductsByType(currentFilter);

        loadMoreBtn.classList.remove("is-done");
        loadMoreBtn.disabled = false;
        loadMoreBtn.textContent = "Load More Items";

        loadMore();
    })
})

const cached = {
    latest: [],
    best: [],
    featured: []
};

function getProductsByType(type) {
    if (cached[type]?.length) return cached[type];
    let result;

    switch (type) {
        case "latest":
            result = [...products].sort((a, b) => b.id - a.id);
            break;
        case "best":
            result = [...products].sort((a, b) => b.viewCount - a.viewCount);
            break;
        case "featured":
            result = products.filter(p => p.rating >= 4);
            break;
        default:
            result = products;
    }

    cached[type] = result;
    return result;
}

// Handle render price
function renderPrice(p) {
    const price = p.price

    // VARIABLE / GROUPED PRODUCT
    if (p.type === "variable" || p.type === "grouped") {
        return `
            <span class="product-price__new-price">
                $${price.min.toFixed(2)} – $${price.max.toFixed(2)}
            </span>
        `;
    }

    // SIMPLE / EXTERNAL PRODUCT - CÓ SALE
    if (price.sale != null && price.sale < price.regular) {
        return `
            <span class="product-price__old-price">
                $${price.regular.toFixed(2)}
            </span>
            <span class="product-price__new-price">
                $${price.sale.toFixed(2)}
            </span>
        `;
    }

    // SIMPLE / EXTERNAL PRODUCT - KHÔNG SALE
    return `
        <span class="product-price__new-price">
            $${price.regular.toFixed(2)}
        </span>
    `;
};


// ============ Suggest Collection =============
const collectionItems = document.querySelectorAll('.collection-list__item');
const productByCollection = document.querySelector('.product-by-collection');

let collectionProducts = [];
let collectionSwiper = null;

async function fetchCollectionProducts() {
    collectionProducts = await fetchBase();

    const firstCollection = getCollectionNameFromItem(collectionItems[0]);

    renderProductsByCollection(
        collectionProducts.filter(p =>
            normalizeCollections(p).includes(firstCollection)
        )
    );
};

fetchCollectionProducts();

function renderProductsByCollection(productsCollection) {
    productByCollection.innerHTML = "";

    if (collectionSwiper) {
        collectionSwiper.destroy(true, true);
        collectionSwiper = null;
    }

    if (productsCollection.length === 0) {
        productByCollection.innerHTML = `<p>No products found</p>`;
        return;
    }

    const showNavigation = productsCollection.length > 5;

    productByCollection.innerHTML = `
        <div class="swiper collection-swiper">
            <div class="swiper-wrapper">
                ${productsCollection.map(renderCollectionProduct).join("")}
            </div>
            ${showNavigation ? `
                <div class="swiper-button-next"></div>
                <div class="swiper-button-prev"></div>
            ` : ""}
        </div>
    `;

    collectionSwiper = new Swiper('.collection-swiper', {
        slidesPerView: 5,
        spaceBetween: 20,

        speed: 600,
        loop: showNavigation,

        autoplay: false,
        grabCursor: true,
        allowTouchMove: true,
        grabCursor: true,

        navigation: showNavigation
            ? {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            }
            : false,

        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            576: {
                slidesPerView: 1,
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
        }
    });

    handleImageLoading(productByCollection);
}

collectionItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();

        collectionItems.forEach(i =>
            i.classList.remove('active')
        );
        item.classList.add('active');

        const collectionName = getCollectionNameFromItem(item);

        renderProductsByCollection(
            collectionProducts.filter(p =>
                normalizeCollections(p).includes(collectionName)
            )
        )
    });
});

function renderCollectionProduct(p) {
    return `
        <div class="swiper-slide product-item">
            ${p.isSale ? `<span class="on-sale">Sale!</span>` : ""}
            <div class="product-image">
                <a class="product-image__wrap" href="#">
                    <img src="${p.path}" alt="${p.name}" />
                </a>
                <div class="product-actions">
                    <a class="product-action__group add-to-cart" href="#">
                        <i class="fa-solid fa-shopping-cart"></i>
                        Add To Cart
                    </a>
                    <div class="product-action__group emoji-action">
                        <a class="emoji-action__btn add-to-wishlist-btn" href="#">
                            <i class="fa-solid fa-heart"></i>
                            <span class="emoji-title">Add to Wishlist</span>
                        </a>
                        <a class="emoji-action__btn compare-btn" href="#">
                            <i class="fa-solid fa-shuffle"></i>
                            <span class="emoji-title">Compare</span>
                        </a>
                        <a class="emoji-action__btn quick-view-btn" href="#">
                            <i class="fa-solid fa-eye"></i>
                            <span class="emoji-title">Quick View</span>
                        </a>
                    </div>
                </div>
            </div>
            <div class="product-text-group">
                <a href="#" class="product-name">${p.name}</a>
                <p class="product-price">${renderPrice(p)}</p>
                <span class="product-rating">
                    ${Array.from({ length: 5 })
            .map((_, i) => `
                        <i class="fa-${i < p.rating ? "solid" : "regular"} fa-star"></i>
                        `
            ).join("")}
                </span>
            </div>
        </div>
    `;
};

function getCollectionNameFromItem(item) {
    return item.querySelector("span")
        .textContent
        .trim()
        .toLowerCase();
};

function normalizeCollections(product) {
    if (Array.isArray(product.collection)) {
        return product.collection.map(c => c.toLowerCase());
    }

    if (typeof product.collection === "string") {
        return [product.collection.toLowerCase()];
    }

    return [];
};


// ========== Most Viewed =========
const mostViewedWrapper = document.querySelector('.most-viewed-wrapper')

let mostViewedProduct = []
let viewWrapper = null
const PAGE_SIZE = 8
const MAX_ITEMS = 26

async function fetchMostViewedProducts() {
    mostViewedProduct = await fetchBase()

    renderMostViewedProduct(
        [...mostViewedProduct]
            .sort((a, b) => b.viewCount - a.viewCount)
            .slice(0, MAX_ITEMS)
    )
}

fetchMostViewedProducts()

function renderMostViewedProduct(productMostViewed) {
    mostViewedWrapper.innerHTML = ""

    if (productMostViewed.length === 0) {
        mostViewedWrapper.innerHTML = `<p>No products found</p>`;
        return;
    }

    const showNavigation = productMostViewed.length > 0

    mostViewedWrapper.innerHTML = `
        <div class="swiper most-viewed-swiper">
            <div class="swiper-wrapper">
                ${productMostViewed.map(renderMostViewed).join("")}
            </div>
            ${showNavigation ? `
                <div class="swiper-button-next"></div>
                <div class="swiper-button-prev"></div>
            ` : ""}
        </div>
    `;

    viewWrapper = new Swiper('.most-viewed-swiper', {
        slidesPerView: 4,
        spaceBetween: 20,

        loop: true,
        speed: 600,

        autoplay: false,
        allowTouchMove: true,
        grabCursor: true,

        navigation: showNavigation
            ? {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            }
            : false,

        breakpoints: {
            0: {
                slidesPerView: 1,
                grid: {
                    fill: 'row',
                    rows: 2,
                },
            },
            576: {
                slidesPerView: 1,
                grid: {
                    fill: 'row',
                    rows: 2,
                },
            },
            768: {
                slidesPerView: 3,
                grid: {
                    fill: 'row',
                    rows: 2,
                },
            },
            992: {
                slidesPerView: 4,
                grid: {
                    fill: 'row',
                    rows: 2,
                },
            },
            1200: {
                slidesPerView: 4,
                grid: {
                    fill: 'row',
                    rows: 2,
                },
            },
            1400: {
                slidesPerView: 4,
                grid: {
                    fill: 'row',
                    rows: 2,
                },
            },
        }
    })

    handleImageLoading(mostViewedWrapper)
}

function renderMostViewed(p) {
    return `
        <div class="swiper-slide most-viewed-items product-item grid-auto-1fr">
            <!-- ${p.isSale ? `<span class="on-sale">Sale!</span>` : ""} -->
            <div class="product-image">
                <a class="product-image__wrap" href="#">
                    <img src="${p.path}" alt="${p.name}" />
                </a>
            </div>
            <div class="product-text-group">
                <a href="#" class="product-name">${p.name}</a>
                <p class="product-price">${renderPrice(p)}</p>
                <span class="product-rating">
                    ${Array.from({ length: 5 })
            .map((_, i) => `
                        <i class="fa-${i < p.rating ? "solid" : "regular"} fa-star"></i>
                        `
            ).join("")}
                </span>
                <a href="#" class="most-viewed__add-to-cart">
                    <i class="fa-solid fa-shopping-cart"></i>
                    Add To Cart
                </a>
            </div>
        </div>
    `;
}

// Common handle image loading
function handleImageLoading(wrapper) {
    const images = wrapper.querySelectorAll(".product-image img");

    images.forEach(img => {
        if (img.complete) {
            img.closest(".product-image").classList.add("loaded");
        } else {
            img.addEventListener("load", () => {
                img.closest(".product-image").classList.add("loaded");
            });
        }
    });
};

