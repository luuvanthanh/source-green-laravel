<?php

namespace GGPHP\Notification\Notification;

use GGPHP\Notification\Notification\WorkflowBaseNotification;

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

                        $text =  'Phát hiện rác tại ' . $nameTouristDestination;
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

                        $text =  'Phát hiện một đối tượng Nghi ngờ là HDV tại ' . $nameTouristDestination;
                        break;
                    case 'HVHD':
                        $nameTouristDestination = $model->touristDestination->name;

                        $text =  'Phát hiện Hành vi hướng dẫn tại ' . $nameTouristDestination;
                        break;
                }
        }

        return $text;
    }
}
