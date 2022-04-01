<?php

namespace GGPHP\Notification\Notification;

use Carbon\Carbon;
use GGPHP\Notification\Channels\OnesignalChannel;

class CountNumberOfTourist extends BaseNotification
{
    public $numberWarning;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($numberWarning = null)
    {
        parent::__construct();
        $this->numberWarning = $numberWarning;
    }

    /**
     * Get the message of the notification.
     *
     * @param  mixed  $notifiable
     * @return Message
     */
    public function getMessage($notifiable)
    {

        $params = [
            $this->getText()
        ];

        $line2 = implode(' ', array_filter($params));

        $message = <<<EOD
$line2
EOD;

        return $message;
    }

    /**
     * Get action.
     *
     * @return void
     */
    public function getText()
    {
        $model = $this->model;
        $touristDestination = $model->touristDestination;
        $date = Carbon::parse($model->time)->format('d-m-Y');
        $text = 'Số lượng du khách đến' . $touristDestination->name . 'ngày' . $date . 'vượt mức' . $this->numberWarning . 'người';

        return $text;
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
        $data = [
            'message' => $this->getMessage($notifiable),
            'image' => [],
            'model_id' => $this->model->id,
            'event_type' => 'COUNT_NUMBER_OF_TOURIST',
            'type' => 'COUNT_NUMBER_OF_TOURIST',
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
