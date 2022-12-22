<?php

namespace GGPHP\Category\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;
use GGPHP\Fee\Models\ChargeOldStudent;
use GGPHP\Refund\Models\RefundStudent;
use Illuminate\Database\Eloquent\SoftDeletes;

class Branch extends UuidModel
{
    use ActivityLogTrait;
    use SoftDeletes;
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'Branches';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Code', 'Name', 'Address', 'PhoneNumber', 'BranchIdCrm'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    public function chargeOldStudent()
    {
        return $this->hasMany(ChargeOldStudent::class, 'BranchId');
    }

    public function refundStudent()
    {
        return $this->hasMany(RefundStudent::class, 'BranchId');
    }
}
