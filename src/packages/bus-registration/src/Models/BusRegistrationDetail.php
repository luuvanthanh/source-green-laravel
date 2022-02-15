<?php

namespace GGPHP\BusRegistration\Models;

use GGPHP\Core\Models\UuidModel;

class BusRegistrationDetail extends UuidModel
{
    public $incrementing = false;

    protected $table = 'BusRegistrationDetails';

    protected $fillable = [
        'BusRegistrationId', 'Date', 'Hours'
    ];

    protected $casts = [
        'Date' => 'date:Y-m-d',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function busRegistration()
    {
        return $this->belongsTo(BusRegistration::class, 'BusRegistrationId');
    }
}
