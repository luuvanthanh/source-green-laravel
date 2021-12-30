<?php

namespace GGPHP\Notification\Models;

use GGPHP\Core\Models\UuidModel;

class Player extends UuidModel
{

    /**
     * Declare the table name
     */
    protected $table = 'notifications_players';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'player_id', 'user_id',
    ];
}
