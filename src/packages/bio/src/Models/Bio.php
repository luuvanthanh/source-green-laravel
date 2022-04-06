<?php

namespace GGPHP\Bio\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;
use ZK\Traits\SyncToDevice;

class Bio extends UuidModel
{
    use SyncToDevice, SoftDeletes;

    /**
     * Declare the table name
     */
    protected $table = 'Bios';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'EmployeeId', 'Pin', 'No', 'Index', 'Valid', 'Duress', 'Type', 'MajorVer',
        'MinorVer', 'Format', 'Tmp'
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
}
