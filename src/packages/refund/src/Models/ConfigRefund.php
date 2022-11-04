<?php

namespace GGPHP\Refund\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;
use GGPHP\Fee\Models\SchoolYear;

class ConfigRefund extends UuidModel
{
    use ActivityLogTrait;
    /**
     * Declare the table name
     */
    protected $table = 'fee.ConfigRefunds';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['RefundDetailId', 'RefundForm', 'Type'];

    public function refundDetail()
    {
        return $this->belongsTo(refundDetail::class, 'ReundDetailId');
    }
}
