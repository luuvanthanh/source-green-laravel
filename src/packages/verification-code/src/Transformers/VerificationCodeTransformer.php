<?php

namespace GGPHP\VerificationCode\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\VerificationCode\Models\VerificationCode;
use GGPHP\Users\Transformers\UserTransformer;
use GGPHP\Camera\Transformers\CameraTransformer;

/**
 * Class VerificationCodeTransformer.
 *
 * @package namespace App\Transformers;
 */
class VerificationCodeTransformer extends BaseTransformer
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
