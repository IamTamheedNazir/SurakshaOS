<?php
/**
 * UmrahConnect 2.0 - Installation API
 * Handles all installation wizard backend operations
 */

header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Get action from query parameter
$action = $_GET['action'] ?? '';

// Route to appropriate handler
switch ($action) {
    case 'check_requirements':
        checkRequirements();
        break;
    case 'test_database':
        testDatabase();
        break;
    case 'create_env':
        createEnvFile();
        break;
    case 'generate_key':
        generateAppKey();
        break;
    case 'run_migrations':
        runMigrations();
        break;
    case 'seed_database':
        seedDatabase();
        break;
    case 'create_admin':
        createAdminAccount();
        break;
    case 'set_permissions':
        setPermissions();
        break;
    case 'finalize':
        finalizeInstallation();
        break;
    default:
        jsonResponse(false, 'Invalid action');
}

/**
 * Get backend path - supports both 'backend' and 'backend-laravel' folder names
 */
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
    
    return dirname(__DIR__) . '/backend'; // Default
}

/**
 * Check system requirements
 */
function checkRequirements() {
    $checks = [];
    
    // PHP Version
    $phpVersion = phpversion();
    $checks[] = [
        'name' => 'PHP Version',
        'passed' => version_compare($phpVersion, '8.1.0', '>='),
        'message' => $phpVersion . ' (Required: 8.1+)'
    ];
    
    // Required PHP Extensions
    $requiredExtensions = ['pdo', 'pdo_mysql', 'mbstring', 'openssl', 'tokenizer', 'xml', 'ctype', 'json', 'bcmath'];
    foreach ($requiredExtensions as $ext) {
        $checks[] = [
            'name' => 'PHP Extension: ' . $ext,
            'passed' => extension_loaded($ext),
            'message' => extension_loaded($ext) ? 'Installed' : 'Not installed'
        ];
    }
    
    // Directory Permissions
    $backendPath = getBackendPath();
    $storagePath = $backendPath . '/storage';
    $bootstrapCachePath = $backendPath . '/bootstrap/cache';
    
    // Check if storage directory exists and is writable
    if (file_exists($storagePath)) {
        $isWritable = is_writable($storagePath);
        $checks[] = [
            'name' => 'Storage Directory Writable',
            'passed' => $isWritable,
            'message' => $isWritable ? 'Writable' : 'Not writable (chmod 775 or 777 required)'
        ];
    } else {
        $checks[] = [
            'name' => 'Storage Directory Writable',
            'passed' => false,
            'message' => 'Directory not found: ' . $storagePath
        ];
    }
    
    // Check if bootstrap cache exists and is writable
    if (file_exists($bootstrapCachePath)) {
        $isWritable = is_writable($bootstrapCachePath);
        $checks[] = [
            'name' => 'Bootstrap Cache Writable',
            'passed' => $isWritable,
            'message' => $isWritable ? 'Writable' : 'Not writable (chmod 775 or 777 required)'
        ];
    } else {
        $checks[] = [
            'name' => 'Bootstrap Cache Writable',
            'passed' => false,
            'message' => 'Directory not found: ' . $bootstrapCachePath
        ];
    }
    
    // Composer vendor directory
    $vendorPath = $backendPath . '/vendor';
    $checks[] = [
        'name' => 'Composer Dependencies',
        'passed' => file_exists($vendorPath . '/autoload.php'),
        'message' => file_exists($vendorPath . '/autoload.php') ? 'Installed' : 'Not installed (run: composer install)'
    ];
    
    jsonResponse(true, 'Requirements checked', ['checks' => $checks]);
}

/**
 * Test database connection
 */
function testDatabase() {
    $host = $_POST['db_host'] ?? '';
    $name = $_POST['db_name'] ?? '';
    $user = $_POST['db_user'] ?? '';
    $password = $_POST['db_password'] ?? '';
    $port = $_POST['db_port'] ?? '3306';
    
    try {
        $dsn = "mysql:host=$host;port=$port;dbname=$name;charset=utf8mb4";
        $pdo = new PDO($dsn, $user, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);
        
        // Test query
        $pdo->query('SELECT 1');
        
        jsonResponse(true, 'Database connection successful');
    } catch (PDOException $e) {
        jsonResponse(false, 'Database connection failed: ' . $e->getMessage());
    }
}

/**
 * Create .env file
 */
function createEnvFile() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $backendPath = getBackendPath();
    $envExamplePath = $backendPath . '/.env.example';
    $envPath = $backendPath . '/.env';
    
    if (!file_exists($envExamplePath)) {
        jsonResponse(false, '.env.example file not found');
        return;
    }
    
    // Read .env.example
    $envContent = file_get_contents($envExamplePath);
    
    // Replace database values
    $envContent = preg_replace('/DB_HOST=.*/', 'DB_HOST=' . $data['database']['db_host'], $envContent);
    $envContent = preg_replace('/DB_PORT=.*/', 'DB_PORT=' . $data['database']['db_port'], $envContent);
    $envContent = preg_replace('/DB_DATABASE=.*/', 'DB_DATABASE=' . $data['database']['db_name'], $envContent);
    $envContent = preg_replace('/DB_USERNAME=.*/', 'DB_USERNAME=' . $data['database']['db_user'], $envContent);
    $envContent = preg_replace('/DB_PASSWORD=.*/', 'DB_PASSWORD=' . $data['database']['db_password'], $envContent);
    
    // Replace app values
    $envContent = preg_replace('/APP_NAME=.*/', 'APP_NAME="' . $data['app']['app_name'] . '"', $envContent);
    $envContent = preg_replace('/APP_ENV=.*/', 'APP_ENV=' . $data['app']['app_env'], $envContent);
    $envContent = preg_replace('/APP_DEBUG=.*/', 'APP_DEBUG=' . $data['app']['app_debug'], $envContent);
    $envContent = preg_replace('/APP_URL=.*/', 'APP_URL=' . $data['app']['app_url'], $envContent);
    
    // Write .env file
    if (file_put_contents($envPath, $envContent)) {
        jsonResponse(true, '.env file created successfully');
    } else {
        jsonResponse(false, 'Failed to create .env file');
    }
}

