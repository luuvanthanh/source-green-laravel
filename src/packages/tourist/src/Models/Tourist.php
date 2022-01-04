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

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('image')->singleFile();
        $this->addMediaCollection('video')->singleFile();
    }
}
