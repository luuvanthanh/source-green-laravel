<?php

return [
    'disks' => [
        // other disks
        'minio' => [
            'driver' => 'minio',
            'key' => env('MINIO_KEY', 'minio'),
            'secret' => env('MINIO_SECRET', 'minio123'),
            'region' => '',
            'bucket' => env('MINIO_BUCKET', 'erptran'),
            'endpoint' => env('MINIO_ENDPOINT', 'http://s3:9000'),
        ],
    ],
    'pathToUpload' => 'files',
];
