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
    protected $table = 'transfers';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'decision_number', 'decision_date', 'reason',
    ];

    protected $dateTimeFields = [
        'decision_date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'decision_date' => 'datetime',
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
        return $this->hasMany(TransferDetail::class, 'transfer_id');
    }
}
