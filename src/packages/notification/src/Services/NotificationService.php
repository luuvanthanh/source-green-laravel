<?php

namespace GGPHP\Notification\Services;

use GGPHP\Notification\Notification\ModelCreated;
use GGPHP\Users\Models\User;

class NotificationService
{
    const EVENT = 'EVENT';

    /**
     * @param $attributes
     * @return bool
     */
    public static function eventCreated($type, $model)
    {
        $recipients = User::whereHas('players')->get();
        $sendData = new ModelCreated($type, $model);

        \Notification::send($recipients, $sendData);
    }
}
