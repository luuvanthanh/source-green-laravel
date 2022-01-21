<?php

namespace GGPHP\Crm\AdmissionRegister\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\Employee\Models\Employee;

class TestInput extends UuidModel
{
    protected $table = 'test_inputs';

    protected $fillable = [
        'employee_id', 'date_interview', 'time_interview',
        'teacher_comment', 'headmaster_comment', 'admission_register_id', 'status', 'type'
    ];

    const STATUS = [
        'UNTESTING' => 0,
        'TESTING' => 1,
        'FINISH' => 2,
        'CANCEL' => 3,
    ];

    const TYPE_TEST_INPUT = 0;

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function AdmissionRegister()
    {
        return $this->belongsTo(AdmissionRegister::class);
    }

    public function testInputDetail()
    {
        return $this->hasMany(TestInputDetail::class, 'test_input_id');
    }
}
