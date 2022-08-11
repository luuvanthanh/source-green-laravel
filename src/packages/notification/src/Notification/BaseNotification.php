<?php

namespace GGPHP\Notification\Notification;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class BaseNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $model;
    public $type;
    public $touristDestination;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($type = null, $model = null, $touristDestination = null)
    {
        $this->type = $type;
        $this->model = $model;
        $this->touristDestination = $touristDestination;
    }
}
