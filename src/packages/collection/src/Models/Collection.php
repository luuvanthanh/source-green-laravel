<?php

namespace GGPHP\Collection\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Users\Models\User;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use GGPHP\Camera\Models\Camera;
use Illuminate\Database\Eloquent\SoftDeletes;

class Collection extends UuidModel implements HasMedia
{
    use SoftDeletes;
    use InteractsWithMedia;

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('avatar')->singleFile();
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'description', 'type', 'location', 'created_by'
    ];

    /**
     * The storage format of the model's date columns.
     *
     * @var string
     */
    protected $dateTimeFormat = 'c';

    /**
     * Get collection of camera
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function camera()
    {
        return $this->belongsToMany(Camera::class, 'camera_collection', 'collection_id', 'camera_id')
            ->withPivot('priority')
            ->orderBy('camera_collection.priority');
    }

    /**
     * Get collection of camera
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function user()
    {
        return $this->belongsToMany(User::class, 'user_collection', 'collection_id', 'user_id')->withTimestamps();
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
