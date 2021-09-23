<?php

namespace GGPHP\Crm\Category\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class ParentLead extends UuidModel
{
    use SoftDeletes;

    protected $table = 'parent_leads';

    protected $fillable = ['code', 'name'];
}
