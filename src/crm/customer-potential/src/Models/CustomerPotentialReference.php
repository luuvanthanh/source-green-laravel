<?php

namespace GGPHP\Crm\CustomerPotential\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Crm\Category\Models\StatusParentPotential;
use Illuminate\Database\Eloquent\SoftDeletes;

class CustomerPotentialReference extends UuidModel
{
    use SoftDeletes;

    protected $table = 'customer_potential_references';

    protected $fillable = [
        'full_name', 'birth_date', 'address', 'phone',
        'status_parent_potential_id', 'customer_potential_id'
    ];

    public function customerPotential()
    {
        return $this->belongsTo(CustomerPotential::class);
    }

    public function StatusParentPotential()
    {
        return $this->belongsTo(StatusParentPotential::class);
    }
}
