<?php

namespace GGPHP\Crm\CustomerLead\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\Category\Transformers\StatusParentLeadTransformer;
use GGPHP\Crm\CustomerLead\Models\StatusCare;
use Predis\Response\Status;

/**
 * Class EventInfoTransformer.
 *
 * @package namespace App\Transformers;
 */
class StatusCareTransformer extends BaseTransformer
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
    protected $availableIncludes = ['statusParentLead', 'customerLead'];

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

    public function includeStatusParentLead(StatusCare $statusCare)
    {
        if (empty($statusCare->statusParentLead)) {
            return;
        }

        return $this->item($statusCare->statusParentLead, new StatusParentLeadTransformer, 'StatusParentLead');
    }

    public function includeCustomerLead(StatusCare $statusCare)
    {
        if (empty($statusCare->customerLead)) {
            return;
        }

        return $this->item($statusCare->customerLead, new CustomerLeadTransformer, 'CustomerLead');
    }
}
