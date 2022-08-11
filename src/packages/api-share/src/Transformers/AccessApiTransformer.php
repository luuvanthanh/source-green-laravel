<?php

namespace GGPHP\ApiShare\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\ApiShare\Models\ApiShare;

/**
 * Class AccessApiTransformer.
 *
 * @package namespace App\Transformers;
 */
class AccessApiTransformer extends BaseTransformer
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
        return [
            'response' => json_decode($model->response)
        ];
    }
}
