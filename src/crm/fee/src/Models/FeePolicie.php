<?php

namespace GGPHP\Crm\Fee\Models;

use GGPHP\Core\Models\UuidModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class FeePolicie extends UuidModel
{
    use SoftDeletes;

    protected $table = 'fee_policies';

    protected $fillable = [
        'decision_date', 'decision_number', 'school_year_id', 'fee_policie_clover_id'
    ];
}
