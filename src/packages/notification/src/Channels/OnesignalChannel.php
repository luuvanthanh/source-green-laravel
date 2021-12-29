<?php

namespace GGPHP\Notification\Channels;

use Illuminate\Notifications\Notification;
use OneSignal;

class OnesignalChannel
{
    /**
     * Send the given notification.
     *
     * @param  mixed  $notifiable
     * @param  \Illuminate\Notification\Notification  $notification
     * @return void
     */
    public function send($notifiable, Notification $notification)
    {
        $notifiable->type = 'OneSignal';
        $data = $notification->toOnesignal($notifiable);

        $players = $notifiable->players;

        if (!empty($players)) {
            foreach ($players as $player) {
                $params = $this->prepareParams($data, $player->player_id);
                OneSignal::sendNotificationCustom($params);
            }
        }
    }

    public function prepareParams($data, $playerId)
    {
        $contents = [
            'en' => $data['message'] ?? '',
        ];

        $params = [
            'contents' => $contents,
            'include_player_ids' => [$playerId],
            'data' => $data,
        ];

        if (!empty($data['url'])) {
            $params['url'] = $data['url'];
        }

        if (!empty($data['buttons'])) {
            $params['buttons'] = $data['buttons'];
        }

        if (!empty($data['send_after'])) {
            $params['send_after'] = $data['send_after'];
        }

        if (!empty($data['headings'])) {
            $params['headings'] = [
                'en' => $data['headings'],
            ];
        }

        if (!empty($data['subtitle'])) {
            $params['subtitle'] = [
                'en' => $data['subtitle'],
            ];
        }

        // adds media attachments to notifications
        if (!empty($data['image'])) {
            // platform: iOS 10+
            $params['ios_attachments'] = ['image' => \URL::to(env('IMAGE_URL', '')) . '/' . $data['image']['path']];
        }

        return $params;
    }
}
