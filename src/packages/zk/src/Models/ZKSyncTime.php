<?php

namespace ZK\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;
use Illuminate\Support\Arr;

class ZKSyncTime extends UuidModel
{
    use ActivityLogTrait;
    public $incrementing = false;

    protected $table = 'ZkDeviceSyncTimes';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'DeviceId', 'ZkSyncId',
    ];
}
