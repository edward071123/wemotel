const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const heroImage = document.querySelector(".home-hero img");
const branchPanels = document.querySelectorAll(".branch-panel");
const faqItems = document.querySelectorAll(".faq-item");
const adminShell = document.querySelector(".admin-shell");
const loginForm = document.querySelector(".login-card");
const managerTableBody = document.querySelector(".manager-table-body");
const managerPagination = document.querySelector(".manager-pagination");
const createManagerButton = document.querySelector(".manager-open-create");
const openBranchesButton = document.querySelector(".admin-open-branches");
const adminModal = document.querySelector(".admin-modal");
const modalTitle = document.querySelector("#modal-title");
const modalClose = document.querySelector(".admin-modal__close");
const modalForms = document.querySelectorAll(".modal-form");
const editableModalForms = Array.from(modalForms).filter((form) => form.tagName === "FORM");
const adminViews = document.querySelectorAll(".admin-view");
const adminMenuLinks = document.querySelectorAll(".admin-menu a[href^='#']");
const ticketTableBody = document.querySelector(".ticket-table-body");
const ticketDetailBody = document.querySelector(".ticket-detail-body");
const branchTicketSummary = document.querySelector(".branch-ticket-summary");
const branchSummaryToggle = document.querySelector(".branch-summary-toggle");
const ticketPagination = document.querySelector(".ticket-pagination");
const ticketDetailPagination = document.querySelector(".ticket-detail-pagination");
const storageTableBody = document.querySelector(".storage-table-body");
const storagePagination = document.querySelector(".storage-pagination");
const storageBranchFilter = document.querySelector(".storage-branch-filter");
const storageDepartmentFilter = document.querySelector(".storage-department-filter");
const storageSearchInput = document.querySelector(".storage-search-input");
const storageSearchButton = document.querySelector(".storage-search-button");
const housekeepingBranchSelect = document.querySelector(".housekeeping-branch-select");
const floorPlanWrap = document.querySelector(".floor-plan-wrap");
const floorPlan = document.querySelector(".floor-plan");
const housekeepingRows = document.querySelectorAll("[data-floor-row]");
const housekeepingRoomDetail = document.querySelector(".housekeeping-room-detail");
const reportTypeSelect = document.querySelector(".report-type-select");
const reportBranchSelect = document.querySelector(".report-branch-select");
const reportStartDate = document.querySelector(".report-start-date");
const reportEndDate = document.querySelector(".report-end-date");
const reportExportButton = document.querySelector(".report-export-button");
const reportOutput = document.querySelector(".report-output");
const reportPreviewSummary = document.querySelector(".report-preview-summary");
const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[char]);

const formatDateForFile = (value) => String(value || "").replaceAll("-", "");

if (menuButton) {
  menuButton.addEventListener("click", () => {
    const isOpen = header.classList.toggle("menu-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });
}

if ((heroImage || branchPanels.length) && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let ticking = false;

  const updateParallax = () => {
    if (heroImage) {
      const sectionRect = heroImage.parentElement.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const sectionCenter = sectionRect.top + sectionRect.height / 2;
      const distanceFromCenter = sectionCenter - viewportCenter;
      const travel = Math.max(-90, Math.min(46, distanceFromCenter * -0.08));
      heroImage.style.setProperty("--hero-parallax-y", `${travel}px`);
    }

    branchPanels.forEach((panel) => {
      const rect = panel.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const progress = (rect.top + rect.height) / (viewportHeight + rect.height);
      const y = Math.max(-100, Math.min(100, 100 - progress * 200));
      panel.style.setProperty("--panel-bg-y", `${y}px`);
    });

    ticking = false;
  };

  const requestParallaxUpdate = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  };

  updateParallax();
  window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
  window.addEventListener("resize", requestParallaxUpdate);
}

faqItems.forEach((item) => {
  const button = item.querySelector(".faq-question");

  button.addEventListener("click", () => {
    const isOpen = item.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
});

const showAdminView = (id) => {
  adminViews.forEach((view) => {
    view.hidden = view.id !== id;
  });

  adminMenuLinks.forEach((link) => {
    link.classList.toggle("is-current", link.getAttribute("href") === `#${id}`);
  });

  if (id === "housekeeping") {
    requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
  }
};

if (loginForm && adminShell) {
  const errorText = loginForm.querySelector(".login-error");

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(loginForm);
    const username = String(formData.get("username") || "").trim();
    const password = String(formData.get("password") || "");

    if (username === "admin" && password === "123123") {
      adminShell.classList.remove("is-locked");
      showAdminView("dashboard");
      errorText.textContent = "";
      return;
    }

    errorText.textContent = "帳號或密碼錯誤";
  });
}

if (adminViews.length && adminMenuLinks.length) {
  adminMenuLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href").slice(1);
      const targetView = document.getElementById(id);
      if (!targetView) return;
      event.preventDefault();
      showAdminView(id);
    });
  });
}

