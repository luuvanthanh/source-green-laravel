<?php

namespace GGPHP\Crm\Fee\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\Category\Models\Branch;
use Illuminate\Database\Eloquent\SoftDeletes;

class FeePolicie extends UuidModel
{
    use SoftDeletes;

    protected $table = 'fee_policies';

    protected $fillable = [
        'decision_date', 'decision_number', 'school_year_id', 'fee_policie_clover_id', 'branch_id'
    ];

    public function schoolYear()
    {
        return $this->belongsTo(SchoolYear::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}
