<?php

namespace GGPHP\CameraServer\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class CameraServer extends UuidModel
{
    use SoftDeletes;

    const STATUS = [
        'NOT_ACTIVATED' => 0,
        'CONNECTING' => 1,
        'CONNECTION' => 2,
        'DISABLE' => 3,
        'DISCONNECT' => 4,
        'LOCK' => 5,
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'ipv4', 'ipv6', 'nas_folder', 'status', 'user_id', 'uuid',
        'root_path_bk', 'second_interval_bk', 'media_server_url', 'clip_root_path',
        'log_root_path', 'log_level'
    ];

    /**
     * The storage format of the model's date columns.
     *
     * @var string
     */
    protected $dateTimeFormat = 'c';

    public function camera()
    {
        return $this->hasMany(\GGPHP\Camera\Models\Camera::class);
    }
}