if (ticketTableBody) {
  let ticketPage = 1;
  let ticketDetailPage = 1;
  let currentTicketDetails = [];
  const ticketPageSize = 4;
  const ticketDetailPageSize = 6;
  const ticketBatches = [
    { branch: "高雄自由館", type: "休息", start: "TK-202510010001", end: "TK-202510011000", date: "2025-10-01 09:30:18", count: 1000, sold: 235, amount: 822500, operator: "王俊富" },
    { branch: "高雄鳳山館", type: "游泳", start: "TK-202510020001", end: "TK-202510022000", date: "2025-10-02 10:12:44", count: 2000, sold: 755, amount: 2642500, operator: "鳳山店長" },
    { branch: "高雄自由館", type: "休息", start: "TK-202510030001", end: "TK-202510031500", date: "2025-10-03 14:05:31", count: 1500, sold: 920, amount: 3220000, operator: "自由店長" },
    { branch: "高雄湖內館", type: "休息", start: "TK-202510040001", end: "TK-202510041200", date: "2025-10-04 11:22:09", count: 1200, sold: 410, amount: 1435000, operator: "湖內店長" },
    { branch: "台南六甲館", type: "游泳", start: "TK-202510050001", end: "TK-202510050800", date: "2025-10-05 16:48:52", count: 800, sold: 165, amount: 577500, operator: "六甲店長" },
    { branch: "屏東潮州館", type: "休息", start: "TK-202510060001", end: "TK-202510060500", date: "2025-10-06 13:18:26", count: 500, sold: 120, amount: 420000, operator: "潮州店長" },
  ];

  const formatNumber = (value) => Number(value).toLocaleString("en-US");
  const compactDateTime = (value) => value.replace(/\D/g, "").slice(0, 14);
  const randomCode = (seed) => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    let value = seed * 9301 + 49297;
    for (let index = 0; index < 5; index += 1) {
      value = (value * 233280 + 49297) % 9301;
      code += chars[value % chars.length];
    }
    return code;
  };

  const buildTicketDetails = (batchIndex) => {
    const batch = ticketBatches[batchIndex];
    const visibleCount = Math.min(batch.count, 30);
    return Array.from({ length: visibleCount }, (_, index) => {
      const sold = index < Math.min(batch.sold, visibleCount);
      const used = sold && index % 3 === 0;
      const ticketDate = compactDateTime(batch.date);
      const baseAmount = batch.type === "游泳" ? 500 : 700;
      const payment = sold
        ? `信用卡${baseAmount - 150 + (index % 3) * 50}元 + 現金${100 + (index % 4) * 50}元 + 補助${50 + (index % 2) * 100}元`
        : "-";
      const plate = sold ? `${String.fromCharCode(65 + ((batchIndex + index) % 26))}${String.fromCharCode(65 + ((batchIndex + index + 8) % 26))}-${String(1200 + batchIndex * 137 + index * 23).slice(-4)}` : "-";
      return {
        code: `${ticketDate}${randomCode(batchIndex * 1000 + index + 1)}`,
        type: batch.type,
        status: sold ? "已售出" : "未售出",
        soldAt: sold ? `2025-10-${String(6 + (index % 18)).padStart(2, "0")} ${String(10 + (index % 8)).padStart(2, "0")}:20:00` : "-",
        used: used ? "是" : "否",
        usedAt: used ? `2025-10-${String(7 + (index % 18)).padStart(2, "0")} ${String(12 + (index % 6)).padStart(2, "0")}:00:00` : "-",
        payment,
        plate,
      };
    });
  };

  const renderBranchTicketSummary = () => {
    if (!branchTicketSummary) return;
    const summaries = ticketBatches.reduce((result, batch) => {
      if (!result[batch.branch]) {
        result[batch.branch] = { stocked: 0, sold: 0, amount: 0 };
      }
      result[batch.branch].stocked += batch.count;
      result[batch.branch].sold += batch.sold;
      result[batch.branch].amount += batch.amount;
      return result;
    }, {});

    branchTicketSummary.innerHTML = Object.entries(summaries)
      .map(([branch, summary]) => `
        <article>
          <h3>${escapeHtml(branch)}</h3>
          <p><span>入庫張數</span><strong>${formatNumber(summary.stocked)}</strong></p>
          <p><span>已售出張數</span><strong>${formatNumber(summary.sold)}</strong></p>
          <p><span>已售出金額</span><strong>$${formatNumber(summary.amount)}</strong></p>
        </article>
      `)
      .join("");
  };

  const renderPagination = (container, currentPage, pageCount, type) => {
    if (!container) return;
    container.innerHTML = `
      <button type="button" data-${type}-page="prev"${currentPage === 1 ? " disabled" : ""}>上一頁</button>
      ${Array.from({ length: pageCount }, (_, index) => `
        <button type="button" class="${currentPage === index + 1 ? "is-current" : ""}" data-${type}-page="${index + 1}">${index + 1}</button>
      `).join("")}
      <button type="button" data-${type}-page="next"${currentPage === pageCount ? " disabled" : ""}>下一頁</button>
    `;
  };

  const renderTickets = () => {
    const pageCount = Math.max(1, Math.ceil(ticketBatches.length / ticketPageSize));
    ticketPage = Math.min(ticketPage, pageCount);
    const start = (ticketPage - 1) * ticketPageSize;
    const pageItems = ticketBatches.slice(start, start + ticketPageSize);

    ticketTableBody.innerHTML = pageItems
      .map((batch, index) => {
        const batchIndex = start + index;
        const unsold = batch.count - batch.sold;
        return `
          <tr>
            <td>${escapeHtml(batch.branch)}</td>
            <td>${escapeHtml(batch.type)}</td>
            <td>${escapeHtml(batch.start)}</td>
            <td>${escapeHtml(batch.end)}</td>
            <td>${escapeHtml(batch.date)}</td>
            <td>${formatNumber(batch.count)}</td>
            <td class="status-ready">${formatNumber(unsold)}</td>
            <td class="status-pending">${formatNumber(batch.sold)}</td>
            <td>${escapeHtml(batch.operator)}</td>
            <td><button class="ticket-action" type="button" data-ticket-detail="${batchIndex}">詳細票卷資料</button></td>
          </tr>
        `;
      })
      .join("");

    renderPagination(ticketPagination, ticketPage, pageCount, "ticket");
  };

  const renderTicketDetails = () => {
    const pageCount = Math.max(1, Math.ceil(currentTicketDetails.length / ticketDetailPageSize));
    ticketDetailPage = Math.min(ticketDetailPage, pageCount);
    const start = (ticketDetailPage - 1) * ticketDetailPageSize;
    const pageItems = currentTicketDetails.slice(start, start + ticketDetailPageSize);
    const renderPayment = (payment) => {
      if (payment === "-") return "-";
      return `
        <div class="payment-breakdown">
          ${payment.split(" + ").map((item) => {
            const match = item.match(/^(.+?)(\d+元)$/);
            const label = match ? match[1] : item;
            const amount = match ? match[2] : "";
            return `<span><small>${escapeHtml(label)}</small><strong>${escapeHtml(amount)}</strong></span>`;
          }).join("")}
        </div>
      `;
    };

    ticketDetailBody.innerHTML = pageItems
      .map((ticket) => `
        <tr>
          <td>${escapeHtml(ticket.code)}</td>
          <td>${escapeHtml(ticket.type)}</td>
          <td class="${ticket.status === "已售出" ? "status-pending" : "status-ready"}">${ticket.status}</td>
          <td>${escapeHtml(ticket.soldAt)}</td>
          <td>${escapeHtml(ticket.used)}</td>
          <td>${escapeHtml(ticket.usedAt)}</td>
          <td class="ticket-payment-cell">${renderPayment(ticket.payment)}</td>
          <td>${escapeHtml(ticket.plate)}</td>
        </tr>
      `)
      .join("");

    renderPagination(ticketDetailPagination, ticketDetailPage, pageCount, "ticket-detail");
  };

  if (ticketPagination) {
    ticketPagination.addEventListener("click", (event) => {
      const button = event.target.closest("[data-ticket-page]");
      if (!button || button.disabled) return;
      const pageCount = Math.max(1, Math.ceil(ticketBatches.length / ticketPageSize));
      const target = button.dataset.ticketPage;
      ticketPage = target === "prev" ? Math.max(1, ticketPage - 1) : target === "next" ? Math.min(pageCount, ticketPage + 1) : Number(target);
      renderTickets();
    });
  }

  if (ticketDetailPagination) {
    ticketDetailPagination.addEventListener("click", (event) => {
      const button = event.target.closest("[data-ticket-detail-page]");
      if (!button || button.disabled) return;
      const pageCount = Math.max(1, Math.ceil(currentTicketDetails.length / ticketDetailPageSize));
      const target = button.dataset.ticketDetailPage;
      ticketDetailPage = target === "prev" ? Math.max(1, ticketDetailPage - 1) : target === "next" ? Math.min(pageCount, ticketDetailPage + 1) : Number(target);
      renderTicketDetails();
    });
  }

  if (branchSummaryToggle && branchTicketSummary) {
    branchSummaryToggle.addEventListener("click", () => {
      const isExpanded = branchSummaryToggle.getAttribute("aria-expanded") === "true";
      branchSummaryToggle.setAttribute("aria-expanded", String(!isExpanded));
      branchSummaryToggle.textContent = isExpanded ? "展開各館別銷售狀態" : "收合各館別銷售狀態";
      branchTicketSummary.hidden = isExpanded;
    });
  }

  ticketTableBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-ticket-detail]");
    if (!button) return;
    const batchIndex = Number(button.dataset.ticketDetail);
    currentTicketDetails = buildTicketDetails(batchIndex);
    ticketDetailPage = 1;
    modalTitle.textContent = "詳細票卷資料";
    modalForms.forEach((form) => {
      form.hidden = true;
    });
    const detailPanel = document.querySelector('[data-modal-form="ticketDetails"]');
    renderTicketDetails();
    detailPanel.hidden = false;
    adminModal.hidden = false;
  });

  renderBranchTicketSummary();
  renderTickets();
}

