<?php

namespace GGPHP\Crm\CustomerPotential\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\Category\Models\CategoryRelationship;
use Illuminate\Database\Eloquent\SoftDeletes;

class PotentialStudentInfo extends UuidModel
{
    use SoftDeletes;

    protected $table = 'potential_student_infos';

    const SEX = [
        'FEMALE' => 0,
        'MALE' => 1,
        'OTHER' => 2,
    ];

    protected $fillable = [
        'full_name', 'birth_date', 'sex',
        'customer_potential_id', 'file_image', 'category_relationship_id'
    ];

    public function customerPotential()
    {
        return $this->belongsTo(CustomerPotential::class);
    }

    public function categoryRelationship()
    {
        return $this->belongsTo(CategoryRelationship::class, 'category_relationship_id');
    }
}
