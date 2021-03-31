<?php

namespace GGPHP\LateEarly\Models;

use GGPHP\Core\Models\CoreModel;
use GGPHP\LateEarly\Presenters\LateEarlyPresenter;
use GGPHP\RolePermission\Models\Store;
use GGPHP\Users\Models\User;

class LateEarly extends CoreModel
{

    const LATE = 'LATE';
    const EARLY = 'EARLY';

    /**
     * Status LateEarly
     */
    const PENDING = 'PENDING';
    const APPROVED = 'APPROVED';
    const DECLINED = 'DECLINED';
    const CANCELED = 'CANCELED';
    const AUTOMATIC_APPROVE = 'AUTOMATIC_APPROVE';
    const INVALID = 'INVALID';

    protected $fillable = ['time_config_type', 'time', 'date', 'status', 'user_id', 'store_id', 'approval_id',
        'time_shift', 'shift_code', 'time_slot', 'status_work_declaration', 'time_violation', 'work_store',
    ];

    protected $presenter = LateEarlyPresenter::class;

    protected $dateTimeFields = [
        'date',
    ];

    protected $casts = [
        'date' => 'datetime',
    ];
    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function approve()
    {
        return $this->belongsTo(User::class, 'approval_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function lateEarlyConfig()
    {
        return $this->belongsTo(LateEarlyTimeConfig::class, 'time_config_type');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function store()
    {
        return $this->belongsTo(Store::class, 'store_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function workStore()
    {
        return $this->belongsTo(Store::class, 'work_store');
    }

    /**
     * @return mixed
     */
    public function timekeeping()
    {
        return $this->user->timekeeping()->whereDate('attended_at', $this->date);
    }

    /**
     * Get type attribute
     */
    public function getTypeAttribute()
    {
        return $this->lateEarlyConfig->type;
    }

    /**
     * Return approval requests relations via moprhMany.
     *
     * @return \Illuminate\Database\Eloquent\Relations\MorphMany
     */
    public function workDeclarationDetail()
    {
        return $this->morphOne(\GGPHP\LateEarly\Models\WorkDeclarationDetail::class, 'model');

    }
}
