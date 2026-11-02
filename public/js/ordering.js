$(function () {
  const MENU_API   = '/icoms/api/menu.php';
  const ORDER_API  = '/icoms/api/orders.php';
  const receiptModal = new bootstrap.Modal('#receiptModal');

  let menuItems = [];
  let menuLookup = {};
  let cart = {};
  let activeCategory = 'All';
  let searchTerm = '';
  let selectedPaymentMethod = 'cash';
  let isDockCollapsed = false;

  // Warm beige coffee & tea SVG fallback
  const FALLBACK_SVG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="110" viewBox="0 0 24 24" fill="%23C29E7D" style="background:%23F5EAE0;padding:22px"><path d="M2 21h18v-2H2v2zm2-4h14v-2H4v2zm2-4h10V5H6v8zm14-5v3c0 1.66-1.34 3-3 3h-1V6h1c1.66 0 3 1.34 3 3z"/></svg>';

  // Curated bright, warm-beige cafe imagery & badges
  const ITEM_METADATA = {
    'caffe americano': {
      code: 'AMER-01',
      desc: 'Rich double espresso shots topped with pure hot water.',
      badge: 'House classic',
      img: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=500&auto=format&fit=crop&q=80'
    },
    'caffe latte': {
      code: 'CLATTE-02',
      desc: 'Double espresso, steamed velvety milk, and silky microfoam.',
      badge: 'Community fave',
      img: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=500&auto=format&fit=crop&q=80'
    },
    'spanish latte': {
      code: 'SPANISH-03',
      desc: 'Espresso with textured milk and sweet condensed milk swirl.',
      badge: 'Bestseller',
      img: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=500&auto=format&fit=crop&q=80'
    },
    'caramel macchiato': {
      code: 'CARAMEL-04',
      desc: 'Fresh milk marked with bold espresso and rich caramel drizzle.',
      badge: 'Extra creamy',
      img: 'https://images.unsplash.com/photo-1572286258217-40142c1c6a70?w=500&auto=format&fit=crop&q=80'
    },
    'iced mocha': {
      code: 'MOCHA-05',
      desc: 'Espresso, artisan dark chocolate, and chilled milk over ice.',
      badge: 'Rich chocolate',
      img: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop&q=80'
    },
    'signature cold brew': {
      code: 'COLD-06',
      desc: 'Slow steeped for 16 hours for an ultra-smooth, low-acid brew.',
      badge: 'House steeped',
      img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&auto=format&fit=crop&q=80'
    },
    'iced brown sugar oat latte': {
      code: 'OAT-BSUGAR',
      desc: 'Espresso, creamy barista oat milk and warm brown sugar syrup.',
      badge: 'Barista pick',
      img: 'https://images.unsplash.com/photo-1595928642581-f50f4f3453a5?w=500&auto=format&fit=crop&q=80'
    },
    'iced matcha latte': {
      code: 'MATCHA-08',
      desc: 'Ceremonial Japanese matcha whisked with sweet milk over ice.',
      badge: 'Ceremonial',
      img: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=80'
    },
    'london fog latte': {
      code: 'LONDON-09',
      desc: 'Aromatic Earl Grey tea steeped with vanilla and steamed milk.',
      badge: 'Specialty tea',
      img: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80'
    },
    'strawberry milk': {
      code: 'BERRY-10',
      desc: 'Real crushed ripe strawberries and creamy chilled fresh milk.',
      badge: 'Refreshing',
      img: 'https://images.unsplash.com/photo-1553787499-6f9133860278?w=500&auto=format&fit=crop&q=80'
    },
    'fresh baked croissant': {
      code: 'BAKE-11',
      desc: 'Flaky, golden and baked fresh with pure butter every morning.',
      badge: 'Freshly baked',
      img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=80'
    },
    'chocolate chip cookie': {
      code: 'BAKE-12',
      desc: 'Crispy golden exterior with warm, gooey dark chocolate center.',
      badge: 'Warm & chewy',
      img: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&auto=format&fit=crop&q=80'
    },
    'seasonal mint mocha': {
      code: 'SEASON-13',
      desc: 'Double shot espresso, cocoa, and cool peppermint infusion.',
      badge: 'Limited batch',
      img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&auto=format&fit=crop&q=80'
    }
  };

  function getItemMeta(m) {
    const key = (m.name || '').toLowerCase().trim();
    if (ITEM_METADATA[key]) return ITEM_METADATA[key];

    const cat = (m.category || '').toLowerCase();
    let img = 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=500&auto=format&fit=crop&q=80';
    let badge = 'Crafted fresh';
    if (cat.includes('pastr') || cat.includes('bake')) {
      img = 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=80';
      badge = 'Freshly baked';
    } else if (cat.includes('tea') || cat.includes('matcha')) {
      img = 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80';
      badge = 'Specialty tea';
    } else if (cat.includes('cold') || cat.includes('iced') || cat.includes('frap')) {
      img = 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop&q=80';
      badge = 'Iced beverage';
    }

    const code = (m.name || 'ITEM').replace(/[^a-zA-Z]/g, '').slice(0, 8).toUpperCase();
    return {
      code: code,
      desc: m.category ? `${m.category} specialty crafted fresh to order.` : 'Specially crafted fresh to order.',
      badge: badge,
      img: img
    };
  }

  loadMenu();

  function loadMenu() {
    $.get(MENU_API, { action: 'list' }).done(res => {
      if (!res.success) return toast(res.message, 'danger');
      menuItems = res.data.filter(m => m.is_available == 1);
      menuLookup = {};
      menuItems.forEach(m => menuLookup[m.id] = m);

      renderCategoryTabs();
      renderMenuGrid();
    });
  }

  function renderCategoryTabs() {
    const uniqueCats = [...new Set(menuItems.map(m => m.category).filter(Boolean))];
    const cats = ['All', ...uniqueCats];

    $('#categoryTabs').html(cats.map(c => {
      const label = c === 'All' ? 'All Menu' : c;
      const isActive = c === activeCategory;
      return `
        <button type="button" class="pos-cat-pill ${isActive ? 'active' : ''}" data-cat="${escapeHtml(c)}">
          <span>${escapeHtml(label)}</span>
          ${isActive ? '<i class="bi bi-chevron-right small"></i>' : ''}
        </button>
      `;
    }).join(''));
  }

  function renderMenuGrid() {
    let rows = menuItems;

    if (activeCategory !== 'All') {
      rows = rows.filter(m => m.category === activeCategory);
      $('#currentCategoryHeading').text(activeCategory);
    } else {
      $('#currentCategoryHeading').text('All-day favorites');
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      rows = rows.filter(m => m.name.toLowerCase().includes(q));
    }

    $('#menuCountLabel').text(`${rows.length} choices`);

    if (!rows.length) {
      $('#menuGrid').html(`
        <div class="col-12 text-center text-muted py-5">
          <i class="bi bi-search display-6 d-block mb-2 text-muted"></i>
          <p class="mb-0">No menu items found for your selection.</p>
        </div>`);
      return;
    }

    const html = rows.map(m => {
      const out = m.max_servings !== null && m.max_servings <= 0;
      const low = m.max_servings !== null && m.max_servings > 0 && m.max_servings <= 5;
      const meta = getItemMeta(m);

      let badgeText = meta.badge;
      let badgeClass = 'item-badge-pill';
      if (out) {
        badgeText = 'Out of stock';
        badgeClass += ' out-of-stock';
      } else if (low) {
        badgeText = `Only ${m.max_servings} left`;
        badgeClass += ' low-stock';
      }

      return `
        <div class="col-12 col-md-6 col-xxl-4">
          <div class="pos-item-card menu-tile ${out ? 'opacity-50' : ''}" data-id="${m.id}" style="${out ? 'cursor:not-allowed' : 'cursor:pointer'}">
            
            <!-- Left Thumbnail with Warm Beige Container -->
            <div class="item-thumb-box">
              <img src="${meta.img}" alt="${escapeHtml(m.name)}" class="item-thumb-img" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_SVG}'">
              <span class="${badgeClass}">${badgeText}</span>
            </div>

            <!-- Right Details -->
            <div class="item-details-box">
              <div>
                <div class="item-header-row">
                  <div class="item-name">${escapeHtml(m.name)}</div>
                  <div class="item-price">₱${parseFloat(m.price).toFixed(2)}</div>
                </div>
                <div class="item-desc">${escapeHtml(meta.desc)}</div>
              </div>

              <div class="item-footer-row">
                <span class="item-code">${escapeHtml(meta.code)}</span>
                <button class="btn-add-item" type="button" title="Add to order" ${out ? 'disabled' : ''}>
                  <i class="bi bi-plus-lg"></i>
                </button>
              </div>
            </div>

          </div>
        </div>
      `;
    }).join('');

    $('#menuGrid').html(html);
  }

  $(document).on('click', '#categoryTabs button', function () {
    activeCategory = $(this).data('cat');
    renderCategoryTabs();
    renderMenuGrid();
  });

  $('#menuSearch').on('input', function () {
    searchTerm = $(this).val().trim();
    renderMenuGrid();
  });

  // Adding item by clicking card or plus button
  $(document).on('click', '.menu-tile', function (e) {
    const id = $(this).data('id');
    const m = menuLookup[id];
    if (!m) return;

    const out = m.max_servings !== null && m.max_servings <= 0;
    if (out) return toast(`"${m.name}" is out of stock.`, 'warning');

    cart[id] = (cart[id] || 0) + 1;
    renderCart();

    const $btn = $(this).find('.btn-add-item');
    $btn.addClass('active');
    setTimeout(() => $btn.removeClass('active'), 180);
  });

  function renderCart() {
    const ids = Object.keys(cart).filter(id => cart[id] > 0);

    if (!ids.length) {
      $('#cartBody').html(`
        <div class="pos-cart-empty">
          <i class="bi bi-cup-straw fs-4 d-block mb-1 text-muted"></i>
          <span>Your order is empty. Tap any drink or pastry to add.</span>
        </div>`);
      $('#cartTotal').text('0.00');
      $('#cartSubtotal').text('0.00');
      $('#cartCount').text('0');
      $('#cartCountBadge').text('0');
      $('#dockPreviewCount').text('0');
      $('#dockPreviewTotal').text('0.00');
      $('#dockMiniTotal').text('0.00');
      $('#btnCheckout').prop('disabled', true);
      $('#btnMiniCheckout').prop('disabled', true);
      return;
    }

    let total = 0;
    let count = 0;

    const html = ids.map(id => {
      const m = menuLookup[id];
      const qty = cart[id];
      const sub = parseFloat(m.price) * qty;
      total += sub;
      count += qty;
      const meta = getItemMeta(m);

      return `
        <div class="cart-chip-card cart-row" data-id="${id}">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="cart-chip-code">${escapeHtml(meta.code)}</span>
            <button type="button" class="cart-chip-void cart-rm" title="Remove item">
              <i class="bi bi-trash3 me-1"></i>VOID
            </button>
          </div>
          <div class="cart-chip-title" title="${escapeHtml(m.name)}">${escapeHtml(m.name)}</div>
          <div class="d-flex justify-content-between align-items-center mt-1">
            <div class="cart-chip-stepper">
              <button type="button" class="cart-step-btn qty-dec" title="Decrease">−</button>
              <span class="cart-step-val">${qty}</span>
              <button type="button" class="cart-step-btn qty-inc" title="Increase">+</button>
            </div>
            <div class="cart-chip-price">₱${sub.toFixed(2)}</div>
          </div>
        </div>
      `;
    }).join('');

    $('#cartBody').html(html);
    $('#cartSubtotal').text(total.toFixed(2));
    $('#cartTotal').text(total.toFixed(2));
    $('#cartCount').text(count);
    $('#cartCountBadge').text(count);
    $('#dockPreviewCount').text(count);
    $('#dockPreviewTotal').text(total.toFixed(2));
    $('#dockMiniTotal').text(total.toFixed(2));
    $('#btnCheckout').prop('disabled', false);
    $('#btnMiniCheckout').prop('disabled', false);
  }

  // Stepper & void handlers
  $(document).on('click', '.qty-inc', function (e) {
    e.stopPropagation();
    const id = $(this).closest('[data-id]').data('id');
    cart[id]++;
    renderCart();
  });

  $(document).on('click', '.qty-dec', function (e) {
    e.stopPropagation();
    const id = $(this).closest('[data-id]').data('id');
    cart[id]--;
    if (cart[id] <= 0) delete cart[id];
    renderCart();
  });

  $(document).on('click', '.cart-rm', function (e) {
    e.stopPropagation();
    const id = $(this).closest('[data-id]').data('id');
    delete cart[id];
    renderCart();
  });

  $('#btnClearCart').on('click', () => {
    if (!Object.keys(cart).length) return;
    if (!confirm('Clear the current order?')) return;
    cart = {};
    renderCart();
  });

  // Show / Hide / Preview Order Details Toggle
  $('#btnToggleOrderDetails').on('click', function () {
    toggleOrderDetails();
  });

  function toggleOrderDetails(forceState) {
    if (typeof forceState === 'boolean') {
      isDockCollapsed = forceState;
    } else {
      isDockCollapsed = !isDockCollapsed;
    }

    const $dock = $('#posCheckoutDock');
    const $screen = $('.pos-screen');
    const $btn = $('#btnToggleOrderDetails');
    const $pill = $('#dockPreviewPill');
    const $mini = $('#dockMiniActions');

    if (isDockCollapsed) {
      $dock.addClass('is-collapsed');
      $screen.addClass('dock-collapsed');
      $btn.attr('aria-expanded', 'false');
      $btn.find('.toggle-label-text').text('Show / Preview Order Details');
      $pill.removeClass('d-none');
      $mini.removeClass('d-none').addClass('d-flex');
    } else {
      $dock.removeClass('is-collapsed');
      $screen.removeClass('dock-collapsed');
      $btn.attr('aria-expanded', 'true');
      $btn.find('.toggle-label-text').text('Hide Order Details');
      $pill.addClass('d-none');
      $mini.addClass('d-none').removeClass('d-flex');
    }
  }

  // Mini checkout button triggers main checkout
  $('#btnMiniCheckout').on('click', function () {
    $('#btnCheckout').trigger('click');
  });

  // Payment Method Pill Selection
  $(document).on('click', '.pay-method-pill', function () {
    $('.pay-method-pill').removeClass('active');
    $(this).addClass('active');
    selectedPaymentMethod = $(this).data('method');
  });

  $('#discountTrigger').on('click', function () {
    toast('Discounts can be applied during payment processing.', 'info');
  });

  // Checkout trigger
  $('#btnCheckout').on('click', function () {
    const items = Object.keys(cart).map(id => ({
      menu_item_id: parseInt(id),
      quantity: cart[id]
    }));

    if (!items.length) return;

    const $btn = $(this);
    $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-1"></span> Processing…');

    $.post(ORDER_API, {
      action: 'checkout',
      items: JSON.stringify(items)
    })
    .done(res => {
      if (!res.success) { toast(res.message, 'danger'); return; }
      showReceipt(res.data);
      cart = {};
      renderCart();
      loadMenu();
    })
    .fail(xhr => toast(xhr.responseJSON?.message || 'Checkout failed.', 'danger'))
    .always(() => $btn.prop('disabled', false).html('<i class="bi bi-check2-circle me-1"></i> Complete Order / Pay'));
  });

  // Receipt Modal in CommuniTea Café Ph Aesthetic
  function showReceipt(r) {
    const itemsHtml = r.items.map(i => `
      <tr>
        <td class="py-2"><strong>${escapeHtml(i.menu_name)}</strong></td>
        <td class="text-center py-2">${i.quantity}</td>
        <td class="text-end py-2">₱${(+i.unit_price).toFixed(2)}</td>
        <td class="text-end py-2 fw-bold" style="color:#73482C">₱${(+i.subtotal).toFixed(2)}</td>
      </tr>`).join('');

    const html = `
      <div class="receipt-header-hero text-center p-4">
        <img src="/icoms/public/img/logo.png" alt="CommuniTea Café Ph" class="receipt-logo-img mb-2">
        <div class="receipt-brand-name">CommuniTea Café Ph</div>
        <div class="sub-kicker text-uppercase" style="letter-spacing:0.1em; color:#7E6756;">Where Passion Meets Purpose · Est. 2023</div>
        <p class="text-muted small mb-0 mt-1">Payment Completed (${selectedPaymentMethod.toUpperCase()})</p>
      </div>

      <div class="modal-body p-4" id="receiptPrint">
        <div class="d-flex justify-content-between small mb-1 pb-1 border-bottom">
          <span class="text-muted">Order Number</span>
          <span class="fw-bold text-dark font-monospace">${r.order_no}</span>
        </div>
        <div class="d-flex justify-content-between small mb-1 pb-1 border-bottom">
          <span class="text-muted">Cashier / Staff</span>
          <span class="fw-semibold text-dark">${escapeHtml(r.cashier_name)}</span>
        </div>
        <div class="d-flex justify-content-between small mb-1 pb-1 border-bottom">
          <span class="text-muted">Payment Method</span>
          <span class="badge bg-light text-dark border text-uppercase">${selectedPaymentMethod}</span>
        </div>
        <div class="d-flex justify-content-between small mb-3 pb-1 border-bottom">
          <span class="text-muted">Date &amp; Time</span>
          <span class="text-dark">${r.created_at}</span>
        </div>

        <table class="table table-sm align-middle mb-3">
          <thead class="table-light">
            <tr class="small text-muted">
              <th>ITEM</th>
              <th class="text-center">QTY</th>
              <th class="text-end">PRICE</th>
              <th class="text-end">TOTAL</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>

        <div class="p-3 rounded-3" style="background:#FAF5EE; border:1px solid #EADECE;">
          <div class="d-flex justify-content-between align-items-center">
            <span class="fw-bold fs-5" style="font-family:'DM Serif Display', Georgia, serif;">Grand Total</span>
            <span class="fw-bold fs-4" style="color:#73482C; font-family:'DM Serif Display', Georgia, serif;">₱${(+r.total).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div class="modal-footer bg-light px-4 py-3 justify-content-between">
        <button class="btn btn-outline-secondary rounded-pill px-3" onclick="window.print()">
          <i class="bi bi-printer me-1"></i> Print Receipt
        </button>
        <button class="btn btn-pay-action rounded-pill px-4" data-bs-dismiss="modal">
          <i class="bi bi-check-lg me-1"></i> Done / New Order
        </button>
      </div>
    `;

    $('#receiptContent').html(html);
    receiptModal.show();
  }

  function escapeHtml(s) {
    return $('<div>').text(s ?? '').html();
  }
});
