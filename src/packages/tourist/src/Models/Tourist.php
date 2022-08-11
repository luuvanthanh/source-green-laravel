<?php

namespace  GGPHP\Tourist\Models;

use GGPHP\Core\Models\UuidModel;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Tourist extends UuidModel implements HasMedia
{
    use InteractsWithMedia;
    protected $table = 'tourists';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['camera_id', 'tourist_destination_id', 'object_id', 'time', 'track_id'];

    protected $dateTimeFields = [
        'datetime'  =>  'time',
    ];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('image')->singleFile();
        $this->addMediaCollection('video')->singleFile();
    }

    public function touristDestination()
    {
        return $this->belongsTo(\GGPHP\Category\Models\TouristDestination::class);
    }

    public function camera()
    {
        return $this->belongsTo(\GGPHP\Camera\Models\Camera::class);
    }
}
