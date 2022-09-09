<?php

namespace GGPHP\Crm\Fee\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class SchoolYear extends UuidModel
{
    use SoftDeletes;

    protected $table = 'school_years';

    protected $fillable = [
        'year_from', 'year_to', 'start_date', 'end_date', 'school_year_clover_id', 'total_month', 'is_check', 'content'
    ];
}
