<?php

namespace GGPHP\Camera\Models;

use GGPHP\Core\Models\UuidModel;

class CameraGeneralProperties extends UuidModel
{

    public $timestamps = false;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id', 'camera_id', 'device_name', 'device_number', 'device_model', 'serial_number', 'firmware_ver', 'ip', 'port', 'user_name', 'password'
    ];

    protected $guard_name = 'api';

    /**
     * The storage format of the model's date columns.
     *
     * @var string
     */
    protected $dateTimeFormat = 'c';

    /**
     * Get collection of camera
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function camera()
    {
        return $this->belongsToMany(Camera::class, 'camera_collection');
    }
}
