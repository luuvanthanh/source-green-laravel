<?php

namespace GGPHP\MagneticCard\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;
use ZK\Traits\SyncToDevice;

class MagneticCard extends UuidModel
{
    use SyncToDevice, SoftDeletes;

    /**
     * Declare the table name
     */
    protected $table = 'MagneticCards';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'EmployeeId', 'MagneticCard', 'MagneticCardPatch', 'MagneticCardToken', 'Status', 'DeviceId', 'Card', 'TimekeepingStatus',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    /**
     * Define relations employee
     */
    public function employee()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class, 'EmployeeId');
    }

    public function getCardNumberAttribute()
    {
        return '{$this->MagneticCard}{$this->MagneticCardPatch}';
    }
}
