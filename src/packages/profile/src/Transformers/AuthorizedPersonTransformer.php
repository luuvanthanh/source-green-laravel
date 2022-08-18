<?php

namespace GGPHP\Profile\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Profile\Models\AuthorizedPerson;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class AuthorizedPersonTransformer.
 *
 * @package namespace App\Transformers;
 */
class AuthorizedPersonTransformer extends BaseTransformer
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
        return [];
    }

    /**
     * @param AuthorizedPerson $insurrance
     * @return mixed
     */
    public function includeEmployee(AuthorizedPerson $insurrance)
    {
        if (empty($insurrance->employee)) {
            return null;
        }

        return $this->item($insurrance->employee, new UserTransformer, 'Employee');
    }
}
