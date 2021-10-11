<?php

namespace GGPHP\Crm\CustomerPotentail\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\Category\Transformers\TagTransformer;
use GGPHP\Crm\CustomerPotentail\Models\CustomerPotentailTag;

/**
 * Class CityTransformer.
 *
 * @package namespace App\Transformers;
 */
class CustomerPotentailTagTransformer extends BaseTransformer
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
     * Transform the CategoryDetail entity.
     *
     * @param  

     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }

    public function includeTag(CustomerPotentailTag $customerPotentailTag)
    {
        if (empty($customerPotentailTag->tag)) {
            return;
        }
        
        return $this->item($customerPotentailTag->tag, new TagTransformer, 'Tag');
    }
}
