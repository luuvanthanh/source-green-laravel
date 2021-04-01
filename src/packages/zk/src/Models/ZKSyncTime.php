<?php

namespace ZK\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Support\Arr;

class ZKSyncTime extends UuidModel
{
    public $incrementing = false;

    protected $table = 'zk_device_sync_times';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'device_id', 'updated_at', 'zk_sync_id',
    ];
}
