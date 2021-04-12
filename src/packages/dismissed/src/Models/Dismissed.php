<?php

namespace GGPHP\Dismissed\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Dismissed\Models\DismissedDetail;
use GGPHP\Users\Models\User;

class Dismissed extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'dismisseds';

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
     * Get educations of user
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function dismissedDetails()
    {
        return $this->hasMany(DismissedDetail::class, 'dismissed_id');
    }

}
