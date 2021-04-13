<?php

namespace GGPHP\Category\Models;

use GGPHP\Core\Models\UuidModel;

class TypeOfContract extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'type_of_contracts';

    protected $fillable = [
        'code', 'type', 'name', 'year', 'month',
    ];

    /**
     * Define relations parameterValues
     */
    public function parameterValues()
    {
        return $this->belongsToMany(\GGPHP\Category\Models\ParamaterValue::class, 'type_of_contract_parameter_value', 'type_of_contract_id', 'parameter_value_id');
    }

    /**
     * Define relations parameterFormulas
     */
    public function parameterFormulas()
    {
        return $this->belongsToMany(\GGPHP\Category\Models\ParamaterFormula::class, 'type_of_contract_parameter_formula', 'type_of_contract_id', 'parameter_formula_id');
    }
}
