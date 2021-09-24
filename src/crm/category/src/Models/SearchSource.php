<?php

namespace GGPHP\Crm\Category\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class SearchSource extends UuidModel
{
    use SoftDeletes;

    const CODE = 'N';

    protected $table = 'search_sources';

    protected $fillable = ['code', 'name'];
}
