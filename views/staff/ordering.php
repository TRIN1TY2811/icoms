<?php
  $pageTitle = 'CommuniTea Café Ph — Ordering';
  $pageScript = '/icoms/public/js/ordering.js';
  $extraCss = '/icoms/public/css/ordering.css';
  $hideSidebar = true;
  require_once __DIR__ . '/../layouts/header.php';
  require_once __DIR__ . '/../layouts/sidebar.php';

  $dashboardUrl = $isOwner ? '/icoms/views/owner/dashboard.php' : '/icoms/views/staff/dashboard.php';
  $historyUrl   = $isOwner ? '/icoms/views/owner/orders.php' : '/icoms/views/staff/history.php';
  $wasteUrl     = '/icoms/views/staff/waste.php';
?>

<div class="pos-screen d-flex flex-column">

  <!-- =========================================================================
       1. TOP BAR (System Name: ICOMS with CommuniTea Logo & System Title)
       ========================================================================= -->
  <header class="pos-topbar px-3 px-md-4 py-2 d-flex justify-content-between align-items-center">
    <div class="d-flex align-items-center gap-3">
      <!-- System Name & Café Logo -->
      <a href="<?= $dashboardUrl ?>" class="pos-brand text-decoration-none d-flex align-items-center gap-3">
        <img src="/icoms/public/img/logo.png" alt="CommuniTea Café Ph Logo" class="pos-brand-logo-img">
        <div class="pos-brand-text">
          <div class="d-flex align-items-center gap-2 flex-wrap">
            <span class="brand-title">ICOMS</span>
            <span class="brand-cafe-pill">CommuniTea Café Ph</span>
          </div>
          <div class="brand-sub d-none d-sm-block">Integrated Cafe Inventory and Operation Management System</div>
        </div>
      </a>
    </div>

    <!-- Right: Kiosk badge + Profile Dropdown (Dashboard, Order History, Waste, etc.) -->
    <div class="d-flex align-items-center gap-2 gap-md-3">
      <div class="pos-kiosk-badge d-none d-sm-inline-flex align-items-center gap-2">
        <span class="kiosk-status-dot"></span>
        <span>KIOSK 01</span>
      </div>

      <!-- Profile Section -->
      <div class="dropdown">
        <button class="pos-profile-btn dropdown-toggle d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          <div class="pos-avatar">
            <?= strtoupper(substr($user['name'] ?? 'U', 0, 1)) ?>
          </div>
          <div class="text-start d-none d-lg-block">
            <div class="pos-profile-name"><?= htmlspecialchars($user['name'] ?? 'Staff') ?></div>
            <div class="pos-profile-role"><?= ucfirst($user['role'] ?? 'Staff') ?></div>
          </div>
        </button>
        <ul class="dropdown-menu dropdown-menu-end shadow-sm pos-dropdown-menu">
          <li class="dropdown-header small">Signed in as <strong><?= htmlspecialchars($user['username'] ?? '') ?></strong></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="<?= $dashboardUrl ?>"><i class="bi bi-speedometer2 me-2 text-muted"></i> Dashboard</a></li>
          <li><a class="dropdown-item" href="<?= $historyUrl ?>"><i class="bi bi-clock-history me-2 text-muted"></i> Order History</a></li>
          <li><a class="dropdown-item" href="<?= $wasteUrl ?>"><i class="bi bi-trash3 me-2 text-muted"></i> Waste Record</a></li>
          <?php if ($isOwner): ?>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="/icoms/views/owner/inventory.php"><i class="bi bi-box-seam me-2 text-muted"></i> Inventory</a></li>
            <li><a class="dropdown-item" href="/icoms/views/owner/menu.php"><i class="bi bi-journal-text me-2 text-muted"></i> Menu &amp; Recipes</a></li>
            <li><a class="dropdown-item" href="/icoms/views/owner/reports.php"><i class="bi bi-graph-up me-2 text-muted"></i> Reports</a></li>
            <li><a class="dropdown-item" href="/icoms/views/owner/users.php"><i class="bi bi-people me-2 text-muted"></i> User Management</a></li>
          <?php endif; ?>
          <li><hr class="dropdown-divider"></li>
          <li>
            <a class="dropdown-item text-danger" href="#" id="logoutBtn">
              <i class="bi bi-box-arrow-right me-2"></i> Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
  </header>

  <!-- =========================================================================
       COMMUNITY QUOTE BANNER
       ========================================================================= -->
  <div class="pos-quote-banner px-3 px-md-4 py-2 d-flex align-items-center justify-content-between">
    <div class="d-flex align-items-center gap-2 overflow-hidden">
      <span class="quote-badge">
        <i class="bi bi-cup-hot-fill me-1"></i> PHILOSOPHY
      </span>
      <span class="quote-text text-truncate">
        “More than just coffee – we brew connections, fostering communities just like Kendama, Fingerboard and Skate scenes. Where passion meets purpose.”
      </span>
    </div>
    <div class="quote-tags d-none d-xl-flex align-items-center gap-2">
      <span class="community-tag"><i class="bi bi-record-circle me-1"></i>Kendama</span>
      <span class="community-tag"><i class="bi bi-record-circle me-1"></i>Fingerboard</span>
      <span class="community-tag"><i class="bi bi-record-circle me-1"></i>Skate</span>
    </div>
  </div>

  <!-- =========================================================================
       2. CATEGORY ROW (Horizontal Category Pills & Search)
       ========================================================================= -->
  <section class="pos-category-row px-3 px-md-4 py-3 d-flex flex-wrap justify-content-between align-items-center gap-3">
    <div class="d-flex align-items-center gap-3 flex-wrap">
      <div class="category-title-group d-none d-xl-block">
        <div class="sub-kicker">BROWSE MENU</div>
        <h3 class="category-main-title mb-0">Categories</h3>
      </div>
      <div id="categoryTabs" class="pos-category-pills d-flex flex-wrap gap-2">
        <!-- Rendered by JS -->
      </div>
    </div>

    <!-- Search input -->
    <div class="pos-search-wrapper position-relative">
      <i class="bi bi-search search-icon"></i>
      <input id="menuSearch" class="form-control pos-search-input" placeholder="Search drinks or food…">
    </div>
  </section>

  <!-- =========================================================================
       3. MENU SECTION (Warm beige cards)
       ========================================================================= -->
  <section class="pos-menu-viewport flex-grow-1 px-3 px-md-4 py-2">
    <div class="d-flex justify-content-between align-items-baseline mb-3">
      <div>
        <div class="sub-kicker text-uppercase">COMMUNITEA SIGNATURES</div>
        <h2 class="menu-hero-title mb-0" id="currentCategoryHeading">All-day favorites</h2>
      </div>
      <div class="text-muted small" id="menuCountLabel">Loading menu…</div>
    </div>

    <!-- Main Menu Grid (Warm beige cards) -->
    <div id="menuGrid" class="row g-3 pb-3">
      <!-- Cards rendered by JS -->
    </div>
  </section>

  <!-- =========================================================================
       4. ORDER DETAILS AND CHECKOUT (Bottom Docked Area with Show/Hide Slide)
       ========================================================================= -->
  <section class="pos-checkout-dock" id="posCheckoutDock">

    <!-- Show / Hide / Preview Toggle Handle Bar -->
    <div class="pos-dock-handle-bar px-3 px-md-4 py-1 d-flex justify-content-between align-items-center">
      <button type="button" class="btn-dock-toggle d-flex align-items-center gap-2" id="btnToggleOrderDetails" aria-expanded="true">
        <i class="bi bi-chevron-down toggle-arrow"></i>
        <span class="toggle-label-text">Hide Order Details</span>
        <span class="dock-preview-pill ms-2 d-none" id="dockPreviewPill">
          <span id="dockPreviewCount">0</span> items · ₱<span id="dockPreviewTotal">0.00</span>
        </span>
      </button>

      <!-- Mini Summary & Quick Pay (Active when collapsed) -->
      <div class="dock-mini-actions d-none align-items-center gap-2" id="dockMiniActions">
        <span class="dock-mini-total fw-bold">₱<span id="dockMiniTotal">0.00</span></span>
        <button class="btn btn-sm btn-pay-mini" id="btnMiniCheckout" disabled>
          <i class="bi bi-check2-circle me-1"></i> Quick Pay
        </button>
      </div>
    </div>

    <!-- Expandable Order Details Content (Smoothly slides up/down) -->
    <div class="pos-dock-content" id="posDockContent">
      <div class="container-fluid px-3 px-md-4 py-2 py-md-3">
        <div class="row g-3 align-items-center">

          <!-- Left / Cart: "Your items" with counter badge -->
          <div class="col-xl-7 col-lg-6">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <div class="d-flex align-items-center gap-2">
                <span class="sub-kicker text-uppercase mb-0">LIVE ORDER</span>
                <h5 class="cart-section-title mb-0">Your items</h5>
                <span class="pos-cart-badge" id="cartCountBadge">0</span>
                <span class="d-none" id="cartCount">0</span>
              </div>
              <button class="btn btn-sm btn-link text-decoration-none text-muted p-0 pos-clear-btn" id="btnClearCart" title="Clear all items">
                <i class="bi bi-trash3 me-1"></i> Void all
              </button>
            </div>

            <!-- Horizontal scrollable cart shelf -->
            <div class="pos-cart-shelf" id="cartBody">
              <div class="pos-cart-empty">
                <i class="bi bi-cup-straw fs-4 d-block mb-1 text-muted"></i>
                <span>Your order is empty. Tap any drink or pastry to add.</span>
              </div>
            </div>
          </div>

          <!-- Right: Pricing, Payment Method & Pay button -->
          <div class="col-xl-5 col-lg-6">
            <div class="pos-payment-card p-3">
              <div class="row align-items-center mb-3">
                <div class="col-4">
                  <div class="summary-caption">SUBTOTAL</div>
                  <div class="summary-amount">₱<span id="cartSubtotal">0.00</span></div>
                </div>
                <div class="col-4">
                  <div class="summary-caption">DISCOUNTS</div>
                  <div class="summary-discount small" id="discountTrigger">
                    <i class="bi bi-percent"></i> Add discount
                  </div>
                </div>
                <div class="col-4 text-end">
                  <div class="summary-caption">GRAND TOTAL</div>
                  <div class="summary-grand">₱<span id="cartTotal">0.00</span></div>
                </div>
              </div>

              <div class="d-flex flex-wrap gap-2 align-items-center justify-content-between">
                <!-- Payment Method Selector -->
                <div class="pos-payment-methods d-flex gap-2">
                  <button type="button" class="pay-method-pill active" data-method="cash">
                    <i class="bi bi-cash"></i>
                    <span>Cash</span>
                    <i class="bi bi-check-lg check-mark"></i>
                  </button>
                  <button type="button" class="pay-method-pill" data-method="gcash">
                    <i class="bi bi-qr-code"></i>
                    <span>GCash</span>
                  </button>
                </div>

                <!-- Complete Order / Pay Button -->
                <button class="btn btn-pay-action flex-grow-1 flex-sm-grow-0" id="btnCheckout" disabled>
                  <i class="bi bi-check2-circle me-1"></i> Complete Order / Pay
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>

</div>

<!-- RECEIPT MODAL (CommuniTea Café Ph Aesthetic) -->
<div class="modal fade" id="receiptModal" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content pos-receipt-modal" id="receiptContent">
      <!-- filled by JS -->
    </div>
  </div>
</div>

<?php require_once __DIR__ . '/../layouts/footer.php'; ?>
