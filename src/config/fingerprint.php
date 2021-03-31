<?php

/*
 * You can place your custom package configuration in here.
 */
return [
    
     // * Definition tables have reference with fingerprint
        'reference_tables' => [
            'users' => [
                'type' => 'bigInteger',
                'fieldName' => 'user_id'
            ],
            // 'fingerprint_timekeepers' => [
            //     'type' => 'integer',
            //     'fieldName' => 'device_id'
            // ]
        ]
     
    
];