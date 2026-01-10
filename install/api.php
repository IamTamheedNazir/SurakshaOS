<?php
/**
 * UmrahConnect 2.0 - Installation API
 * This script handles all installation requests
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Get request data
$input = json_decode(file_get_contents('php://input'), true);
$action = $_GET['action'] ?? '';

// Response helper
function sendResponse($success, $message, $data = []) {
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit;
}

// Check if already installed
if (file_exists('../.env') && file_exists('../storage/installed.lock') && $action !== 'force') {
    sendResponse(false, 'Application is already installed. Delete .env file to reinstall.');
}

switch ($action) {
    case 'check_requirements':
        checkRequirements();
        break;
    
    case 'test_database':
        testDatabaseConnection($input);
        break;
    
    case 'install':
        performInstallation($input);
        break;
    
    default:
        sendResponse(false, 'Invalid action');
}

/**
 * Check system requirements
 */
function checkRequirements() {
    $requirements = [
        'php_version' => PHP_VERSION,
        'extensions' => [
            'curl' => extension_loaded('curl'),
            'openssl' => extension_loaded('openssl'),
            'pdo' => extension_loaded('pdo'),
            'pdo_mysql' => extension_loaded('pdo_mysql'),
            'mbstring' => extension_loaded('mbstring'),
            'json' => extension_loaded('json'),
            'fileinfo' => extension_loaded('fileinfo')
        ],
        'permissions' => [
            'root' => is_writable('../'),
            'storage' => is_writable('../storage') || @mkdir('../storage', 0777, true),
            'database' => is_writable('../database') || @mkdir('../database', 0777, true)
        ]
    ];
    
    $allPassed = version_compare(PHP_VERSION, '7.4.0', '>=');
    foreach ($requirements['extensions'] as $ext => $loaded) {
        if (!$loaded) $allPassed = false;
    }
    foreach ($requirements['permissions'] as $dir => $writable) {
        if (!$writable) $allPassed = false;
    }
    
    sendResponse($allPassed, 'Requirements check completed', [
        'checks' => $requirements,
        'php_version' => PHP_VERSION
    ]);
}

/**
 * Test database connection
 */
function testDatabaseConnection($data) {
    $host = $data['db_host'] ?? 'localhost';
    $port = $data['db_port'] ?? '3306';
    $name = $data['db_name'] ?? '';
    $username = $data['db_user'] ?? '';
    $password = $data['db_password'] ?? '';
    
    if (empty($name) || empty($username)) {
        sendResponse(false, 'Database name and username are required');
    }
    
    try {
        $dsn = "mysql:host=$host;port=$port;dbname=$name;charset=utf8mb4";
        $pdo = new PDO($dsn, $username, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]);
        
        sendResponse(true, 'Database connection successful', [
            'version' => $pdo->getAttribute(PDO::ATTR_SERVER_VERSION)
        ]);
    } catch (PDOException $e) {
        sendResponse(false, 'Database connection failed: ' . $e->getMessage());
    }
}

/**
 * Perform installation
 */
function performInstallation($data) {
    try {
        // Step 1: Create necessary directories
        createDirectories();
        
        // Step 2: Create .env file
        createEnvFile($data);
        
        // Step 3: Connect to database
        $pdo = connectDatabase($data['database']);
        
        // Step 4: Import database schema
        importDatabaseSchema($pdo);
        
        // Step 5: Create admin account
        createAdminAccount($pdo, $data['admin']);
        
        // Step 6: Create default settings
        createDefaultSettings($pdo, $data['config']);
        
        // Step 7: Create installation lock
        file_put_contents('../storage/installed.lock', json_encode([
            'installed_at' => date('Y-m-d H:i:s'),
            'version' => '2.0.0',
            'admin_email' => $data['admin']['admin_email']
        ]));
        
        sendResponse(true, 'Installation completed successfully', [
            'admin_email' => $data['admin']['admin_email'],
            'app_url' => $data['config']['site_url']
        ]);
        
    } catch (Exception $e) {
        sendResponse(false, 'Installation failed: ' . $e->getMessage());
    }
}

/**
 * Create necessary directories
 */
function createDirectories() {
    $dirs = [
        '../storage',
        '../storage/uploads',
        '../storage/uploads/packages',
        '../storage/uploads/vendors',
        '../storage/uploads/documents',
        '../storage/logs',
        '../storage/temp'
    ];
    
    foreach ($dirs as $dir) {
        if (!file_exists($dir)) {
            @mkdir($dir, 0777, true);
        }
    }
}

/**
 * Create .env file
 */
