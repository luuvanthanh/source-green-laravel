<?php

namespace GGPHP\Crm\Facebook\Services;

use Symfony\Component\HttpKernel\Exception\HttpException;

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
            $status = 500;
            if ($e->getStatusCode() != 500) {
                $status = $e->getStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        } catch (\Facebook\Exceptions\FacebookSDKException $e) {
            $status = 500;
            if ($e->getStatusCode() != 500) {
                $status = $e->getStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        }

        $graphNode = $response->getBody();

        return json_decode($graphNode)->data;
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
            $status = 500;
            if ($e->getStatusCode() != 500) {
                $status = $e->getStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        } catch (\Facebook\Exceptions\FacebookSDKException $e) {
            $status = 500;
            if ($e->getStatusCode() != 500) {
                $status = $e->getStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
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
            $status = 500;
            if ($e->getStatusCode() != 500) {
                $status = $e->getStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        } catch (\Facebook\Exceptions\FacebookSDKException $e) {
            $status = 500;
            if ($e->getStatusCode() != 500) {
                $status = $e->getStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        }

        $graphNode = $response->getBody();

        return json_decode($graphNode)->data;
    }

    /**
     * page conversation
     * @return array
     */
    public static function profilePic(array $attributes)
    {

        $fb = getFacebookSdk();
        try {
            $userId = $attributes['user_id'];

            $response = $fb->get(
                "/$userId?fields=profile_pic",
                $attributes['page_access_token']
            );
        } catch (\Facebook\Exceptions\FacebookResponseException $e) {
            $status = 500;
            if ($e->getStatusCode() != 500) {
                $status = $e->getStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        } catch (\Facebook\Exceptions\FacebookSDKException $e) {
            $status = 500;
            if ($e->getStatusCode() != 500) {
                $status = $e->getStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
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
            $status = 500;
            if ($e->getStatusCode() != 500) {
                $status = $e->getStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        } catch (\Facebook\Exceptions\FacebookSDKException $e) {
            $status = 500;
            if ($e->getStatusCode() != 500) {
                $status = $e->getStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        }

        $graphNode = $response->getBody();

        return json_decode($graphNode)->data;
    }

    /**
     * page conversation send message
     * @return array
     */
    public static function pageConversationSendMessage(array $attributes)
    {
        $fb = getFacebookSdk();

        try {
            $response = $fb->post(
                '/me/messages',
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
            $status = 500;
            if ($e->getStatusCode() != 500) {
                $status = $e->getStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        } catch (\Facebook\Exceptions\FacebookSDKException $e) {
            $status = 500;
            if ($e->getStatusCode() != 500) {
                $status = $e->getStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        }

        $graphNode = $response->getBody();

        return json_decode($graphNode);
    }

    public static function publishPagePost(array $attributes)
    {
        $fb = getFacebookSdk();

        try {
            $pageId = $attributes['page_id'];
            $response = $fb->post(
                "$pageId/feed",
                [
                    "message" => $attributes['message'],
                    // 'link' => 'https://developers.facebook.com',
                ],
                $attributes['page_access_token']
            );
        } catch (\Facebook\Exceptions\FacebookResponseException $e) {
            $status = 500;
            if ($e->getStatusCode() != 500) {
                $status = $e->getStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        } catch (\Facebook\Exceptions\FacebookSDKException $e) {
            $status = 500;
            if ($e->getStatusCode() != 500) {
                $status = $e->getStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        }

        $graphNode = $response->getBody();

        return json_decode($graphNode);
    }

    public static function getPagePost(array $attributes)
    {
        $fb = getFacebookSdk();

        try {
            $pageId = $attributes['page_id'];
            $response = $fb->get(
                "$pageId/feed?fields=admin_creator,full_picture,icon,permalink_url",
                $attributes['page_access_token']
            );
        } catch (\Facebook\Exceptions\FacebookResponseException $e) {
            $status = 500;
            if ($e->getStatusCode() != 500) {
                $status = $e->getStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        } catch (\Facebook\Exceptions\FacebookSDKException $e) {
            $status = 500;
            if ($e->getStatusCode() != 500) {
                $status = $e->getStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        }

        $graphNode = $response->getBody();

        return json_decode($graphNode);
    }
}
