<?php

namespace GGPHP\Refund\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;
use GGPHP\Fee\Models\Fee;

class RefundDetail extends UuidModel
{
    //use ActivityLogTrait;
    /**
     * Declare the table name
     */
    protected $table = 'fee.RefundDetails';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'RefundId', 'FeeId', 'StartDate', 'EndDate'
    ];

    public function configRefund()
    {
        return $this->hasMany(ConfigRefund::class, 'RefundDetailId');
    }

    public function fee()
    {
        return $this->belongsTo(Fee::class, 'FeeId');
    }
}
