<?php

namespace GGPHP\Crm\Marketing\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class CategoryDetailTransformer.
 *
 * @package namespace App\Transformers;
 */
class ArticleCommentInfoTransformer extends BaseTransformer
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
    protected $availableIncludes = [];

    /**
     * Transform the CategoryDetail entity.
     *
     * @param ArticleCommentInfo 

     *
     * @return array
     */
    public function customAttributes($model): array
    {
        $data = [];
        $data = $model->articleCommentInfoDetail->toArray();
        
        return [
            'article_comment_info_detail' => $data
        ];
    }
}
