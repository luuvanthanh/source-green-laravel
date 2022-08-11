<?php

namespace GGPHP\TourGuide\Models;

use GGPHP\Core\Models\UuidModel;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class TourGuideAdditionalInformation extends UuidModel implements HasMedia
{
    use InteractsWithMedia;

    public $timestamps = false;

    /**
     * Declare the table name
     */
    protected $table = 'tour_guide_additional_informations';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'tour_guide_id', 'note'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];
}
