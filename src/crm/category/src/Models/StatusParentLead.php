<?php

namespace GGPHP\Crm\Category\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class StatusParentLead extends UuidModel
{
    use SoftDeletes;

    const CODE = 'TTL';

    protected $table = 'status_parent_leads';

    protected $fillable = ['code', 'name'];
}
