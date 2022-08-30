<?php

namespace GGPHP\Crm\Facebook\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Crm\Facebook\Events\FacebookMessageReceive;
use GGPHP\Crm\Facebook\Events\FacebookStatusSendMessage;
use GGPHP\Crm\Facebook\Events\FacebookSynchronizeConversation;
use GGPHP\Crm\Facebook\Jobs\GetMessageFacebook;
use GGPHP\Crm\Facebook\Jobs\StoreDataMessageToDatabase;
use GGPHP\Crm\Facebook\Jobs\StoreMessageFacebook;
use GGPHP\Crm\Facebook\Models\Conversation;
use GGPHP\Crm\Facebook\Models\Message;
use GGPHP\Crm\Facebook\Models\Page;
use GGPHP\Crm\Facebook\Models\UserFacebookInfo;
use GGPHP\Crm\Facebook\Presenters\MessagePresenter;
use GGPHP\Crm\Facebook\Repositories\Contracts\MessageRepository;
use GGPHP\Crm\Facebook\Services\FacebookService;
use Illuminate\Support\Facades\Storage;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Illuminate\Support\Facades\Http;

use function CloudCreativity\LaravelJsonApi\json_decode;

/**
 * Class PageRepositoryEloquent.
 *
 * @package namespace App\Repositories;
 */
