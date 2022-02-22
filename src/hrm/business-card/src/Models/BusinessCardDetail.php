<?php

namespace GGPHP\BusinessCard\Models;

use GGPHP\Core\Models\UuidModel;

class BusinessCardDetail extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'BusinessCardDetails';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'BusinessCardId', 'Date', 'IsFullDate', 'Number', 'StartTime', 'EndTime', 'ShiftCode',
    ];

    protected $dateTimeFields = [
        'Date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'Date' => 'datetime',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function businessCard()
    {
        return $this->belongsTo(BusinessCard::class, 'BusinessCardId');
    }
}
