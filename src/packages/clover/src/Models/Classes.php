<?php

namespace GGPHP\Clover\Models;

use GGPHP\Core\Models\UuidModel;

class Classes extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'origination.Classes';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Code', 'Name', 'Year', 'BranchId', 'Description', 'ExtraProperties', 'ConcurrencyStamp',
        'CreatorId', 'LastModifierId', 'IsDeleted', 'DeleterId', 'DeletionTime', 'ClassTypeId',
    ];

    public function branch()
    {
        return $this->belongsTo(\GGPHP\Category\Models\Branch::class, 'BranchId');
    }

    public function teacher()
    {
        return $this->belongsToMany(\GGPHP\Users\Models\User::class, 'distribution.ClassTeachers', 'ClassId', 'EmployeeId');
    }

    public function classType()
    {
        return $this->belongsTo(\GGPHP\Fee\Models\ClassType::class, 'ClassTypeId');
    }
}
