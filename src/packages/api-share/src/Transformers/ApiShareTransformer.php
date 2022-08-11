<?php

namespace GGPHP\ApiShare\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\ApiShare\Models\ApiShare;
use GGPHP\Users\Transformers\UserTransformer;
use GGPHP\Camera\Transformers\CameraTransformer;

/**
 * Class ApiShareTransformer.
 *
 * @package namespace App\Transformers;
 */
class ApiShareTransformer extends BaseTransformer
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
    protected $availableIncludes = ['accessApi'];

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
            'access_api_count' => $model->accessApi->count()
        ];
    }

    /**
     * include AccessApi
     *
     * @param ApiShare $item
     * @return type
     */
    public function includeAccessApi(ApiShare $model)
    {
        return $this->collection($model->accessApi, new AccessApiTransformer, 'AccessApi');
    }
}
