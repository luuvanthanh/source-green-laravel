<?php

namespace GGPHP\NumberOfTourist\Models;

use GGPHP\Core\Models\UuidModel;

class NumberOfTourist extends UuidModel
{

    /**
     * Declare the table name
     */
    protected $table = 'number_of_tourists';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'camera_id', 'tourist_destination_id', 'time', 'number_of_guest_in', 'number_of_guest_out'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    public function touristDestination()
    {
        return $this->belongsTo(\GGPHP\Category\Models\TouristDestination::class);
    }

    public function camera()
    {
        return $this->belongsTo(\GGPHP\Camera\Models\Camera::class);
    }
}
