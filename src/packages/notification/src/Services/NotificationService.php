<?php

namespace GGPHP\Notification\Services;

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
        $recipients = User::whereHas('players')->get();
        $sendData = new ModelCreated($type, $model);

        \Notification::send($recipients, $sendData);
    }

    /**
     * @param $attributes
     * @return bool
     */
    public static function surveyFormCreated($type, $model)
    {
        $recipients = User::whereHas('players')->get();
        $sendData = new ModelCreated($type, $model);

        \Notification::send($recipients, $sendData);
    }

    /**
     * @param $attributes
     * @return bool
     */
    public static function updateCamera($type, $model)
    {
        $recipients = User::whereHas('players')->get();
        $sendData = new CameraUpdate($type, $model);

        \Notification::send($recipients, $sendData);
    }

    /**
     * @param $attributes
     * @return bool
     */
    public static function countNumberOfTourist($model, $numberWarning)
    {
        $recipients = User::whereHas('players')->get();
        $sendData = new CountNumberOfTourist(null, $model, $numberWarning);

        \Notification::send($recipients, $sendData);
    }
}
