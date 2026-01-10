<?php
/**
 * UmrahConnect 2.0 - Installation Entry Point
 * This file checks if the application is installed and redirects accordingly
 */

// Check if already installed
if (file_exists(__DIR__ . '/.env') && file_exists(__DIR__ . '/storage/installed.lock')) {
    // Already installed, redirect to main application
    header('Location: /index.php');
    exit;
}

// Not installed, redirect to installation wizard
header('Location: /install/index.php');
exit;
?>
