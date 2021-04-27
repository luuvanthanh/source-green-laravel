<?php

namespace GGPHP\Profile\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Profile\Models\Insurrance;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class InsurranceTransformer.
 *
 * @package namespace App\Transformers;
 */
class InsurranceTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['employee'];

    /**
     * Transform the custom field entity.
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [
        ];
    }

    /**
     * @param Insurrance $insurrance
     * @return mixed
     */
    public function includeEmployee(Insurrance $insurrance)
    {
        return $this->collection($insurrance->Employee, new UserTransformer, 'Employee');
    }

}