if (storageTableBody) {
  let storagePage = 1;
  const storagePageSize = 4;
  const storageItems = [
    { id: 5, branch: "高雄湖內館", department: "房務", name: "浴巾", vendor: "白巾企業", capacity: "-", unit: "條", price: 180, stock: 95, tone: "white" },
    { id: 7, branch: "高雄湖內館", department: "房務", name: "毛巾", vendor: "白巾企業", capacity: "-", unit: "條", price: 65, stock: 180, tone: "cream" },
    { id: 9, branch: "高雄湖內館", department: "房務", name: "沐浴乳", vendor: "香氛日化", capacity: "4L", unit: "桶", price: 420, stock: 18, tone: "gold" },
    { id: 11, branch: "高雄湖內館", department: "房務", name: "洗髮精", vendor: "香氛日化", capacity: "4L", unit: "桶", price: 420, stock: 16, tone: "blue" },
    { id: 14, branch: "高雄鳳山館", department: "餐飲", name: "早餐咖啡豆", vendor: "南區供應", capacity: "1kg", unit: "包", price: 480, stock: 36, tone: "brown" },
    { id: 18, branch: "高雄自由館", department: "櫃檯", name: "房卡套", vendor: "印刷工坊", capacity: "100入", unit: "盒", price: 220, stock: 24, tone: "purple" },
    { id: 23, branch: "台南六甲館", department: "總倉", name: "備品牙刷組", vendor: "日用百貨", capacity: "500入", unit: "箱", price: 1250, stock: 8, tone: "clear" },
    { id: 31, branch: "屏東潮州館", department: "房務", name: "拋棄式拖鞋", vendor: "客房備品社", capacity: "200雙", unit: "箱", price: 1680, stock: 11, tone: "pink" },
  ];

  const formatStoragePrice = (value) => (Number(value) > 0 ? `$${Number(value).toLocaleString("en-US")}` : "0");

  const getFilteredStorageItems = () => {
    const branch = storageBranchFilter?.value || "全部館別";
    const department = storageDepartmentFilter?.value || "全部部門";
    const keyword = String(storageSearchInput?.value || "").trim().toLowerCase();

    return storageItems.filter((item) => {
      const branchMatched = branch === "全部館別" || item.branch === branch;
      const departmentMatched = department === "全部部門" || item.department === department;
      const keywordMatched = !keyword || item.name.toLowerCase().includes(keyword);
      return branchMatched && departmentMatched && keywordMatched;
    });
  };

  const renderStoragePagination = (pageCount) => {
    if (!storagePagination) return;
    storagePagination.innerHTML = `
      <button type="button" data-storage-page="prev"${storagePage === 1 ? " disabled" : ""}>上一頁</button>
      ${Array.from({ length: pageCount }, (_, index) => `
        <button type="button" class="${storagePage === index + 1 ? "is-current" : ""}" data-storage-page="${index + 1}">${index + 1}</button>
      `).join("")}
      <button type="button" data-storage-page="next"${storagePage === pageCount ? " disabled" : ""}>下一頁</button>
    `;
  };

  const renderStorage = () => {
    const filteredItems = getFilteredStorageItems();
    const pageCount = Math.max(1, Math.ceil(filteredItems.length / storagePageSize));
    storagePage = Math.min(storagePage, pageCount);
    const start = (storagePage - 1) * storagePageSize;
    const pageItems = filteredItems.slice(start, start + storagePageSize);

    storageTableBody.innerHTML = pageItems
      .map((item) => `
        <tr>
          <td>${escapeHtml(item.branch)}</td>
          <td>${escapeHtml(item.department)}</td>
          <td>${escapeHtml(item.name)}</td>
          <td><div class="storage-photo storage-photo-${escapeHtml(item.tone)}"><span>${escapeHtml(item.name)}</span></div></td>
          <td>${escapeHtml(item.vendor)}</td>
          <td>${escapeHtml(item.capacity)}</td>
          <td>${escapeHtml(item.unit)}</td>
          <td>${formatStoragePrice(item.price)}</td>
          <td>${item.stock}</td>
          <td><button class="storage-history-button" type="button" data-storage-history="supply" data-id="${item.id}">點我查看</button></td>
          <td><button class="storage-history-button" type="button" data-storage-history="change" data-id="${item.id}">點我查看</button></td>
          <td>
            <div class="manager-actions storage-actions">
              <button class="edit" type="button" data-storage-edit="${item.id}">修改</button>
              <button class="delete" type="button" data-storage-delete="${item.id}">刪除</button>
            </div>
          </td>
        </tr>
      `)
      .join("");

    renderStoragePagination(pageCount);
  };

  const openStorageHistory = (id, type) => {
    const item = storageItems.find((storageItem) => storageItem.id === id);
    if (!item || !adminModal) return;
    const historyPanel = document.querySelector('[data-modal-form="storageHistory"]');
    const historyList = document.querySelector(".storage-history-list");
    modalTitle.textContent = type === "supply" ? "補貨/領貨歷程" : "異動歷程";
    modalForms.forEach((form) => {
      form.hidden = true;
    });
    const supplyRows = [
      { note: "操作進貨", quantity: 12, action: "補進", operator: "鳳山店長", date: "2026-07-03 13:05" },
      { note: "操作領貨", quantity: 3, action: "領出", operator: "自由店長", date: "2026-02-06 12:29" },
      { note: "操作售出", quantity: 1, action: "領出", operator: "湖內店長", date: "2026-01-27 16:02" },
      { note: "操作盤點", quantity: 2, action: "補進", operator: "六甲店長", date: "2025-12-24 15:46" },
      { note: "操作領貨", quantity: 1, action: "領出", operator: "潮州店長", date: "2025-10-21 10:10" },
    ];
    const changeRows = [
      { note: "新增庫存項目", name: item.name, department: item.department, vendor: item.vendor, capacity: item.capacity, unit: item.unit, price: item.price, quantity: 0, operator: "鳳山店長", date: "2026-04-28 12:11" },
      { note: "修改庫存項目", name: item.name, department: "總倉", vendor: item.vendor, capacity: item.capacity, unit: item.unit, price: item.price, quantity: 3, operator: "自由店長", date: "2026-05-05 17:46" },
      { note: "修改庫存項目", name: item.name, department: item.department, vendor: item.vendor, capacity: item.capacity, unit: item.unit, price: item.price + 20, quantity: item.stock, operator: "最高權限管理者", date: "2026-01-17 12:18" },
    ];
    historyList.innerHTML = `
      <p class="storage-history-item-title">項目：${escapeHtml(item.name)}</p>
      <div class="storage-history-grid ${type === "supply" ? "is-supply" : "is-change"}">
        ${(type === "supply" ? supplyRows : changeRows)
          .map((row) => type === "supply" ? `
            <article>
              <p><span>備註</span><strong>${escapeHtml(row.note)}</strong></p>
              <p><span>項目數量</span><strong>${row.quantity}</strong></p>
              <p><span>動作</span><strong>${escapeHtml(row.action)}</strong></p>
              <p><span>操作者</span><strong>${escapeHtml(row.operator)}</strong></p>
              <p><span>操作日期時間</span><strong>${escapeHtml(row.date)}</strong></p>
            </article>
          ` : `
            <article>
              <p><span>備註</span><strong>${escapeHtml(row.note)}</strong></p>
              <p><span>異動項目名稱</span><strong>${escapeHtml(row.name)}</strong></p>
              <p><span>異動時部門</span><strong>${escapeHtml(row.department)}</strong></p>
              <p><span>異動時廠商</span><strong>${escapeHtml(row.vendor)}</strong></p>
              <p><span>異動時容量</span><strong>${escapeHtml(row.capacity)}</strong></p>
              <p><span>異動時單位</span><strong>${escapeHtml(row.unit)}</strong></p>
              <p><span>異動時價格</span><strong>${formatStoragePrice(row.price)}</strong></p>
              <p><span>異動時數量</span><strong>${row.quantity}</strong></p>
              <p><span>操作者</span><strong>${escapeHtml(row.operator)}</strong></p>
              <p><span>操作日期時間</span><strong>${escapeHtml(row.date)}</strong></p>
            </article>
          `)
          .join("")}
      </div>
    `;
    historyPanel.hidden = false;
    adminModal.hidden = false;
  };

  const resetStorageSearch = () => {
    storagePage = 1;
    renderStorage();
  };

  [storageBranchFilter, storageDepartmentFilter].forEach((select) => {
    if (select) select.addEventListener("change", resetStorageSearch);
  });

  if (storageSearchButton) storageSearchButton.addEventListener("click", resetStorageSearch);
  if (storageSearchInput) {
    storageSearchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") resetStorageSearch();
    });
  }

  if (storagePagination) {
    storagePagination.addEventListener("click", (event) => {
      const button = event.target.closest("[data-storage-page]");
      if (!button || button.disabled) return;
      const pageCount = Math.max(1, Math.ceil(getFilteredStorageItems().length / storagePageSize));
      const target = button.dataset.storagePage;
      storagePage = target === "prev" ? Math.max(1, storagePage - 1) : target === "next" ? Math.min(pageCount, storagePage + 1) : Number(target);
      renderStorage();
    });
  }

  storageTableBody.addEventListener("click", (event) => {
    const historyButton = event.target.closest("[data-storage-history]");
    const deleteButton = event.target.closest("[data-storage-delete]");
    const editButton = event.target.closest("[data-storage-edit]");

    if (historyButton) {
      openStorageHistory(Number(historyButton.dataset.id), historyButton.dataset.storageHistory);
    }

    if (deleteButton) {
      const index = storageItems.findIndex((item) => item.id === Number(deleteButton.dataset.storageDelete));
      if (index >= 0) {
        storageItems.splice(index, 1);
        renderStorage();
      }
    }

    if (editButton) {
      const item = storageItems.find((storageItem) => storageItem.id === Number(editButton.dataset.storageEdit));
      if (item) {
        item.stock += 1;
        renderStorage();
      }
    }
  });

  renderStorage();
}

