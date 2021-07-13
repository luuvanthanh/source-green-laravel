<?php

namespace GGPHP\Facebook\Services;

class FacebookService
{
    /**
     * list page of user
     * @return array
     */
    public static function listPages(array $attributes)
    {
        $fb = getFacebookSdk();

        try {
            $userId = $attributes['user_id'];
            $response = $fb->get(
                "/$userId/accounts?fields=id,name,access_token", // id user
                $attributes['user_access_token']
            );
        } catch (\Facebook\Exceptions\FacebookResponseException $e) {
            return 'Graph returned an error: ' . $e->getMessage();
        } catch (\Facebook\Exceptions\FacebookSDKException $e) {
            return 'Facebook SDK returned an error: ' . $e->getMessage();
        }

        $graphNode = $response->getBody();

        return json_decode($graphNode);
    }

    /**
     * page token
     * @return array
     */
    public static function pageToken(array $attributes)
    {
        $fb = getFacebookSdk();

        try {
            $pageId = $attributes['page_id'];
            $response = $fb->get(
                "/$pageId?fields=id,access_token",
                $attributes['user_access_token']
            );
        } catch (\Facebook\Exceptions\FacebookResponseException $e) {
            return 'Graph returned an error: ' . $e->getMessage();
        } catch (\Facebook\Exceptions\FacebookSDKException $e) {
            return 'Facebook SDK returned an error: ' . $e->getMessage();
        }

        $graphNode = $response->getBody();

        return json_decode($graphNode);
    }

    /**
     * page conversation
     * @return array
     */
    public static function pageConversation(array $attributes)
    {
        $fb = getFacebookSdk();

        try {
            $pageId = $attributes['page_id'];
            $response = $fb->get(
                "/$pageId/conversations?fields=id,unread_count,senders{profile_pic},can_reply,snippet,updated_time,wallpaper",
                $attributes['page_access_token']
            );
        } catch (\Facebook\Exceptions\FacebookResponseException $e) {
            return 'Graph returned an error: ' . $e->getMessage();
        } catch (\Facebook\Exceptions\FacebookSDKException $e) {
            return 'Facebook SDK returned an error: ' . $e->getMessage();
        }

        $graphNode = $response->getBody();

        return json_decode($graphNode);
    }

    /**
     * page conversation message
     * @return array
     */
    public static function pageConversationMessage(array $attributes)
    {
        $fb = getFacebookSdk();

        try {
            $conversationId = $attributes['conversation_id'];
            //Nội dung cuộc trò chuyện
            $response = $fb->get(
                "/$conversationId/messages?fields=id,message,from,to,created_time&limit=10",
                $attributes['page_access_token']
            );
        } catch (\Facebook\Exceptions\FacebookResponseException $e) {
            return 'Graph returned an error: ' . $e->getMessage();
        } catch (\Facebook\Exceptions\FacebookSDKException $e) {
            return 'Facebook SDK returned an error: ' . $e->getMessage();
        }

        $graphNode = $response->getBody();

        return json_decode($graphNode);
    }

    /**
     * page conversation send message
     * @return array
     */
    public static function pageConversationSendMessage(array $attributes)
    {
        $fb = getFacebookSdk();

        try {
            $conversationId = $attributes['conversation_id'];
            $response = $fb->post(
                '/me/messagese',
                [
                    "recipient" => [
                        "id" => $attributes['recipient_id'], // id người nhận
                    ],
                    "message" => [
                        "text" => $attributes['message'],
                    ],
                ],
                $attributes['page_access_token']
            );

        } catch (\Facebook\Exceptions\FacebookResponseException $e) {
            return 'Graph returned an error: ' . $e->getMessage();
        } catch (\Facebook\Exceptions\FacebookSDKException $e) {
            return 'Facebook SDK returned an error: ' . $e->getMessage();
        }

        $graphNode = $response->getBody();

        return json_decode($graphNode);
    }
}
