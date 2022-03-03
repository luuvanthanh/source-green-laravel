<?php

namespace GGPHP\Crm\CallCenter\Models;

use GGPHP\Crm\Employee\Models\Employee;
use Illuminate\Database\Eloquent\Model;

class EmployeeExtension extends Model
{
    protected $table = 'employee_extension';

    protected  $fillable = ['employee_id', 'extension_id'];

    public $timestamps = false;

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function extension()
    {
        return $this->belongsTo(Extension::class);
    }
}
