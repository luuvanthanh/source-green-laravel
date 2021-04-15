<?php

namespace GGPHP\Transfer\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Users\Models\User;

class TransferDetail extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'TransferDetails';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'transfer_id', 'EmployeeId', 'BranchId', 'DivisionId',
        'PositionId', 'Note',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function employee()
    {
        return $this->belongsTo(User::class, 'EmployeeId');
    }

    /**
     * Define relations position
     */
    public function position()
    {
        return $this->hasOne(\GGPHP\Category\Models\Position::class, 'Id', 'PositionId');
    }

    /**
     * Define relations division
     */
    public function division()
    {
        return $this->hasOne(\GGPHP\Category\Models\Division::class, 'Id', 'DivisionId');
    }
}
