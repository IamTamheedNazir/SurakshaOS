<?php
/**
 * UmrahConnect 2.0 - Diagnostic Script
 * Run this to identify installation issues
 */

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>UmrahConnect 2.0 - Diagnostic Check</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            border-bottom: 3px solid #667eea;
            padding-bottom: 10px;
        }
        .check {
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
            display: flex;
            align-items: center;
        }
        .check.success {
            background: #d4edda;
            border-left: 4px solid #28a745;
        }
        .check.error {
            background: #f8d7da;
            border-left: 4px solid #dc3545;
        }
        .check.warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
        }
        .icon {
            font-size: 24px;
            margin-right: 15px;
            font-weight: bold;
        }
        .success .icon { color: #28a745; }
        .error .icon { color: #dc3545; }
        .warning .icon { color: #ffc107; }
        .info {
            background: #e7f3ff;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            border-left: 4px solid #2196F3;
        }
        .code {
            background: #f4f4f4;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            margin: 10px 0;
        }
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
        .btn:hover {
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 UmrahConnect 2.0 - Diagnostic Check</h1>
        
        <?php
        $errors = [];
        $warnings = [];
        $success = [];
        
        // Check 1: PHP Version
        $phpVersion = phpversion();
        if (version_compare($phpVersion, '8.1.0', '>=')) {
            $success[] = "PHP Version: $phpVersion ✓";
        } else {
            $errors[] = "PHP Version: $phpVersion (Required: 8.1+)";
        }
        
        // Check 2: Required Extensions
        $requiredExtensions = ['pdo', 'pdo_mysql', 'mbstring', 'openssl', 'tokenizer', 'xml', 'ctype', 'json', 'bcmath'];
        $missingExtensions = [];
        foreach ($requiredExtensions as $ext) {
            if (!extension_loaded($ext)) {
                $missingExtensions[] = $ext;
            }
        }
        
        if (empty($missingExtensions)) {
            $success[] = "All required PHP extensions are installed ✓";
        } else {
            $errors[] = "Missing PHP extensions: " . implode(', ', $missingExtensions);
        }
        
        // Check 3: Backend Directory
        $backendPath = dirname(__DIR__) . '/backend-laravel';
        if (file_exists($backendPath)) {
            $success[] = "Backend directory found: backend-laravel/ ✓";
        } else {
            $errors[] = "Backend directory not found: backend-laravel/";
        }
        
        // Check 4: Composer Vendor Directory
        $vendorPath = $backendPath . '/vendor';
        if (file_exists($vendorPath . '/autoload.php')) {
            $success[] = "Composer dependencies installed ✓";
        } else {
            $errors[] = "Composer dependencies NOT installed (vendor/autoload.php not found)";
        }
        
        // Check 5: Storage Directory Permissions
        $storagePath = $backendPath . '/storage';
        if (file_exists($storagePath)) {
            if (is_writable($storagePath)) {
                $success[] = "Storage directory is writable ✓";
            } else {
                $warnings[] = "Storage directory exists but is not writable";
            }
        } else {
            $errors[] = "Storage directory not found";
        }
        
        // Check 6: Bootstrap Cache Permissions
        $bootstrapCachePath = $backendPath . '/bootstrap/cache';
        if (file_exists($bootstrapCachePath)) {
            if (is_writable($bootstrapCachePath)) {
                $success[] = "Bootstrap cache directory is writable ✓";
            } else {
                $warnings[] = "Bootstrap cache directory exists but is not writable";
            }
        } else {
            $errors[] = "Bootstrap cache directory not found";
        }
        
        // Check 7: .env.example exists
        $envExamplePath = $backendPath . '/.env.example';
        if (file_exists($envExamplePath)) {
            $success[] = ".env.example file found ✓";
        } else {
            $errors[] = ".env.example file not found";
        }
        
        // Check 8: Installer files
        if (file_exists(__DIR__ . '/index.php')) {
            $success[] = "Installer index.php found ✓";
        } else {
            $errors[] = "Installer index.php not found";
        }
        
        if (file_exists(__DIR__ . '/install-api.php')) {
            $success[] = "Installer API found ✓";
        } else {
            $errors[] = "Installer API not found";
        }
        
        // Display Results
        foreach ($success as $msg) {
            echo '<div class="check success"><span class="icon">✓</span><span>' . htmlspecialchars($msg) . '</span></div>';
        }
        
        foreach ($warnings as $msg) {
            echo '<div class="check warning"><span class="icon">⚠</span><span>' . htmlspecialchars($msg) . '</span></div>';
        }
        
        foreach ($errors as $msg) {
            echo '<div class="check error"><span class="icon">✗</span><span>' . htmlspecialchars($msg) . '</span></div>';
        }
        
        // Summary and Solutions
        if (!empty($errors)) {
            echo '<div class="info">';
            echo '<h3>🔧 How to Fix These Issues:</h3>';
            
            if (in_array("Composer dependencies NOT installed (vendor/autoload.php not found)", $errors)) {
                echo '<h4>1. Install Composer Dependencies:</h4>';
                echo '<p><strong>Option A: Via SSH</strong></p>';
                echo '<div class="code">cd ' . htmlspecialchars($backendPath) . '<br>composer install --no-dev --optimize-autoloader</div>';
                
                echo '<p><strong>Option B: Upload vendor folder</strong></p>';
                echo '<ol>';
                echo '<li>On your local machine, run: <code>composer install --no-dev</code> in backend-laravel/</li>';
                echo '<li>Upload the generated <code>vendor/</code> folder to <code>public_html/backend-laravel/vendor/</code></li>';
                echo '</ol>';
            }
            
            if (strpos(implode('', $errors), 'PHP Version') !== false) {
                echo '<h4>2. Update PHP Version:</h4>';
                echo '<p>In cPanel:</p>';
                echo '<ol>';
                echo '<li>Go to <strong>Select PHP Version</strong> or <strong>MultiPHP Manager</strong></li>';
                echo '<li>Select PHP 8.1 or higher</li>';
                echo '<li>Click Apply</li>';
                echo '</ol>';
            }
            
            if (strpos(implode('', $errors), 'Missing PHP extensions') !== false) {
                echo '<h4>3. Enable PHP Extensions:</h4>';
                echo '<p>In cPanel → Select PHP Version:</p>';
                echo '<ol>';
                echo '<li>Click on <strong>Extensions</strong></li>';
                echo '<li>Enable: ' . implode(', ', $missingExtensions) . '</li>';
                echo '<li>Click Save</li>';
                echo '</ol>';
            }
            
            if (!empty($warnings)) {
                echo '<h4>4. Fix Directory Permissions:</h4>';
                echo '<div class="code">chmod -R 755 ' . htmlspecialchars($storagePath) . '<br>';
                echo 'chmod -R 755 ' . htmlspecialchars($bootstrapCachePath) . '</div>';
            }
            
            echo '</div>';
        } else {
            echo '<div class="info">';
            echo '<h3>✅ All Checks Passed!</h3>';
            echo '<p>Your server meets all requirements. You can proceed with the installation.</p>';
            echo '<a href="index.php" class="btn">Start Installation →</a>';
            echo '</div>';
        }
        
        // System Information
        echo '<div class="info">';
        echo '<h3>📊 System Information:</h3>';
        echo '<p><strong>PHP Version:</strong> ' . phpversion() . '</p>';
        echo '<p><strong>Server Software:</strong> ' . ($_SERVER['SERVER_SOFTWARE'] ?? 'Unknown') . '</p>';
        echo '<p><strong>Document Root:</strong> ' . ($_SERVER['DOCUMENT_ROOT'] ?? 'Unknown') . '</p>';
        echo '<p><strong>Current Directory:</strong> ' . __DIR__ . '</p>';
        echo '<p><strong>Backend Path:</strong> ' . $backendPath . '</p>';
        echo '<p><strong>Loaded Extensions:</strong> ' . implode(', ', get_loaded_extensions()) . '</p>';
        echo '</div>';
        ?>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666;">
            <p>UmrahConnect 2.0 - Diagnostic Tool</p>
            <p>After fixing issues, <a href="check.php">refresh this page</a> to verify.</p>
        </div>
    </div>
</body>
</html>
