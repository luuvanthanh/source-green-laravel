<?php

namespace GGPHP\Crm\Facebook\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\Facebook\Models\Page;
use GGPHP\Crm\Marketing\Transformers\PostFacebookInfoTransformer;

/**
 * Class CustomerPotentialEventInfoTransformer.
 *
 * @package namespace App\Transformers;
 */
class PageTransformer extends BaseTransformer
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
    protected $availableIncludes = ['conversation', 'postFacebookInfo'];

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

    public function includeConversation(Page $page)
    {
        return $this->collection($page->userFacebookInfo, new UserFacebookInfoTransformer, 'Conversation');
    }

    public function includePostFacebookInfo(Page $page)
    {
        return $this->collection($page->postFacebookInfo, new PostFacebookInfoTransformer, 'PostFacebookInfo');
    }
}
