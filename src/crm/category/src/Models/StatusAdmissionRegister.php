<?php

namespace GGPHP\Crm\Category\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class StatusAdmissionRegister extends UuidModel
{
    use SoftDeletes;

    const CODE = 'TTY';

    protected $table = 'status_admission_registers';

    protected $fillable = ['code', 'name'];

    public function admissionRegister()
    {
        return $this->hasMany(AdmissionRegister::class);
    }
}
