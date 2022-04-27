<?php

namespace GGPHP\TourGuide\Models;

use GGPHP\Core\Models\UuidModel;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class TourGuide extends UuidModel implements HasMedia
{
    use InteractsWithMedia;

    /**
     * Declare the table name
     */
    protected $table = 'tour_guides';

    const TYPE = [
        'ILLEGAL' => 0,
        'LEGAL' => 1,
        'OBJECT_TRACKED' => 2,
    ];

    const SEX = [
        'MALE' => 0,
        'FEMALE' => 1
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'full_name', 'sex', 'id_card', 'date_of_birth', 'card_type_id', 'card_number', 'language_id', 'object_type_id',
        'expiration_date', 'degree', 'professional_certificate', 'nationality', 'home_town', 'resident',
        'note', 'type', 'sync_data_id', 'url_sso_image'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('avatar')->singleFile();
    }

    public function cardType()
    {
        return $this->belongsTo(\GGPHP\Category\Models\CardType::class);
    }

    public function language()
    {
        return $this->belongsTo(\GGPHP\Category\Models\Language::class);
    }

    public function objectType()
    {
        return $this->belongsTo(\GGPHP\Category\Models\ObjectType::class);
    }

    public function tourGuideAdditionalInformation()
    {
        return $this->hasOne(\GGPHP\TourGuide\Models\TourGuideAdditionalInformation::class);
    }

    public function event()
    {
        return $this->hasMany(\GGPHP\Event\Models\Event::class);
    }

    public function travelAgencieTourGuide()
    {
        return $this->hasMany(\GGPHP\TravelAgency\Models\TravelAgencieTourGuide::class);
    }

    /**
     * Get avatar
     */
    public function getAvatar()
    {
        $avatar = $this->getMedia('avatar');

        return $avatar->isEmpty() ? null : $avatar->first();
    }
}
