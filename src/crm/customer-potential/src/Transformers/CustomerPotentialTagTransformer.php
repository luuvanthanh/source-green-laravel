<?php

namespace GGPHP\Crm\CustomerPotential\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\Category\Transformers\TagTransformer;
use GGPHP\Crm\CustomerPotential\Models\CustomerPotentialTag;

/**
 * Class CityTransformer.
 *
 * @package namespace App\Transformers;
 */
class CustomerPotentialTagTransformer extends BaseTransformer
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

    public function includeTag(CustomerPotentialTag $customerPotentialTag)
    {
        if (empty($customerPotentialTag->tag)) {
            return;
        }

        return $this->item($customerPotentialTag->tag, new TagTransformer, 'Tag');
    }
}
