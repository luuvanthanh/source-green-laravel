<?php

namespace GGPHP\EventConfig\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\EventConfig\Models\EventConfig;
use GGPHP\Users\Transformers\UserTransformer;
use GGPHP\Camera\Transformers\CameraTransformer;

/**
 * Class EventConfigTransformer.
 *
 * @package namespace App\Transformers;
 */
class EventConfigTransformer extends BaseTransformer
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
