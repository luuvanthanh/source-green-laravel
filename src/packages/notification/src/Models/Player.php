<?php

namespace GGPHP\Notification\Models;

use GGPHP\Core\Models\CoreModel;

class Player extends CoreModel
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
