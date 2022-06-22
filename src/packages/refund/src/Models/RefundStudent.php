<?php

namespace GGPHP\Refund\Models;

use GGPHP\Category\Models\Branch;
use GGPHP\Core\Models\UuidModel;

class RefundStudent extends UuidModel
{
    /**
     * Declare the table name
     */
    protected $table = 'fee.RefundStudents';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['Month', 'Type', 'RefundId', 'BranchId'];

    public function refund()
    {
        return $this->belongsTo(Refund::class, 'RefundId');
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class, 'BranchId');
    }

    public function studentRefundDetail()
    {
        return $this->hasMany(StudentRefundDetail::class, 'RefundStudentId');
    }
}
