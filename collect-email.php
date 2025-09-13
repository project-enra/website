<?php
// Security headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die('Method not allowed');
}

// Basic rate limiting (prevent spam)
session_start();
$current_time = time();
if (isset($_SESSION['last_submission']) && ($current_time - $_SESSION['last_submission']) < 60) {
    http_response_code(429);
    die('Please wait before submitting again');
}

// Validate and sanitize email
if (!isset($_POST['email']) || empty($_POST['email'])) {
    http_response_code(400);
    die('Email is required');
}

$email = filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL);
if (!$email) {
    http_response_code(400);
    die('Invalid email address');
}

// Additional security checks
if (strlen($email) > 254) {
    http_response_code(400);
    die('Email too long');
}

// Check for suspicious patterns
$suspicious_patterns = ['/script/i', '/javascript/i', '/onload/i', '/onerror/i'];
foreach ($suspicious_patterns as $pattern) {
    if (preg_match($pattern, $email)) {
        http_response_code(400);
        die('Invalid email format');
    }
}

// Define CSV path (make sure this directory exists and is writable)
// For security, this should be OUTSIDE your web root
$csv_directory = '../private/data/';
$csv_file = $csv_directory . 'veilglass_emails.csv';

// Create directory if it doesn't exist
if (!file_exists($csv_directory)) {
    if (!mkdir($csv_directory, 0755, true)) {
        error_log('Failed to create CSV directory: ' . $csv_directory);
        http_response_code(500);
        die('Server error');
    }
}

// Check if email already exists
if (file_exists($csv_file)) {
    $existing_emails = file($csv_file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($existing_emails as $line) {
        $data = str_getcsv($line);
        if (isset($data[0]) && $data[0] === $email) {
            // Email already exists - still show success to user
            $_SESSION['last_submission'] = $current_time;
            echo json_encode(['success' => true, 'message' => 'Welcome back to the Sacred Circle']);
            exit;
        }
    }
}

// Prepare data
$timestamp = date('Y-m-d H:i:s');
$ip_address = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$user_agent = substr($_SERVER['HTTP_USER_AGENT'] ?? 'unknown', 0, 255);

// Create CSV data
$csv_data = [
    $email,
    $timestamp,
    $ip_address,
    $user_agent
];

// Write to CSV file
$file_handle = fopen($csv_file, 'a');
if (!$file_handle) {
    error_log('Failed to open CSV file for writing: ' . $csv_file);
    http_response_code(500);
    die('Server error');
}

// Lock file for writing
if (flock($file_handle, LOCK_EX)) {
    // Add header if file is empty
    if (filesize($csv_file) === 0) {
        fputcsv($file_handle, ['Email', 'Timestamp', 'IP_Address', 'User_Agent']);
    }
    
    // Write the data
    if (fputcsv($file_handle, $csv_data)) {
        flock($file_handle, LOCK_UN);
        fclose($file_handle);
        
        // Update session
        $_SESSION['last_submission'] = $current_time;
        
        // Return JSON response for AJAX
        header('Content-Type: application/json');
        echo json_encode([
            'success' => true, 
            'message' => 'Your mystical correspondence has been received'
        ]);
        
        // Log successful submission (optional)
        error_log("New Veilglass email subscription: $email");
        
    } else {
        flock($file_handle, LOCK_UN);
        fclose($file_handle);
        http_response_code(500);
        die('Failed to save email');
    }
} else {
    fclose($file_handle);
    http_response_code(500);
    die('Could not lock file for writing');
}
?>

