<?php

namespace GGPHP\Crm\CustomerLead\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\CustomerLead\Models\EventInfo;

/**
 * Class EventInfoTransformer.
 *
 * @package namespace App\Transformers;
 */
class EventInfoTransformer extends BaseTransformer
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
    protected $availableIncludes = ['customerLead'];

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
    
    public function includeCustomerLead(EventInfo $eventInfo)
    {   
        if (empty($eventInfo->customerLead)) {
            return;
        }

        return $this->item($eventInfo->customerLead, new CustomerLeadTransformer, 'CustomerLead');
    }
}
