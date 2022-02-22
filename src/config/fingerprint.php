<?php

/*
 * You can place your custom package configuration in here.
 */
return [

    // * Definition tables have reference with fingerprint
    'reference_tables' => [
        'Employees' => [
            'type' => 'uuid',
            'fieldName' => 'EmployeeId',
        ],
        // 'fingerprint_timekeepers' => [
        //     'type' => 'integer',
        //     'fieldName' => 'device_id'
        // ]
    ],

];
