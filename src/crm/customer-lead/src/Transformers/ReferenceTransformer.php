<?php

namespace GGPHP\Crm\CustomerLead\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\Category\Transformers\StatusParentLeadTransformer;
use GGPHP\Crm\CustomerLead\Models\Reference;

/**
 * Class EventInfoTransformer.
 *
 * @package namespace App\Transformers;
 */
class ReferenceTransformer extends BaseTransformer
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
    protected $availableIncludes = ['statusParentLead','customerLead'];

    /**
     * Transform the User entity.
     *
     * @param Reference $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }

    public function includeStatusParentLead(Reference $reference)
    {   
        if (empty($reference->statusParentLead)) {
            return;
        }

        return $this->item($reference->statusParentLead, new StatusParentLeadTransformer, 'StatusParentLead');
    }

    public function includeCustomerLead(Reference $reference)
    {   
        if (empty($reference->customerLead)) {
            return;
        }

        return $this->item($reference->customerLead, new CustomerLeadTransformer, 'CustomerLead');
    }
}
