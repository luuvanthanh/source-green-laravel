<?php

namespace GGPHP\Crm\Marketing\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\Marketing\Models\MarketingProgram;

/**
 * Class CategoryDetailTransformer.
 *
 * @package namespace App\Transformers;
 */
class MarketingProgramTransformer extends BaseTransformer
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
    protected $availableIncludes = ['article'];

    /**
     * Transform the CategoryDetail entity.
     *
     * @param MarketingProgram 

     *
     * @return array
     */
    public function customAttributes($model): array
    {
        $status = null;

        foreach (MarketingProgram::STATUS as $key => $value) {

            if ($value == $model->status) {
                $status = $key;
            }
        }
        return [
            'status' => $status,
        ];
    }

    public function includeArticle(MarketingProgram $marketingProgram)
    {
        return $this->collection($marketingProgram->article, new ArticleTransformer, 'Article');
    }
}
