<?php

namespace GGPHP\Crm\CustomerLead\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\Category\Transformers\TagTransformer;
use GGPHP\Crm\CustomerLead\Models\CustomerTag;

/**
 * Class EventInfoTransformer.
 *
 * @package namespace App\Transformers;
 */
class CustomerTagTransformer extends BaseTransformer
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
    protected $availableIncludes = ['tag'];

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

    public function includeTag(CustomerTag $customerTag)
    {
        
        return $this->item($customerTag->tag, new TagTransformer, 'Tag');
    }
}
