<?php

namespace GGPHP\Crm\CustomerLead\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\Category\Transformers\StatusParentLeadTransformer;
use GGPHP\Crm\CustomerLead\Models\StatusLead;
use Predis\Response\Status;

/**
 * Class EventInfoTransformer.
 *
 * @package namespace App\Transformers;
 */
class StatusLeadTransformer extends BaseTransformer
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
     * @param StatusLead $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        $status = null;
        foreach (StatusLead::STATUS_LEAD as $key => $value) {
            if (!is_null($model->status)) {
                if ($value == $model->status) {
                    $status = $key;
                }
            }
        }
        return [
            'user_update_info' => json_decode($model->user_update_info),
            'status' => $status
        ];
    }

    public function includeCustomerLead(StatusLead $statusLead)
    {
        if (empty($statusLead->customerLead)) {
            return;
        }

        return $this->item($statusLead->customerLead, new CustomerLeadTransformer, 'CustomerLead');
    }
}
