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
    protected $availableIncludes = ['tag','customerLead'];

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
        if (empty($customerTag->tag)) {
            return;
        }

        return $this->item($customerTag->tag, new TagTransformer, 'Tag');
    }

    public function includeCustomerLead(CustomerTag $customerTag)
    {   
        if (empty($customerTag->customerLead)) {
            return;
        }

        return $this->item($customerTag->customerLead, new CustomerLeadTransformer, 'CustomerLead');
    }
}
