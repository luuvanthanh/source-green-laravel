<?php

namespace GGPHP\Category\Models;

use GGPHP\Core\Models\UuidModel;

class TypeOfContract extends UuidModel
{
    public $incrementing = false;

    const HOP_DONG = 'HOP_DONG';
    const THU_VIEC = 'THU_VIEC';
    const THOI_VU = 'THOI_VU';
    /**
     * Declare the table name
     */
    protected $table = 'TypeOfContracts';

    protected $fillable = [
        'Code', 'Type', 'Name', 'Year', 'Month', 'IsUnlimited'
    ];

    /**
     * Define relations parameterValues
     */
    public function parameterValues()
    {
        return $this->belongsToMany(\GGPHP\Category\Models\ParamaterValue::class, 'TypeOfContractParameterValue', 'TypeOfContractId', 'ParameterValueId');
    }

    /**
     * Define relations parameterFormulas
     */
    public function parameterFormulas()
    {
        return $this->belongsToMany(\GGPHP\Category\Models\ParamaterFormula::class, 'TypeOfContractParameterFormula', 'TypeOfContractId', 'ParameterFormulaId');
    }
}
