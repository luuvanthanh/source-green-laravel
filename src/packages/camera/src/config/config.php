<?php

/*
 * You can place your custom package configuration in here.
 */
return [
    'HTTP_STATUS_CODE' => [
        'NOT_FOUND'            => 404,
        'BAD_REQUEST'          => 400,
        'SERVER_ERROR'         => 500,
        'METHOD_NOT_ALLOWED'   => 405,
        'UNAUTHORIZED'         => 401,
        'PERMISSION_DENIED'    => 403,
        'UNPROCESSABLE_ENTITY' => 422,
        'NOT_ACCEPTABLE'       => 406,
        'SUCCESS'              => 200,
    ],
    'SEARCH_VALUES_DEFAULT' => [
        'LIMIT'             => 10,
        'PAGE'              => 1,
        'LIMIT_ZERO'        => 0,
        'LIMIT_RANDOM_USER' => 50,
        'SORTED_BY_DEFAULT' => 'ASC',
    ],
    'NO_PAGINATION' => 'no',
    'CAMERA' => [
        'PUBLISH' => [
            'PUBLISH_CHANEL' => 'vmscore_to_camserver',
            'EVENT' => [
                'UPDATE' => 'camera_updated',
                'ADD'    => 'camera_added',
                'DELETE' => 'camera_removed'
            ],
        ],
        'SUBSCRIBE' => [
            'SUBSCRIBE_CHANEL' => 'camserver_to_vmscore',
            'EVENT' => [
                'READY'   => 'camera_ready',
                'STARTED' => 'camera_started',
                'RUNNING' => 'camera_running',
                'STOPPED' => 'camera_stopped',
                'FAILED'  => 'camera_failed',
            ],
        ],
        'PTZ' => [
            'URL' => [
                'PUT_PTZ'       => '/ISAPI/PTZCtrl/channels/1/continuous',
                'GET_PRESET'    => '/ISAPI/PTZCtrl/channels/1/presets',
                'CREATE_PRESET' => '/ISAPI/PTZCtrl/channels/1/presets/$idPreset',
                'GOTO_PRESET'   => '/ISAPI/PTZCtrl/channels/1/presets/$idPreset/goto',
                'GET_INFO'      => '/ISAPI/System/deviceInfo',
            ],
            'ACTION' => [
                'LEFT'            => 'left',
                'RIGHT'           => 'right',
                'UP'              => 'up',
                'DOWN'            => 'down',
                'SKEW_UP_LEFT'    => 'skew_up_left',
                'SKEW_UP_RIGHT'   => 'skew_up_right',
                'SKEW_DOWN_LEFT'  => 'skew_down_left',
                'SKEW_DOWN_RIGHT' => 'skew_down_right',
                'ZOOM_IN'         => 'zoom_in',
                'ZOOM_OUT'        => 'zoom_out',
            ],
            'STATUS' => [
                'START' => 1,
                'STOP'  => 0
            ]
        ]
    ]
];
