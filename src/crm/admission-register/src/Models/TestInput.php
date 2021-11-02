<?php

namespace GGPHP\Crm\AdmissionRegister\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\Employee\Models\Employee;

class TestInput extends UuidModel
{
    protected $table = 'test_inputs';

    protected $fillable = [
        'employee_id', 'date_interview', 'time_interview', 'teacher_comment', 'headmaster_comment'
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
