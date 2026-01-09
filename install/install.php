<?php
/**
 * UmrahConnect 2.0 - Installation Script
 * This script handles the actual installation process
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
if (file_exists('../.env') && $action !== 'force') {
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
        'php_version' => [
            'required' => '7.4.0',
            'current' => PHP_VERSION,
            'status' => version_compare(PHP_VERSION, '7.4.0', '>=')
        ],
        'extensions' => [
            'curl' => extension_loaded('curl'),
            'openssl' => extension_loaded('openssl'),
            'pdo' => extension_loaded('pdo'),
            'mbstring' => extension_loaded('mbstring'),
            'tokenizer' => extension_loaded('tokenizer'),
            'json' => extension_loaded('json'),
            'fileinfo' => extension_loaded('fileinfo')
        ],
        'permissions' => [
            'storage' => is_writable('../storage'),
            'public' => is_writable('../public'),
            'env' => is_writable('../')
        ]
    ];
    
    $allPassed = $requirements['php_version']['status'];
    foreach ($requirements['extensions'] as $ext => $loaded) {
        if (!$loaded) $allPassed = false;
    }
    foreach ($requirements['permissions'] as $dir => $writable) {
        if (!$writable) $allPassed = false;
    }
    
    sendResponse($allPassed, 'Requirements check completed', $requirements);
}

/**
 * Test database connection
 */
function testDatabaseConnection($data) {
    $type = $data['type'] ?? 'mysql';
    $host = $data['host'] ?? 'localhost';
    $port = $data['port'] ?? '3306';
    $name = $data['name'] ?? '';
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';
    
    if (empty($name) || empty($username)) {
        sendResponse(false, 'Database name and username are required');
    }
    
    try {
        $dsn = "$type:host=$host;port=$port;dbname=$name";
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
        // Step 1: Create .env file
        createEnvFile($data);
        
        // Step 2: Connect to database
        $pdo = connectDatabase($data['database']);
        
        // Step 3: Create tables
        createTables($pdo, $data['database']['type']);
        
        // Step 4: Seed initial data
        seedInitialData($pdo, $data);
        
        // Step 5: Create admin account
        createAdminAccount($pdo, $data['admin']);
        
        // Step 6: Set permissions
        setPermissions();
        
        // Step 7: Create installation lock
        file_put_contents('../storage/installed.lock', date('Y-m-d H:i:s'));
        
        sendResponse(true, 'Installation completed successfully', [
            'admin_email' => $data['admin']['email'],
            'app_url' => $data['config']['app_url']
        ]);
        
    } catch (Exception $e) {
        sendResponse(false, 'Installation failed: ' . $e->getMessage());
    }
}

/**
 * Create .env file
 */
function createEnvFile($data) {
    $db = $data['database'];
    $config = $data['config'];
    
    $envContent = <<<ENV
# Application
NODE_ENV=production
APP_NAME={$config['app_name']}
APP_URL={$config['app_url']}
API_URL={$config['api_url']}

# Database
DB_TYPE={$db['type']}
DB_HOST={$db['host']}
DB_PORT={$db['port']}
DB_NAME={$db['name']}
DB_USER={$db['username']}
DB_PASSWORD={$db['password']}

# JWT
JWT_SECRET=
JWT_EXPIRE=7d

# Application Settings
DEFAULT_CURRENCY={$config['currency']}
DEFAULT_LANGUAGE={$config['language']}
TIMEZONE={$config['timezone']}

# Email (Configure later)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM_NAME={$config['app_name']}
EMAIL_FROM_ADDRESS=

# Payment Gateways (Configure later)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./storage/uploads

# Installation
INSTALLED=true
INSTALLED_AT=" . date('Y-m-d H:i:s') . "
ENV;
    
    // Generate JWT secret
    $jwtSecret = bin2hex(random_bytes(32));
    $envContent = str_replace('JWT_SECRET=', "JWT_SECRET=$jwtSecret", $envContent);
    
    if (!file_put_contents('../.env', $envContent)) {
        throw new Exception('Failed to create .env file');
    }
}

/**
 * Connect to database
 */
