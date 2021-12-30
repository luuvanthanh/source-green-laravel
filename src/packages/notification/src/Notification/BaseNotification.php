<?php

namespace GGPHP\Notification\Notification;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Bus\Queueable;

class BaseNotification extends Notification implements ShouldQueue
{
    use Queueable;

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
}
