<?php

namespace GGPHP\Notification\Services;

use GGPHP\ConfigReceiveNotification\Models\ConfigReceiveNotification;
use GGPHP\Notification\Notification\CameraUpdate;
use GGPHP\Notification\Notification\CountNumberOfTourist;
use GGPHP\Notification\Notification\ModelCreated;
use GGPHP\Users\Models\User;

class NotificationService
{
    const EVENT = 'EVENT';
    const CAMERA_UPDATE_STATUS = 'CAMERA_UPDATE_STATUS';
    const CAMERA_UPDATE_STREAM = 'CAMERA_UPDATE_STREAM';
    const CAMERA_UPDATE_RECORD = 'CAMERA_UPDATE_RECORD';
    const CAMERA_UPDATE_LIVING = 'CAMERA_UPDATE_LIVING';

    /**
     * @param $attributes
     * @return bool
     */
    public static function eventCreated($type, $model)
    {
        $users = User::get();

        foreach ($users as $user) {
            $configReceiveNotification = $user->configReceiveNotification;
            if ($configReceiveNotification->isEmpty()) {
                $userId[] = $user->id;
            } else {
                $configReceiveNotification = ConfigReceiveNotification::where('user_id', $user->id)->where('event_type_id', $model->event_type_id)->first();

                if ($configReceiveNotification->is_use == true) {
                    $userId[] = $user->id;
                }
            }
        }

        $recipients = User::whereHas('players', function ($query) use ($userId) {
            $query->whereIn('user_id', $userId);
        })->get();
        
        $sendData = new ModelCreated($type, $model, $model->tourist_destination_id);

        \Notification::send($recipients, $sendData);
    }

    /**
     * @param $attributes
     * @return bool
     */
    public static function surveyFormCreated($type, $model)
    {
        $recipients = User::whereHas('players')->get();
        $sendData = new ModelCreated($type, $model, $model->tourist_destination_id);

        \Notification::send($recipients, $sendData);
    }

    /**
     * @param $attributes
     * @return bool
     */
    public static function updateCamera($type, $model)
    {
        $recipients = User::whereHas('players')->get();
        $sendData = new CameraUpdate($type, $model, $model->tourist_destination_id);

        \Notification::send($recipients, $sendData);
    }

    /**
     * @param $attributes
     * @return bool
     */
    public static function countNumberOfTourist($model, $numberWarning)
    {
        $recipients = User::whereHas('players')->get();
        $sendData = new CountNumberOfTourist(null, $model, $model->tourist_destination_id, $numberWarning);

        \Notification::send($recipients, $sendData);
    }
}
