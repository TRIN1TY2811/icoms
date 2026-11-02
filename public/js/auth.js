$(function () {
  const API = '/icoms/api/auth.php';

  $('#loginForm').on('submit', function (e) {
    e.preventDefault();
    const $btn = $(this).find('button[type=submit]');
    $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm"></span> Signing in...');
    $('#loginAlert').html('');

    $.ajax({
      url: API,
      type: 'POST',
      data: $(this).serialize() + '&action=login',
      dataType: 'json'
    })
      .done(res => {
        if (res && res.success) {
          const role = res.data?.role;
          const dest = role === 'owner'
            ? '/icoms/views/owner/dashboard.php'
            : '/icoms/views/staff/ordering.php';
          window.location.href = dest;
        } else {
          const msg = (res && res.message) ? res.message : (typeof res === 'string' ? res : 'Invalid username or password.');
          showError(msg);
        }
      })
      .fail(xhr => {
        let msg = xhr.responseJSON?.message;
        if (!msg && xhr.responseText) {
          const cleanText = xhr.responseText.replace(/<[^>]+>/g, '').trim();
          if (cleanText.length > 0 && cleanText.length < 250) {
            msg = cleanText;
          }
        }
        showError(msg || 'Invalid username or password. Please verify MySQL is started in XAMPP.');
      })
      .always(() => {
        $btn.prop('disabled', false).html('<i class="bi bi-box-arrow-in-right"></i> Sign In');
      });
  });

  function showError(msg) {
    const text = (msg && msg !== 'undefined') ? msg : 'Unable to sign in. Please verify your credentials and database connection.';
    $('#loginAlert').html(
      `<div class="alert alert-danger py-2 small shadow-sm">${escapeHtml(text)}</div>`
    );
  }

  function escapeHtml(s) {
    return $('<div>').text(s ?? '').html();
  }

  $('#togglePassword').on('click', function () {
    const $input = $('input[name=password]');
    const $icon  = $(this).find('i');

    const isHidden = $input.attr('type') === 'password';
    $input.attr('type', isHidden ? 'text' : 'password');

    $icon.toggleClass('bi-eye', !isHidden).toggleClass('bi-eye-slash', isHidden);

    $(this).attr('aria-label', isHidden ? 'Hide password' : 'Show password');
  });
});
