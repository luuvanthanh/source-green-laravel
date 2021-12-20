<?php

namespace GGPHP\Event\Models;

use GGPHP\Core\Models\UuidModel;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Event extends UuidModel implements HasMedia
{
    use InteractsWithMedia;

    /**
     * Declare the table name
     */
    protected $table = 'events';

    const STATUS = [
        'PENDING' => 0,
        'DOING' => 1,
        'DONE' => 2,
    ];

    const WARNING_LEVEL = [
        'LOW' => 0,
        'MEDIUM' => 1,
        'HIGH' => 2,
        'EMERGENCY' => 3,
    ];

    const STATUS_DETAIL = [
        'SKIP' => 0,
        'MISTAKE' => 1,
        'HANDLE_NOW' => 2,
        'HANDLE_FOLLOW' => 3,
        'HANDLE_NOW_MUTI' => 4,
        'HANDLE_FOLLOW_MUTI' => 5,
        'SKIP_MUTI' => 6,
    ];


    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'event_type_id', 'tourist_destination_id', 'camera_id', 'warning_level', 'status', 'is_follow',
        'time', 'tour_guide_id', 'classify', 'status_detail', 'is_read', 'track_id', 'percent_similarity',
        'event_handle_muti_id', 'is_add_object'
    ];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('image')->singleFile();
        $this->addMediaCollection('video')->singleFile();
    }

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    public function eventType()
    {
        return $this->belongsTo(\GGPHP\Category\Models\EventType::class);
    }

    public function touristDestination()
    {
        return $this->belongsTo(\GGPHP\Category\Models\TouristDestination::class);
    }

    public function camera()
    {
        return $this->belongsTo(\GGPHP\Camera\Models\Camera::class);
    }

    public function tourGuide()
    {
        return $this->belongsTo(\GGPHP\TourGuide\Models\TourGuide::class);
    }

    public function eventHandle()
    {
        return $this->hasOne(\GGPHP\Event\Models\EventHandle::class);
    }
}
