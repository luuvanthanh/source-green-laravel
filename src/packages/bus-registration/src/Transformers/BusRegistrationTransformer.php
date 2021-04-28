<?php

namespace GGPHP\BusRegistration\Transformers;

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

    protected $availableIncludes = ['employee'];
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

}
