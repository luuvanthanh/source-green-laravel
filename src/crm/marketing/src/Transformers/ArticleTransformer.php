<?php

namespace GGPHP\Crm\Marketing\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\Marketing\Models\Article;

/**
 * Class CategoryDetailTransformer.
 *
 * @package namespace App\Transformers;
 */
class ArticleTransformer extends BaseTransformer
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
    protected $availableIncludes = ['postFacebookInfo'];

    /**
     * Transform the CategoryDetail entity.
     *
     * @param Article 

     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }

    public function includePostFacebookInfo(Article $article)
    {
        return $this->collection($article->postFacebookInfo, new PostFacebookInfoTransformer, 'PostFacebookInfo');
    }
}
