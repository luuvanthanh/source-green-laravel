<?php

namespace GGPHP\Clover\Models;

use GGPHP\Core\Models\UuidModel;

class Student extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'object.Students';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Source', 'ParentWish', 'ParentWith', 'FullName', 'Note', 'LaborNumber', 'Sex', 'DayOFBirth', 'Age', 'Address', 'Health', 'ClassId',
        'FartherId', 'MotherId', 'CreatorId', 'LastModifierId', 'ConcurrencyStamp', 'DeleterId', 'DeletionTime', 'ExtraProperties', 'IsDeleted',
        'CardNumber', 'Code', 'Comments', 'StudentId', 'RegisterDate', 'StartDate', 'Status', 'FileImage', 'City', 'District', 'Street', 'Ward',
    ];
}
