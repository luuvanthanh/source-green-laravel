<?php

namespace GGPHP\Crm\CustomerLead\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class StudentInfo extends UuidModel
{
    use SoftDeletes;

    protected $table = 'student_infos';

    protected $fillable = [
        'full_name', 'birth_date', 'sex', 'month_age',
        'customer_lead_id', 'file_image', 'relationship'
    ];

    public function customerLead()
    {
        return $this->belongsTo(CustomerLead::class);
    }
}
