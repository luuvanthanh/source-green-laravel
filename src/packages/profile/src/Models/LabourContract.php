<?php

namespace GGPHP\Profile\Models;

use GGPHP\Core\Models\UuidModel;

class LabourContract extends UuidModel
{
    public $incrementing = false;

    protected $table = 'labour_contracts';

    protected $fillable = [
        'contract_number', 'contract_date', 'type_of_contract_id', 'employee_id', 'year',
        'month', 'division_id', 'contract_from', 'contract_to', 'position_id', 'work',
        'work_time', 'branch_id',
    ];

    protected $dateTimeFields = [
        'contract_date',
        'contract_from',
        'contract_to',
    ];

    protected $casts = [
        'contract_date' => 'datetime',
        'contract_from' => 'datetime',
        'contract_to' => 'datetime',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function employee()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class, 'employee_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function typeOfContract()
    {
        return $this->belongsTo(\GGPHP\Category\Models\TypeOfContract::class, 'type_of_contract_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function division()
    {
        return $this->belongsTo(\GGPHP\Category\Models\Division::class, 'division_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function position()
    {
        return $this->belongsTo(\GGPHP\Category\Models\Position::class, 'position_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function branch()
    {
        return $this->belongsTo(\GGPHP\Category\Models\Branch::class, 'branch_id');
    }

    /**
     * Define relations user
     */
    public function parameterValues()
    {
        return $this->belongsToMany(\GGPHP\Category\Models\ParamaterValue::class, 'labour_contract_parameter_value', 'labour_contract_id', 'parameter_value_id')->withPivot('value');
    }
}
