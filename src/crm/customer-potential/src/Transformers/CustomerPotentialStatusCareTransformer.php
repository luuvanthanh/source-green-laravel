<?php

namespace GGPHP\Crm\CustomerPotential\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\Category\Transformers\StatusParentLeadTransformer;
use GGPHP\Crm\Category\Transformers\StatusParentPotentialTransformer;
use GGPHP\Crm\CustomerPotential\Models\CustomerPotentialStatusCare;
use GGPHP\Crm\CustomerPotential\Models\StatusCare;

/**
 * Class EventInfoTransformer.
 *
 * @package namespace App\Transformers;
 */
class CustomerPotentialStatusCareTransformer extends BaseTransformer
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
    protected $availableIncludes = ['statusParentPotential'];

    /**
     * Transform the User entity.
     *
     * @param StatusCare $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [
            'user_update_info' => json_decode($model->user_update_info),
        ];
    }

    public function includeStatusParentPotential(CustomerPotentialStatusCare $customerPotentialStatusCare)
    {
        if (empty($customerPotentialStatusCare->statusParentPotential)) {
            return;
        }

        return $this->item($customerPotentialStatusCare->statusParentPotential, new StatusParentPotentialTransformer, 'StatusParentPotential');
    }
}
