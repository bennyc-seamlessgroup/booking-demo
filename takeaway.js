const params = new URLSearchParams(window.location.search);
const rid = params.get("rid");
let currentLang = params.get("lang") === "zh" ? "zh" : "en";
const phone = params.get("phone") || "";

const restaurant = (window.RESTAURANTS || []).find(x => x.id === rid);

const I18N = {
  en: {
    htmlLang: "en",
    toggle: "中文",
    eyebrow: "Takeaway Order",
    menuTitle: "Menu",
    menuSubtitle: "Choose your items for takeaway.",
    reviewOrder: "Review Order",
    itemCount: n => `${n} item${n === 1 ? "" : "s"}`,
    cartTitle: "Order Summary",
    cartSubtitle: "Review your takeaway order before payment.",
    subtotal: "Subtotal",
    packagingFee: "Packaging fee",
    total: "Total",
    back: "Back",
    pay: "Pay with Apple Pay",
    processing: "Processing payment...",
    paymentComplete: "Payment Complete",
    orderConfirmed: "Your takeaway order is confirmed.",
    pickupTime: "Pickup time",
    pickupNumber: "Pickup number",
    paid: "Paid",
    done: "Done",
    areaFallback: "Unknown area",
    cuisineFallback: "Unknown cuisine",
    add: "Add",
    emptyCart: "Your cart is empty.",
    notFound: "Restaurant not found"
  },
  zh: {
    htmlLang: "zh-Hant",
    toggle: "EN",
    eyebrow: "外賣下單",
    menuTitle: "餐牌",
    menuSubtitle: "選擇你想外賣的食物。",
    reviewOrder: "查看訂單",
    itemCount: n => `${n} 件`,
    cartTitle: "確認訂單",
    cartSubtitle: "付款前請先確認你的外賣內容。",
    subtotal: "小計",
    packagingFee: "包裝費",
    total: "總額",
    back: "返回",
    pay: "使用 Apple Pay 付款",
    processing: "付款處理中...",
    paymentComplete: "付款完成",
    orderConfirmed: "你的外賣訂單已確認。",
    pickupTime: "取餐時間",
    pickupNumber: "取餐編號",
    paid: "已付款",
    done: "完成",
    areaFallback: "未知地區",
    cuisineFallback: "未知菜式",
    add: "加入",
    emptyCart: "你的購物車是空的。",
    notFound: "找不到餐廳"
  }
};

// 你之後可以按餐廳 id 換不同 menu
const MENUS = {
  MK02: [
    { id: "m1", name_zh: "招牌牛肉漢堡", name_en: "Signature Beef Burger", price: 68, desc_zh: "厚切牛肉配薯條", desc_en: "Juicy beef burger with fries" },
    { id: "m2", name_zh: "雙層芝士漢堡", name_en: "Double Cheeseburger", price: 78, desc_zh: "雙層牛肉加濃厚芝士", desc_en: "Double beef patties with rich cheese" },
    { id: "m3", name_zh: "炸雞漢堡", name_en: "Crispy Chicken Burger", price: 64, desc_zh: "香脆雞扒配生菜", desc_en: "Crispy chicken fillet with lettuce" },
    { id: "m4", name_zh: "薯條", name_en: "Fries", price: 28, desc_zh: "即炸香脆薯條", desc_en: "Freshly fried crispy fries" }
  ]
};

const DEFAULT_MENU = [
  { id: "d1", name_zh: "雲吞麵", name_en: "Wonton Noodles", price: 60, desc_zh: "招牌人氣之選", desc_en: "A signature favorite" },
  { id: "d2", name_zh: "叉燒飯", name_en: "BBQ Pork Rice", price: 75, desc_zh: "經典港式燒味", desc_en: "Classic Hong Kong BBQ rice" },
  { id: "d3", name_zh: "點心拼盤", name_en: "Dim Sum Set", price: 90, desc_zh: "人氣點心組合", desc_en: "Popular dim sum combo" }
];

const menu = MENUS[rid] || DEFAULT_MENU;
const packagingFee = 5;
const cart = {};

