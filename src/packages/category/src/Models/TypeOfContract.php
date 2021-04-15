<?php

namespace GGPHP\Category\Models;

use GGPHP\Core\Models\UuidModel;

class TypeOfContract extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'TypeOfContracts';

    protected $fillable = [
        'Code', 'Type', 'Name', 'Year', 'Month',
    ];

    /**
     * Define relations parameterValues
     */
    public function parameterValues()
    {
        return $this->belongsToMany(\GGPHP\Category\Models\ParamaterValue::class, 'TypeOfContractParameteValue', 'TypeOfContractId', 'ParameterValueId');
    }

    /**
     * Define relations parameterFormulas
     */
    public function parameterFormulas()
    {
        return $this->belongsToMany(\GGPHP\Category\Models\ParamaterFormula::class, 'TypeOfContractParameterFormula', 'TypeOfContractId', 'ParameterFormulaId');
    }
}
