<?php

namespace GGPHP\Crm\Marketing\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class DataMarketingStudentInfo extends UuidModel
{
    use SoftDeletes;

    protected $table = 'data_marketing_student_infos';

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
        'data_marketing_id', 'file_image', 'relationship'
    ];

}
