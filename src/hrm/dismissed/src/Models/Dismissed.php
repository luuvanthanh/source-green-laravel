<?php

namespace GGPHP\Dismissed\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Dismissed\Models\DismissedDetail;

class Dismissed extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'Dismisseds';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'DecisionNumber', 'DecisionDate', 'Reason', 'FileImage', 'TimeApply',
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
        'TimeApply' => 'datetime',
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
    public function dismissedDetails()
    {
        return $this->hasMany(DismissedDetail::class, 'DismissedId');
    }
}
