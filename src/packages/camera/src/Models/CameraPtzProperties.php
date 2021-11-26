<?php

namespace GGPHP\Camera\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Support\Facades\Redis;

class CameraPtzProperties extends UuidModel
{
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id', 'camera_id', 'zoom_enabled', 'pan_enabled', 'tilt_enabled', 'zoom_val', 'pan_val', 'tilt_val'
    ];

    protected $guard_name = 'api';

    /**
     * The storage format of the model's date columns.
     *
     * @var string
     */
    protected $dateTimeFormat = 'c';
}