if (housekeepingRows.length && housekeepingBranchSelect && housekeepingRoomDetail && adminModal && floorPlan && floorPlanWrap) {
  const roomGroups = {
    101: ["101", "102", "103", "104", "105"],
    201: ["201", "202", "203", "204", "205", "206"],
    301: ["301", "302", "303", "304", "305", "306", "307"],
  };
  const branchLayouts = {
    高雄鳳山館: {
      className: "layout-fengshan",
      rooms: roomGroups,
    },
    高雄自由館: {
      className: "layout-freedom",
      rooms: {
        101: [...roomGroups[101]].reverse(),
        201: roomGroups[201],
        301: [...roomGroups[301]].reverse(),
      },
    },
    高雄湖內館: {
      className: "layout-hunei",
      rooms: {
        101: roomGroups[301],
        201: roomGroups[101],
        301: roomGroups[201],
      },
    },
    台南六甲館: {
      className: "layout-liujia",
      rooms: {
        101: roomGroups[201],
        201: [...roomGroups[301]].reverse(),
        301: roomGroups[101],
      },
    },
    屏東潮州館: {
      className: "layout-chaozhou",
      rooms: {
        101: [...roomGroups[201]].reverse(),
        201: [...roomGroups[101]].reverse(),
        301: roomGroups[301],
      },
    },
  };
  const branchNames = ["高雄鳳山館", "高雄自由館", "高雄湖內館", "台南六甲館", "屏東潮州館"];
  const defaultRoomState = (branch) => {
    const rooms = {};
    Object.values(roomGroups).flat().forEach((room) => {
      rooms[room] = {
        status: "normal",
        issues: [],
        history: [`${branch} ${room} 建立正常可用狀態`],
      };
    });
    rooms["102"].status = "repair";
    rooms["102"].issues = [{ type: "repair", text: "浴室排水異常", done: false }];
    rooms["102"].history.push("新增報修：浴室排水異常");
    rooms["204"].status = "supply";
    rooms["204"].issues = [{ type: "supply", text: "補毛巾 2 條、牙刷組 2 組", done: false }];
    rooms["204"].history.push("新增補給：補毛巾 2 條、牙刷組 2 組");
    rooms["303"].status = "repair";
    rooms["303"].issues = [{ type: "repair", text: "冷氣遙控器無反應", done: false }];
    rooms["303"].history.push("新增報修：冷氣遙控器無反應");
    return rooms;
  };
  const housekeepingState = Object.fromEntries(branchNames.map((branch) => [branch, defaultRoomState(branch)]));

  const getCurrentRooms = () => housekeepingState[housekeepingBranchSelect.value];

  const statusLabel = (status) => ({
    normal: "正常可用",
    supply: "需補給",
    repair: "需報修",
  })[status] || "正常可用";

  const updateRoomStatus = (room) => {
    const pending = room.issues.filter((issue) => !issue.done);
    if (pending.some((issue) => issue.type === "repair")) room.status = "repair";
    else if (pending.some((issue) => issue.type === "supply")) room.status = "supply";
    else room.status = "normal";
  };

  const renderHousekeeping = () => {
    const rooms = getCurrentRooms();
    const layout = branchLayouts[housekeepingBranchSelect.value] || branchLayouts["高雄鳳山館"];
    floorPlan.className = `floor-plan ${layout.className}`;
    housekeepingRows.forEach((row) => {
      const group = layout.rooms[row.dataset.floorRow];
      const label = row.parentElement.querySelector("strong");
      if (label) label.textContent = `${group[0]} - ${group[group.length - 1]}`;
      row.innerHTML = group.map((roomNumber) => {
        const room = rooms[roomNumber];
        const pendingCount = room.issues.filter((issue) => !issue.done).length;
        return `
          <button class="room-card is-${room.status}" type="button" data-room="${roomNumber}">
            <strong>${roomNumber}</strong>
            <span>${statusLabel(room.status)}</span>
            <small>${pendingCount ? `${pendingCount} 件待處理` : "可用"}</small>
          </button>
        `;
      }).join("");
    });
    requestAnimationFrame(scaleFloorPlan);
  };

  const scaleFloorPlan = () => {
    const styles = window.getComputedStyle(floorPlanWrap);
    const paddingX = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
    const paddingY = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
    const availableWidth = Math.max(280, floorPlanWrap.clientWidth - paddingX);
    const scale = Math.min(1, availableWidth / 900);
    floorPlanWrap.style.setProperty("--floor-scale", String(scale));
    floorPlan.style.transform = `scale(${scale})`;
    floorPlanWrap.style.setProperty("--floor-scaled-height", `${Math.ceil(floorPlan.scrollHeight * scale + paddingY)}px`);
  };

  const renderRoomModal = (roomNumber) => {
    const rooms = getCurrentRooms();
    const room = rooms[roomNumber];
    updateRoomStatus(room);
    modalTitle.textContent = `${housekeepingBranchSelect.value} ${roomNumber}`;
    modalForms.forEach((form) => {
      form.hidden = true;
    });
    housekeepingRoomDetail.innerHTML = `
      <div class="room-detail-head is-${room.status}">
        <span>${roomNumber}</span>
        <strong>${statusLabel(room.status)}</strong>
      </div>
      <div class="room-action-panel">
        <label>狀況類型
          <select data-room-issue-type>
            <option value="supply">補給</option>
            <option value="repair">報修</option>
          </select>
        </label>
        <label>狀況內容
          <input data-room-issue-text type="text" placeholder="例如：補浴巾 2 條 / 冷氣漏水" />
        </label>
        <button type="button" data-room-add="${roomNumber}">新增狀況</button>
      </div>
      <div class="room-issue-list">
        <h3>待處理狀況</h3>
        ${room.issues.length ? room.issues.map((issue, index) => `
          <article class="${issue.done ? "is-done" : ""}">
            <span>${issue.type === "repair" ? "報修" : "補給"}</span>
            <strong>${escapeHtml(issue.text)}</strong>
            <p>${issue.done ? "已處理" : "待處理"}</p>
            ${issue.done ? "" : `<button type="button" data-room-done="${roomNumber}" data-index="${index}">確認已處理</button>`}
          </article>
        `).join("") : "<p class=\"room-empty\">目前沒有待處理狀況。</p>"}
      </div>
      <details class="room-history" open>
        <summary>歷程查看</summary>
        ${room.history.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}
      </details>
    `;
    const modalPanel = document.querySelector('[data-modal-form="housekeepingRoom"]');
    modalPanel.hidden = false;
    adminModal.hidden = false;
  };

  housekeepingBranchSelect.addEventListener("change", renderHousekeeping);
  window.addEventListener("resize", scaleFloorPlan);

  housekeepingRows.forEach((row) => {
    row.addEventListener("click", (event) => {
      const button = event.target.closest("[data-room]");
      if (!button) return;
      renderRoomModal(button.dataset.room);
    });
  });

  housekeepingRoomDetail.addEventListener("click", (event) => {
    const addButton = event.target.closest("[data-room-add]");
    const doneButton = event.target.closest("[data-room-done]");
    const rooms = getCurrentRooms();

    if (addButton) {
      const roomNumber = addButton.dataset.roomAdd;
      const type = housekeepingRoomDetail.querySelector("[data-room-issue-type]").value;
      const input = housekeepingRoomDetail.querySelector("[data-room-issue-text]");
      const text = String(input.value || "").trim();
      if (!text) return;
      rooms[roomNumber].issues.push({ type, text, done: false });
      rooms[roomNumber].history.push(`新增${type === "repair" ? "報修" : "補給"}：${text}`);
      updateRoomStatus(rooms[roomNumber]);
      renderHousekeeping();
      renderRoomModal(roomNumber);
    }

    if (doneButton) {
      const roomNumber = doneButton.dataset.roomDone;
      const index = Number(doneButton.dataset.index);
      const issue = rooms[roomNumber].issues[index];
      issue.done = true;
      rooms[roomNumber].history.push(`確認已處理：${issue.text}`);
      updateRoomStatus(rooms[roomNumber]);
      renderHousekeeping();
      renderRoomModal(roomNumber);
    }
  });

  renderHousekeeping();
}

