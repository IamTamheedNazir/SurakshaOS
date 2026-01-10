<?php
/**
 * UmrahConnect 2.0 - Main Application Entry Point
 * This is the main entry point after installation is complete
 */

// Check if installed
if (!file_exists(__DIR__ . '/.env') || !file_exists(__DIR__ . '/storage/installed.lock')) {
    // Not installed, redirect to installer
    header('Location: /install/index.php');
    exit;
}

// Load environment variables
if (file_exists(__DIR__ . '/.env')) {
    $env = parse_ini_file(__DIR__ . '/.env');
    foreach ($env as $key => $value) {
        $_ENV[$key] = $value;
        putenv("$key=$value");
    }
}

// Get configuration
$apiUrl = $_ENV['API_URL'] ?? 'http://localhost:5000';
$frontendPath = __DIR__ . '/frontend/build/index.html';

// Check if Node.js backend is running
$backendHealth = @file_get_contents($apiUrl . '/health', false, stream_context_create([
    'http' => ['timeout' => 2]
]));

if (!$backendHealth) {
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <title>Backend Not Running - UmrahConnect</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                padding: 20px;
            }
            .container {
                background: white;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                max-width: 600px;
                text-align: center;
            }
            h1 { color: #e74c3c; margin-bottom: 20px; }
            p { color: #555; line-height: 1.6; margin-bottom: 15px; }
            .code {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 5px;
                font-family: monospace;
                text-align: left;
                margin: 20px 0;
            }
            .button {
                display: inline-block;
                background: #667eea;
                color: white;
                padding: 12px 30px;
                border-radius: 5px;
                text-decoration: none;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>⚠️ Backend API Not Running</h1>
            <p>The Node.js backend server is not running. Please start it to use the application.</p>
            
            <div class="code">
                <strong>To start the backend:</strong><br><br>
                cd backend<br>
                npm install<br>
                npm start
            </div>
            
            <p><strong>API URL:</strong> <?php echo htmlspecialchars($apiUrl); ?></p>
            
            <a href="/" class="button">Refresh Page</a>
        </div>
    </body>
    </html>
    <?php
    exit;
}

// Serve frontend
if (file_exists($frontendPath)) {
    // Production: Serve built frontend
    readfile($frontendPath);
} else {
    // Development: Show message to build frontend or use dev server
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <title>Frontend Not Built - UmrahConnect</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                padding: 20px;
            }
            .container {
                background: white;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                max-width: 600px;
                text-align: center;
            }
            h1 { color: #f39c12; margin-bottom: 20px; }
            p { color: #555; line-height: 1.6; margin-bottom: 15px; }
            .code {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 5px;
                font-family: monospace;
                text-align: left;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>⚠️ Frontend Not Built</h1>
            <p>The frontend application needs to be built for production.</p>
            
            <div class="code">
                <strong>To build frontend:</strong><br><br>
                cd frontend<br>
                npm install<br>
                npm run build
            </div>
            
            <p><strong>Or for development:</strong></p>
            <div class="code">
                cd frontend<br>
                npm start
            </div>
            <p>Then visit: <a href="http://localhost:3000">http://localhost:3000</a></p>
        </div>
    </body>
    </html>
    <?php
    exit;
}
?>
