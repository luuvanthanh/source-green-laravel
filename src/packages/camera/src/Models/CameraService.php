<?php

namespace GGPHP\Camera\Models;

use GGPHP\AiService\Models\AiService;
use GGPHP\Camera\Models\Camera;
use GGPHP\Collection\Models\Collection;
use GGPHP\Core\Models\UuidModel;

class CameraService extends UuidModel
{
    protected $table = 'camera_service';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'ai_service_id', 'camera_id', 'is_on', 'coordinates', 'is_stream'
    ];

    protected $guard_name = 'api';

    protected $casts = [
        'status' => 'boolean',
        'coordinates' => 'array'
    ];

    /**
     * User belong to
     *
     * @return type
     */
    public function camera()
    {
        return $this->belongsTo(Camera::class);
    }

    /**
     * User belong to
     *
     * @return type
     */
    public function aiService()
    {
        return $this->belongsTo(AiService::class, 'ai_service_id');
    }
}
