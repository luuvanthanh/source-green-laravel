<?php

namespace GGPHP\Camera\Models;

use GGPHP\Core\Models\UuidModel;

class CameraVideoProperties extends UuidModel
{
    public $timestamps = false;

    /**
     * recording status enabled
     */
    const RECORDING_ENABLED = 1;

    /**
     * recording status disabled
     */
    const RECORDING_DISABLED = 0;

    /**
     * streaming status enabled
     */
    const STREAMING_ENABLED = 1;

    /**
     * streaming status disabled
     */
    const STREAMING_DISBALED = 0;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'camera_id', 'rtsp_url', 'resolution', 'video_encoding', 'frame_rate', 'bit_rate', 'stream_url', 'recording_enabled', 'streaming_enabled',
        'device_number', 'model', 'serial_number', 'firmware_ver'
    ];
}
