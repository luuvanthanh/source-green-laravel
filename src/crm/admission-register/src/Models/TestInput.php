<?php

namespace GGPHP\Crm\AdmissionRegister\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\Category\Models\Branch;
use GGPHP\Crm\Employee\Models\Employee;
use GGPHP\Crm\Fee\Models\ClassType;

class TestInput extends UuidModel
{
    protected $table = 'test_inputs';

    protected $fillable = [
        'employee_id', 'date_interview', 'time_interview',
        'strength', 'encourage', 'admission_register_id', 'status', 'type', 'class_type_id', 'approval_status', 'branch_id', 'time_age'
    ];

    const STATUS = [
        'UNTESTING' => 0,
        'TESTING' => 1,
        'FINISH' => 2,
        'CANCEL' => 3,
    ];

    const TYPE_TEST_INPUT = 1;

    const APPROVAL_STATUS = [
        'UNSENT' => 0,
        'UNQUALIFIED' => 1,
        'APPROVED' => 2,
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }

    public function admissionRegister()
    {
        return $this->belongsTo(AdmissionRegister::class, 'admission_register_id');
    }

    public function testInputDetail()
    {
        return $this->hasMany(TestInputDetail::class, 'test_input_id')->orderBy('created_at', 'DESC');
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class, 'branch_id');
    }

    public function classType()
    {
        return $this->belongsTo(ClassType::class, 'class_type_id');
    }
}
