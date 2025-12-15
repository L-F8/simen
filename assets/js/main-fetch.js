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

function renderProduct(p) {
    return `
        <div class="product-item">
            <div class="product-image">
                <a href="#">
                <img src="${p.path}" alt="${p.name}" />
                </a>
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

function loadMore() {
    setButtonState({ text: "Loading...", disabled: true })

    setTimeout(() => {
        const nextProducts = products.slice(
            currentIndex,
            currentIndex + LIMIT
        )

        productWrapper.insertAdjacentHTML(
            "beforeend",
            nextProducts.map(renderProduct).join("")
        )

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