const els = {
  langToggle: document.getElementById("langToggle"),
  eyebrow: document.getElementById("eyebrow"),
  name: document.getElementById("name"),
  area: document.getElementById("area"),
  cuisine: document.getElementById("cuisine"),
  price: document.getElementById("price"),
  desc: document.getElementById("desc"),
  img: document.getElementById("img"),

  menuScreen: document.getElementById("menuScreen"),
  cartScreen: document.getElementById("cartScreen"),
  payingScreen: document.getElementById("payingScreen"),
  successScreen: document.getElementById("successScreen"),

  menuTitle: document.getElementById("menuTitle"),
  menuSubtitle: document.getElementById("menuSubtitle"),
  menuList: document.getElementById("menuList"),
  stickyCount: document.getElementById("stickyCount"),
  stickyTotal: document.getElementById("stickyTotal"),
  reviewCartBtn: document.getElementById("reviewCartBtn"),

  cartTitle: document.getElementById("cartTitle"),
  cartSubtitle: document.getElementById("cartSubtitle"),
  cartList: document.getElementById("cartList"),
  subtotalLabel: document.getElementById("subtotalLabel"),
  serviceFeeLabel: document.getElementById("serviceFeeLabel"),
  totalLabel: document.getElementById("totalLabel"),
  subtotalValue: document.getElementById("subtotalValue"),
  serviceFeeValue: document.getElementById("serviceFeeValue"),
  totalValue: document.getElementById("totalValue"),
  backToMenuBtn: document.getElementById("backToMenuBtn"),
  payBtn: document.getElementById("payBtn"),

  payingTitle: document.getElementById("payingTitle"),
  payingAmount: document.getElementById("payingAmount"),

  successTitle: document.getElementById("successTitle"),
  successSubtitle: document.getElementById("successSubtitle"),
  pickupTimeLabel: document.getElementById("pickupTimeLabel"),
  pickupTimeValue: document.getElementById("pickupTimeValue"),
  pickupNumberLabel: document.getElementById("pickupNumberLabel"),
  pickupNumberValue: document.getElementById("pickupNumberValue"),
  successTotalLabel: document.getElementById("successTotalLabel"),
  successTotalValue: document.getElementById("successTotalValue"),
  successRestaurantName: document.getElementById("successRestaurantName"),
  successOrderItems: document.getElementById("successOrderItems"),
  doneBtn: document.getElementById("doneBtn")
};

function itemName(item) {
  return currentLang === "zh" ? item.name_zh : item.name_en;
}

function itemDesc(item) {
  return currentLang === "zh" ? item.desc_zh : item.desc_en;
}

function formatCurrency(value) {
  return `$${value}`;
}

function getSubtotal() {
  return menu.reduce((sum, item) => sum + ((cart[item.id] || 0) * item.price), 0);
}

function getItemCount() {
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}

function getTotal() {
  const subtotal = getSubtotal();
  return subtotal > 0 ? subtotal + packagingFee : 0;
}

function showScreen(name) {
  els.menuScreen.classList.add("hidden");
  els.cartScreen.classList.add("hidden");
  els.payingScreen.classList.add("hidden");
  els.successScreen.classList.add("hidden");

  if (name === "menu") els.menuScreen.classList.remove("hidden");
  if (name === "cart") els.cartScreen.classList.remove("hidden");
  if (name === "paying") els.payingScreen.classList.remove("hidden");
  if (name === "success") els.successScreen.classList.remove("hidden");
}

function renderHeader() {
  const t = I18N[currentLang];
  document.documentElement.lang = t.htmlLang;
  els.langToggle.textContent = t.toggle;
  els.eyebrow.textContent = t.eyebrow;

  if (!restaurant) {
    els.name.textContent = t.notFound;
    els.desc.textContent = "";
    return;
  }

  els.name.textContent =
    currentLang === "zh"
      ? restaurant.name
      : (restaurant.en_name || restaurant.name);

  els.area.textContent =
    currentLang === "zh"
      ? (restaurant.area || t.areaFallback)
      : (restaurant.area_en || restaurant.area || t.areaFallback);

  els.cuisine.textContent =
    currentLang === "zh"
      ? (restaurant.cuisine || t.cuisineFallback)
      : (restaurant.cuisine_en || restaurant.cuisine || t.cuisineFallback);

  els.price.textContent = restaurant.price || "";
  els.desc.textContent =
    currentLang === "zh"
      ? (restaurant.desc || restaurant.desc_en || "")
      : (restaurant.desc_en || restaurant.desc || "");

  els.img.src = restaurant.image_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4";
}

function renderMenu() {
  const t = I18N[currentLang];
  els.menuTitle.textContent = t.menuTitle;
  els.menuSubtitle.textContent = t.menuSubtitle;
  els.reviewCartBtn.textContent = t.reviewOrder;

  els.menuList.innerHTML = "";

  menu.forEach(item => {
    const qty = cart[item.id] || 0;

    const row = document.createElement("div");
    row.className = "menu-card";
    row.innerHTML = `
      <div class="menu-card-main">
        <div class="menu-card-title">${itemName(item)}</div>
        <div class="menu-card-desc">${itemDesc(item)}</div>
        <div class="menu-card-price">${formatCurrency(item.price)}</div>
      </div>
      <div class="qty-control">
        <button type="button" class="qty-btn" data-action="minus" data-id="${item.id}">−</button>
        <div class="qty-number" id="qty-${item.id}">${qty}</div>
        <button type="button" class="qty-btn" data-action="plus" data-id="${item.id}">+</button>
      </div>
    `;
    els.menuList.appendChild(row);
  });

  els.menuList.querySelectorAll(".qty-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const action = btn.dataset.action;

      if (action === "plus") {
        cart[id] = (cart[id] || 0) + 1;
      } else if (action === "minus") {
        cart[id] = Math.max((cart[id] || 0) - 1, 0);
      }

      renderMenu();
      renderCartSummaryOnly();
    });
  });

  renderCartSummaryOnly();
}

