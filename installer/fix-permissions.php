<?php
/**
 * UmrahConnect 2.0 - Quick Fix Script
 * Fixes permissions and checks Composer dependencies
 */

header('Content-Type: text/html; charset=utf-8');

// Get backend path
function getBackendPath() {
    $possiblePaths = [
        dirname(__DIR__) . '/backend',
        dirname(__DIR__) . '/backend-laravel'
    ];
    
    foreach ($possiblePaths as $path) {
        if (file_exists($path)) {
            return $path;
        }
    }
    
    return dirname(__DIR__) . '/backend';
}

$backendPath = getBackendPath();
$storagePath = $backendPath . '/storage';
$bootstrapCachePath = $backendPath . '/bootstrap/cache';
$vendorPath = $backendPath . '/vendor';

?>
<!DOCTYPE html>
<html>
<head>
    <title>UmrahConnect 2.0 - Quick Fix</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 900px;
            margin: 50px auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        h1 {
            color: #333;
            border-bottom: 3px solid #667eea;
            padding-bottom: 15px;
            margin-bottom: 30px;
        }
        .issue {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .issue h3 {
            margin-top: 0;
            color: #856404;
        }
        .solution {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
        .code {
            background: #2d2d2d;
            color: #f8f8f2;
            padding: 15px;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
            overflow-x: auto;
            margin: 10px 0;
        }
        .success {
            background: #d4edda;
            border-left: 4px solid #28a745;
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
            color: #155724;
        }
        .btn {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            margin: 10px 5px;
            font-weight: bold;
        }
        .btn:hover {
            opacity: 0.9;
        }
        .step {
            background: white;
            border: 2px solid #667eea;
            padding: 20px;
            margin: 15px 0;
            border-radius: 8px;
        }
        .step-number {
            display: inline-block;
            width: 35px;
            height: 35px;
            background: #667eea;
            color: white;
            border-radius: 50%;
            text-align: center;
            line-height: 35px;
            font-weight: bold;
            margin-right: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔧 UmrahConnect 2.0 - Quick Fix</h1>
        
        <?php
        // Try to fix permissions automatically
        $fixedStorage = false;
        $fixedBootstrap = false;
        
        if (file_exists($storagePath)) {
            $fixedStorage = @chmod($storagePath, 0775);
            if ($fixedStorage) {
                // Try to fix subdirectories
                try {
                    $iterator = new RecursiveIteratorIterator(
                        new RecursiveDirectoryIterator($storagePath, RecursiveDirectoryIterator::SKIP_DOTS),
                        RecursiveIteratorIterator::SELF_FIRST
                    );
                    foreach ($iterator as $item) {
                        @chmod($item->getPathname(), $item->isDir() ? 0775 : 0664);
                    }
                } catch (Exception $e) {
                    // Continue
                }
            }
        }
        
        if (file_exists($bootstrapCachePath)) {
            $fixedBootstrap = @chmod($bootstrapCachePath, 0775);
        }
        
        $hasVendor = file_exists($vendorPath . '/autoload.php');
        
        // Show results
        if ($fixedStorage && $fixedBootstrap && $hasVendor) {
            echo '<div class="success">';
            echo '<h2>✅ All Issues Fixed!</h2>';
            echo '<p>Your installation is ready to proceed.</p>';
            echo '<a href="index.php" class="btn">Continue to Installer →</a>';
            echo '</div>';
        } else {
            echo '<div class="issue">';
            echo '<h3>⚠️ Manual Fixes Required</h3>';
            echo '<p>Some issues need manual intervention. Follow the steps below:</p>';
            echo '</div>';
            
            // Issue 1: Storage permissions
            if (!$fixedStorage || !is_writable($storagePath)) {
                echo '<div class="step">';
                echo '<h3><span class="step-number">1</span> Fix Storage Directory Permissions</h3>';
                echo '<div class="solution">';
                echo '<p><strong>Via cPanel File Manager:</strong></p>';
                echo '<ol>';
                echo '<li>Navigate to: <code>' . htmlspecialchars($storagePath) . '</code></li>';
                echo '<li>Right-click the <strong>storage</strong> folder</li>';
                echo '<li>Click <strong>Change Permissions</strong></li>';
                echo '<li>Set to <strong>775</strong> (or check all boxes)</li>';
                echo '<li>Check <strong>"Recurse into subdirectories"</strong></li>';
                echo '<li>Click <strong>Change Permissions</strong></li>';
                echo '</ol>';
                
                echo '<p><strong>Via SSH:</strong></p>';
                echo '<div class="code">chmod -R 775 ' . htmlspecialchars($storagePath) . '</div>';
                echo '</div>';
                echo '</div>';
            }
            
            // Issue 2: Bootstrap cache permissions
            if (!$fixedBootstrap || !is_writable($bootstrapCachePath)) {
                echo '<div class="step">';
                echo '<h3><span class="step-number">2</span> Fix Bootstrap Cache Permissions</h3>';
                echo '<div class="solution">';
                echo '<p><strong>Via cPanel File Manager:</strong></p>';
                echo '<ol>';
                echo '<li>Navigate to: <code>' . htmlspecialchars($bootstrapCachePath) . '</code></li>';
                echo '<li>Right-click the <strong>cache</strong> folder</li>';
                echo '<li>Click <strong>Change Permissions</strong></li>';
                echo '<li>Set to <strong>775</strong></li>';
                echo '<li>Check <strong>"Recurse into subdirectories"</strong></li>';
                echo '<li>Click <strong>Change Permissions</strong></li>';
                echo '</ol>';
                
                echo '<p><strong>Via SSH:</strong></p>';
                echo '<div class="code">chmod -R 775 ' . htmlspecialchars($bootstrapCachePath) . '</div>';
                echo '</div>';
                echo '</div>';
            }
            
            // Issue 3: Composer dependencies
            if (!$hasVendor) {
                echo '<div class="step">';
                echo '<h3><span class="step-number">3</span> Install Composer Dependencies</h3>';
                echo '<div class="solution">';
                echo '<p><strong>Option A: Via SSH (Recommended)</strong></p>';
                echo '<div class="code">cd ' . htmlspecialchars($backendPath) . '<br>composer install --no-dev --optimize-autoloader</div>';
                
                echo '<p><strong>Option B: Upload vendor folder</strong></p>';
                echo '<ol>';
                echo '<li>On your <strong>local machine</strong>, navigate to the backend folder</li>';
                echo '<li>Run: <code>composer install --no-dev --optimize-autoloader</code></li>';
                echo '<li>Upload the generated <strong>vendor/</strong> folder to cPanel</li>';
                echo '<li>Place it at: <code>' . htmlspecialchars($backendPath) . '/vendor/</code></li>';
                echo '</ol>';
                
                echo '<p><strong>Option C: Download pre-built vendor folder</strong></p>';
                echo '<p>If you don\'t have Composer locally:</p>';
                echo '<ol>';
                echo '<li>Ask your developer to provide a pre-built vendor folder</li>';
                echo '<li>Or use a service like <a href="https://getcomposer.org" target="_blank">Composer Cloud</a></li>';
                echo '</ol>';
                echo '</div>';
                echo '</div>';
            }
            
            echo '<div style="margin-top: 30px; padding: 20px; background: #e7f3ff; border-radius: 8px;">';
            echo '<h3>📝 After Fixing:</h3>';
            echo '<ol>';
            echo '<li>Refresh this page to verify fixes</li>';
            echo '<li>Or go directly to the installer</li>';
            echo '</ol>';
            echo '<a href="fix-permissions.php" class="btn">🔄 Refresh Check</a>';
            echo '<a href="index.php" class="btn">Continue to Installer →</a>';
            echo '</div>';
        }
        ?>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #ddd;">
            <h3>📊 Current Status:</h3>
            <ul style="line-height: 2;">
                <li><strong>Backend Path:</strong> <?php echo htmlspecialchars($backendPath); ?></li>
                <li><strong>Storage Writable:</strong> <?php echo is_writable($storagePath) ? '✅ Yes' : '❌ No'; ?></li>
                <li><strong>Bootstrap Cache Writable:</strong> <?php echo is_writable($bootstrapCachePath) ? '✅ Yes' : '❌ No'; ?></li>
                <li><strong>Composer Installed:</strong> <?php echo $hasVendor ? '✅ Yes' : '❌ No'; ?></li>
            </ul>
        </div>
        
        <div style="margin-top: 30px; text-align: center; color: #666;">
            <p>Need help? Check the <a href="https://github.com/IamTamheedNazir/umrahconnect-2.0" target="_blank">documentation</a></p>
        </div>
    </div>
</body>
</html>
