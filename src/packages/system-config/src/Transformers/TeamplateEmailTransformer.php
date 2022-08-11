<?php

namespace GGPHP\SystemConfig\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class TeamplateEmailTransformer.
 *
 * @package namespace App\Transformers;
 */
class TeamplateEmailTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [];

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = [];

    /**
     * Array attribute doesn't parse.
     */
    public $ignoreAttributes = [];

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
}
