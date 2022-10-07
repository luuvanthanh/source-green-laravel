<?php

namespace GGPHP\Profile\Models;

use GGPHP\Core\Models\UuidModel;

class SeasonalContract extends UuidModel
{
    protected $table = 'SeasonalContracts';

    protected $fillable = [
        'ContractNumber', 'TypeOfContractId', 'EmployeeId',
        'Month', 'Date', 'DivisionId', 'PositionId',
        'WorkDetail', 'WorkTime', 'NameProject', 'JoinSocialInsurance', 'Project',
        'BranchId', 'ContractDate', 'ContractFrom', 'ContractTo', 'RepresentId',
        'OrdinalNumber', 'NumberForm'
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

    public function parameterValues()
    {
        return $this->belongsToMany(\GGPHP\Category\Models\ParamaterValue::class, 'SeasonalContractParameterValue', 'SeasonalContractId', 'ParameterValueId')->withPivot('Value');
    }

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
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function represent()
    {
        return $this->belongsTo(\GGPHP\Users\Models\User::class, 'RepresentId');
    }
}
