<?php

namespace GGPHP\Transfer\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Transfer\Models\TransferDetail;
use GGPHP\Users\Models\User;

class Transfer extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'transfers';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'decision_number', 'decision_date', 'reason',
    ];

    protected $dateTimeFields = [
        'decision_date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'decision_date' => 'datetime',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    /**
     * Get educations of user
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function transferDetails()
    {
        return $this->hasMany(TransferDetail::class, 'transfer_id');
    }

    /**
     * Define relations user
     */
    public function userCreate()
    {
        return $this->belongsTo(User::class, 'user_create');
    }

    /**
     * Define relations Store
     */
    public function store()
    {
        return $this->belongsTo(\GGPHP\RolePermission\Models\Store::class);
    }
}
