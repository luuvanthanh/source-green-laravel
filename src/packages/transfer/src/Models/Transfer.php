<?php

namespace GGPHP\Transfer\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Transfer\Models\TransferDetail;

class Transfer extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'Transfers';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'DecisionNumber', 'DecisionDate', 'Reason', 'FileImage',
    ];

    protected $dateTimeFields = [
        'DecisionDate',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'DecisionDate' => 'datetime',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    /**
     * Get educations of employee
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function transferDetails()
    {
        return $this->hasMany(TransferDetail::class, 'TransferId');
    }
}
