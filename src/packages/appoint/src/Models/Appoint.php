<?php

namespace GGPHP\Appoint\Models;

use GGPHP\Appoint\Models\AppointDetail;
use GGPHP\Core\Models\UuidModel;

class Appoint extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'Appoints';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'DecisionNumber', 'DecisionDate', 'Reason',
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
    public function appointDetails()
    {
        return $this->hasMany(AppointDetail::class, 'AppointId');
    }

}
