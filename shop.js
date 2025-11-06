const PRODUCTS = {
  apple: { name: "Apple", emoji: "🍏" },
  banana: { name: "Banana", emoji: "🍌" },
  strawberry: { name: "Strawberry", emoji: "🍓" },
  lemon: { name: "Lemon", emoji: "🍋" },
};


function getBasket() {
  try {
    const basket = localStorage.getItem("basket");
    if (!basket) return [];
    const parsed = JSON.parse(basket);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Error parsing basket from localStorage:", error);
    return [];
  }
}

function addToBasket(product) {
  const basket = getBasket();
  // Prevent combining strawberries and bananas
  if (
    (product === "banana" && basket.includes("strawberry")) ||
    (product === "strawberry" && basket.includes("banana"))
  ) {
    window.alert("Strawberries and bananas cannot be combined.");
    return;
  }
  basket.push(product);
  localStorage.setItem("basket", JSON.stringify(basket));
}


function clearBasket() {
  localStorage.removeItem("basket");
}

function renderBasket() {
  const basket = getBasket();
  const basketList = document.getElementById("basketList");
  const cartButtonsRow = document.querySelector(".cart-buttons-row");
  if (!basketList) return;
  basketList.innerHTML = "";
  if (basket.length === 0) {
    basketList.innerHTML = "<li>No products in basket.</li>";
    if (cartButtonsRow) cartButtonsRow.style.display = "none";
    return;
  }
  // Group identical products and preserve first-seen order
  const counts = {};
  const order = [];
  basket.forEach((product) => {
    if (!PRODUCTS[product]) return;
    if (!counts[product]) {
      counts[product] = 1;
      order.push(product);
    } else {
      counts[product] += 1;
    }
  });
  order.forEach((product) => {
    const item = PRODUCTS[product];
    const qty = counts[product];
    const li = document.createElement("li");
    li.innerHTML = `<span class='basket-emoji'>${item.emoji}</span> <span>${qty}x ${item.name}</span>`;
    basketList.appendChild(li);
  });
  if (cartButtonsRow) cartButtonsRow.style.display = "flex";
}


function renderBasketIndicator() {
  const basket = getBasket();
  let indicator = document.querySelector(".basket-indicator");
  if (!indicator) {
    const basketLink = document.querySelector(".basket-link");
    if (!basketLink) return;
    indicator = document.createElement("span");
    indicator.className = "basket-indicator";
    basketLink.appendChild(indicator);
  }
  if (basket.length > 0) {
    indicator.textContent = basket.length;
    indicator.style.display = "flex";
  } else {
    indicator.style.display = "none";
  }
}

// Call this on page load and after basket changes
if (document.readyState !== "loading") {
  renderBasketIndicator();
} else {
  document.addEventListener("DOMContentLoaded", renderBasketIndicator);
}

// Patch basket functions to update indicator
const origAddToBasket = window.addToBasket;
window.addToBasket = function (product) {
  origAddToBasket(product);
  renderBasketIndicator();
};
const origClearBasket = window.clearBasket;
window.clearBasket = function () {
  origClearBasket();
  renderBasketIndicator();
};
