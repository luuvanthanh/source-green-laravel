<?php

namespace GGPHP\WorkDeclaration\Models;

use GGPHP\Core\Models\UuidModel;

class WorkDeclarationDetail extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'work_declaration_details';

    protected $fillable = ['work_declaration_id', 'model_id', 'model_type', 'reason', 'time', 'work_number', 'month', 'shift_id', 'work_date'];

    const MODEL = [
        "INVALID" => "GGPHP\WorkDeclaration\Models\WorkDeclaration",
        "REVOKESHIFT" => "GGPHP\Absent\Models\RevokeShift",
        "DEFAULT" => "Default",
    ];

    protected $dateTimeFields = [
        'date',
    ];

    protected $casts = [
        'date' => 'datetime',
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
        return $this->hasOne(\GGPHP\ShiftSchedule\Models\Shift::class, 'id', 'shift_id');
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
        return $this->workDeclaration->employee->timekeeping()->whereDate('attended_at', $this->date);
    }
}
