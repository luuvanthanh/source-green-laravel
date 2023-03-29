<?php

namespace GGPHP\Crm\KnowledgeToTeachChildren\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class CategoryKnowledgeToTeachChildren extends UuidModel
{
    const CODE = 'DMTV';

    protected $table = 'category_knowledge_to_teach_childrens';

    protected $fillable = [
        'code', 'name', 'description'
    ];

    public function postKnowledgeToTeachChildren(){
        return $this->hasMany(PostKnowledgeToTeachChildren::class);
    }
}