function connectDatabase($db) {
    $dsn = "{$db['type']}:host={$db['host']};port={$db['port']};dbname={$db['name']}";
    return new PDO($dsn, $db['username'], $db['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
}

/**
 * Create database tables
 */
function createTables($pdo, $dbType) {
    $sqlFile = __DIR__ . "/sql/schema_{$dbType}.sql";
    
    if (!file_exists($sqlFile)) {
        throw new Exception("SQL schema file not found for $dbType");
    }
    
    $sql = file_get_contents($sqlFile);
    $statements = explode(';', $sql);
    
    foreach ($statements as $statement) {
        $statement = trim($statement);
        if (!empty($statement)) {
            $pdo->exec($statement);
        }
    }
}

/**
 * Seed initial data
 */
function seedInitialData($pdo, $data) {
    $config = $data['config'];
    
    // Insert default settings
    $settings = [
        ['key' => 'app_name', 'value' => $config['app_name'], 'category' => 'general'],
        ['key' => 'app_url', 'value' => $config['app_url'], 'category' => 'general'],
        ['key' => 'default_currency', 'value' => $config['currency'], 'category' => 'general'],
        ['key' => 'default_language', 'value' => $config['language'], 'category' => 'general'],
        ['key' => 'timezone', 'value' => $config['timezone'], 'category' => 'general'],
    ];
    
    $stmt = $pdo->prepare("INSERT INTO settings (`key`, `value`, category) VALUES (?, ?, ?)");
    foreach ($settings as $setting) {
        $stmt->execute([$setting['key'], $setting['value'], $setting['category']]);
    }
    
    // Insert default currencies
    $currencies = [
        ['INR', 'Indian Rupee', '₹', '🇮🇳', 1.0000, true],
        ['USD', 'US Dollar', '$', '🇺🇸', 0.0120, false],
        ['EUR', 'Euro', '€', '🇪🇺', 0.0110, false],
        ['GBP', 'British Pound', '£', '🇬🇧', 0.0095, false],
        ['AED', 'UAE Dirham', 'د.إ', '🇦🇪', 0.0440, false],
        ['SAR', 'Saudi Riyal', 'ر.س', '🇸🇦', 0.0450, false],
    ];
    
    $stmt = $pdo->prepare("INSERT INTO currencies (code, name, symbol, flag, exchange_rate, is_default) VALUES (?, ?, ?, ?, ?, ?)");
    foreach ($currencies as $currency) {
        $stmt->execute($currency);
    }
    
    // Insert default languages
    $languages = [
        ['en', 'English', 'English', '🇬🇧', 'ltr', true, 100],
        ['ar', 'Arabic', 'العربية', '🇸🇦', 'rtl', false, 95],
        ['ur', 'Urdu', 'اردو', '🇵🇰', 'rtl', false, 88],
        ['hi', 'Hindi', 'हिन्दी', '🇮🇳', 'ltr', false, 92],
    ];
    
    $stmt = $pdo->prepare("INSERT INTO languages (code, name, native_name, flag, direction, is_default, translation_progress) VALUES (?, ?, ?, ?, ?, ?, ?)");
    foreach ($languages as $language) {
        $stmt->execute($language);
    }
    
    // Insert default roles
    $roles = [
        ['admin', 'Administrator', 'Full system access'],
        ['vendor', 'Vendor', 'Manage packages and bookings'],
        ['customer', 'Customer', 'Book packages'],
        ['support', 'Support', 'Handle support tickets'],
        ['accountant', 'Accountant', 'Manage finances'],
    ];
    
    $stmt = $pdo->prepare("INSERT INTO roles (name, display_name, description) VALUES (?, ?, ?)");
    foreach ($roles as $role) {
        $stmt->execute($role);
    }
}

/**
 * Create admin account
 */
function createAdminAccount($pdo, $admin) {
    $userId = generateUUID();
    $hashedPassword = password_hash($admin['password'], PASSWORD_BCRYPT);
    
    // Insert user
    $stmt = $pdo->prepare("
        INSERT INTO users (id, email, password, first_name, last_name, role, email_verified, status)
        VALUES (?, ?, ?, ?, ?, 'admin', 1, 'active')
    ");
    $stmt->execute([
        $userId,
        $admin['email'],
        $hashedPassword,
        $admin['firstname'],
        $admin['lastname']
    ]);
    
    // Assign admin role
    $roleStmt = $pdo->prepare("SELECT id FROM roles WHERE name = 'admin'");
    $roleStmt->execute();
    $roleId = $roleStmt->fetchColumn();
    
    $stmt = $pdo->prepare("INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)");
    $stmt->execute([$userId, $roleId]);
}

/**
 * Set file permissions
 */
function setPermissions() {
    $directories = [
        '../storage',
        '../storage/uploads',
        '../storage/logs',
        '../public/uploads',
    ];
    
    foreach ($directories as $dir) {
        if (!file_exists($dir)) {
            mkdir($dir, 0755, true);
        }
        chmod($dir, 0755);
    }
}

/**
 * Generate UUID
 */
function generateUUID() {
    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}
