<?php

namespace GGPHP\Camera\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Collection\Models\Collection;
use GGPHP\CameraServer\Models\CameraServer;
use GGPHP\VideoWall\Models\VideoWall;
use Illuminate\Support\Facades\Redis;
use Illuminate\Database\Eloquent\SoftDeletes;

class Camera extends UuidModel
{
    use SoftDeletes;

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
    const LAT_DEFAULT = "0.00000000";

    /**
     * Define longitude default if camera do not have input: 0.00000000
     */
    const LONG_DEFAULT = "0.00000000";

    public static $fillable_post = [
        'address',
        'address_detail',
        'lat',
        'long',
        'camera_server_id'
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'status',
        'status_label',
        'address',
        'address_detail',
        'lat',
        'long',
        'user_id',
        'camera_server_id',
        'preset_view_id',
        'preset_update_id',
        'created_at',
        'updated_at',
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
        return $this->belongsToMany(VideoWall::class, 'camera_video_wall')->withPivot('priority');
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

    /**
     * Add scope filter camera by request params
     *
     * @param type $query
     * @param type $request
     * @return type
     */
    public function scopeByFilter($query, $request)
    {
        $keyword = $request->get('keyword', '');
        $status = $request->get('status', '');

        // Filter camera by collection
        if ($request->has('collection_id')) {
            $collectionId = $request->collection_id;
            $query->whereHas('collection', function ($query) use ($collectionId) {
                return $query->where('collection_id', $collectionId);
            });
        }

        if ($request->has('except_collection_id')) {
            $collectionId = $request->except_collection_id;
            $query->whereHas('collection', function ($query) use ($collectionId) {
                return $query->where('collection_id', '=', $collectionId);
            }, '=', 0);
        }

        // Filter camera by video wall
        if ($request->has('video_wall_id')) {
            $videoWallId = $request->video_wall_id;
            $query->whereHas('videoWalls', function ($query) use ($videoWallId) {
                return $query->where('video_wall_id', $videoWallId);
            });
        }

        if ($request->has('except_video_wall_id')) {
            $videoWallId = $request->except_video_wall_id;
            $query->whereHas('videoWalls', function ($q) use ($videoWallId) {
                return $q->where('video_wall_id', '=', $videoWallId);
            }, '=', 0);
        }

        // Filter by camera device name/number
        if (!empty($keyword)) {
            $query->where(function ($query) use ($keyword) {
                return $query->where('address', 'LIKE', "%$keyword%")
                    ->orWhere(function ($query) use ($keyword) {
                        $query->whereHas('generalProperties', function ($query) use ($keyword) {
                            return $query->where('device_name', 'LIKE', "%$keyword%")
                                ->orWhere('device_number', 'LIKE', "%$keyword%");
                        });
                    });
            });
        }

        if (!empty($status)) {
            switch ($status) {
                case self::STATUS_READY:
                case self::STATUS_STARTED:
                case self::STATUS_RUNNING:
                    $status = [self::STATUS_READY, self::STATUS_STARTED, self::STATUS_RUNNING];
                    break;
                case self::STATUS_STOPPED:
                case self::STATUS_FAILED:
                    $status = [self::STATUS_STOPPED, self::STATUS_FAILED];
                    break;
            }

            $query->whereIn('status', $status);
        }

        return $query;
    }
}
