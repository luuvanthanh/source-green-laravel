<?php

namespace GGPHP\Camera\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Collection\Models\Collection;
use GGPHP\Camera\Models\Camera;

class CameraService extends UuidModel
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'ai_service_id', 'camera_id', 'is_on', 'coordinates'
    ];

    protected $guard_name = 'api';

    protected $casts = [
        'status' => 'boolean',
        'coordinates' => 'array'
    ];
}
