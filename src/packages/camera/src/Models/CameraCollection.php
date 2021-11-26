<?php

namespace GGPHP\Camera\Models;

use GGPHP\Core\Models\UuidModel;
use GGPHP\Collection\Models\Collection;
use GGPHP\Camera\Models\Camera;

class CameraCollection extends UuidModel
{
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id', 'collection_id', 'camera_id', 'created_at', 'updated_at'
    ];

    protected $guard_name = 'api';

    /**
     * The storage format of the model's date columns.
     *
     * @var string
     */
    protected $dateTimeFormat = 'c';

    /**
     * Collection belong to
     *
     * @return type
     */
    public function collection()
    {
        return $this->belongsTo(Collection::class);
    }

    /**
     * User belong to
     *
     * @return type
     */
    public function camera()
    {
        return $this->belongsTo(Camera::class);
    }
}
