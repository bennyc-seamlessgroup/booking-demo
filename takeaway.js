const p = new URLSearchParams(location.search);
const rid = p.get("rid");
const lang = p.get("lang") === "zh" ? "zh" : "en";

const r = window.RESTAURANTS.find(x => x.id === rid);

const isZh = lang === "zh";

document.getElementById("name").innerText =
  isZh ? r.name : r.en_name;

document.getElementById("desc").innerText =
  isZh ? r.desc : r.desc_en;

document.getElementById("img").src = r.image_url;

// 🔥 Dummy Menu（之後可以改 DB）
const menu = [
  { id: "1", name: "Wonton Noodles", price: 60 },
  { id: "2", name: "BBQ Pork Rice", price: 75 },
  { id: "3", name: "Dim Sum Set", price: 90 }
];

let cart = {};

// render menu
const menuList = document.getElementById("menuList");

menu.forEach(item => {
  const div = document.createElement("div");
  div.className = "menu-item";

  div.innerHTML = `
    <div>
      <strong>${item.name}</strong><br/>
      $${item.price}
    </div>
    <div>
      <button onclick="add('${item.id}')">+</button>
      <span id="qty-${item.id}">0</span>
      <button onclick="remove('${item.id}')">-</button>
    </div>
  `;

  menuList.appendChild(div);
});

// cart logic
function add(id) {
  cart[id] = (cart[id] || 0) + 1;
  update();
}

function remove(id) {
  if (!cart[id]) return;
  cart[id]--;
  update();
}

function update() {
  let total = 0;
  const cartList = document.getElementById("cartList");
  cartList.innerHTML = "";

  Object.keys(cart).forEach(id => {
    const item = menu.find(m => m.id === id);
    const qty = cart[id];

    if (qty <= 0) return;

    total += item.price * qty;

    cartList.innerHTML += `
      <div>${item.name} x ${qty} = $${item.price * qty}</div>
    `;

    document.getElementById(`qty-${id}`).innerText = qty;
  });

  document.getElementById("total").innerText = "Total: $" + total;
}

// checkout
document.getElementById("checkoutBtn").innerText =
  isZh ? "Apple Pay 付款" : "Pay with Apple Pay";

document.getElementById("checkoutBtn").onclick = () => {
  document.getElementById("paymentModal").classList.remove("hidden");
};

// pay
document.getElementById("payNow").onclick = () => {
  document.getElementById("paymentModal").classList.add("hidden");
  document.getElementById("loading").classList.remove("hidden");

  setTimeout(() => {
    document.getElementById("loading").classList.add("hidden");
    document.getElementById("success").classList.remove("hidden");
  }, 2000);
};