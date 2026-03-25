document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const rid = params.get("rid");
  let currentLang = params.get("lang") === "zh" ? "zh" : "en";
  const phone = params.get("phone") || "";

  const restaurant = (window.RESTAURANTS || []).find(x => x.id === rid);

  const I18N = {
    en: {
      htmlLang: "en",
      toggle: "中文",
      eyebrow: "Queue Ticket",
      queueTitle: "Join the queue",
      queueSubtitle: "See the current queue and get a ticket.",
      currentServing: "Current serving",
      waitingGroups: "Waiting groups",
      estimatedWait: "Estimated wait",
      queueType: "Queue type",
      customerName: "Your name",
      queueNotesTitle: "Queue notes",
      queueNotes: [
        "Please arrive when your number is close.",
        "Queue ticket is for demo only.",
        "Ticket may expire if you miss your turn."
      ],
      joinQueue: "Get Queue Ticket",
      successTitle: "Queue ticket confirmed",
      successSubtitle: "Your queue ticket has been issued.",
      ticketNumber: "Ticket number",
      groupsAhead: "Groups ahead",
      done: "Done",
      areaFallback: "Unknown area",
      cuisineFallback: "Unknown cuisine",
      waitUnit: "mins",
      queueTypes: {
        walkin: "Walk-in",
        "2p": "2 people",
        "4p": "4 people",
        "6p": "6+ people"
      }
    },
    zh: {
      htmlLang: "zh-Hant",
      toggle: "EN",
      eyebrow: "排隊取票",
      queueTitle: "加入排隊",
      queueSubtitle: "查看目前輪候情況並領取票號。",
      currentServing: "目前叫號",
      waitingGroups: "等候組數",
      estimatedWait: "預計等候",
      queueType: "排隊類型",
      customerName: "你的姓名",
      queueNotesTitle: "排隊說明",
      queueNotes: [
        "請在接近叫號時返回餐廳。",
        "此票號為示範用途。",
        "錯過叫號後票號可能失效。"
      ],
      joinQueue: "領取排隊票",
      successTitle: "已成功取票",
      successSubtitle: "你的排隊票號已建立。",
      ticketNumber: "票號",
      groupsAhead: "前面組數",
      done: "完成",
      areaFallback: "未知地區",
      cuisineFallback: "未知菜式",
      waitUnit: "分鐘",
      queueTypes: {
        walkin: "即場入座",
        "2p": "2位",
        "4p": "4位",
        "6p": "6位或以上"
      }
    }
  };

  const els = {
    langToggle: document.getElementById("langToggle"),
    eyebrow: document.getElementById("eyebrow"),
    name: document.getElementById("name"),
    area: document.getElementById("area"),
    cuisine: document.getElementById("cuisine"),
    price: document.getElementById("price"),
    desc: document.getElementById("desc"),
    img: document.getElementById("img"),

    queueScreen: document.getElementById("queueScreen"),
    queueSuccessScreen: document.getElementById("queueSuccessScreen"),

    queueTitle: document.getElementById("queueTitle"),
    queueSubtitle: document.getElementById("queueSubtitle"),
    currentTicketLabel: document.getElementById("currentTicketLabel"),
    waitingGroupsLabel: document.getElementById("waitingGroupsLabel"),
    estimatedWaitLabel: document.getElementById("estimatedWaitLabel"),
    currentTicketValue: document.getElementById("currentTicketValue"),
    waitingGroupsValue: document.getElementById("waitingGroupsValue"),
    estimatedWaitValue: document.getElementById("estimatedWaitValue"),
    queueTypeLabel: document.getElementById("queueTypeLabel"),
    customerNameLabel: document.getElementById("customerNameLabel"),
    queueType: document.getElementById("queueType"),
    customerName: document.getElementById("customerName"),
    queueNotesTitle: document.getElementById("queueNotesTitle"),
    queueNotesList: document.getElementById("queueNotesList"),
    joinQueueBtn: document.getElementById("joinQueueBtn"),

    successTitle: document.getElementById("successTitle"),
    successSubtitle: document.getElementById("successSubtitle"),
    ticketNumberLabel: document.getElementById("ticketNumberLabel"),
    ticketNumberValue: document.getElementById("ticketNumberValue"),
    aheadLabel: document.getElementById("aheadLabel"),
    aheadValue: document.getElementById("aheadValue"),
    queueWaitLabel: document.getElementById("queueWaitLabel"),
    queueWaitValue: document.getElementById("queueWaitValue"),
    queueRestaurantName: document.getElementById("queueRestaurantName"),
    queueTypeSummary: document.getElementById("queueTypeSummary"),
    doneBtn: document.getElementById("doneBtn")
  };

  function randBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generateTicketNumber() {
    const prefix = ["A", "B", "C"][randBetween(0, 2)];
    const num = randBetween(100, 199);
    return `${prefix}${num}`;
  }

  function getQueueSnapshot() {
    const waiting = randBetween(3, 12);
    const current = `A${String(randBetween(20, 99)).padStart(3, "0")}`;
    const wait = waiting * 3;
    return { waiting, current, wait };
  }

  let queueData = getQueueSnapshot();

  function applyLanguage() {
    const t = I18N[currentLang];
    document.documentElement.lang = t.htmlLang;

    els.langToggle.textContent = t.toggle;
    els.eyebrow.textContent = t.eyebrow;
    els.queueTitle.textContent = t.queueTitle;
    els.queueSubtitle.textContent = t.queueSubtitle;
    els.currentTicketLabel.textContent = t.currentServing;
    els.waitingGroupsLabel.textContent = t.waitingGroups;
    els.estimatedWaitLabel.textContent = t.estimatedWait;
    els.queueTypeLabel.textContent = t.queueType;
    els.customerNameLabel.textContent = t.customerName;
    els.queueNotesTitle.textContent = t.queueNotesTitle;
    els.joinQueueBtn.textContent = t.joinQueue;
    els.successTitle.textContent = t.successTitle;
    els.successSubtitle.textContent = t.successSubtitle;
    els.ticketNumberLabel.textContent = t.ticketNumber;
    els.aheadLabel.textContent = t.groupsAhead;
    els.queueWaitLabel.textContent = t.estimatedWait;
    els.doneBtn.textContent = t.done;

    els.queueType.innerHTML = `
      <option value="walkin">${t.queueTypes.walkin}</option>
      <option value="2p">${t.queueTypes["2p"]}</option>
      <option value="4p">${t.queueTypes["4p"]}</option>
      <option value="6p">${t.queueTypes["6p"]}</option>
    `;

    els.queueNotesList.innerHTML = t.queueNotes.map(note => `<li>${note}</li>`).join("");

    if (restaurant) {
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

      els.img.src =
        restaurant.image_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop";
    }

    els.currentTicketValue.textContent = queueData.current;
    els.waitingGroupsValue.textContent = queueData.waiting;
    els.estimatedWaitValue.textContent = `${queueData.wait} ${t.waitUnit}`;
  }

  function showQueueSuccess(ticketNumber, ahead, waitMinutes, queueTypeLabel) {
    els.queueScreen.classList.add("hidden");
    els.queueSuccessScreen.classList.remove("hidden");

    els.ticketNumberValue.textContent = ticketNumber;
    els.aheadValue.textContent = ahead;
    els.queueWaitValue.textContent = `${waitMinutes} ${I18N[currentLang].waitUnit}`;
    els.queueRestaurantName.textContent =
      currentLang === "zh"
        ? restaurant.name
        : (restaurant.en_name || restaurant.name);

    els.queueTypeSummary.innerHTML = `
      <div>${queueTypeLabel}</div>
      <div>${phone ? phone : ""}</div>
    `;
  }

  els.joinQueueBtn.addEventListener("click", () => {
  const selectedType = els.queueType.value;
  const queueTypeLabel = els.queueType.options[els.queueType.selectedIndex].text;
  const ticketNumber = generateTicketNumber();
  const ahead = queueData.waiting;
  const waitMinutes = ahead * 3 + randBetween(0, 5);

  fetch("https://bennyseamlessgroup.app.n8n.cloud/webhook/queue-submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      phone,
      lang: currentLang,
      restaurant_id: rid,
      restaurant_name:
        currentLang === "zh"
          ? restaurant.name
          : (restaurant.en_name || restaurant.name),
      restaurant_name_zh: restaurant.name || "",
      restaurant_name_en: restaurant.en_name || restaurant.name || "",
      area:
        currentLang === "zh"
          ? (restaurant.area || "")
          : (restaurant.area_en || restaurant.area || ""),
      address_map: restaurant.map || "",
      queue_type: selectedType,
      queue_type_label: queueTypeLabel,
      ticket_number: ticketNumber,
      groups_ahead: ahead,
      estimated_wait: waitMinutes
    })
  })
    .then(async (res) => {
      try {
        const result = await res.json();
        console.log("queue webhook result:", result);
      } catch (e) {
        console.log("Queue webhook returned non-JSON");
      }
    })
    .catch((e) => {
      console.log("Queue webhook error", e);
    });

  showQueueSuccess(ticketNumber, ahead, waitMinutes, queueTypeLabel);
});

  els.doneBtn.addEventListener("click", () => {
    els.queueSuccessScreen.classList.add("hidden");
    els.queueScreen.classList.remove("hidden");
  });

  els.langToggle.addEventListener("click", () => {
    currentLang = currentLang === "zh" ? "en" : "zh";
    const newParams = new URLSearchParams(window.location.search);
    newParams.set("lang", currentLang);
    history.replaceState({}, "", `${window.location.pathname}?${newParams.toString()}`);
    applyLanguage();
  });

  if (!restaurant) {
    document.body.innerHTML = `<div class="page"><div class="booking-card">${I18N[currentLang].notFound}</div></div>`;
  } else {
    applyLanguage();
  }
});
