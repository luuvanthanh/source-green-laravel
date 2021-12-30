<?php

namespace GGPHP\Notification\Notification;

use Illuminate\Notifications\Notification;

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
