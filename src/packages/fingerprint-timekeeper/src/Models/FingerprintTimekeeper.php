<?php

namespace GGPHP\FingerprintTimekeeper\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\Model;

/**
 * Class FingerprintTimekeeper.
 *
 * @package namespace GGPHP\FingerprintTimekeeper\Models;
 */
class FingerprintTimekeeper extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'fingerprint_timekeepers';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'serial_number', 'ip', 'port', 'status',
    ];

    /**
     * Define relations store
     */
    public function syncTime()
    {
        return $this->hasOne(\ZK\Models\ZKSyncTime::class, 'device_id');
    }
}
