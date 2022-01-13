<?php

namespace GGPHP\Notification\Notification;

use GGPHP\Camera\Models\Camera;
use GGPHP\Notification\Channels\OnesignalChannel;

class CameraUpdate extends BaseNotification
{
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
        $text = '';
        switch ($this->type) {
            case 'CAMERA_UPDATE_STATUS':
                $model = $this->model;

                $name = $model->name;
                $nameTouristDestination = $model->touristDestination->name;

                $status = null;
                switch ($model->status) {
                    case Camera::STATUS['STATUS_RUNNING']:
                        $status = 'kết nối thành công.';
                        break;
                    case Camera::STATUS['STATUS_FAILED']:
                        $status = 'bị ngắt kết nối.';
                        break;
                }
                $text =  'Camera ' . $name . ' tại ' . $nameTouristDestination . ' ' . $status;
                break;
            case 'CAMERA_UPDATE_STREAM':
                $model = $this->model;

                $name = $model->name;
                $nameTouristDestination = $model->touristDestination->name;

                if ($model->cam_info['streaming_living']) {
                    $status = 'đã bật';
                } else {
                    $status = 'đã tắt';
                }

                $text = 'Chế độ stream của camera ' . $name . ' tại ' . $nameTouristDestination . ' ' . $status;
                break;
            case 'CAMERA_UPDATE_RECORD':
                $model = $this->model;

                $name = $model->name;
                $nameTouristDestination = $model->touristDestination->name;

                if ($model->cam_info['capture_living']) {
                    $status = 'đã bật';
                } else {
                    $status = 'đã tắt';
                }

                $text = 'Chế độ record của camera ' . $name . ' tại ' . $nameTouristDestination . ' ' . $status;
                break;
            case 'CAMERA_UPDATE_LIVING':
                $model = $this->model;

                $name = $model->name;
                $nameTouristDestination = $model->touristDestination->name;

                if ($model->cam_info['capture_living']) {
                    $status = 'đã bật';
                } else {
                    $status = 'đã tắt';
                }

                $text = 'Trạng thái live của camera ' . $name . ' tại ' . $nameTouristDestination . ' ' . $status;
                break;
        }

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

        $eventType =  $this->type;

        $data = [
            'message' => $this->getMessage($notifiable),
            'image' => [],
            'model_id' => $this->model->id,
            'event_type' => $eventType,
            'type' => 'CAMERA',
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
