<?php

namespace GGPHP\Notification\Notification;

use Illuminate\Notifications\Notification;
use GGPHP\Notification\Channels\OnesignalChannel;

class BaseNotification extends Notification
{
    public $model;
    public $type;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($type, $model = null)
    {
        $this->type = $type;
        $this->model = $model;
    }

    /**
     * Get the notification channels.
     *
     * @param  mixed  $notifiable
     * @return array|string
     */
    public function via($notifiable)
    {
        $channels[] = 'database';

        $channels[] = OnesignalChannel::class;

        return $channels;
    }

    /**
     * Get the webapp representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return WebappMessage
     */
    public function toOnesignal($notifiable)
    {
        $imageMedia = $this->model->getMedia('image');
        $imageMedia = $imageMedia->isEmpty() ? null : $imageMedia->first();
        $image = [];

        if (!is_null($imageMedia)) {
            $image = [
                'path' => $imageMedia->getPath(),
                'name' => $imageMedia->name,
            ];
        }

        $data = [
            'message' => $this->getMessage($notifiable),
            'image' => $image,
            'created_at' => $this->model->created_at->timezone(config('app.timezone'))->format('c'),
        ];

        return $data;
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return $this->toOnesignal($notifiable);
    }
}
