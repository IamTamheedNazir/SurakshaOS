<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UmrahConnect 2.0 - Installation Wizard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 800px;
            width: 100%;
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 32px;
            margin-bottom: 10px;
        }
        
        .header p {
            opacity: 0.9;
            font-size: 16px;
        }
        
        .content {
            padding: 40px;
        }
        
        .step {
            display: none;
        }
        
        .step.active {
            display: block;
            animation: fadeIn 0.5s;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .form-group {
            margin-bottom: 25px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #333;
        }
        
        .form-group input,
        .form-group select {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.3s;
        }
        
        .form-group input:focus,
        .form-group select:focus {
            outline: none;
            border-color: #667eea;
        }
        
        .form-group small {
            display: block;
            margin-top: 5px;
            color: #666;
            font-size: 12px;
        }
        
        .btn {
            padding: 12px 30px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        
        .btn-secondary {
            background: #e0e0e0;
            color: #333;
            margin-right: 10px;
        }
        
        .btn-secondary:hover {
            background: #d0d0d0;
        }
        
        .progress-bar {
            height: 6px;
            background: #e0e0e0;
            border-radius: 3px;
            margin-bottom: 30px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            transition: width 0.3s;
        }
        
        .alert {
            padding: 15px 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        .alert-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .alert-error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        .alert-warning {
            background: #fff3cd;
            color: #856404;
            border: 1px solid #ffeaa7;
        }
        
        .check-item {
            display: flex;
            align-items: center;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            margin-bottom: 10px;
        }
        
        .check-icon {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            margin-right: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }
        
        .check-icon.success {
            background: #28a745;
            color: white;
        }
        
        .check-icon.error {
            background: #dc3545;
            color: white;
        }
        
        .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .buttons {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
        }
        
        .step-indicator {
            text-align: center;
            margin-bottom: 30px;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🕌 UmrahConnect 2.0</h1>
            <p>Installation Wizard - Let's get you set up!</p>
        </div>
        
        <div class="content">
            <div class="progress-bar">
                <div class="progress-fill" id="progressFill" style="width: 20%"></div>
            </div>
            
            <div class="step-indicator" id="stepIndicator">Step 1 of 5</div>
            
            <!-- Step 1: Welcome & Requirements Check -->
            <div class="step active" id="step1">
                <h2>Welcome! 👋</h2>
                <p style="margin: 20px 0; color: #666;">
                    This wizard will help you install UmrahConnect 2.0 on your cPanel hosting in just a few minutes.
                </p>
                
                <h3 style="margin-top: 30px; margin-bottom: 15px;">System Requirements Check</h3>
                <div id="requirementsCheck">
                    <div class="check-item">
                        <div class="loading"></div>
                        <span>Checking requirements...</span>
                    </div>
                </div>
                
                <div class="buttons">
                    <div></div>
                    <button class="btn btn-primary" onclick="nextStep()" id="step1Next" disabled>
                        Next: Database Setup →
                    </button>
                </div>
            </div>
            
            <!-- Step 2: Database Configuration -->
            <div class="step" id="step2">
                <h2>Database Configuration 🗄️</h2>
                <p style="margin: 20px 0; color: #666;">
                    Enter your MySQL database credentials. You can create these in cPanel → MySQL Databases.
                </p>
                
                <form id="dbForm">
                    <div class="form-group">
                        <label>Database Host</label>
                        <input type="text" name="db_host" value="localhost" required>
                        <small>Usually "localhost" for cPanel hosting</small>
                    </div>
                    
                    <div class="form-group">
                        <label>Database Name</label>
                        <input type="text" name="db_name" placeholder="umrahconnect_db" required>
                        <small>The name of your MySQL database</small>
                    </div>
                    
                    <div class="form-group">
                        <label>Database Username</label>
                        <input type="text" name="db_user" placeholder="umrahconnect_user" required>
                        <small>MySQL username with access to the database</small>
                    </div>
                    
                    <div class="form-group">
                        <label>Database Password</label>
                        <input type="password" name="db_password" required>
                        <small>MySQL user password</small>
                    </div>
                    
                    <div class="form-group">
                        <label>Database Port</label>
                        <input type="text" name="db_port" value="3306" required>
                        <small>Usually 3306 for MySQL</small>
                    </div>
                </form>
                
                <div id="dbTestResult"></div>
                
                <div class="buttons">
                    <button class="btn btn-secondary" onclick="prevStep()">← Back</button>
                    <button class="btn btn-primary" onclick="testDatabase()">
                        Test Connection & Continue →
                    </button>
                </div>
            </div>
            
            <!-- Step 3: Application Configuration -->
            <div class="step" id="step3">
                <h2>Application Configuration ⚙️</h2>
                <p style="margin: 20px 0; color: #666;">
                    Configure your application settings.
                </p>
                
                <form id="appForm">
                    <div class="form-group">
                        <label>Application Name</label>
                        <input type="text" name="app_name" value="UmrahConnect" required>
                        <small>Your application name</small>
                    </div>
                    
                    <div class="form-group">
                        <label>Application URL</label>
                        <input type="url" name="app_url" placeholder="https://yourdomain.com" required>
                        <small>Your website URL (include https://)</small>
                    </div>
                    
                    <div class="form-group">
                        <label>Environment</label>
                        <select name="app_env" required>
                            <option value="production">Production</option>
                            <option value="local">Local Development</option>
                        </select>
                        <small>Select "Production" for live site</small>
                    </div>
                    
                    <div class="form-group">
                        <label>Debug Mode</label>
                        <select name="app_debug" required>
                            <option value="false">Disabled (Recommended for Production)</option>
                            <option value="true">Enabled (For Development Only)</option>
                        </select>
                        <small>Keep disabled for production</small>
                    </div>
                </form>
                
                <div class="buttons">
                    <button class="btn btn-secondary" onclick="prevStep()">← Back</button>
                    <button class="btn btn-primary" onclick="nextStep()">
                        Next: Admin Account →
                    </button>
                </div>
            </div>
            
            <!-- Step 4: Admin Account -->
            <div class="step" id="step4">
                <h2>Create Admin Account 👤</h2>
                <p style="margin: 20px 0; color: #666;">
                    Create your administrator account to manage UmrahConnect.
                </p>
                
                <form id="adminForm">
                    <div class="form-group">
                        <label>Admin Name</label>
                        <input type="text" name="admin_name" placeholder="John Doe" required>
                        <small>Your full name</small>
                    </div>
                    
                    <div class="form-group">
                        <label>Admin Email</label>
                        <input type="email" name="admin_email" placeholder="admin@yourdomain.com" required>
                        <small>This will be your login email</small>
                    </div>
                    
                    <div class="form-group">
                        <label>Admin Password</label>
                        <input type="password" name="admin_password" required minlength="8">
                        <small>Minimum 8 characters</small>
                    </div>
                    
                    <div class="form-group">
                        <label>Confirm Password</label>
                        <input type="password" name="admin_password_confirm" required minlength="8">
                        <small>Re-enter your password</small>
                    </div>
                </form>
                
                <div class="buttons">
                    <button class="btn btn-secondary" onclick="prevStep()">← Back</button>
                    <button class="btn btn-primary" onclick="validateAdmin()">
                        Next: Install →
                    </button>
                </div>
            </div>
            
            <!-- Step 5: Installation -->
            <div class="step" id="step5">
                <h2>Installing UmrahConnect 2.0 🚀</h2>
                <p style="margin: 20px 0; color: #666;">
                    Please wait while we set up your application...
                </p>
                
                <div id="installProgress">
                    <div class="check-item">
                        <div class="loading"></div>
                        <span>Starting installation...</span>
                    </div>
                </div>
                
                <div id="installComplete" style="display: none;">
                    <div class="alert alert-success">
                        <h3>🎉 Installation Complete!</h3>
                        <p style="margin-top: 10px;">UmrahConnect 2.0 has been successfully installed.</p>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 20px;">
                        <h4>Next Steps:</h4>
                        <ol style="margin-left: 20px; margin-top: 10px; line-height: 1.8;">
                            <li>Login to admin panel: <a href="../backend/admin" target="_blank">Admin Panel</a></li>
                            <li>Configure your site settings</li>
                            <li>Add your first Umrah package</li>
                            <li>Customize your theme and branding</li>
                        </ol>
                    </div>
                    
                    <div class="buttons" style="margin-top: 30px;">
                        <a href="../" class="btn btn-secondary" style="text-decoration: none; display: inline-block;">
                            View Website
                        </a>
                        <a href="../backend/admin" class="btn btn-primary" style="text-decoration: none; display: inline-block;">
                            Go to Admin Panel →
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        let currentStep = 1;
        const totalSteps = 5;
        let installData = {};
        
        // Check requirements on page load
        window.onload = function() {
            checkRequirements();
        };
        
        function checkRequirements() {
            fetch('install-api.php?action=check_requirements')
                .then(response => response.json())
                .then(data => {
                    displayRequirements(data);
                })
                .catch(error => {
                    console.error('Error:', error);
                    document.getElementById('requirementsCheck').innerHTML = `
                        <div class="alert alert-error">
                            Failed to check requirements. Please refresh the page.
                        </div>
                    `;
                });
        }
        
        function displayRequirements(data) {
            let html = '';
            let allPassed = true;
            
            data.checks.forEach(check => {
                const icon = check.passed ? 'success' : 'error';
                const symbol = check.passed ? '✓' : '✗';
                html += `
                    <div class="check-item">
                        <div class="check-icon ${icon}">${symbol}</div>
                        <span>${check.name}: ${check.message}</span>
                    </div>
                `;
                if (!check.passed) allPassed = false;
            });
            
            document.getElementById('requirementsCheck').innerHTML = html;
            
            if (allPassed) {
                document.getElementById('step1Next').disabled = false;
            } else {
                document.getElementById('requirementsCheck').innerHTML += `
                    <div class="alert alert-error" style="margin-top: 20px;">
                        Please fix the requirements above before continuing.
                    </div>
                `;
            }
        }
        
        function testDatabase() {
            const form = document.getElementById('dbForm');
            const formData = new FormData(form);
            
            document.getElementById('dbTestResult').innerHTML = `
                <div class="check-item">
                    <div class="loading"></div>
                    <span>Testing database connection...</span>
                </div>
            `;
            
            fetch('install-api.php?action=test_database', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('dbTestResult').innerHTML = `
                        <div class="alert alert-success">
                            ✓ Database connection successful!
                        </div>
                    `;
                    
                    // Store database config
                    installData.database = Object.fromEntries(formData);
                    
                    setTimeout(() => nextStep(), 1000);
                } else {
                    document.getElementById('dbTestResult').innerHTML = `
                        <div class="alert alert-error">
                            ✗ Connection failed: ${data.message}
                        </div>
                    `;
                }
            })
            .catch(error => {
                document.getElementById('dbTestResult').innerHTML = `
                    <div class="alert alert-error">
                        ✗ Error: ${error.message}
                    </div>
                `;
            });
        }
        
        function validateAdmin() {
            const form = document.getElementById('adminForm');
            const formData = new FormData(form);
            const password = formData.get('admin_password');
            const confirm = formData.get('admin_password_confirm');
            
            if (password !== confirm) {
                alert('Passwords do not match!');
                return;
            }
            
            installData.admin = Object.fromEntries(formData);
            installData.app = Object.fromEntries(new FormData(document.getElementById('appForm')));
            
            nextStep();
            startInstallation();
        }
        
        function startInstallation() {
            const steps = [
                { name: 'Creating .env file', action: 'create_env' },
                { name: 'Generating application key', action: 'generate_key' },
                { name: 'Running database migrations', action: 'run_migrations' },
                { name: 'Seeding database', action: 'seed_database' },
                { name: 'Creating admin account', action: 'create_admin' },
                { name: 'Setting permissions', action: 'set_permissions' },
                { name: 'Finalizing installation', action: 'finalize' }
            ];
            
            let currentStepIndex = 0;
            
            function runNextStep() {
                if (currentStepIndex >= steps.length) {
                    showComplete();
                    return;
                }
                
                const step = steps[currentStepIndex];
                updateProgress(step.name);
                
                fetch('install-api.php?action=' + step.action, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(installData)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        markStepComplete(step.name);
                        currentStepIndex++;
                        setTimeout(runNextStep, 500);
                    } else {
                        showError(step.name, data.message);
                    }
                })
                .catch(error => {
                    showError(step.name, error.message);
                });
            }
            
            runNextStep();
        }
        
        function updateProgress(message) {
            document.getElementById('installProgress').innerHTML += `
                <div class="check-item">
                    <div class="loading"></div>
                    <span>${message}...</span>
                </div>
            `;
        }
        
        function markStepComplete(message) {
            const items = document.getElementById('installProgress').getElementsByClassName('check-item');
            const lastItem = items[items.length - 1];
            lastItem.innerHTML = `
                <div class="check-icon success">✓</div>
                <span>${message} - Complete</span>
            `;
        }
        
        function showError(step, message) {
            document.getElementById('installProgress').innerHTML += `
                <div class="alert alert-error">
                    Failed at: ${step}<br>
                    Error: ${message}
                </div>
            `;
        }
        
        function showComplete() {
            document.getElementById('installProgress').style.display = 'none';
            document.getElementById('installComplete').style.display = 'block';
        }
        
        function nextStep() {
            if (currentStep < totalSteps) {
                document.getElementById('step' + currentStep).classList.remove('active');
                currentStep++;
                document.getElementById('step' + currentStep).classList.add('active');
                updateProgressBar();
                updateStepIndicator();
            }
        }
        
        function prevStep() {
            if (currentStep > 1) {
                document.getElementById('step' + currentStep).classList.remove('active');
                currentStep--;
                document.getElementById('step' + currentStep).classList.add('active');
                updateProgressBar();
                updateStepIndicator();
            }
        }
        
        function updateProgressBar() {
            const progress = (currentStep / totalSteps) * 100;
            document.getElementById('progressFill').style.width = progress + '%';
        }
        
        function updateStepIndicator() {
            document.getElementById('stepIndicator').textContent = `Step ${currentStep} of ${totalSteps}`;
        }
    </script>
</body>
</html>