function createEnvFile($data) {
    $db = $data['database'];
    $config = $data['config'];
    
    $jwtSecret = bin2hex(random_bytes(32));
    $refreshSecret = bin2hex(random_bytes(32));
    
    $envContent = "# Application
NODE_ENV=production
APP_NAME={$config['site_name']}
APP_URL={$config['site_url']}
FRONTEND_URL={$config['site_url']}
API_URL={$config['api_url']}

# Database
DB_HOST={$db['db_host']}
DB_PORT={$db['db_port']}
DB_NAME={$db['db_name']}
DB_USER={$db['db_user']}
DB_PASSWORD={$db['db_password']}

# JWT
JWT_SECRET=$jwtSecret
JWT_EXPIRE=30d
REFRESH_TOKEN_SECRET=$refreshSecret
REFRESH_TOKEN_EXPIRE=90d

# Application Settings
DEFAULT_CURRENCY={$config['currency']}
DEFAULT_LANGUAGE=en
TIMEZONE={$config['timezone']}

# Server
PORT=5000

# Email (Configure later in admin panel)
EMAIL_SERVICE=smtp
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_SECURE=false
EMAIL_FROM_NAME={$config['site_name']}
EMAIL_FROM_ADDRESS=

# SMS (Configure later in admin panel)
SMS_SERVICE=twilio
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Payment Gateways (Configure later in admin panel)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_MODE=sandbox

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./storage/uploads
ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf,doc,docx

# CORS
CORS_ORIGIN={$config['site_url']}

# Installation
INSTALLED=true
INSTALLED_AT=" . date('Y-m-d H:i:s') . "
VERSION=2.0.0
";
    
    if (!file_put_contents('../.env', $envContent)) {
        throw new Exception('Failed to create .env file. Check write permissions.');
    }
    
    // Also create backend .env
    if (!file_put_contents('../backend/.env', $envContent)) {
        throw new Exception('Failed to create backend .env file.');
    }
}

/**
 * Connect to database
 */
function connectDatabase($db) {
    $dsn = "mysql:host={$db['db_host']};port={$db['db_port']};dbname={$db['db_name']};charset=utf8mb4";
    return new PDO($dsn, $db['db_user'], $db['db_password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
}

/**
 * Import database schema
 */
function importDatabaseSchema($pdo) {
    // Check which schema file exists
    $schemaFiles = [
        '../database/schema-shared-hosting.sql',
        '../database/schema.sql',
        './complete_schema.sql',
        './database_schema.sql'
    ];
    
    $schemaFile = null;
    foreach ($schemaFiles as $file) {
        if (file_exists($file)) {
            $schemaFile = $file;
            break;
        }
    }
    
    if (!$schemaFile) {
        throw new Exception('Database schema file not found');
    }
    
    $sql = file_get_contents($schemaFile);
    
    // Split by semicolon and execute each statement
    $statements = array_filter(array_map('trim', explode(';', $sql)));
    
    foreach ($statements as $statement) {
        if (!empty($statement) && !preg_match('/^(--|#)/', $statement)) {
            try {
                $pdo->exec($statement);
            } catch (PDOException $e) {
                // Continue on duplicate table errors
                if (strpos($e->getMessage(), 'already exists') === false) {
                    throw $e;
                }
            }
        }
    }
}

/**
 * Create admin account
 */
function createAdminAccount($pdo, $admin) {
    // Generate UUID
    $userId = sprintf(
        '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
    
    // Hash password (bcrypt compatible with Node.js)
    $passwordHash = password_hash($admin['admin_password'], PASSWORD_BCRYPT, ['cost' => 10]);
    
    // Check if admin already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? OR role = 'admin' LIMIT 1");
    $stmt->execute([$admin['admin_email']]);
    
    if ($stmt->fetch()) {
        // Update existing admin
        $stmt = $pdo->prepare("
            UPDATE users 
            SET password = ?, first_name = ?, last_name = ?, phone = ?, email_verified = 1, status = 'active'
            WHERE email = ? OR role = 'admin'
        ");
        $stmt->execute([
            $passwordHash,
            $admin['admin_first_name'],
            $admin['admin_last_name'],
            $admin['admin_phone'] ?? null,
            $admin['admin_email']
        ]);
    } else {
        // Create new admin
        $stmt = $pdo->prepare("
            INSERT INTO users (
                id, email, password, first_name, last_name, phone,
                role, status, email_verified, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, 'admin', 'active', 1, NOW(), NOW())
        ");
        
        $stmt->execute([
            $userId,
            $admin['admin_email'],
            $passwordHash,
            $admin['admin_first_name'],
            $admin['admin_last_name'],
            $admin['admin_phone'] ?? null
        ]);
    }
}

/**
 * Create default settings
 */
function createDefaultSettings($pdo, $config) {
    $settings = [
        ['site_name', $config['site_name'], 'string', 'Website name'],
        ['site_url', $config['site_url'], 'string', 'Website URL'],
        ['api_url', $config['api_url'], 'string', 'API URL'],
        ['currency', $config['currency'], 'string', 'Default currency'],
        ['timezone', $config['timezone'], 'string', 'Default timezone'],
        ['commission_rate', '10', 'number', 'Default commission rate (%)'],
        ['booking_prefix', 'UC', 'string', 'Booking number prefix'],
        ['enable_reviews', 'true', 'boolean', 'Enable review system'],
        ['enable_notifications', 'true', 'boolean', 'Enable notifications'],
        ['maintenance_mode', 'false', 'boolean', 'Maintenance mode']
    ];
    
    foreach ($settings as $setting) {
        $settingId = sprintf(
            '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
        
        try {
            $stmt = $pdo->prepare("
                INSERT INTO settings (id, setting_key, setting_value, setting_type, description, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, NOW(), NOW())
                ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)
            ");
            
            $stmt->execute([
                $settingId,
                $setting[0],
                $setting[1],
                $setting[2],
                $setting[3]
            ]);
        } catch (PDOException $e) {
            // Continue on duplicate key errors
            if (strpos($e->getMessage(), 'Duplicate entry') === false) {
                throw $e;
            }
        }
    }
}
?>
