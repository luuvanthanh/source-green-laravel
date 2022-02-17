<?php

namespace GGPHP\Crm\Zalo\Services;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Zalo\Builder\MessageBuilder;
use Zalo\Exceptions\ZaloResponseException;
use Zalo\Exceptions\ZaloSDKException;
use Zalo\ZaloEndPoint;

class ZaloService
{
    /**
     * list page of user
     * @return array
     */
    public static function listFollower(array $attributes)
    {
        $zalo = getZaloSdk();

        try {
            $access_token = $attributes['access_token'];

            $params = ['data' => json_encode(array(
                'offset' => 0,
                'count' => 10,
            ))];
            $response = $zalo->get(ZaloEndPoint::API_OA_GET_LIST_FOLLOWER, $access_token, $params);
        } catch (ZaloResponseException $e) {
            $status = 500;
            if ($e->getStatusCode() != 500) {
                $status = $e->getStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        } catch (ZaloSDKException $e) {
            $status = 500;
            if ($e->getStatusCode() != 500) {
                $status = $e->getStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        }

        return $response->getDecodedBody();
    }

    public static function zaloGetProfile(array $attributes)
    {
        $zalo = getZaloSdk();

        try {
            $accessToken = $attributes['access_token'];
            $userId = $attributes['user_id'];

            $params = ['data' => json_encode(array(
                'user_id' => $userId,
            ))];

            $response = $zalo->get(ZaloEndPoint::API_OA_GET_USER_PROFILE, $accessToken, $params);
        } catch (ZaloResponseException $e) {
            $status = 500;
            if ($e->getStatusCode() != 500) {
                $status = $e->getStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        } catch (ZaloSDKException $e) {
            $status = 500;
            if ($e->getStatusCode() != 500) {
                $status = $e->getStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        }

        return $response->getDecodedBody();
    }

    public static function sendMessages(array $attributes)
    {
        $zalo = getZaloSdk();

        try {
            $accessToken = $attributes['access_token'];

            $msgBuilder = new MessageBuilder('text');
            $msgBuilder->withUserId($attributes['user_id']);
            $msgBuilder->withText($attributes['messages']);
            $msgText = $msgBuilder->build();
            $response = $zalo->post(ZaloEndpoint::API_OA_SEND_MESSAGE, $accessToken, $msgText);
        } catch (ZaloResponseException $e) {
            $status = 500;
            if ($e->getStatusCode() != 500) {
                $status = $e->getStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        } catch (ZaloSDKException $e) {
            $status = 500;
            if ($e->getStatusCode() != 500) {
                $status = $e->getStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        }

        return $response->getDecodedBody();
    }

    public static function listRecentChat(array $attributes)
    {
        $zalo = getZaloSdk();

        try {
            $accessToken = $attributes['access_token'];

            $data = ['data' => json_encode(array(
                'offset' => 0,
                'count' => 10,
            ))];

            $response = $zalo->get(ZaloEndpoint::API_OA_GET_LIST_RECENT_CHAT, $accessToken, $data);
        } catch (ZaloResponseException $e) {
            $status = 500;
            if ($e->getStatusCode() != 500) {
                $status = $e->getStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        } catch (ZaloSDKException $e) {
            $status = 500;
            if ($e->getStatusCode() != 500) {
                $status = $e->getStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        }

        return $response->getDecodedBody();
    }

    public static function getConversation(array $attributes)
    {
        $zalo = getZaloSdk();

        try {
            $accessToken = $attributes['access_token'];
            $userId = $attributes['user_id'];
            $data = ['data' => json_encode(array(
                'user_id' => (int) $userId,
                'offset' => 0,
                'count' => 10,
            ))];

            $response = $zalo->get(ZaloEndpoint::API_OA_GET_CONVERSATION, $accessToken, $data);
        } catch (ZaloResponseException $e) {
            $status = 500;
            if ($e->getStatusCode() != 500) {
                $status = $e->getStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        } catch (ZaloSDKException $e) {
            $status = 500;
            if ($e->getStatusCode() != 500) {
                $status = $e->getStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        }

        return $response->getDecodedBody();
    }
}
