<?php

namespace GGPHP\Appoint\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Users\Models\User;

class AppointDetail extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'appoint_details';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'appoint_id', 'employee_id', 'branch_id', 'division_id',
        'position_id', 'note',
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
        return $this->belongsTo(User::class, 'employee_id');
    }

    /**
     * Define relations position
     */
    public function position()
    {
        return $this->hasOne(\GGPHP\Category\Models\Position::class, 'id', 'position_id');
    }

    /**
     * Define relations division
     */
    public function division()
    {
        return $this->hasOne(\GGPHP\Category\Models\Division::class, 'id', 'division_id');
    }

    /**
     * Define relations division
     */
    public function branch()
    {
        return $this->hasOne(\GGPHP\Category\Models\Branch::class, 'id', 'branch_id');
    }
}
