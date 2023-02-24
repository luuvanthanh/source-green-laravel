<?php

namespace GGPHP\Clover\Models;

use GGPHP\ActivityLog\Traits\ActivityLogTrait;
use GGPHP\Core\Models\UuidModel;

class Parents extends UuidModel
{
    //use ActivityLogTrait;
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'object.Parents';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'EmployeeId', 'Code', 'FullName', 'Sex', 'DayOfBirth', 'Address', 'Phone', 'AnotherPhone', 'Email', 'Zalo', 'FaceBook',
        'Instagram', 'Hobby', 'Referent', 'Status', 'JobTile', 'FileImage', 'ExtraProperties', 'ConcurrencyStamp',
        'CreatorId', 'LastModifierId', 'IsDeleted', 'DeleterId', 'DeletionTime', 'City', 'District', 'Street', 'Ward', 'Source',
    ];

    public function account()
    {
        return $this->hasOne(\GGPHP\Clover\Models\ParentAccount::class, 'ParentId');
    }
}
