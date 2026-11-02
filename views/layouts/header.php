<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../core/Response.php';
require_once __DIR__ . '/../../core/BaseRepository.php';
require_once __DIR__ . '/../../core/BaseService.php';
require_once __DIR__ . '/../../helpers/Session.php';
require_once __DIR__ . '/../../helpers/Auth.php';

Auth::requireLogin();
$user = Auth::user();
$pageTitle = $pageTitle ?? 'Dashboard';
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>ICOMS — <?= htmlspecialchars($pageTitle) ?></title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Lexend:wght@100..900&family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;1,500&display=swap" rel="stylesheet">
    <link href="/icoms/public/css/base.css" rel="stylesheet">
    <link href="/icoms/public/css/layout.css" rel="stylesheet">
    <link href="/icoms/public/css/components.css" rel="stylesheet">
    <?php if (!empty($extraCss)): ?>
        <link href="<?= htmlspecialchars($extraCss) ?>" rel="stylesheet">
    <?php endif; ?>
    <link href="/icoms/public/css/print.css" rel="stylesheet" media="print">
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
</head>

<body>
    <div class="app d-flex">
