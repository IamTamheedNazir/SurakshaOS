<?php
/**
 * UmrahConnect 2.0 - Installation Wizard Entry Point
 */

// Check if already installed
if (file_exists(__DIR__ . '/../.env') && file_exists(__DIR__ . '/../storage/installed.lock')) {
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <title>Already Installed - UmrahConnect</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
            }
            .container {
                background: white;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                text-align: center;
                max-width: 500px;
            }
            h1 { color: #10b981; }
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
            <h1>✅ Already Installed</h1>
            <p>UmrahConnect 2.0 is already installed on this server.</p>
            <p>Please delete the <code>/install/</code> folder for security.</p>
            <a href="/" class="button">Go to Application</a>
        </div>
    </body>
    </html>
    <?php
    exit;
}

// Show installation wizard - Include the full HTML here or load from separate file
include 'wizard.html';
?>
