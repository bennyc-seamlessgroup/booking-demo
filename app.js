const I18N = {
  en: {
    htmlLang: "en",
    toggle: "中文",
    eyebrow: "Restaurant Booking",
    sectionTitle: "Book a table",
    sectionSubtitle: "Choose your preferred date, time, and party size.",
    labelDate: "Date",
    labelTime: "Time",
    labelParty: "Party size",
    labelName: "Your name",
    labelNote: "Special request",
    placeholderName: "Enter your name",
    placeholderNote: "Optional: birthday, dietary request, seating preference...",
    submit: "Submit booking",
    submitting: "Submitting...",
    selectTime: "Select time",
    selectParty: "Select party size",
    areaFallback: "Unknown area",
    cuisineFallback: "Unknown cuisine",
    scoreFallback: "No score",
    notFound: "Restaurant not found",
    notFoundDesc: "We can't find the selected restaurant.",
    bookingSuccess: "Booking submitted successfully.",
    bookingFail: "Booking failed. Please try again.",
    bookingError: "Something went wrong while submitting your booking."
  },
  zh: {
    htmlLang: "zh-Hant",
    toggle: "EN",
    eyebrow: "餐廳訂位",
    sectionTitle: "預約訂位",
    sectionSubtitle: "選擇日期、時間與人數。",
    labelDate: "日期",
    labelTime: "時間",
    labelParty: "人數",
    labelName: "你的姓名",
    labelNote: "特別要求",
    placeholderName: "請輸入姓名",
    placeholderNote: "例如：生日、飲食要求、座位偏好⋯",
    submit: "提交訂位",
    submitting: "提交中...",
    selectTime: "請選擇時間",
    selectParty: "請選擇人數",
    areaFallback: "未知地區",
    cuisineFallback: "未知菜式",
    scoreFallback: "未有評分",
    notFound: "找不到餐廳",
    notFoundDesc: "暫時找不到你選擇的餐廳資料。",
    bookingSuccess: "訂位已成功提交。",
    bookingFail: "訂位失敗，請再試一次。",
    bookingError: "提交訂位時發生錯誤。"
  }
};

const params = new URLSearchParams(window.location.search);
const rid = params.get("rid");
const phone = params.get("phone");
let currentLang = params.get("lang") === "zh" ? "zh" : "en";

const restaurant = (window.RESTAURANTS || []).find(r => r.id === rid);

const els = {
  langToggle: document.getElementById("langToggle"),
  eyebrow: document.getElementById("eyebrow"),
  restaurantName: document.getElementById("restaurantName"),
  restaurantArea: document.getElementById("restaurantArea"),
  restaurantCuisine: document.getElementById("restaurantCuisine"),
  restaurantPrice: document.getElementById("restaurantPrice"),
  restaurantScore: document.getElementById("restaurantScore"),
  restaurantDesc: document.getElementById("restaurantDesc"),
  restaurantImage: document.getElementById("restaurantImage"),
  sectionTitle: document.getElementById("sectionTitle"),
  sectionSubtitle: document.getElementById("sectionSubtitle"),
  labelDate: document.getElementById("labelDate"),
  labelTime: document.getElementById("labelTime"),
  labelParty: document.getElementById("labelParty"),
  labelName: document.getElementById("labelName"),
  labelNote: document.getElementById("labelNote"),
  bookingTime: document.getElementById("bookingTime"),
  partySize: document.getElementById("partySize"),
  customerName: document.getElementById("customerName"),
  note: document.getElementById("note"),
  form: document.getElementById("bookingForm"),
  submitBtn: document.getElementById("submitBtn"),
  resultBox: document.getElementById("resultBox")
};

function updateUrlLanguage(lang) {
  const newParams = new URLSearchParams(window.location.search);
  newParams.set("lang", lang);
  const newUrl = `${window.location.pathname}?${newParams.toString()}`;
  window.history.replaceState({}, "", newUrl);
}

