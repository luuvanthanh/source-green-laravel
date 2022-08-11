<?php

namespace GGPHP\AiService\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\AiService\Models\AiService;
use GGPHP\Users\Transformers\UserTransformer;
use GGPHP\Camera\Transformers\CameraTransformer;

/**
 * Class AiServiceTransformer.
 *
 * @package namespace App\Transformers;
 */
class AiServiceTransformer extends BaseTransformer
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
