<?php

namespace GGPHP\TravelAgency\Models;

use GGPHP\Core\Models\UuidModel;

class TravelAgencieTourGuide extends UuidModel
{

    /**
     * Declare the table name
     */
    protected $table = 'travel_agencie_tour_guides';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'travel_agency_id', 'tour_guide_id', 'date_of_entering_the_company',
    ];

    public function tourGuide()
    {
        return $this->belongsTo(\GGPHP\TourGuide\Models\TourGuide::class);
    }
}
