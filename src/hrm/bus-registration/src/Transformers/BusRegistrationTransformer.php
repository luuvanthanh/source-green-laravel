<?php

namespace GGPHP\BusRegistration\Transformers;

use GGPHP\BusRegistration\Transformers\BusRegistrationDetailTransformer;
use GGPHP\BusRegistration\Models\BusRegistration;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class BusRegistrationTransformer.
 *
 * @package namespace GGPHP\BusRegistration\Transformers;
 */
class BusRegistrationTransformer extends BaseTransformer
{

    protected $availableIncludes = ['employee', 'busRegistrationDetail'];
    protected $defaultIncludes = [];

    public function customAttributes($model): array
    {
        return [];
    }

    /**
     * Include User
     * @param  BusRegistration $busRegistration
     */
    public function includeEmployee(BusRegistration $busRegistration)
    {
        if (empty($busRegistration->employee)) {
            return;
        }

        return $this->item($busRegistration->employee, new UserTransformer, 'Employee');
    }

    /**
     * Include Owner
     * @param BusRegistration $absent
     * @return \League\Fractal\Resource\Item
     */
    public function includeBusRegistrationDetail(BusRegistration $busRegistration)
    {
        return $this->collection($busRegistration->busRegistrationDetail, new BusRegistrationDetailTransformer, 'BusRegistrationDetail');
    }
}
