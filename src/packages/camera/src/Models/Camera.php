<?php

namespace GGPHP\Camera\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Collection\Models\Collection;
use GGPHP\CameraServer\Models\CameraServer;
use GGPHP\Category\Models\TouristDestination;
use GGPHP\VideoWall\Models\VideoWall;
use Illuminate\Support\Facades\Redis;
use Illuminate\Database\Eloquent\SoftDeletes;

class Camera extends UuidModel
{
    use SoftDeletes;

    const STATUS = [
        'STATUS_READY' => 0,
        'STATUS_STARTED' => 1,
        'STATUS_RUNNING' => 2,
        'STATUS_STOPPED' => 3,
        'STATUS_FAILED' => 4,
    ];

    /**
     * Status: Ready(User not activated Recording or Streaming)
     */
    const STATUS_READY = 1;

    /**
     * Status: started(User not activated Recording or Streaming)
     */
    const STATUS_STARTED = 2;

    /**
     * Status: Running(Active Recording or Streaming sucessfully)
     */
    const STATUS_RUNNING = 3;

    /**
     * Status: Stopped(User stop Recording and Streaming)
     */
    const STATUS_STOPPED = 4;

    /**
     * Status: Failed(Camera faild)
     */
    const STATUS_FAILED = 5;

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
        'status', 'status_label', 'address', 'address_detail', 'lat', 'long',
        'user_id', 'camera_server_id', 'preset_view_id', 'preset_update_id', 'tourist_destination_id',
        'name', 'ip', 'port', 'user_name', 'password', 'video_source', 'is_recording', 'is_streaming', 'video_url'
    ];
    protected $appends = ['status_label'];
    protected $guard_name = 'api';
    protected $casts = [
        'status' => 'integer',
        'lat' => 'float',
        'long' => 'float',
    ];

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
    public function collection()
    {
        return $this->belongsToMany(Collection::class, 'camera_collection');
    }

    /**
     * Get general peroperties of camera
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function generalProperties()
    {
        return $this->hasOne(CameraGeneralProperties::class, 'camera_id');
    }

    /**
     * Get video peroperties of camera
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function videoProperties()
    {
        return $this->hasOne(CameraVideoProperties::class, 'camera_id');
    }

    /**
     * Get network peroperties of camera
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function networkProperties()
    {
        return $this->hasOne(CameraNetworkProperties::class, 'camera_id');
    }

    /**
     * Get ptz peroperties of camera
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function ptzProperties()
    {
        return $this->hasOne(CameraPtzProperties::class, 'camera_id');
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

    public static function publishRedis($camera, $chanel = '')
    {
        $data = [
            'camera_id' => $camera['uuid'] ?? '',
            'rtsp_url' => $camera['rtsp'] ?? '',
            'is_recording' => $camera['recording_status'] ?? '',
        ];
        return Redis::publish($chanel, json_encode($data));
    }

    /**
     * Get status camera
     *
     * @return type
     */
    public function getStatusLabelAttribute()
    {
        switch ($this->status) {
            case self::STATUS_READY:
                return trans('lang::messages.status.ready');
            case self::STATUS_STARTED:
                return trans('lang::messages.status.started');
            case self::STATUS_RUNNING:
                return trans('lang::messages.status.running');
            case self::STATUS_STOPPED:
                return trans('lang::messages.status.stopped');
            case self::STATUS_FAILED:
                return trans('lang::messages.status.failed');
            default:
                return trans('lang::messages.status.failed');
        }
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
