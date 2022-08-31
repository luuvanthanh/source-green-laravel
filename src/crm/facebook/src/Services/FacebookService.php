<?php

namespace GGPHP\Crm\Facebook\Services;

use Facebook\Exceptions\FacebookResponseException;
use Facebook\Exceptions\FacebookSDKException;
use GGPHP\Crm\Facebook\Models\Conversation;
use GGPHP\Crm\Facebook\Models\Page;
use GGPHP\Crm\Facebook\Models\UserFacebookInfo;
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
                '/' . $userId . '/accounts?fields=id,name,access_token', // id user
                $attributes['user_access_token']
            );
        } catch (\Facebook\Exceptions\FacebookResponseException $e) {
            $status = 500;

            if ($e->getHttpStatusCode() != 500) {
                $status = $e->getHttpStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        } catch (\Facebook\Exceptions\FacebookSDKException $e) {
            $status = 500;

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
                '/' . $pageId . '?fields=id,access_token',
                $attributes['user_access_token']
            );
        } catch (\Facebook\Exceptions\FacebookResponseException $e) {
            $status = 500;

            if ($e->getHttpStatusCode() != 500) {
                $status = $e->getHttpStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        } catch (\Facebook\Exceptions\FacebookSDKException $e) {
            $status = 500;

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
        $fields = null;

        if (isset($attributes['fields'])) {
            $fields = $attributes['fields'];
        }

        try {
            $pageId = $attributes['page_id'];
            $response = $fb->get(
                '/' . $pageId . '/conversations?fields=id' . $fields . '&folder=' . $attributes['folder'] . '&limit=99999999999999999999',
                $attributes['page_access_token']
            );
        } catch (\Facebook\Exceptions\FacebookResponseException $e) {
            $status = 500;

            if ($e->getHttpStatusCode() != 500) {
                $status = $e->getHttpStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        } catch (\Facebook\Exceptions\FacebookSDKException $e) {
            $status = 500;

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
                '/' . $userId . '?fields=profile_pic',
                $attributes['page_access_token']
            );
        } catch (\Facebook\Exceptions\FacebookResponseException $e) {
            $status = 500;

            if ($e->getHttpStatusCode() != 500) {
                $status = $e->getHttpStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        } catch (\Facebook\Exceptions\FacebookSDKException $e) {
            $status = 500;

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
                '/' . $conversationId . '/messages?fields=id,message,from,to,created_time,attachments,shares{link}&limit=99999999999999999999999',
                $attributes['page_access_token']
            );
        } catch (\Facebook\Exceptions\FacebookResponseException $e) {
            $status = 500;

            if ($e->getHttpStatusCode() != 500) {
                $status = $e->getHttpStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        } catch (\Facebook\Exceptions\FacebookSDKException $e) {
            $status = 500;

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
            if (!empty($attributes['message'])) {
                $response = $fb->post(
                    '/me/messages',
                    [
                        'recipient' => [
                            'id' => $attributes['recipient_id'], // id người nhận
                        ],
                        'message' => [
                            'text' => $attributes['message'],
                        ],
                        'tag' => 'CONFIRMED_EVENT_UPDATE'
                    ],
                    $attributes['page_access_token']
                );
            }
            if (!empty($attributes['urls'])) {
                foreach ($attributes['urls'] as $key => $url) {
                    $response = $fb->post(
                        '/me/messages',
                        [
                            'recipient' => [
                                'id' => $attributes['recipient_id'], // id người nhận
                            ],
                            'message' => [
                                'attachment' => [
                                    'type' => $url['type'],
                                    'payload' => [
                                        'is_reusable' => true,
                                        'url' => $url['url']
                                    ]
                                ]
                            ],
                            'tag' => 'CONFIRMED_EVENT_UPDATE'
                        ],
                        $attributes['page_access_token']
                    );
                }
            }
        } catch (\Facebook\Exceptions\FacebookResponseException $e) {
            $status = 500;

            if ($e->getHttpStatusCode() != 500) {
                $status = $e->getHttpStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        } catch (\Facebook\Exceptions\FacebookSDKException $e) {
            $status = 500;

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        }

        $graphNode = $response->getBody();

        return json_decode($graphNode);
    }

    // public static function uploadMultipleFile($attributes, $urls)
    // {
    //     $pageId = $attributes['page_id'];
    //     $fb = getFacebookSdk();
    //     $photoIdArray = array();
    //     foreach ($urls as $url) {
    //         $params = array(
    //             'message' => [
    //                 'attachment' => [
    //                     'type' => 'image',
    //                     'payload' => [
    //                         'is_reusable' => true,
    //                         'url' => $url
    //                     ]
    //                 ]
    //             ]
    //         );
    //         try {
    //             $postResponse = $fb->post(
    //                 'me/message_attachments',
    //                 $params,
    //                 $attributes['page_access_token']
    //             );
    //             $photoId = $postResponse->getDecodedBody();

    //             if (!empty($photoId['attachment_id'])) {
    //                 $photoIdArray[] = $photoId['attachment_id'];
    //             }
    //         } catch (FacebookResponseException $e) {
    //             $status = 500;
    //             if ($e->getHttpStatusCode() != 500) {
    //                 $status = $e->getHttpStatusCode();
    //             }
    //             throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
    //         } catch (FacebookSDKException $e) {
    //             throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
    //         }
    //     }

    //     return $photoIdArray;
    // }

    public static function publishPagePost(array $attributes)
    {
        $fb = getFacebookSdk();

        try {
            $pageId = $attributes['page_id'];
            $response = $fb->post(
                $pageId . '/feed',
                [
                    'message' => $attributes['message'],
                    // 'link' => 'https://developers.facebook.com',
                ],
                $attributes['page_access_token']
            );
        } catch (\Facebook\Exceptions\FacebookResponseException $e) {
            $status = 500;
            if ($e->getHttpStatusCode() != 500) {
                $status = $e->getHttpStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        } catch (\Facebook\Exceptions\FacebookSDKException $e) {
            $status = 500;

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        }

        $graphNode = $response->getBody();

        return json_decode($graphNode);
    }
    public static function postMultipleImage($attributes, $urls)
    {
        $pageId = $attributes['page_id'];
        $fb = getFacebookSdk();
        $photoIdArray = array();
        foreach ($urls as $url) {
            $params = array(
                'url' => $url,
                'published' => false
            );
            try {
                $postResponse = $fb->post(
                    $pageId . '/photos',
                    $params,
                    $attributes['page_access_token']
                );
                $photoId = $postResponse->getDecodedBody();
                if (!empty($photoId['id'])) {
                    $photoIdArray[] = $photoId['id'];
                }
            } catch (\Facebook\Exceptions\FacebookResponseException $e) {
                $status = 500;

                if ($e->getHttpStatusCode() != 500) {
                    $status = $e->getHttpStatusCode();
                }

                throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
            } catch (\Facebook\Exceptions\FacebookSDKException $e) {
                $status = 500;

                throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
            }
        }

        return $photoIdArray;
    }

    public static function publishPagePostWithImage(array $attributes, $urls)
    {
        $pageId = $attributes['page_id'];
        $fb = getFacebookSdk();

        $photoIdArray = self::postMultipleImage($attributes, $urls);
        $postParam['message'] = $attributes['message'];
        foreach ($photoIdArray as $key => $photoId) {
            $postParam['attached_media'][$key] = '{"media_fbid":"' . $photoId . '"}';
        }

        try {
            $response = $fb->post(
                $pageId . '/feed',
                $postParam,
                $attributes['page_access_token']
            );
        } catch (\Facebook\Exceptions\FacebookResponseException $e) {
            $status = 500;

            if ($e->getHttpStatusCode() != 500) {
                $status = $e->getHttpStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        } catch (\Facebook\Exceptions\FacebookSDKException $e) {
            $status = 500;

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        }

        $graphNode = $response->getBody();

        return json_decode($graphNode);
    }

    public static function publishPagePostWithVideo(array $attributes, $urls)
    {
        $fb = getFacebookSdk();

        $url = $fb->fileToUpload($urls[0]);
        try {
            $pageId = $attributes['page_id'];
            $response = $fb->post(
                $pageId . '/videos',
                [
                    'description' => $attributes['description'],
                    'url' => $url,
                ],
                $attributes['page_access_token']
            );
        } catch (\Facebook\Exceptions\FacebookResponseException $e) {
            $status = 500;

            if ($e->getHttpStatusCode() != 500) {
                $status = $e->getHttpStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        } catch (\Facebook\Exceptions\FacebookSDKException $e) {
            $status = 500;

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
                $pageId . '/feed?fields=admin_creator,full_picture,icon,permalink_url',
                $attributes['page_access_token']
            );
        } catch (\Facebook\Exceptions\FacebookResponseException $e) {
            $status = 500;

            if ($e->getHttpStatusCode() != 500) {
                $status = $e->getHttpStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        } catch (\Facebook\Exceptions\FacebookSDKException $e) {
            $status = 500;

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        }

        $graphNode = $response->getBody();

        return json_decode($graphNode);
    }

    public static function createUserFacebookInfo($attributes)
    {
        $userId = $attributes['value']['from']['id'];
        $userFacebookInfo = UserFacebookInfo::where('user_id', $userId)->first();

        if (is_null($userFacebookInfo)) {
            if (isset($attributes['value']['from']['name'])) {
                $data = [
                    'user_id' => $userId,
                    'user_name' => $attributes['value']['from']['name']
                ];
                UserFacebookInfo::create($data);
            }
        }
    }

    public static function deletePagePost($attributes)
    {
        $fb = getFacebookSdk();

        try {
            $response = $fb->delete(
                '/' .
                    $attributes['facebook_post_id'],
                [],
                $attributes['page_access_token']
            );
        } catch (\Facebook\Exceptions\FacebookResponseException $e) {
            $status = 500;

            if ($e->getHttpStatusCode() != 500) {
                $status = $e->getHttpStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        } catch (\Facebook\Exceptions\FacebookSDKException $e) {
            $status = 500;

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        }

        $graphNode = $response->getBody();

        return json_decode($graphNode);
    }

    public static function pageRole(array $attributes)
    {
        $fb = getFacebookSdk();

        try {
            $pageId = $attributes['page_id'];
            $response = $fb->get(
                '/' . $pageId . '/roles',
                $attributes['page_access_token']
            );
        } catch (\Facebook\Exceptions\FacebookResponseException $e) {
            $status = 500;

            if ($e->getHttpStatusCode() != 500) {
                $status = $e->getHttpStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        } catch (\Facebook\Exceptions\FacebookSDKException $e) {
            $status = 500;

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        }

        $graphNode = $response->getBody();

        return json_decode($graphNode)->data;
    }

    public static function getAvatarUser($attributes)
    {
        $fb = getFacebookSdk();
        try {
            $userId = $attributes['user_id'];
            $response = $fb->get(
                '/' . $userId . '/picture?height=320&width=320',
                $attributes['page_access_token']
            );
        } catch (\Facebook\Exceptions\FacebookResponseException $e) {
            $status = 500;

            if ($e->getHttpStatusCode() != 500) {
                $status = $e->getHttpStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        } catch (\Facebook\Exceptions\FacebookSDKException $e) {
            $status = 500;

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        }
        $graphNode = $response->getHeaders();
        return $graphNode['location'];
    }

    public static function getAttachmentMessage($attributes)
    {
        $fb = getFacebookSdk();
        try {
            $messageIdFacebook = $attributes['message_id_facebook'];
            $response = $fb->get(
                '/' . $messageIdFacebook . '/attachments',
                $attributes['page_access_token']
            );
        } catch (\Facebook\Exceptions\FacebookResponseException $e) {
            $status = 500;

            if ($e->getHttpStatusCode() != 500) {
                $status = $e->getHttpStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        } catch (\Facebook\Exceptions\FacebookSDKException $e) {
            $status = 500;

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        }
        $graphNode = $response->getBody();

        return json_decode($graphNode)->data;
    }

    public static function userLongToken(array $attributes)
    {
        $client_id = env('APP_ID_FACEBOOK');
        $client_secret = env('APP_SECRET_FACEBOOK');
        $user_access_token = $attributes['user_access_token'];
        $response = file_get_contents('https://graph.facebook.com/oauth/access_token?client_id=' . $client_id . '&client_secret=' . $client_secret . '&grant_type=fb_exchange_token&fb_exchange_token=' . $user_access_token);

        return json_decode($response);
    }

    public static function getQuantitySharePost(array $attributes)
    {
        $fb = getFacebookSdk();

        try {
            $postId = $attributes['post_id'];
            $response = $fb->get(
                '/' . $postId . '?fields=shares',
                $attributes['page_access_token']
            );
        } catch (\Facebook\Exceptions\FacebookResponseException $e) {
            $status = 500;

            if ($e->getHttpStatusCode() != 500) {
                $status = $e->getHttpStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        } catch (\Facebook\Exceptions\FacebookSDKException $e) {
            $status = 500;

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        }

        $graphNode = $response->getBody();

        return json_decode($graphNode);
    }

    public static function registrationWebhook(array $attributes)
    {
        $fb = getFacebookSdk();
        $subscribedFields = Page::SUBSCRIBEDFIELD;

        try {
            foreach ($attributes['data_page'] as $dataPage) {
                $pageId = $dataPage['page_id'];
                $response = $fb->post(
                    '/' . $pageId . '/subscribed_apps',
                    [
                        'subscribed_fields' => $subscribedFields
                    ],
                    $dataPage['page_access_token']
                );
            }
        } catch (\Facebook\Exceptions\FacebookResponseException $e) {
            $status = 500;

            if ($e->getHttpStatusCode() != 500) {
                $status = $e->getHttpStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        } catch (\Facebook\Exceptions\FacebookSDKException $e) {
            $status = 500;

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        }

        $graphNode = $response->getBody();

        return json_decode($graphNode);
    }

    public static function updatePagePost($attributes)
    {
        $fb = getFacebookSdk();

        try {
            $postId = $attributes['facebook_post_id'];
            $response = $fb->post(
                $postId,
                [
                    'message' => $attributes['message'],
                    // 'link' => 'https://developers.facebook.com',
                ],
                $attributes['page_access_token']
            );
        } catch (\Facebook\Exceptions\FacebookResponseException $e) {
            $status = 500;
            if ($e->getHttpStatusCode() != 500) {
                $status = $e->getHttpStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        } catch (\Facebook\Exceptions\FacebookSDKException $e) {
            $status = 500;

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        }

        $graphNode = $response->getBody();

        return json_decode($graphNode);
    }

    public static function updatePagePostWithImage($attributes, $urls)
    {
        $postId = $attributes['facebook_post_id'];
        $fb = getFacebookSdk();

        $photoIdArray = self::postMultipleImage($attributes, $urls);
        $postParam['message'] = $attributes['message'];
        foreach ($photoIdArray as $key => $photoId) {
            $postParam['attached_media'][$key] = '{"media_fbid":"' . $photoId . '"}';
        }

        try {
            $response = $fb->post(
                $postId,
                $postParam,
                $attributes['page_access_token']
            );
        } catch (\Facebook\Exceptions\FacebookResponseException $e) {
            $status = 500;

            if ($e->getHttpStatusCode() != 500) {
                $status = $e->getHttpStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        } catch (\Facebook\Exceptions\FacebookSDKException $e) {
            $status = 500;

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        }

        $graphNode = $response->getBody();

        return json_decode($graphNode);
    }

    public static function updatePagePostWithVideo($attributes, $urls)
    {
        $fb = getFacebookSdk();
        $url = $fb->fileToUpload($urls[0]);
        try {
            $postId = $attributes['facebook_post_id'];
            $response = $fb->post(
                $postId,
                [
                    'title' => $attributes['title'],
                    'description' => $attributes['description'],
                    'url' => $url,
                ],
                $attributes['page_access_token']
            );
        } catch (\Facebook\Exceptions\FacebookResponseException $e) {
            $status = 500;

            if ($e->getHttpStatusCode() != 500) {
                $status = $e->getHttpStatusCode();
            }

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        } catch (\Facebook\Exceptions\FacebookSDKException $e) {
            $status = 500;

            throw new HttpException($status, 'Graph returned an error:' .  $e->getMessage());
        }

        $graphNode = $response->getBody();

        return json_decode($graphNode);
    }
}
