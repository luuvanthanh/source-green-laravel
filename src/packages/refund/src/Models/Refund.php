<?php

namespace GGPHP\Refund\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;
use GGPHP\Fee\Models\SchoolYear;

class Refund extends UuidModel
{
    use ActivityLogTrait;
    /**
     * Declare the table name
     */
    protected $table = 'fee.Refunds';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['SchoolYearId'];

    public function refundDetail()
    {
        return $this->hasMany(RefundDetail::class, 'RefundId');
    }

    public function schoolYear()
    {
        return $this->belongsTo(SchoolYear::class, 'SchoolYearId');
    }
}
