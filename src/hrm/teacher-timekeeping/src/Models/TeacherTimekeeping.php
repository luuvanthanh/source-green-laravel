<?php

namespace GGPHP\TeacherTimekeeping\Models;

use GGPHP\Category\Models\Branch;
use GGPHP\Clover\Models\Classes;
use GGPHP\Clover\Models\ClassProjectSession;
use GGPHP\Clover\Models\Item;
use GGPHP\Core\Models\UuidModel;
use GGPHP\FingerprintTimekeeper\Models\FingerprintTimekeeper;
use GGPHP\Users\Models\User;

class TeacherTimekeeping extends UuidModel
{
    public $incrementing = false;

    protected $table = 'TeacherTimekeepings';

    const STATUS = [
        'START' => 1,
        'DOING' => 2,
        'FINISH' => 3
    ];

    const TYPE = [
        'MANUAL' => 1,
        'FINGERPRINT' => 2,
        'CARD' => 3,
        'PHONE' => 4
    ];

    const ACCOUNTANT_TYPE = [
        'PROGRAM' => 'PROGRAM',
        'MODULE' => 'MODULE',
        'PROJECT' => 'PROJECT'
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'EmployeeId', 'Status', 'Type', 'AttendedAt', 'StartTime', 'EndTime', 'TotalHourWorked', 'OverTimeHour',
        'BranchId', 'ClassId', 'ClassProjectSessionId', 'ProductId', 'ModuleId', 'ProjectId'
    ];

    protected $dateTimeFields = [
        'AttendedAt',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'AttendedAt' => 'datetime',
    ];

    /**
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function employee()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Item::class, 'ProductId', 'Id')->where('Type', self::ACCOUNTANT_TYPE['PROGRAM']);
    }

    public function module()
    {
        return $this->belongsTo(Item::class, 'ModuleId', 'Id')->where('Type', self::ACCOUNTANT_TYPE['MODULE']);
    }

    public function project()
    {
        return $this->belongsTo(Item::class, 'ProjectId', 'Id')->where('Type', self::ACCOUNTANT_TYPE['PROJECT']);
    }

    public function classes()
    {
        return $this->belongsTo(Classes::class, 'ClassId', 'Id');
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class, 'BranchId', 'Id');
    }

    public function classProjectSession()
    {
        return $this->belongsTo(ClassProjectSession::class, 'ClassProjectSessionId', 'Id');
    }
}
