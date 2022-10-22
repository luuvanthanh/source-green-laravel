<?php

namespace GGPHP\Notification\Notification;

use GGPHP\Notification\Channels\OnesignalChannel;

class ModelCreated extends BaseNotification
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
            case 'EVENT':
                $model = $this->model;
                $type = $model->eventType->code;
                $text = '';
                switch ($type) {
                    case 'HDVHP':
                        $nameTourGuide = $model->tourGuide->full_name;
                        $nameTouristDestination = $model->touristDestination->name;

                        $text =  'Hướng dẫn viên ' . $nameTourGuide . ' đã xuất hiện tại ' . $nameTouristDestination;
                        break;
                    case 'BL':
                        $nameTourGuide = $model->tourGuide->full_name;
                        $nameTouristDestination = $model->touristDestination->name;

                        $text =  'Đối tượng Blacklist ' . $nameTourGuide . ' đã xuất hiện tại ' . $nameTouristDestination;
                        break;
                    case 'RAC':
                        $nameTouristDestination = $model->touristDestination->name;
                        $text =  'Phát hiện rác tại ' . $nameTouristDestination . '    🗑';
                        break;
                    case 'BHR':
                        $nameTouristDestination = $model->touristDestination->name;

                        $text =  'Phát hiện hành vi bán hàng rong tại ' . $nameTouristDestination;
                        break;
                    case 'HDVBHP':
                        $nameTourGuide = $model->tourGuide->full_name;
                        $nameTouristDestination = $model->touristDestination->name;

                        $text =  'Hướng dẫn viên bất hợp pháp ' . $nameTourGuide . ' đã xuất hiện tại ' . $nameTouristDestination;
                        break;
                    case 'NNHDV':
                        $nameTouristDestination = $model->touristDestination->name;

                        $text =  'Phát hiện một đối tượng Nghi ngờ là HDV tại ' . $nameTouristDestination . '🕴️';
                        break;
                    case 'HVHD':
                        $nameTouristDestination = $model->touristDestination->name;

                        $text =  'Phát hiện Hành vi hướng dẫn tại ' . $nameTouristDestination . '   📢';
                        break;
                }
                break;
            case 'SURVEYFORM':
                $model = $this->model;
                $text = 'Khảo sát ' . $model->survey->name . ' tại ' . $model->survey->touristDestination->name . ' vừa nhận được một lượt trả lời mới.';
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
        $image = [];
        $model_id = null;
        $eventType = null;
        switch ($this->type) {
            case 'EVENT':
                $imageMedia = $this->model->getMedia('image');
                $imageMedia = $imageMedia->isEmpty() ? null : $imageMedia->first();
                if (!is_null($imageMedia)) {
                    $image = [
                        'path' => $imageMedia->getPath(),
                        'name' => $imageMedia->name,
                    ];
                }
                $eventType =  $this->model->eventType->code;
                $model_id = $this->model->id;
                break;
            case 'SURVEYFORM':
                $model_id = $this->model->survey->id;
                break;
        }

        $data = [
            'message' => $this->getMessage($notifiable),
            'image' => $image,
            'model_id' => $model_id,
            'event_type' => $eventType,
            'type' => $this->type,
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
