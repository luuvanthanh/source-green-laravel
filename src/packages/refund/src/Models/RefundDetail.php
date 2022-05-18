<?php

namespace GGPHP\Refund\Models;

use GGPHP\Core\Models\UuidModel;

class RefundDetail extends UuidModel
{
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
}