function renderCartSummaryOnly() {
  const t = I18N[currentLang];
  const count = getItemCount();
  const total = getTotal();

  els.stickyCount.textContent = t.itemCount(count);
  els.stickyTotal.textContent = formatCurrency(total);

  els.reviewCartBtn.disabled = count === 0;
  els.reviewCartBtn.style.opacity = count === 0 ? "0.6" : "1";
}

function renderCartScreen() {
  const t = I18N[currentLang];
  const subtotal = getSubtotal();
  const total = getTotal();

  els.cartTitle.textContent = t.cartTitle;
  els.cartSubtitle.textContent = t.cartSubtitle;
  els.subtotalLabel.textContent = t.subtotal;
  els.serviceFeeLabel.textContent = t.packagingFee;
  els.totalLabel.textContent = t.total;
  els.backToMenuBtn.textContent = t.back;
  els.payBtn.textContent = t.pay;
  els.payingTitle.textContent = t.processing;

  els.cartList.innerHTML = "";

  const chosenItems = menu.filter(item => (cart[item.id] || 0) > 0);

  if (!chosenItems.length) {
    els.cartList.innerHTML = `<div class="empty-cart">${t.emptyCart}</div>`;
  } else {
    chosenItems.forEach(item => {
      const qty = cart[item.id];
      const lineTotal = qty * item.price;

      const row = document.createElement("div");
      row.className = "cart-item-row";
      row.innerHTML = `
        <div class="cart-item-left">
          <div class="cart-item-name">${itemName(item)}</div>
          <div class="cart-item-qty">x ${qty}</div>
        </div>
        <div class="cart-item-right">${formatCurrency(lineTotal)}</div>
      `;
      els.cartList.appendChild(row);
    });
  }

  els.subtotalValue.textContent = formatCurrency(subtotal);
  els.serviceFeeValue.textContent = subtotal > 0 ? formatCurrency(packagingFee) : formatCurrency(0);
  els.totalValue.textContent = formatCurrency(total);
  els.payingAmount.textContent = formatCurrency(total);
}

function generatePickupNumber() {
  const prefix = ["A", "B", "C"][Math.floor(Math.random() * 3)];
  const num = Math.floor(100 + Math.random() * 900);
  return `${prefix}${num}`;
}

function renderSuccessScreen() {
  const t = I18N[currentLang];
  const total = getTotal();
  const chosenItems = menu.filter(item => (cart[item.id] || 0) > 0);

  els.successTitle.textContent = t.paymentComplete;
  els.successSubtitle.textContent = t.orderConfirmed;
  els.pickupTimeLabel.textContent = t.pickupTime;
  els.pickupNumberLabel.textContent = t.pickupNumber;
  els.successTotalLabel.textContent = t.paid;
  els.doneBtn.textContent = t.done;

  els.pickupTimeValue.textContent =
    currentLang === "zh" ? "約 15 分鐘後" : "In about 15 minutes";

  els.pickupNumberValue.textContent = generatePickupNumber();
  els.successTotalValue.textContent = formatCurrency(total);

  els.successRestaurantName.textContent =
    currentLang === "zh"
      ? restaurant.name
      : (restaurant.en_name || restaurant.name);

  els.successOrderItems.innerHTML = chosenItems
    .map(item => {
      const qty = cart[item.id];
      return `<div>${itemName(item)} × ${qty}</div>`;
    })
    .join("");
}

els.reviewCartBtn.addEventListener("click", () => {
  if (getItemCount() === 0) return;
  renderCartScreen();
  showScreen("cart");
});

els.backToMenuBtn.addEventListener("click", () => {
  showScreen("menu");
});

els.payBtn.addEventListener("click", () => {
  showScreen("paying");

  setTimeout(() => {
    renderSuccessScreen();
    showScreen("success");
  }, 2200);
});

els.doneBtn.addEventListener("click", () => {
  showScreen("menu");
});

els.langToggle.addEventListener("click", () => {
  currentLang = currentLang === "zh" ? "en" : "zh";
  const newParams = new URLSearchParams(window.location.search);
  newParams.set("lang", currentLang);
  history.replaceState({}, "", `${window.location.pathname}?${newParams.toString()}`);

  renderHeader();
  renderMenu();
  renderCartScreen();
  if (!els.successScreen.classList.contains("hidden")) {
    renderSuccessScreen();
  }
});

if (!restaurant) {
  document.body.innerHTML = `<div class="page"><div class="booking-card">${I18N[currentLang].notFound}</div></div>`;
} else {
  renderHeader();
  renderMenu();
  showScreen("menu");
}
