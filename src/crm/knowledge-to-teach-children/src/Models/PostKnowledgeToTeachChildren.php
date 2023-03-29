<?php

namespace GGPHP\Crm\KnowledgeToTeachChildren\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\Clover\Models\EmployeeHrm;
use GGPHP\Crm\Employee\Models\Employee;
use Illuminate\Database\Eloquent\SoftDeletes;

class PostKnowledgeToTeachChildren extends UuidModel
{
    const STATUS = [
        'POSTED' => 1,
        'DRAFT' => 2
    ];

    protected $table = 'post_knowledge_to_teach_childrens';

    protected $fillable = [
        'name',
        'category_knowledge_to_teach_children_id',
        'image',
        'content',
        'status',
        'employee_id',
    ];


    public function categoryKnowledgeToTeachChildren()
    {
        return $this->belongsTo(CategoryKnowledgeToTeachChildren::class);
    }
}
