<?php

namespace GGPHP\WorkHour\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Users\Transformers\UserTransformer;
use GGPHP\WorkHour\Models\WorkHour;

/**
 * Class WorkHourTransformer.
 *
 * @package namespace GGPHP\WorkHour\Transformers;
 */
class WorkHourTransformer extends BaseTransformer
{

    protected $availableIncludes = ['user'];
    protected $defaultIncludes = [];

    public function customAttributes($model): array
    {
        return [
            "hours" => json_decode($model->hours),
        ];
    }

    /**
     * Include User
     * @param  WorkHour $workHour
     */
    public function includeUser(WorkHour $workHour)
    {
        if (empty($workHour->user)) {
            return;
        }

        return $this->item($workHour->user, new UserTransformer, 'User');
    }
}
