<?php

namespace GGPHP\WorkDeclaration\Models;

use GGPHP\Core\Models\UuidModel;

class WorkDeclarationDetail extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'WorkDeclarationDetails';

    protected $fillable = ['WorkDeclarationId', 'ModelId', 'ModelType', 'Reason', 'Time', 'WorkNumber', 'Month', 'ShiftId', 'WorkDate'];

    const MODEL = [
        "INVALID" => "GGPHP\WorkDeclaration\Models\WorkDeclaration",
        "REVOKESHIFT" => "GGPHP\RevokeShift\Models\RevokeShift",
        "DEFAULT" => "Default",
    ];

    protected $dateTimeFields = [
        'WorkDate',
    ];

    protected $casts = [
        'WorkDate' => 'datetime',
    ];

    /**
     * Get models that the modification belongs to.
     *
     * @return \Illuminate\Database\Eloquent\Relations\MorphTo
     */
    public function model()
    {
        return $this->morphTo();
    }

    /**
     * Define relations shift
     */
    public function shift()
    {
        return $this->hasOne(\GGPHP\ShiftSchedule\Models\Shift::class, 'Id', 'ShiftId');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function workDeclaration()
    {
        return $this->belongsTo(WorkDeclaration::class);
    }

    /**
     * @return mixed
     */
    public function timekeeping()
    {
        return $this->workDeclaration->employee->timekeeping()->whereDate('AttendedAt', $this->date);
    }
}