class MessageRepositoryEloquent extends BaseRepository implements MessageRepository
{

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'created_at',
    ];
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Message::class;
    }



    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    public function presenter()
    {
        return MessagePresenter::class;
    }

    public function getMessage($attributes)
    {
        if (!empty($attributes['conversation_id'])) {
            $this->model = $this->model->where('conversation_id', $attributes['conversation_id']);
            $this->seenConversation($attributes['conversation_id']);
        }   

        if (!empty($attributes['limit'])) {
            $message = $this->paginate($attributes['limit']);
        } else {
            $message = $this->get();
        }

        return $message;
    }

    public function checkCutomerConversationMessage($attributes)
    {
        $page = Page::where('page_id_facebook', $attributes['from'])->first();
        if (is_null($page)) {
            $userId = $attributes['from'];
        } else {
            $userId = $attributes['to'];
        }
        $userFacebookInfo = UserFacebookInfo::where('user_id', $userId)->first();
        //\Log::info($userFacebookInfo);
        if (!is_null($userFacebookInfo)) {
            $conversation = Conversation::where('user_facebook_info_id', $userFacebookInfo->id)->first();
        } else {
            $conversation = null;
        }
        if (is_null($conversation)) {
            $this->storeConversationMessageNew($attributes);
        } else {
            $this->storeMessage($attributes);
        }
    }

    public function storeMessage($attributes)
    {
        //\Log::info($attributes);
        $page = Page::where('page_id_facebook', $attributes['from'])->first();
        //\Log::info($page);
        $notiInbox = Conversation::NOTI_INBOX['SEEN'];
        if (!is_null($page)) {
            $from = $page->id;
            $pageId = $page->id;
            $userFacebookInfo = UserFacebookInfo::where('user_id', $attributes['to'])->first();
            $to = $userFacebookInfo->id;
            $userFacebookInfoId = $userFacebookInfo->id;
        } else {
            $notiInbox = Conversation::NOTI_INBOX['NOT_SEEN'];
            $userFacebookInfo = UserFacebookInfo::where('user_id', $attributes['from'])->first();
            $from = $userFacebookInfo->id;
            $userFacebookInfoId = $userFacebookInfo->id;
            $page = Page::where('page_id_facebook', $attributes['to'])->first();
            $to =  $page->id;
            $pageId = $page->id;
        }

        $conversation = Conversation::where('page_id', $pageId)->where('user_facebook_info_id', $userFacebookInfoId)->first();
        $conversation->update(['noti_inbox' => $notiInbox]);
        $dataMessage = [
            'content' => $attributes['content'],
            'message_id_facebook' => $attributes['message_id_facebook'],
            'from' => $from,
            'to' => $to,
            'conversation_id' => $conversation->id,
            'watermark' => $attributes['watermark']
        ];

        $message = Message::create($dataMessage);
        $created_at = $message->created_at;
        //\Log::info("khach hang cu");
        broadcast(new FacebookMessageReceive([
            'from' => $message->from,
            'to' => $message->to,
            'content' => $message->content
        ]));

        $dataConversation = [
            'time' => $created_at->setTimezone('GMT+7')->format('Y-m-d H:i'),
            'snippet' => $message->content,
            'from' => $message->from,
            'to' => $message->to,
            'show_conversation' => true
        ];

        $conversation->update($dataConversation);
    }

    public function storeConversationMessageNew($attributes)
    {
        $page = Page::where('page_id_facebook', $attributes['from'])->first();
        $notiInbox = Conversation::NOTI_INBOX['SEEN'];
        if (!is_null($page)) {
            $userId = $attributes['to'];
            $pageId = $page->id;
        } else {
            $notiInbox = Conversation::NOTI_INBOX['NOT_SEEN'];
            $userId = $attributes['from'];
            $page = Page::where('page_id_facebook', $attributes['to'])->first();
            $pageId = $page->id;
        }
        $userFacebookInfo = UserFacebookInfo::where('user_id', $userId)->first();
        if (is_null($userFacebookInfo)) {
            $userFacebookInfo = UserFacebookInfo::create(['user_id' => $userId]);
        }
        $dataConversation = [
            'page_id' => $pageId,
            'user_facebook_info_id' => $userFacebookInfo->id,
            'show_conversation' => true
        ];
        $conversation = Conversation::create($dataConversation);
        $dataMessage = [
            'content' => $attributes['content'],
            'message_id_facebook' => $attributes['message_id_facebook'],
            'from' => $userFacebookInfo->id,
            'to' => $page->id,
            'conversation_id' => $conversation->id,
            'watermark' => $attributes['watermark']
        ];

        $message = Message::create($dataMessage);

        $created_at = $message->created_at;
        $dataConversation = [
            'time' => $created_at->setTimezone('GMT+7')->format('Y-m-d H:i'),
            'snippet' => $message->content,
            'noti_inbox' => $notiInbox,
            'from' => $message->from,
            'to' => $message->to,
            'show_conversation' => true
        ];

        $conversation->update($dataConversation);

        //\Log::info("khach hang moi");
        broadcast(new FacebookSynchronizeConversation([
            'synchronize_conversation' => 'synchronizeConversation'
        ]));

        broadcast(new FacebookMessageReceive([
            'from' => $message->from,
            'to' => $message->to,
            'content' => $message->content
        ]));
    }

    public function seenConversation($conversation_id)
    {
        $conversation = Conversation::find($conversation_id);
        $conversation->update(['noti_inbox' => Conversation::NOTI_INBOX['SEEN']]);
        return $conversation;
    }

    public function statusSendMessage($attributes, $statusSendMessage)
    {

        $page = Page::where('page_id_facebook', $attributes['from'])->first();
        //\Log::info($page);
        if (is_null($page)) {

            if (!is_null($page)) {
                $pageId = $page->id;
                $userFacebookInfo = UserFacebookInfo::where('user_id', $attributes['to'])->first();
                $userFacebookInfoId = $userFacebookInfo->id;
            } else {
                $userFacebookInfo = UserFacebookInfo::where('user_id', $attributes['from'])->first();
                $userFacebookInfoId = $userFacebookInfo->id;
                $page = Page::where('page_id_facebook', $attributes['to'])->first();
                $pageId = $page->id;
            }
            $conversation = Conversation::where('page_id', $pageId)->where('user_facebook_info_id', $userFacebookInfoId)->first();

            if (isset($statusSendMessage['delivery'])) {
                broadcast(new FacebookStatusSendMessage([
                    'status_send_message' => 'received',
                    'conversation_id' => $conversation->id
                ]));

                if (isset($statusSendMessage['delivery']['watermark'])) {
                    $message = Message::where('watermark', $statusSendMessage['delivery']['watermark'])->first();

                    if (!is_null($message)) {
                        $message->watermark = $statusSendMessage['delivery']['watermark'];
                        if ($message->status_send_message != Message::STATUS_SEND_MESSAGE['READ']) {
                            $message->status_send_message = Message::STATUS_SEND_MESSAGE['RECEIVED'];
                            $message->update();
                        }
                    }
                }
                $conversation->update(['status_send_message' => Conversation::STATUS_SEND_MESSAGE['RECEIVED']]);
            } elseif (isset($statusSendMessage['read'])) {
                broadcast(new FacebookStatusSendMessage([
                    'status_send_message' => 'read',
                    'conversation_id' => $conversation->id
                ]));
                $messages = Message::where('from', $pageId)->where('to', $userFacebookInfoId)->get();

                foreach ($messages as $message) {
                    $message->status_send_message = Message::STATUS_SEND_MESSAGE['READ'];
                    $message->update();
                    $conversation->update(['status_send_message' => Conversation::STATUS_SEND_MESSAGE['READ']]);
                }
            }
        }
    }

    public function refreshLinkFile($attributes)
    {
        $messageVideo = Message::where('conversation_id', $attributes['conversation_id'])->whereLike('content', 'https://video')->get();

        if (!empty($messageVideo)) {
            foreach ($messageVideo as $value) {
                $statusCode = $this->getResponseCode($value->content);
                if ($statusCode == '403') {
                    $attributes['message_id_facebook'] = $value->message_id_facebook;
                    $attachmentMessage = FacebookService::getAttachmentMessage($attributes);
                    $value->update(['content' => $attachmentMessage[0]->video_data->url]);
                }
            }
        }

        $messageFile = Message::where('conversation_id', $attributes['conversation_id'])->whereLike('content', 'https://cdn.fbsbx.com')->get();

        if (!empty($messageFile)) {
            foreach ($messageFile as $value) {
                $statusCode = $this->getResponseCode($value->content);
                if ($statusCode == '403') {
                    $attributes['message_id_facebook'] = $value->message_id_facebook;
                    $attachmentMessage = FacebookService::getAttachmentMessage($attributes);
                    $value->update(['content' => $attachmentMessage[0]->file_url]);
                }
            }
        }

        // $messageImage = Message::where('conversation_id', $attributes['conversation_id'])->whereLike('content', 'https://scontent')->get();
        // if (!empty($messageImage)) {
        //     foreach ($messageImage as $value) {
        //         $statusCode = $this->getResponseCode($value->content);
        //         if ($statusCode == '403') {
        //             $attributes['message_id_facebook'] = $value->message_id_facebook;
        //             $attachmentMessage = FacebookService::getAttachmentMessage($attributes);
        //             $value->update(['content' => $attachmentMessage[0]->image_data->url]);
        //         }
        //     }
        // }

        return null;
    }

    function getResponseCode($url)
    {
        file_get_contents($url);
        list($version, $status, $text) = explode(' ', $http_response_header[0], 3);
        return $status;
    }

    public function storeFileByUrl($url)
    {
        $contents = file_get_contents($url);
        $url = strtok($url, '?');
        $name = substr($url, strrpos($url, '/') + 1);
        Storage::disk('local')->put('public/files/' . $name, $contents);
        $url = env('URL_CRM') . '/storage/files/' . $name;
        return $url;
    }

    public static function syncMessage($attributes)
    {
        if (!empty($attributes['data_page'])) {
            foreach ($attributes['data_page'] as $attributes) {
                dispatch(new GetMessageFacebook($attributes));
            }
        }
    }

    public static function getMessageFacebook($attributes)
    {
        foreach (Conversation::FOLDER as $folder) {
            $attributes['folder'] = $folder;
            $conversations = FacebookService::pageConversation($attributes);
            if (!empty($conversations)) {
                foreach ($conversations as $key => $conversation) {
                    $attributes['conversation_id'] = $conversation->id;
                    $messages = FacebookService::pageConversationMessage($attributes);
                    dispatch(new StoreMessageFacebook($messages));
                }
            }
        }
    }

    public static function storeMessageFacebook($messages)
    {
        if (!empty($messages)) {
            foreach ($messages as $key => $message) {
                if (isset($message->attachments)) {
                    $attachments = $message->attachments;
                    $url = self::handleFile($attachments);
                    $content = $url;
                } else {
                    $content = $message->message;
                }

                $attributes = [
                    'from' => $message->from->id,
                    'to' => $message->to->data[0]->id,
                    'content' => $content,
                    'message_id_facebook' => $message->id,
                    'created_at' => Carbon::now()->addSeconds($key + 1),
                    'updated_at' => Carbon::now()->addSeconds($key + 1)
                ];

                dispatch(new StoreDataMessageToDatabase($attributes));
            }
        }
    }

    public static function handleFile($attachments)
    {
        foreach ($attachments->data as $key => $attachment) {
            if (!empty($attachment->image_data)) {
                $url = $attachment->image_data->url;
            } elseif (!empty($attachment->video_data)) {
                $url = $attachment->video_data->url;
            } elseif (!empty($attachment->file_url)) {
                $url = $attachment->file_url;
            }
            $contents = file_get_contents($url);
            $url = strtok($url, '?');
            $name = substr($url, strrpos($url, '/') + 1);
            Storage::disk('local')->put('public/files/' . $name, $contents);
            $url = env('URL_CRM') . '/storage/files/' . $name;
            return $url;
        }
    }

    public static function storeDataMessageToDatabase($attributes)
    {

        $page = Page::where('page_id_facebook', $attributes['from'])->first();
        $notiInbox = Conversation::NOTI_INBOX['SEEN'];

        if (!is_null($page)) {
            $from = $page->id;
            $pageId = $page->id;
            $userFacebookInfo = UserFacebookInfo::where('user_id', $attributes['to'])->first();
            $to = $userFacebookInfo->id;
            $userFacebookInfoId = $userFacebookInfo->id;
        } else {
            $notiInbox = Conversation::NOTI_INBOX['NOT_SEEN'];
            $userFacebookInfo = UserFacebookInfo::where('user_id', $attributes['from'])->first();
            $from = $userFacebookInfo->id;
            $userFacebookInfoId = $userFacebookInfo->id;
            $page = Page::where('page_id_facebook', $attributes['to'])->first();
            $to =  $page->id;
            $pageId = $page->id;
        }

        $conversation = Conversation::where('page_id', $pageId)->where('user_facebook_info_id', $userFacebookInfoId)->first();

        $message = Message::where('message_id_facebook', $attributes['message_id_facebook'])->first();

        if (!is_null($conversation)) {
            $dataMessage = [
                'content' => $attributes['content'],
                'message_id_facebook' => $attributes['message_id_facebook'],
                'from' => $from,
                'to' => $to,
                'conversation_id' => $conversation->id,
                'created_at' => $attributes['created_at'],
                'updated_at' => $attributes['updated_at']
            ];

            if (is_null($message)) {
                $message = Message::create($dataMessage);
            } else {
                $message->update($dataMessage);
            }

            $created_at = $message->created_at;
            $dataConversation = [
                'time' => $created_at->setTimezone('GMT+7')->format('Y-m-d H:i'),
                'snippet' => $message->content,
                'from' => $message->from,
                'to' => $message->to,
                'show_conversation' => true,
                'noti_inbox' => $notiInbox
            ];

            $conversation->update($dataConversation);
        }
    }
}
