<?php

namespace GGPHP\VideoWall\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Users\Models\User;
use GGPHP\Camera\Models\Camera;

class VideoWall extends UuidModel
{
    /**
     * Display type: 2x2
     */
    const TYPE_2X2 = 1;

    /**
     * Display type: 3X3
     */
    const TYPE_3X3 = 2;

    /**
     * Display type: 4X4
     */
    const TYPE_4X4 = 3;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'display_type', 'user_id'];

    protected $guard_name = 'api';

    /**
     * The storage format of the model's date columns.
     *
     * @var string
     */
    protected $dateTimeFormat = 'c';

    /**
     * Get the user that owns the Video Wall.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get cameras of video wall
     *
     * @return \Illuminate\Database\Eloquent\Relations\belongsToMany
     */
    public function cameras()
    {
        return $this->belongsToMany(Camera::class, 'camera_video_wall', 'video_wall_id', 'camera_id')
            ->withPivot('priority')
            ->orderBy('camera_video_wall.priority');
    }
}
