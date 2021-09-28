<?php

namespace GGPHP\Crm\CustomerLead\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\CustomerLead\Models\CustomerLead;

/**
 * Class CityTransformer.
 *
 * @package namespace App\Transformers;
 */
class CustomerLeadTransformer extends BaseTransformer
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
    protected $availableIncludes = ['reference'];

    /**
     * Transform the CategoryDetail entity.
     *
     * @param  

     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [
            "employee_info" => json_decode($model->employee_info),
            "user_create_info" => json_decode($model->user_create_info),
        ];
    }

    public function includeReference(CustomerLead $customerLead)
    {   
        if (empty($customerLead->reference)) {
            return;
        }

        return $this->item($customerLead->reference, new ReferenceTransformer, 'Reference');
    }
}
