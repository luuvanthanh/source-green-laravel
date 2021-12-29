<?php

namespace GGPHP\Notification\Models;

use GGPHP\Core\Traits\CastDatetimeFormatTrait;
use Illuminate\Notifications\DatabaseNotification as IlluminateDatabaseNotification;

class Notification extends IlluminateDatabaseNotification
{
    use CastDatetimeFormatTrait;

    /**
     * Declare the table name
     */
    protected $table = 'notifications';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'notifiable_id', 'notifiable_type', 'data', 'notification_type', 'is_read',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    /**
     * Update is_read
     * @param string $value
     * @return array
     */
    public function getIsReadAttribute($value)
    {
        return $value == 1 ? true : false;
    }
}
