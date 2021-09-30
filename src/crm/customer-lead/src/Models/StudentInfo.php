<?php

namespace GGPHP\Crm\CustomerLead\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class StudentInfo extends UuidModel
{
    use SoftDeletes;

    protected $table = 'student_infos';

    const RELATIONSHIP = [
        'MOTHER' => 0,
        'FATHER' => 1,
    ];

    const SEX = [
        'FEMALE' => 0,
        'MALE' => 1,
        'OTHER' => 2,
    ];

    protected $fillable = [
        'full_name', 'birth_date', 'sex', 'month_age',
        'customer_lead_id', 'file_image', 'relationship'
    ];

    public function customerLead()
    {
        return $this->belongsTo(CustomerLead::class);
    }
}
