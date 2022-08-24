<?php

namespace GGPHP\Crm\CustomerLead\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\Category\Transformers\CategoryEventTransformer;
use GGPHP\Crm\CustomerLead\Models\EventInfo;
use GGPHP\Crm\CustomerLead\Models\HistoryCare;

/**
 * Class HistoryCareTransformer.
 *
 * @package namespace App\Transformers;
 */
class HistoryCareTransformer extends BaseTransformer
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
        $status = null;

        foreach (HistoryCare::STATUS as $key => $value) {
            if (!is_null($model->status)) {
                if ($value == $model->status) {
                    $status = $key;
                }
            }
        }
        
        return [
            'status' => $status,
            'category' => array_search($model->category, HistoryCare::CATEGORY) ? array_search($model->category, HistoryCare::CATEGORY) : null,
        ];
    }

    public function includeCustomerLead(HistoryCare $historyCare)
    {
        if (is_null($historyCare->customerLead)) {
            return;
        }

        return $this->item($historyCare->customerLead, new CustomerLeadTransformer, 'CustomerLead');
    }
}
