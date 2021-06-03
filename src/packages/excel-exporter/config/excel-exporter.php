<?php

return [
    'disk' => env('EXCEL_EXPORTER_DISK', 'local'),
    'local' => [
        'templates' => env('EXCEL_EXPORTER_TEMPLATES_FOLDER', 'excel-exporter/templates'),
        'results' => env('EXCEL_EXPORTER_RESULTS_FOLDER', 'excel-exporter/results'),
        'endPoint' => storage_path('app'),
    ],
    'error' => [
        'template-not-found' => 'Template does not exist',
    ],
];
