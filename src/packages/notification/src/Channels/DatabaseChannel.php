<?php

namespace GGPHP\Notification\Channels;

use Illuminate\Notifications\Channels\DatabaseChannel as IlluminateDatabaseChannel;
use Illuminate\Notifications\Notification;

class DatabaseChannel extends IlluminateDatabaseChannel
{
    /**
     * Build an array payload for the DatabaseNotification Model.
     *
     * @param  mixed  $notifiable
     * @param  \Illuminate\Notifications\Notification  $notification
     * @return array
     */
    protected function buildPayload($notifiable, Notification $notification)
    {
        return [
            'id' => $notification->id,
            'data' => $this->getData($notifiable, $notification),
            'tourist_destination_id' =>  $notification->touristDestination,
            'read_at' => null,
        ];
    }
}