if (reportTypeSelect && reportExportButton && reportOutput && reportPreviewSummary) {
  let activeReportType = null;
  const reportNames = {
    revenue: "年度營收統計",
    profit: "損益表",
    ticket: "票卷報表",
  };
  const reportSummary = {
    revenue: [
      ["休息次數", "3,765 次"],
      ["住宿次數", "2,495 次"],
      ["刷卡", "$3,544,856"],
      ["匯款", "$413,700"],
      ["現金", "$7,236,460"],
      ["年度營收", "$11,195,016"],
    ],
    profit: [
      ["本期營業收入", "$1,882,213"],
      ["營業成本", "100%"],
      ["電費", "$149,566"],
      ["水費", "$10,358"],
      ["營業毛利", "$1,722,289"],
      ["毛利率", "91.5%"],
    ],
    ticket: [
      ["入庫張數", "7,000"],
      ["已售出", "2,605"],
      ["已使用", "876"],
      ["未使用", "1,729"],
      ["票卷種類", "休息 / 游泳"],
      ["銷售金額", "$9,117,500"],
    ],
  };
  const reportRows = {
    revenue: [
      ["月", "休息次數", "住宿次數", "刷卡", "匯款", "現金", "每月營收", "營收漲跌"],
      ["1月", "753", "499", "506,408", "59,100", "1,033,780", "1,599,288", "持平"],
      ["2月", "753", "499", "506,408", "59,100", "1,033,780", "1,599,288", "持平"],
      ["3月", "753", "499", "506,408", "59,100", "1,033,780", "1,599,288", "持平"],
      ["4月", "753", "499", "506,408", "59,100", "1,033,780", "1,599,288", "持平"],
      ["5月", "753", "499", "506,408", "59,100", "1,033,780", "1,599,288", "持平"],
      ["6月", "753", "499", "506,408", "59,100", "1,033,780", "1,599,288", "持平"],
      ["7月", "753", "499", "506,408", "59,100", "1,316,705", "1,882,213", "上漲18%"],
      ["8月", "-", "-", "-", "-", "-", "-", "下降100%"],
      ["年計", "3,765", "2,495", "3,544,856", "413,700", "7,236,460", "11,195,016", ""],
    ],
    profit: [
      ["項目", "金額", "比例"],
      ["營業收入", "1,882,213", ""],
      ["營業成本", "", "100%"],
      ["電費", "149,566", "93.5%"],
      ["水費", "10,358", "6.5%"],
      ["營業毛利", "1,722,289", ""],
      ["毛利%", "", "91.5%"],
    ],
    ticket: [
      ["館別", "票卷種類", "入庫張數", "已售出", "已使用", "未使用", "銷售金額"],
      ["高雄鳳山館", "游泳", "2,000", "755", "260", "495", "2,642,500"],
      ["高雄自由館", "休息", "2,500", "1,155", "385", "770", "4,042,500"],
      ["高雄湖內館", "休息", "1,200", "410", "136", "274", "1,435,000"],
      ["台南六甲館", "游泳", "800", "165", "55", "110", "577,500"],
      ["屏東潮州館", "休息", "500", "120", "40", "80", "420,000"],
    ],
  };

  const getReportMeta = () => ({
    type: reportTypeSelect.value,
    name: reportNames[reportTypeSelect.value],
    branch: reportBranchSelect?.value || "全部館別",
    start: reportStartDate?.value || "",
    end: reportEndDate?.value || "",
  });

  const renderReportPreview = () => {
    const meta = getReportMeta();
    activeReportType = meta.type;
    reportOutput.hidden = false;
    reportExportButton.disabled = false;
    reportPreviewSummary.innerHTML = `
      <div class="report-card-head">
        <span>${escapeHtml(meta.name)}</span>
        <strong>${escapeHtml(meta.branch)}</strong>
        <p>${escapeHtml(meta.start)} 至 ${escapeHtml(meta.end)}</p>
      </div>
      <div class="report-card-grid">
        ${reportSummary[meta.type].map(([label, value]) => `
          <article>
            <span>${escapeHtml(label)}</span>
            <strong>${escapeHtml(value)}</strong>
          </article>
        `).join("")}
      </div>
    `;
  };

  const xmlEscape = (value) =>
    String(value).replace(/[<>&'"]/g, (char) => ({
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      '"': "&quot;",
    })[char]);

  const columnName = (index) => {
    let name = "";
    let value = index + 1;
    while (value > 0) {
      const remainder = (value - 1) % 26;
      name = String.fromCharCode(65 + remainder) + name;
      value = Math.floor((value - remainder) / 26);
    }
    return name;
  };

  const buildWorksheetXml = () => {
    const meta = getReportMeta();
    const rows = reportRows[meta.type];
    const exportRows = [
      [`薇風艾菲爾有限公司 ${meta.name}`],
      [`館別：${meta.branch}`, `期間：${meta.start} 至 ${meta.end}`],
      [],
      ...rows,
      [],
      ["製表人：楊琬浚", "製表時間：2026/10/8 10:47"],
    ];
    const sheetData = exportRows
      .map((row, rowIndex) => `
        <row r="${rowIndex + 1}">
          ${row.map((cell, columnIndex) => `
            <c r="${columnName(columnIndex)}${rowIndex + 1}" t="inlineStr">
              <is><t>${xmlEscape(cell)}</t></is>
            </c>
          `).join("")}
        </row>
      `)
      .join("");
    return `
      <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
        <sheetData>${sheetData}</sheetData>
      </worksheet>
    `;
  };

  const crc32 = (bytes) => {
    let crc = -1;
    for (const byte of bytes) {
      crc ^= byte;
      for (let bit = 0; bit < 8; bit += 1) {
        crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
      }
    }
    return (crc ^ -1) >>> 0;
  };

  const uint16 = (value) => [value & 255, (value >>> 8) & 255];
  const uint32 = (value) => [value & 255, (value >>> 8) & 255, (value >>> 16) & 255, (value >>> 24) & 255];

  const buildZip = (files) => {
    const encoder = new TextEncoder();
    const fileRecords = [];
    const centralDirectory = [];
    let offset = 0;

    files.forEach((file) => {
      const nameBytes = encoder.encode(file.name);
      const contentBytes = encoder.encode(file.content.trim());
      const checksum = crc32(contentBytes);
      const localHeader = new Uint8Array([
        ...uint32(0x04034b50), ...uint16(20), ...uint16(0), ...uint16(0), ...uint16(0), ...uint16(0),
        ...uint32(checksum), ...uint32(contentBytes.length), ...uint32(contentBytes.length),
        ...uint16(nameBytes.length), ...uint16(0),
      ]);
      fileRecords.push(localHeader, nameBytes, contentBytes);
      centralDirectory.push({
        nameBytes,
        checksum,
        size: contentBytes.length,
        offset,
      });
      offset += localHeader.length + nameBytes.length + contentBytes.length;
    });

    const centralStart = offset;
    const centralRecords = [];
    centralDirectory.forEach((file) => {
      const header = new Uint8Array([
        ...uint32(0x02014b50), ...uint16(20), ...uint16(20), ...uint16(0), ...uint16(0), ...uint16(0), ...uint16(0),
        ...uint32(file.checksum), ...uint32(file.size), ...uint32(file.size),
        ...uint16(file.nameBytes.length), ...uint16(0), ...uint16(0), ...uint16(0), ...uint16(0), ...uint32(0),
        ...uint32(file.offset),
      ]);
      centralRecords.push(header, file.nameBytes);
      offset += header.length + file.nameBytes.length;
    });
    const centralSize = offset - centralStart;
    const endRecord = new Uint8Array([
      ...uint32(0x06054b50), ...uint16(0), ...uint16(0), ...uint16(centralDirectory.length), ...uint16(centralDirectory.length),
      ...uint32(centralSize), ...uint32(centralStart), ...uint16(0),
    ]);

    return new Blob([...fileRecords, ...centralRecords, endRecord], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  };

  const buildXlsxBlob = () => buildZip([
    {
      name: "[Content_Types].xml",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
          <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
          <Default Extension="xml" ContentType="application/xml"/>
          <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
          <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
        </Types>`,
    },
    {
      name: "_rels/.rels",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
          <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
        </Relationships>`,
    },
    {
      name: "xl/workbook.xml",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
          <sheets><sheet name="報表" sheetId="1" r:id="rId1"/></sheets>
        </workbook>`,
    },
    {
      name: "xl/_rels/workbook.xml.rels",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
          <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
        </Relationships>`,
    },
    {
      name: "xl/worksheets/sheet1.xml",
      content: buildWorksheetXml(),
    },
  ]);

  [reportTypeSelect, reportBranchSelect, reportStartDate, reportEndDate].forEach((control) => {
    if (!control) return;
    control.addEventListener("change", renderReportPreview);
    control.addEventListener("input", renderReportPreview);
  });
  renderReportPreview();
  reportExportButton.addEventListener("click", () => {
    if (!activeReportType) renderReportPreview();
    const meta = getReportMeta();
    const blob = buildXlsxBlob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${meta.name}_${formatDateForFile(meta.start)}_${formatDateForFile(meta.end)}.xlsx`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
  });
}

if (managerTableBody && adminModal) {
  let activeIndex = null;
  let activeMode = "create";
  let currentPage = 1;
  const pageSize = 5;
  const branches = ["全部", "高雄鳳山館", "高雄自由館", "高雄湖內館", "台南六甲館", "屏東潮州館"];
  const roles = ["最高權限管理者", "總公司", "店長", "檀臺總務", "檀臺", "房務室總務", "房務"];
  const managers = [
    { name: "最高權限管理者", account: "admin", password: "123123", branch: "全部", role: "最高權限管理者" },
    { name: "總公司", account: "headAdmin", password: "123123", branch: "全部", role: "總公司" },
    { name: "鳳山店長", account: "fengshan", password: "123123", branch: "高雄鳳山館", role: "店長" },
    { name: "自由店長", account: "freedom", password: "123123", branch: "高雄自由館", role: "店長" },
    { name: "湖內店長", account: "hunei", password: "123123", branch: "高雄湖內館", role: "店長" },
    { name: "六甲店長", account: "liujia", password: "123123", branch: "台南六甲館", role: "店長" },
    { name: "潮州店長", account: "chaozhou", password: "123123", branch: "屏東潮州館", role: "店長" },
    { name: "林宥辰", account: "counter01", password: "123123", branch: "高雄湖內館", role: "檀臺總務" },
    { name: "陳怡君", account: "house01", password: "123123", branch: "高雄湖內館", role: "房務" },
    { name: "張雅婷", account: "house02", password: "123123", branch: "高雄湖內館", role: "房務" },
  ];

  const fillSelect = (select, values, selectedValue) => {
    if (!select) return;
    select.innerHTML = values
      .map((value) => `<option value="${escapeHtml(value)}"${value === selectedValue ? " selected" : ""}>${escapeHtml(value)}</option>`)
      .join("");
  };

  const renderOptionList = (type) => {
    const values = type === "branch" ? branches : roles;
    const list = document.querySelector(`[data-option-list="${type}"]`);
    if (!list) return;

    list.innerHTML = values
      .map((value, index) => `
        <div class="option-row">
          <input type="text" value="${escapeHtml(value)}" data-option-input="${type}" data-index="${index}" />
          <button class="save" type="button" data-option-save="${type}" data-index="${index}">修改</button>
          <button class="remove" type="button" data-option-remove="${type}" data-index="${index}">刪除</button>
        </div>
      `)
      .join("");
  };

  const refreshAllSelects = () => {
    editableModalForms.forEach((form) => {
      fillSelect(form.elements.branch, branches, form.elements.branch?.value || "全部");
      fillSelect(form.elements.role, roles, form.elements.role?.value || "店長");
    });
  };

  editableModalForms.forEach((form) => {
    fillSelect(form.elements.branch, branches, "全部");
    fillSelect(form.elements.role, roles, "店長");
  });

  const renderManagers = () => {
    const pageCount = Math.max(1, Math.ceil(managers.length / pageSize));
    currentPage = Math.min(currentPage, pageCount);
    const start = (currentPage - 1) * pageSize;
    const pageItems = managers.slice(start, start + pageSize);

    managerTableBody.innerHTML = pageItems
      .map((manager, index) => `
        <tr>
          <td>${start + index + 1}</td>
          <td>${escapeHtml(manager.name)}</td>
          <td>${escapeHtml(manager.account)}</td>
          <td>${escapeHtml(manager.branch)}</td>
          <td>${escapeHtml(manager.role)}</td>
          <td>
            <div class="manager-actions">
              <button class="edit" type="button" data-action="profile" data-index="${start + index}">基本資料</button>
              <button class="password" type="button" data-action="password" data-index="${start + index}">密碼</button>
              <button class="branch" type="button" data-action="branch" data-index="${start + index}">館別</button>
              <button class="role" type="button" data-action="role" data-index="${start + index}">角色</button>
              <button class="delete" type="button" data-action="delete" data-index="${start + index}">▱ 刪除</button>
            </div>
          </td>
        </tr>
      `)
      .join("");

    if (managerPagination) {
      managerPagination.innerHTML = `
        <button type="button" data-page="prev"${currentPage === 1 ? " disabled" : ""}>上一頁</button>
        ${Array.from({ length: pageCount }, (_, index) => `
          <button type="button" class="${currentPage === index + 1 ? "is-current" : ""}" data-page="${index + 1}">${index + 1}</button>
        `).join("")}
        <button type="button" data-page="next"${currentPage === pageCount ? " disabled" : ""}>下一頁</button>
      `;
    }
  };

  const getModalForm = (mode) => document.querySelector(`[data-modal-form="${mode}"]`);

  const closeModal = () => {
    activeIndex = null;
    adminModal.hidden = true;
    modalForms.forEach((form) => {
      form.hidden = true;
      if (typeof form.reset === "function") form.reset();
      const errorText = form.querySelector(".modal-error");
      if (errorText) errorText.textContent = "";
    });
  };

  const openModal = (mode, index = null) => {
    activeMode = mode;
    activeIndex = index;
    modalForms.forEach((form) => {
      form.hidden = true;
      const errorText = form.querySelector(".modal-error");
      if (errorText) errorText.textContent = "";
    });

    const form = getModalForm(mode);
    const manager = index === null ? null : managers[index];
    if (!form) return;

    const titles = {
      create: "新增管理者",
      profile: "修改基本資料",
      password: "修改密碼",
      branch: "管理館別",
      role: "管理角色",
      branches: "管理館別清單",
    };

    modalTitle.textContent = titles[mode];
    form.hidden = false;

    if (mode === "create") {
      fillSelect(form.elements.branch, branches, "全部");
      fillSelect(form.elements.role, roles, "店長");
    }

    if (manager && mode === "profile") {
      form.elements.name.value = manager.name;
      form.elements.account.value = manager.account;
    }

    if (manager && mode === "branch") {
      fillSelect(form.elements.branch, branches, manager.branch);
    }

    if (manager && mode === "role") {
      fillSelect(form.elements.role, roles, manager.role);
    }

    if (mode === "branches") {
      renderOptionList("branch");
    }

    adminModal.hidden = false;
    const firstInput = form.querySelector("input, select");
    if (firstInput) firstInput.focus();
  };

  createManagerButton.addEventListener("click", () => openModal("create"));
  openBranchesButton.addEventListener("click", () => {
    openModal("branches");
  });
  modalClose.addEventListener("click", closeModal);
  adminModal.addEventListener("click", (event) => {
    if (event.target === adminModal) closeModal();
  });

  if (managerPagination) {
    managerPagination.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-page]");
      if (!button || button.disabled) return;

      const pageCount = Math.max(1, Math.ceil(managers.length / pageSize));
      const targetPage = button.dataset.page;
      if (targetPage === "prev") currentPage = Math.max(1, currentPage - 1);
      if (targetPage === "next") currentPage = Math.min(pageCount, currentPage + 1);
      if (/^\d+$/.test(targetPage)) currentPage = Number(targetPage);
      renderManagers();
    });
  }

  managerTableBody.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const index = Number(button.dataset.index);
    const action = button.dataset.action;
    const manager = managers[index];

    if (["profile", "password", "branch", "role"].includes(action)) {
      openModal(action, index);
      return;
    }

    if (action === "delete") {
      managers.splice(index, 1);
      renderManagers();
    }
  });

  editableModalForms.forEach((form) => {
    form.addEventListener("click", (event) => {
      const addButton = event.target.closest("button[data-option-add]");
      const saveButton = event.target.closest("button[data-option-save]");
      const removeButton = event.target.closest("button[data-option-remove]");

      if (addButton) {
        const type = addButton.dataset.optionAdd;
        const values = type === "branch" ? branches : roles;
        const input = form.elements.optionName;
        const value = String(input.value || "").trim();
        if (!value || values.includes(value)) return;
        values.push(value);
        input.value = "";
        renderOptionList(type);
        refreshAllSelects();
      }

      if (saveButton) {
        const type = saveButton.dataset.optionSave;
        const values = type === "branch" ? branches : roles;
        const index = Number(saveButton.dataset.index);
        const input = form.querySelector(`[data-option-input="${type}"][data-index="${index}"]`);
        const nextValue = String(input.value || "").trim();
        if (!nextValue) return;
        const oldValue = values[index];
        values[index] = nextValue;
        managers.forEach((manager) => {
          if (type === "branch" && manager.branch === oldValue) manager.branch = nextValue;
          if (type === "role" && manager.role === oldValue) manager.role = nextValue;
        });
        renderManagers();
        renderOptionList(type);
        refreshAllSelects();
      }

      if (removeButton) {
        const type = removeButton.dataset.optionRemove;
        const values = type === "branch" ? branches : roles;
        const fallback = type === "branch" ? "全部" : "店長";
        const index = Number(removeButton.dataset.index);
        const oldValue = values[index];
        if (values.length <= 1) return;
        values.splice(index, 1);
        managers.forEach((manager) => {
          if (type === "branch" && manager.branch === oldValue) manager.branch = fallback;
          if (type === "role" && manager.role === oldValue) manager.role = fallback;
        });
        renderManagers();
        renderOptionList(type);
        refreshAllSelects();
      }
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (["branches", "roles"].includes(activeMode)) return;

      const formData = new FormData(form);
      const errorText = form.querySelector(".modal-error");

      if (activeMode === "create") {
        const password = String(formData.get("password") || "");
        const passwordConfirm = String(formData.get("passwordConfirm") || "");
        if (password !== passwordConfirm) {
          errorText.textContent = "兩次密碼輸入不一致";
          return;
        }

        managers.push({
          name: String(formData.get("name") || "").trim(),
          account: String(formData.get("account") || "").trim(),
          password,
          branch: String(formData.get("branch") || ""),
          role: String(formData.get("role") || ""),
        });
        currentPage = Math.ceil(managers.length / pageSize);
      }

      if (activeMode === "profile" && activeIndex !== null) {
        managers[activeIndex].name = String(formData.get("name") || "").trim();
      }

      if (activeMode === "password" && activeIndex !== null) {
        const password = String(formData.get("password") || "");
        const passwordConfirm = String(formData.get("passwordConfirm") || "");
        if (password !== passwordConfirm) {
          errorText.textContent = "兩次密碼輸入不一致";
          return;
        }
        managers[activeIndex].password = password;
      }

      if (activeMode === "branch" && activeIndex !== null) {
        managers[activeIndex].branch = String(formData.get("branch") || "");
      }

      if (activeMode === "role" && activeIndex !== null) {
        managers[activeIndex].role = String(formData.get("role") || "");
      }

      renderManagers();
      closeModal();
    });
  });

  renderManagers();
}
