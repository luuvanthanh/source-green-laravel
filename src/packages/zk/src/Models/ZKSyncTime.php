<?php

namespace ZK\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Arr;

class ZKSyncTime extends Model
{
    protected $table = 'zk_device_sync_times';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'device_id', 'updated_at', 'zk_sync_id'
    ];
}
