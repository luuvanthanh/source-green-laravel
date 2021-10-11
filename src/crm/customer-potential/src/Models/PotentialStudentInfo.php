<?php

namespace GGPHP\Crm\CustomerPotential\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class PotentialStudentInfo extends UuidModel
{
    use SoftDeletes;

    protected $table = 'potential_student_infos';

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
        'customer_potential_id', 'file_image', 'relationship'
    ];

    public function customerPotential()
    {
        return $this->belongsTo(CustomerPotential::class);
    }
}
