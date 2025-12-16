const productWrapper = document.getElementById("product-wrapper")
const loadMoreBtn = document.getElementById("loadMoreBtn")

let products = []
let currentIndex = 0
const LIMIT = 5

async function fetchProducts() {
    const res = await fetch('/simen/assets/data/products.json')

    if (!res.ok) {
        throw new Error("Fetch failed: " + res.status);
    }

    products = await res.json()
    loadMore()
}

function setButtonState({ text, disabled }) {
    loadMoreBtn.textContent = text
    loadMoreBtn.disabled = disabled
}

function renderProduct(p, index) {
    return `
        <div class="product-item fade-item" style="--delay:${index * 0.1}s">
            ${p.isSale ? `<span class="on-sale" id="is-sale">Sale!</span>` : ""}
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
                        </a>
                        <a class="emoji-action__btn compare-btn" href="#">
                            <i class="fa-solid fa-shuffle"></i>
                        </a>
                        <a class="emoji-action__btn quick-view-btn" href="#">
                            <i class="fa-solid fa-eye"></i>
                        </a>
                    </div>
                </div>
            </div>

            <div class="product-text-group">
                <a href="#" class="product-name">${p.name}</a>

                <p class="product-price">
                ${p.oldPrice > 0
            ? `<span class="product-price__old-price">$${p.oldPrice.toFixed(2)}</span>`
            : ""
        }
                <span class="product-price__new-price">$${p.newPrice.toFixed(2)}</span>
                </p>

                <span class="product-rating">
                    ${Array.from({ length: 5 })
            .map((_, i) =>
                `<i class="fa-${i < p.starCount ? "solid" : "regular"} fa-star"></i>`
            )
            .join("")}
                </span>
            </div>
        </div>
    `;
}

function handleImageLoading() {
    const images = productWrapper.querySelectorAll(".product-image img");

    images.forEach(img => {
        if (img.complete) {
            img.closest(".product-image").classList.add("loaded");
        } else {
            img.addEventListener("load", () => {
                img.closest(".product-image").classList.add("loaded");
            });
        }
    });
}

function loadMore() {
    setButtonState({ text: "Loading...", disabled: true })

    setTimeout(() => {
        const nextProducts = products.slice(
            currentIndex,
            currentIndex + LIMIT
        )

        productWrapper.insertAdjacentHTML(
            "beforeend",
            nextProducts.map((p, i) => renderProduct(p, currentIndex + i))
                .join("")
        )

        handleImageLoading()

        currentIndex += LIMIT

        if (currentIndex >= products.length) {
            loadMoreBtn.textContent = "All Ready"
            loadMoreBtn.classList.add("is-done")
            loadMoreBtn.disabled = true
        } else {
            setButtonState({ text: "Load More Items", disabled: false })
        }
    }, 500)
}

loadMoreBtn.addEventListener('click', loadMore)

fetchProducts()