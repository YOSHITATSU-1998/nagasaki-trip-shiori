import './style.css'

// Initial Lucide Icons activation
if (typeof lucide !== 'undefined') {
  lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons again just in case DOM loaded after script
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  /* ==========================================================================
     1. TAB NAVIGATION (MAIN TABS)
     ========================================================================== */
  const navTabs = document.querySelectorAll('.nav-tab');
  const tabContents = document.querySelectorAll('.tab-content');

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');

      // Update Nav buttons
      navTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update contents
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `tab-${targetTab}`) {
          content.classList.add('active');
        }
      });

      // Rerender icons for newly displayed tab
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    });
  });

  /* ==========================================================================
     2. DAY SCHEDULE NAVIGATION
     ========================================================================== */
  const dayTabs = document.querySelectorAll('.day-tab');
  const dayContents = document.querySelectorAll('.day-content');

  dayTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetDay = tab.getAttribute('data-day');

      // Update active tabs
      dayTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update active content
      dayContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `schedule-${targetDay}`) {
          content.classList.add('active');
        }
      });

      // Render icons
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    });
  });

  /* ==========================================================================
     3. INTERACTIVE BUDGET CALCULATOR
     ========================================================================== */
  const calcForm = document.getElementById('calc-form');
  const expenseNameInput = document.getElementById('expense-name');
  const expenseAmountInput = document.getElementById('expense-amount');
  const expensesList = document.getElementById('expenses-list');
  const totalExtraAmountEl = document.getElementById('total-extra-amount');
  const perPersonExtraAmountEl = document.getElementById('per-person-extra-amount');
  const finalAmountPerPersonEl = document.getElementById('final-amount-per-person');

  const BASE_FIXED_COST = 31395; // 1人あたりの基本固定費
  const PARTY_SIZE = 4; // 旅行人数
  let extraExpenses = JSON.parse(localStorage.getItem('shiori_extra_expenses')) || [];

  function saveExpenses() {
    localStorage.setItem('shiori_extra_expenses', JSON.stringify(extraExpenses));
  }

  function calculateTotals() {
    const totalExtra = extraExpenses.reduce((sum, item) => sum + item.amount, 0);
    const perPersonExtra = Math.round(totalExtra / PARTY_SIZE);
    const finalTotal = BASE_FIXED_COST + perPersonExtra;

    totalExtraAmountEl.textContent = `¥${totalExtra.toLocaleString()}`;
    perPersonExtraAmountEl.textContent = `¥${perPersonExtra.toLocaleString()}`;
    finalAmountPerPersonEl.textContent = `¥${finalTotal.toLocaleString()}`;
  }

  function renderExpenses() {
    expensesList.innerHTML = '';
    
    if (extraExpenses.length === 0) {
      expensesList.innerHTML = '<li class="empty-msg">追加された共通費はありません</li>';
      return;
    }

    extraExpenses.forEach((item, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="name">${item.name}</span>
        <div class="val-box">
          <span class="amount">¥${item.amount.toLocaleString()}</span>
          <button class="delete-btn" data-index="${index}"><i data-lucide="trash-2"></i></button>
        </div>
      `;
      expensesList.appendChild(li);
    });

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  // Add Expense
  calcForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = expenseNameInput.value.trim();
    const amount = parseInt(expenseAmountInput.value, 10);

    if (name && !isNaN(amount) && amount >= 0) {
      extraExpenses.push({ name, amount });
      saveExpenses();
      renderExpenses();
      calculateTotals();

      // Reset Form
      expenseNameInput.value = '';
      expenseAmountInput.value = '';
    }
  });

  // Delete Expense
  expensesList.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.delete-btn');
    if (deleteBtn) {
      const index = parseInt(deleteBtn.getAttribute('data-index'), 10);
      extraExpenses.splice(index, 1);
      saveExpenses();
      renderExpenses();
      calculateTotals();
    }
  });

  // Initial Calculation Load
  renderExpenses();
  calculateTotals();

  /* ==========================================================================
     4. BAG PACKING CHECKLIST
     ========================================================================== */
  const essentialListEl = document.getElementById('list-essential');
  const onsenListEl = document.getElementById('list-onsen');
  const gadgetsListEl = document.getElementById('list-gadgets');
  const customItemForm = document.getElementById('custom-item-form');
  const customItemNameInput = document.getElementById('custom-item-name');
  const resetChecklistBtn = document.getElementById('reset-checklist');

  const defaultChecklist = {
    essential: [
      { id: 'e1', name: '運転免許証 (必須)', checked: false, isDefault: true },
      { id: 'e2', name: '健康保険証', checked: false, isDefault: true },
      { id: 'e3', name: '現金・財布', checked: false, isDefault: true },
      { id: 'e4', name: 'スマートフォン・充電器', checked: false, isDefault: true },
      { id: 'e5', name: '着替え (2日分)', checked: false, isDefault: true },
      { id: 'e6', name: 'ETCカード', checked: false, isDefault: true }
    ],
    onsen: [
      { id: 'o1', name: 'フェイスタオル・バスタオル', checked: false, isDefault: true },
      { id: 'o2', name: '部屋着・スキンケア用品', checked: false, isDefault: true },
      { id: 'o3', name: 'ビニール袋 (濡れたタオル用)', checked: false, isDefault: true },
      { id: 'o4', name: '洗面用具 (歯ブラシ等)', checked: false, isDefault: true }
    ],
    gadgets: [
      { id: 'g1', name: 'モバイルバッテリー', checked: false, isDefault: true },
      { id: 'g2', name: '車載ホルダー (カーナビ用)', checked: false, isDefault: true },
      { id: 'g3', name: 'ドライブ用音楽プレイリスト', checked: false, isDefault: true },
      { id: 'g4', name: '酔い止め・常備薬', checked: false, isDefault: true }
    ]
  };

  let checklist = JSON.parse(localStorage.getItem('shiori_checklist')) || JSON.parse(JSON.stringify(defaultChecklist));

  function saveChecklist() {
    localStorage.setItem('shiori_checklist', JSON.stringify(checklist));
  }

  function renderChecklistCategory(categoryKey, element) {
    element.innerHTML = '';
    const items = checklist[categoryKey];

    if (items.length === 0) {
      element.innerHTML = '<li class="empty-msg">登録されたアイテムはありません</li>';
      return;
    }

    items.forEach((item) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <label class="checklist-label">
          <input type="checkbox" data-cat="${categoryKey}" data-id="${item.id}" ${item.checked ? 'checked' : ''}>
          <span class="checkbox-custom"></span>
          <span>${item.name}</span>
        </label>
        <button class="delete-btn" data-cat="${categoryKey}" data-id="${item.id}"><i data-lucide="x"></i></button>
      `;
      element.appendChild(li);
    });

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  function renderAllChecklists() {
    renderChecklistCategory('essential', essentialListEl);
    renderChecklistCategory('onsen', onsenListEl);
    renderChecklistCategory('gadgets', gadgetsListEl);
  }

  // Handle Checklist Checkbox toggle & Delete
  document.querySelector('#tab-checklist').addEventListener('change', (e) => {
    if (e.target.type === 'checkbox') {
      const cat = e.target.getAttribute('data-cat');
      const id = e.target.getAttribute('data-id');
      const item = checklist[cat].find(i => i.id === id);
      if (item) {
        item.checked = e.target.checked;
        saveChecklist();
      }
    }
  });

  document.querySelector('#tab-checklist').addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.delete-btn');
    if (deleteBtn) {
      const cat = deleteBtn.getAttribute('data-cat');
      const id = deleteBtn.getAttribute('data-id');
      const index = checklist[cat].findIndex(i => i.id === id);
      if (index > -1) {
        checklist[cat].splice(index, 1);
        saveChecklist();
        renderChecklistCategory(cat, cat === 'essential' ? essentialListEl : cat === 'onsen' ? onsenListEl : gadgetsListEl);
      }
    }
  });

  // Add Custom packing Item (automatically added to gadgets/others category)
  customItemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = customItemNameInput.value.trim();
    if (name) {
      const newItem = {
        id: 'c_' + Date.now(),
        name: name,
        checked: false,
        isDefault: false
      };
      checklist.gadgets.push(newItem);
      saveChecklist();
      renderChecklistCategory('gadgets', gadgetsListEl);
      customItemNameInput.value = '';
    }
  });

  // Reset Checklist to default
  resetChecklistBtn.addEventListener('click', () => {
    if (confirm('チェックリストを初期状態（デフォルト）に戻しますか？追加したカスタム項目もリセットされます。')) {
      checklist = JSON.parse(JSON.stringify(defaultChecklist));
      saveChecklist();
      renderAllChecklists();
    }
  });

  // Transport fee breakdown popup
  const transportRow = document.getElementById('transport-row');
  if (transportRow) {
    transportRow.addEventListener('click', () => {
      alert(
        "🚗 交通費（4人分の合計額）の内訳\n\n" +
        "・行き高速代（通常）: ¥4,010\n" +
        "・帰り高速代（通常）: ¥3,810\n" +
        "・フェリー車体代 : ¥3,500\n" +
        "-------------------------\n" +
        "★ 移動交通費 合計 : ¥11,320\n\n" +
        "（1人あたり: ¥11,320 ÷ 4 ＝ ¥2,830）"
      );
    });
  }

  // Initial Pack List Load
  renderAllChecklists();
});
