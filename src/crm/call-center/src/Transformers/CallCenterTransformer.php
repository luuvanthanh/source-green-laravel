<?php

namespace GGPHP\Crm\CallCenter\Transformers;

use Aws\History;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\CallCenter\Models\HistoryCall;
use GGPHP\Crm\CustomerLead\Transformers\CustomerLeadTransformer;

/**
 * Class CallCenterTransformer.
 *
 * @package namespace App\Transformers;
 */
class CallCenterTransformer extends BaseTransformer
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

    public function includeCustomerLead(HistoryCall $historyCall)
    {
        if ($historyCall->loadCount('customerLead')->customer_lead_count < 1) {
            return null;
        }

        return $this->item($historyCall->customerLead, new CustomerLeadTransformer, 'CustomerLead');
    }
}
