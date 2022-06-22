<?php

namespace GGPHP\Refund\Models;

use GGPHP\Clover\Models\Student;
use GGPHP\Core\Models\UuidModel;

class StudentRefundDetail extends UuidModel
{
    public $timestamps = false;

    /**
     * Declare the table name
     */
    protected $table = 'fee.StudentRefundDetails';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['RefundStudentId', 'StudentId', 'DateOff', 'NumberDayOff'];

    public function refundStudent()
    {
        return $this->belongsTo(RefundStudent::class, 'RefundStudentId');
    }

    public function refundFee()
    {
        return $this->hasMany(RefundFee::class, 'StudentRefundDetailId');
    }

    public function student()
    {
        return $this->belongsTo(Student::class, 'StudentId');
    }
}
