<?php

namespace GGPHP\Camera\Models;

use GGPHP\CameraServer\Models\CameraServer;
use GGPHP\Category\Models\TouristDestination;
use GGPHP\Collection\Models\Collection;
use GGPHP\Core\Models\UuidModel;
use GGPHP\VideoWall\Models\VideoWall;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Redis;

class Camera extends UuidModel
{
    use SoftDeletes;

    const STATUS = [
        'STATUS_RUNNING' => 1,
        'STATUS_PENDING' => 2,
        'STATUS_FAILED' => 3,
    ];

    /**
     * Define latitude default if camera do not have input: 0.00000000
     */
    const LAT_DEFAULT = '0.00000000';

    /**
     * Define longitude default if camera do not have input: 0.00000000
     */
    const LONG_DEFAULT = '0.00000000';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'address', 'lat', 'long', 'ip', 'port', 'user_name', 'password', 'camera_server_id',
        'tourist_destination_id', 'is_recording', 'is_streaming', 'bit_rate', 'frame_rate', 'rtsp',
        'resolution', 'profile', 'fps', 'gop', 'status', 'user_id', 'cam_info'
    ];

    protected $guard_name = 'api';
    protected $casts = [
        'status' => 'integer',
        'lat' => 'float',
        'long' => 'float',
        'is_recording' => 'boolean',
        'is_streaming' => 'boolean',
        'cam_info' => 'array'
    ];

    /**
     * Get collection of camera
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function collection()
    {
        return $this->belongsToMany(Collection::class, 'camera_collection');
    }

    /**
     * Get the cameraServer that owns the Camera.
     */
    public function cameraServer()
    {
        return $this->belongsTo(CameraServer::class, 'camera_server_id');
    }

    /**
     * Get video wall of camera
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function videoWalls()
    {
        return $this->belongsToMany(VideoWall::class, 'camera_video_wall');
    }

    /**
     * Get video wall of camera
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function touristDestination()
    {
        return $this->belongsTo(TouristDestination::class);
    }

    /**
     * Get video wall of camera
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function cameraService()
    {
        return $this->hasMany(CameraService::class);
    }

    /**
     * Set default response latitude
     *
     * @param type $value
     * @return type
     */
    public function getLatAttribute($value)
    {
        return ($value === self::LAT_DEFAULT) ? null : (float) $value;
    }

    /**
     * Set default response longitude
     *
     * @param type $value
     * @return type
     */
    public function getLongAttribute($value)
    {
        return ($value === self::LONG_DEFAULT) ? null : (float) $value;
    }
}
