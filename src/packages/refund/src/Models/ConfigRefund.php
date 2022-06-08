<?php

namespace GGPHP\Refund\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Fee\Models\SchoolYear;

class ConfigRefund extends UuidModel
{
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
