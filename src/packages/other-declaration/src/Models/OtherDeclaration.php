<?php

namespace GGPHP\OtherDeclaration\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;

class OtherDeclaration extends UuidModel
{
    //use ActivityLogTrait;
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'OtherDeclarations';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'NumberOfWorkdays', 'Time', 'IsDiseaseSalary', 'StartDate', 'EndDate'
    ];

    /**
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function otherDeclarationDetail()
    {
        return $this->hasMany(\GGPHP\OtherDeclaration\Models\OtherDeclarationDetail::class, 'OtherDeclarationId');
    }

    /**
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function changeContractParameter()
    {
        return $this->hasMany(\GGPHP\OtherDeclaration\Models\ChangeContractParameter::class, 'OtherDeclarationId');
    }
}
