<?php

namespace GGPHP\Crm\Facebook\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\Facebook\Models\Conversation;

/**
 * Class CustomerPotentialEventInfoTransformer.
 *
 * @package namespace App\Transformers;
 */
class ConversationTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [];

    /**
     * Array attribute doesn't parse.
     */
    public $ignoreAttributes = [];

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['userFacebookInfo', 'page'];

    /**
     * Transform the User entity.
     *
     * @param User $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        $noti_inbox = null;

        foreach (Conversation::NOTI_INBOX as $key => $value) {
            if ($value == $model->noti_inbox) {
                $noti_inbox = $key;
            }
        }
        return [
            'noti_inbox' => $noti_inbox
        ];
    }

    public function includeUserFacebookInfo(Conversation $conversation)
    {
        if (empty($conversation->userFacebookInfo)) {
            return;
        }

        return $this->item($conversation->userFacebookInfo, new UserFacebookInfoTransformer, 'UserFacebookInfo');
    }

    public function includePage(Conversation $conversation)
    {

        if (empty($conversation->page)) {
            return;
        }

        return $this->item($conversation->page, new PageTransformer, 'Page');
    }
}
