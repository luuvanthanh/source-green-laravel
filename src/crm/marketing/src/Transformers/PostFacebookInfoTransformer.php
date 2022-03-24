<?php

namespace GGPHP\Crm\Marketing\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\Marketing\Models\PostFacebookInfo;

/**
 * Class CategoryDetailTransformer.
 *
 * @package namespace App\Transformers;
 */
class PostFacebookInfoTransformer extends BaseTransformer
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
    protected $availableIncludes = ['articleReactionInfo', 'articleCommentInfo'];

    /**
     * Transform the CategoryDetail entity.
     *
     * @param PostFacebookInfo 

     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }

    public function includeArticleReactionInfo(PostFacebookInfo $postFacebookInfo)
    {
        return $this->collection($postFacebookInfo->articleReactionInfo, new ArticleReactionInfoTransformer, 'ArticleReactionInfo');
    }

    public function includeArticleCommentInfo(PostFacebookInfo $postFacebookInfo)
    {
        return $this->collection($postFacebookInfo->articleCommentInfo, new ArticleCommentInfoTransformer, 'ArticleCommentInfo');
    }
}
