<?php

namespace GGPHP\Profile\Models;

use GGPHP\Core\Models\UuidModel;

class LabourContract extends UuidModel
{
    public $incrementing = false;

    protected $table = 'LabourContracts';

    protected $fillable = [
        'ContractNumber', 'ContractDate', 'TypeOfContractId', 'EmployeeId', 'Year',
        'Month', 'DivisionId', 'ContractFrom', 'ContractTo', 'PositionId', 'Work',
        'WorkTime', 'BranchId', 'TotalAllowance', 'BasicSalary', 'IsSocialInsurance', 'IsEffect',
        'RepresentId', 'OrdinalNumber', 'NumberForm'
    ];

    protected $dateTimeFields = [
        'ContractDate',
        'ContractFrom',
        'ContractTo',
    ];

    protected $casts = [
        'ContractDate' => 'datetime',
        'ContractFrom' => 'datetime',
        'ContractTo' => 'datetime',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function employee()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class, 'EmployeeId');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function typeOfContract()
    {
        return $this->belongsTo(\GGPHP\Category\Models\TypeOfContract::class, 'TypeOfContractId');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function division()
    {
        return $this->belongsTo(\GGPHP\Category\Models\Division::class, 'DivisionId');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function position()
    {
        return $this->belongsTo(\GGPHP\Category\Models\Position::class, 'PositionId');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function branch()
    {
        return $this->belongsTo(\GGPHP\Category\Models\Branch::class, 'BranchId');
    }

    /**
     * Define relations employee
     */
    public function parameterValues()
    {
        return $this->belongsToMany(\GGPHP\Category\Models\ParamaterValue::class, 'LabourContractParameterValue', 'LabourContractId', 'ParameterValueId')->withPivot('Value');
    }

    /**
     * Define relations upload file
     */
    public function positionLevel()
    {
        return $this->morphOne('GGPHP\PositionLevel\Models\PositionLevel', 'positionLevelTable', 'ModelType', 'ModelId');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function represent()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class, 'RepresentId');
    }
}
