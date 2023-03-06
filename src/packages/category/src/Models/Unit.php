<?php

namespace GGPHP\Category\Models;

use GGPHP\Core\Models\UuidModel;
use Spatie\MediaLibrary\HasMedia;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\InteractsWithMedia;

class Unit extends UuidModel implements HasMedia
{
    use SoftDeletes,InteractsWithMedia;

    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'units';

    public $fillable = [
        'name'
    ];

    public function getAvatar()
    {
        $avatar = $this->getMedia('avatar');

        return $avatar->isEmpty() ? null : $avatar->first();
    }
}
