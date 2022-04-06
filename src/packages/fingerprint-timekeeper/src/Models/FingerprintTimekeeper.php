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
    protected $table = 'FingerprintTimekeepers';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Name', 'SerialNumber', 'Ip', 'Port', 'Status', 'IsBio'
    ];

    protected $casts = [
        'IsBio' => 'boolean'
    ];

    /**
     * Define relations store
     */
    public function syncTime()
    {
        return $this->hasOne(\ZK\Models\ZKSyncTime::class, 'DeviceId');
    }
}
