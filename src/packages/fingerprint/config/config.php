<?php

/*
 * You can place your custom package configuration in here.
 */
return [
    /*
     * Definition tables have reference with fingerprint
    'reference_tables' => [
    'employees' => [
    'type' => 'bigInteger',
    'fieldName' => 'employee_id'
    ],
    'fingerprint_timekeepers' => [
    'type' => 'integer',
    'fieldName' => 'device_id'
    ]
    ]
     */
    'employeeModel' => \App\Models\User::class,
];
