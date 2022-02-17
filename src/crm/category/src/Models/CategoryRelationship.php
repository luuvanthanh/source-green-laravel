<?php

namespace GGPHP\Crm\Category\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\CustomerLead\Models\StudentInfo;
use Illuminate\Database\Eloquent\SoftDeletes;

class CategoryRelationship extends UuidModel
{
    use SoftDeletes;

    const CODE = 'MQH';

    protected $table = 'category_relationships';

    protected $fillable = [
        'code', 'name'
    ];

    public function studentInfo()
    {
        return $this->hasMany(StudentInfo::class);
    }
}
