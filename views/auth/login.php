<?php
require_once __DIR__ . '/../../helpers/Session.php';
Session::start();
if (Session::get('user_id')) {
  header('Location: /icoms/index.php');
  exit;
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>CommuniTea Café Ph — Login</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Lexend:wght@100..900&family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;1,500&display=swap" rel="stylesheet">
  <link href="/icoms/public/css/base.css" rel="stylesheet">
  <link href="/icoms/public/css/login.css" rel="stylesheet">
</head>

<body class="login-page">

  <div class="login-card">
    <div class="text-center mb-4">
      <img src="/icoms/public/img/logo.png" alt="CommuniTea Café Ph" style="width:72px;height:72px;object-fit:contain;margin-bottom:0.75rem;filter:drop-shadow(0 4px 8px rgba(171,40,96,0.25));border-radius:50%;">
      <div class="brand" style="font-size:1.45rem;font-family:'DM Serif Display',Georgia,serif;">
        CommuniTea Café Ph
      </div>
      <p class="login-subtitle mb-0 small text-muted">
        Where passion meets purpose · Est. 2023
      </p>
    </div>

    <div id="loginAlert"></div>

    <form id="loginForm" autocomplete="off">
      <div class="mb-3">
        <label class="form-label login-label">Username</label>
        <div class="input-wrap">
          <i class="bi bi-person input-icon"></i>
          <input name="username" class="form-control login-input with-icon"
            placeholder="Enter your username" required autofocus>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label login-label">Password</label>
        <div class="input-wrap">
          <i class="bi bi-lock input-icon"></i>
          <input name="password" type="password"
            class="form-control login-input with-icon has-toggle"
            placeholder="Enter your password" required>
          <button type="button" class="toggle-password" tabindex="-1"
            aria-label="Show password" id="togglePassword">
            <i class="bi bi-eye"></i>
          </button>
        </div>
      </div>

      <button class="btn btn-login w-100 py-2 mt-2" type="submit">
        <i class="bi bi-box-arrow-in-right"></i> Sign In
      </button>
    </form>
  </div>

  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <script src="/icoms/public/js/auth.js"></script>
</body>

</html>
