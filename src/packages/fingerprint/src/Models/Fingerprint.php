<?php

namespace GGPHP\Fingerprint\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;
use ZK\Traits\SyncToDevice;

class Fingerprint extends UuidModel
{
    public $incrementing = false;

    use SoftDeletes, SyncToDevice;

    const ON = 'ON';
    const OFF = 'OFF';
    /**
     * Declare the table name
     */
    protected $table = 'Fingerprints';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'EmployeeId', 'Finger', 'Size', 'Valid', 'FingerIndex', 'Status', 'DeviceId',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    /**
     * Define relations store
     */
    public function employee()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class, 'EmployeeId');
    }
}
