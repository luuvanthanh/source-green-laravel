<?php

namespace GGPHP\Refund\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Fee\Models\Fee;

class RefundFee extends UuidModel
{
    public $timestamps = false;

    /**
     * Declare the table name
     */
    protected $table = 'fee.RefundFees';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['FeeId', 'StudentRefundDetailId', 'FeeRefund', 'FeePaid', 'FeeStudied'];

    public function studentRefundDetail()
    {
        return $this->belongsTo(StudentRefundDetail::class, 'StudentRefundDetailId');
    }

    public function fee()
    {
        return $this->belongsTo(Fee::class, 'FeeId');
    }
}
