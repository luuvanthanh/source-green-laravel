<?php

namespace GGPHP\Crm\CustomerPotential\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\Category\Transformers\StatusParentPotentialTransformer;
use GGPHP\Crm\CustomerPotential\Models\CustomerPotentialReference;

/**
 * Class CustomerPotentialEventInfoTransformer.
 *
 * @package namespace App\Transformers;
 */
class CustomerPotentialReferenceTransformer extends BaseTransformer
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
    protected $availableIncludes = ['customerPotential','StatusParentPotential'];

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

    public function includeCustomerPotential(CustomerPotentialReference $customerPotentialReference)
    {
        if (empty($customerPotentialReference->customerPotential)) {
            return;
        }

        return $this->item($customerPotentialReference->customerPotential, new CustomerPotentialTransformer, 'CustomerPotential');
    }

    public function includeStatusParentPotential(CustomerPotentialReference $customerPotentialReference)
    {
        if (empty($customerPotentialReference->StatusParentPotential)) {
            return;
        }

        return $this->item($customerPotentialReference->StatusParentPotential, new StatusParentPotentialTransformer, 'StatusParentPotential');
    }
}
