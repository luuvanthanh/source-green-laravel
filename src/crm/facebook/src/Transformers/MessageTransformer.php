<?php

namespace GGPHP\Crm\Facebook\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\Facebook\Models\Message;

/**
 * Class CustomerPotentialEventInfoTransformer.
 *
 * @package namespace App\Transformers;
 */
class MessageTransformer extends BaseTransformer
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
    protected $availableIncludes = ['conversation'];

    /**
     * Transform the User entity.
     *
     * @param User $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }

    public function includeConversation(Message $message)
    {
        if (empty($message->conversation)) {
            return;
        }

        return $this->item($message->conversation, new ConversationTransformer, 'Conversation');
    }
}
