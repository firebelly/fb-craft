<?php
// Load Composer libraries
require_once('../vendor/autoload.php');

// Get dotenv variables for config
try {
	$dotenv = new Dotenv\Dotenv(dirname(__DIR__));
	$dotenv->load();
	$dotenv->required(['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASS', 'BASE_PATH', 'BASE_URL']);
} catch (Exception $e) {
	exit('Could not find a .env file.');
}

// Path to your craft/ folder
$craftPath = '../craft';

// Do not edit below this line
$path = rtrim($craftPath, '/').'/app/index.php';

if (!is_file($path))
{
	if (function_exists('http_response_code'))
	{
		http_response_code(503);
	}

	exit('Could not find your craft/ folder. Please ensure that <strong><code>$craftPath</code></strong> is set correctly in '.__FILE__);
}

require_once $path;
