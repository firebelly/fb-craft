<?php

/**
 * General Configuration
 *
 * All of your system's general configuration settings go in here.
 * You can see a list of the default settings in craft/app/etc/config/defaults/general.php
 */

return array(
    '*' => array(
        'omitScriptNameInUrls' => true,
        'imageDriver' => 'imagick',
        'cdnUrl' => getenv('CDN_URL'),
        'stripePublishableKey' => getenv('STRIPE_PUBLISHABLE_KEY'),
        'enableCsrfProtection' => true,
        'generateTransformsBeforePageLoad' => true,
        'environmentVariables' => array(
            'baseUrl'  => getenv('BASE_URL'),
            'basePath' => getenv('BASE_PATH'),
        ),
        'defaultSearchTermOptions' => array(
            'subLeft' => true,
            'subRight' => true,
        ),
    ),

    'fb-craft.localhost' => array(
        'devMode' => true,
    ),

    'firebellydesign.com' => array(
        'cooldownDuration' => 0,
    )
);