/**
 * Generate application key
 */
function generateAppKey() {
    $backendPath = getBackendPath();
    
    // Generate random key
    $key = 'base64:' . base64_encode(random_bytes(32));
    
    // Update .env file
    $envPath = $backendPath . '/.env';
    $envContent = file_get_contents($envPath);
    $envContent = preg_replace('/APP_KEY=.*/', 'APP_KEY=' . $key, $envContent);
    
    if (file_put_contents($envPath, $envContent)) {
        // Also generate JWT secret
        $jwtSecret = base64_encode(random_bytes(32));
        $envContent = file_get_contents($envPath);
        $envContent = preg_replace('/JWT_SECRET=.*/', 'JWT_SECRET=' . $jwtSecret, $envContent);
        file_put_contents($envPath, $envContent);
        
        jsonResponse(true, 'Application keys generated');
    } else {
        jsonResponse(false, 'Failed to generate application key');
    }
}

/**
 * Run database migrations
 */
function runMigrations() {
    $backendPath = getBackendPath();
    
    // Change to backend directory
    chdir($backendPath);
    
    // Run migrations
    $output = [];
    $returnVar = 0;
    exec('php artisan migrate --force 2>&1', $output, $returnVar);
    
    if ($returnVar === 0) {
        jsonResponse(true, 'Database migrations completed');
    } else {
        jsonResponse(false, 'Migration failed: ' . implode("\n", $output));
    }
}

/**
 * Seed database
 */
function seedDatabase() {
    $backendPath = getBackendPath();
    
    // Change to backend directory
    chdir($backendPath);
    
    // Run seeders
    $output = [];
    $returnVar = 0;
    exec('php artisan db:seed --force 2>&1', $output, $returnVar);
    
    if ($returnVar === 0) {
        jsonResponse(true, 'Database seeded successfully');
    } else {
        jsonResponse(false, 'Seeding failed: ' . implode("\n", $output));
    }
}

/**
 * Create admin account
 */
function createAdminAccount() {
    $data = json_decode(file_get_contents('php://input'), true);
    $admin = $data['admin'];
    
    $backendPath = getBackendPath();
    $envPath = $backendPath . '/.env';
    
    // Load environment
    if (file_exists($envPath)) {
        $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
                list($key, $value) = explode('=', $line, 2);
                $key = trim($key);
                $value = trim($value, '"\'');
                putenv("$key=$value");
            }
        }
    }
    
    try {
        // Connect to database
        $host = getenv('DB_HOST');
        $port = getenv('DB_PORT');
        $dbname = getenv('DB_DATABASE');
        $username = getenv('DB_USERNAME');
        $password = getenv('DB_PASSWORD');
        
        $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";
        $pdo = new PDO($dsn, $username, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]);
        
        // Hash password
        $hashedPassword = password_hash($admin['admin_password'], PASSWORD_BCRYPT);
        
        // Insert admin user
        $stmt = $pdo->prepare("
            INSERT INTO users (name, email, password, role, email_verified_at, created_at, updated_at)
            VALUES (?, ?, ?, 'admin', NOW(), NOW(), NOW())
            ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            password = VALUES(password),
            role = 'admin'
        ");
        
        $stmt->execute([
            $admin['admin_name'],
            $admin['admin_email'],
            $hashedPassword
        ]);
        
        jsonResponse(true, 'Admin account created');
    } catch (Exception $e) {
        jsonResponse(false, 'Failed to create admin: ' . $e->getMessage());
    }
}

/**
 * Set proper permissions
 */
function setPermissions() {
    $backendPath = getBackendPath();
    
    // Set permissions for storage and cache
    @chmod($backendPath . '/storage', 0775);
    @chmod($backendPath . '/bootstrap/cache', 0775);
    
    // Recursively set permissions for storage
    try {
        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($backendPath . '/storage', RecursiveDirectoryIterator::SKIP_DOTS),
            RecursiveIteratorIterator::SELF_FIRST
        );
        
        foreach ($iterator as $item) {
            @chmod($item->getPathname(), $item->isDir() ? 0775 : 0664);
        }
    } catch (Exception $e) {
        // Continue even if recursive chmod fails
    }
    
    jsonResponse(true, 'Permissions set successfully');
}

/**
 * Finalize installation
 */
function finalizeInstallation() {
    $backendPath = getBackendPath();
    
    // Clear caches
    chdir($backendPath);
    exec('php artisan config:clear 2>&1');
    exec('php artisan cache:clear 2>&1');
    exec('php artisan route:clear 2>&1');
    exec('php artisan view:clear 2>&1');
    
    // Create installation lock file
    $lockFile = dirname(__FILE__) . '/.installed';
    file_put_contents($lockFile, date('Y-m-d H:i:s'));
    
    jsonResponse(true, 'Installation completed successfully');
}

/**
 * Send JSON response
 */
function jsonResponse($success, $message, $data = []) {
    echo json_encode(array_merge([
        'success' => $success,
        'message' => $message
    ], $data));
    exit;
}
