<?php

/*
 * You can place your custom package configuration in here.
 */
return [
    'TYPE' => [
        'COLLECTIONS' => ['FINGERPRINT', 'CARD'],
        'FINGERPRINT' => 'FINGERPRINT',
        'CARD' => 'CARD',
    ],
    'TRACKING_TYPE' => [
        'COLLECTIONS' => ['CHECK_IN', 'CHECK_OUT'],
        'CHECK_IN' => 'CHECK_IN',
        'CHECK_OUT' => 'CHECK_IN',
    ],
    'MARRIAGE_STATUS' => [
        'COLLECTIONS' => ['DOC_THAN', 'DA_KET_HON'],
        'DOC_THAN' => 'DOC_THAN',
        'DA_KET_HON' => 'DA_KET_HON',
    ],
    'HTTP_STATUS_CODE' => [
        'NOT_FOUND' => 404,
        'BAD_REQUEST' => 400,
        'SERVER_ERROR' => 500,
        'METHOD_NOT_ALLOWED' => 405,
        'UNAUTHORIZED' => 401,
        'PERMISSION_DENIED' => 403,
        'UNPROCESSABLE_ENTITY' => 422,
        'NOT_ACCEPTABLE' => 406,
        'SUCCESS' => 200,
    ],
    'SEARCH_VALUES_DEFAULT' => [
        'LIMIT' => 1,
        'PAGE' => 1,
        'LIMIT_ZERO' => 0,
        'LIMIT_RANDOM_USER' => 50,
        'SORTED_BY_DEFAULT' => 'ASC',
    ],

    'TIMEKEEPING_DURATION_ALLOW' => env('TIMEKEEPING_DURATION_ALLOW', 60),
    // Late early config
    'DURATION_ALLOW_BEFORE_STARTTIME' => env('DURATION_ALLOW_BEFORE_STARTTIME', 30),
    'DURATION_ALLOW_AFTERT_STARTTIME' => env('DURATION_ALLOW_AFTERT_STARTTIME', 90),
    'DURATION_ALLOW_BEFORE_ENDTIME' => env('DURATION_ALLOW_BEFORE_ENDTIME', 45),
    'DURATION_ALLOW_AFTERT_ENDTIME' => env('DURATION_ALLOW_AFTERT_ENDTIME', 15),
    'TIMEKEEPING_DEADLINE' => env('TIMEKEEPING_DEADLINE', 5),
    //  End Late early config
    'OVERTIME_DURATION_ALLOW' => env('OVERTIME_DURATION_ALLOW', 15),
    'TIME_LATE' => env('TIME_LATE', 3600),
];