function applyLanguage(lang) {
  currentLang = lang;
  const t = I18N[lang];
  document.documentElement.lang = t.htmlLang;

  els.langToggle.textContent = t.toggle;
  els.eyebrow.textContent = t.eyebrow;
  els.sectionTitle.textContent = t.sectionTitle;
  els.sectionSubtitle.textContent = t.sectionSubtitle;
  els.labelDate.textContent = t.labelDate;
  els.labelTime.textContent = t.labelTime;
  els.labelParty.textContent = t.labelParty;
  els.labelName.textContent = t.labelName;
  els.labelNote.textContent = t.labelNote;
  els.customerName.placeholder = t.placeholderName;
  els.note.placeholder = t.placeholderNote;
  els.submitBtn.textContent = t.submit;

  els.bookingTime.options[0].text = t.selectTime;
  els.partySize.options[0].text = t.selectParty;

  renderRestaurant();
  updateUrlLanguage(lang);
}

function renderRestaurant() {
  const t = I18N[currentLang];

  if (restaurant) {
    els.restaurantName.textContent =
      currentLang === "zh"
        ? `${restaurant.name} / ${restaurant.en_name || restaurant.name}`
        : `${restaurant.en_name || restaurant.name} / ${restaurant.name}`;

    els.restaurantArea.textContent =
      currentLang === "zh"
        ? (restaurant.area || t.areaFallback)
        : (restaurant.area_en || restaurant.area || t.areaFallback);

    els.restaurantCuisine.textContent =
      currentLang === "zh"
        ? (restaurant.cuisine || t.cuisineFallback)
        : (restaurant.cuisine_en || restaurant.cuisine || t.cuisineFallback);

    els.restaurantPrice.textContent = restaurant.price || "";
    els.restaurantScore.textContent = restaurant.score ? `⭐ ${restaurant.score}/5` : t.scoreFallback;
    els.restaurantDesc.textContent =
      currentLang === "zh"
        ? (restaurant.desc || restaurant.desc_en || "")
        : (restaurant.desc_en || restaurant.desc || "");

    els.restaurantImage.src =
      restaurant.image_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4";
  } else {
    els.restaurantName.textContent = t.notFound;
    els.restaurantArea.textContent = t.areaFallback;
    els.restaurantCuisine.textContent = t.cuisineFallback;
    els.restaurantPrice.textContent = "";
    els.restaurantScore.textContent = "";
    els.restaurantDesc.textContent = t.notFoundDesc;
    els.restaurantImage.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4";
    els.form.style.display = "none";
  }
}

els.langToggle.addEventListener("click", () => {
  applyLanguage(currentLang === "en" ? "zh" : "en");
});

els.form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const t = I18N[currentLang];
  els.resultBox.className = "result";
  els.resultBox.textContent = "";
  els.submitBtn.disabled = true;
  els.submitBtn.textContent = t.submitting;

  const payload = {
    restaurant_id: rid || "",
    restaurant_name:
      currentLang === "zh"
        ? (restaurant?.name || restaurant?.en_name || "")
        : (restaurant?.en_name || restaurant?.name || ""),
    area:
      currentLang === "zh"
        ? (restaurant?.area || "")
        : (restaurant?.area_en || restaurant?.area || ""),
    cuisine:
      currentLang === "zh"
        ? (restaurant?.cuisine || "")
        : (restaurant?.cuisine_en || restaurant?.cuisine || ""),
    booking_date: document.getElementById("bookingDate").value,
    booking_time: document.getElementById("bookingTime").value,
    party_size: document.getElementById("partySize").value,
    customer_name: document.getElementById("customerName").value,
    note: document.getElementById("note").value,
    customer_phone: phone || "",
    language: currentLang
  };

  try {
    const res = await fetch("https://impose-stories-powerpoint-uni.trycloudflare.com/webhook/booking-submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (result.success) {
      els.resultBox.className = "result success";
      els.resultBox.textContent = t.bookingSuccess;
      els.form.reset();
    } else {
      els.resultBox.className = "result error";
      els.resultBox.textContent = t.bookingFail;
    }
  } catch (err) {
    els.resultBox.className = "result error";
    els.resultBox.textContent = t.bookingError;
    console.error(err);
  } finally {
    els.submitBtn.disabled = false;
    els.submitBtn.textContent = I18N[currentLang].submit;
  }
});

applyLanguage(currentLang);
