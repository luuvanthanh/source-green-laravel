<?php

namespace GGPHP\Crm\CustomerPotentail\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class PotentailStudentInfo extends UuidModel
{
    use SoftDeletes;

    protected $table = 'potentail_student_infos';

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
        'customer_potentail_id', 'file_image', 'relationship'
    ];

    public function customerPotentail()
    {
        return $this->belongsTo(CustomerPotentail::class);
    }
}
