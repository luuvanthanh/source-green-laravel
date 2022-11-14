<?php

namespace GGPHP\Event\Models;

use GGPHP\Core\Models\UuidModel;

class ObjectHandelFlow extends UuidModel
{
    public $incrementing = false;

    /**
     * Declare the table name
     */
    protected $table = 'object_handel_flows';

    public $fillable = [
        'event_id', 'object_id', 'object_type'
    ];

    /**
     * Define relations object
     */
    public function object()
    {
        return $this->morphTo('object', 'object_type', 'object_id');
    }
}
