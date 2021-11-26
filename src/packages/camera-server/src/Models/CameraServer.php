<?php

namespace GGPHP\CameraServer\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class CameraServer extends UuidModel
{
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'ipv4', 'ipv6', 'nas_folder', 'status', 'user_id'
    ];

    protected $guard_name = 'api';

    /**
     * The storage format of the model's date columns.
     *
     * @var string
     */
    protected $dateTimeFormat = 'c';
}
