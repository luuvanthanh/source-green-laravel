<?php

namespace GGPHP\Reward\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Reward\Models\Reward;

/**
 * Class TimekeepingTransformer.
 *
 * @package namespace App\Transformers;
 */
class RewardTransformer extends BaseTransformer
{
    /**
     * Transform the Timekeeping entity.
     *
     * @param Reward $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [
        ];
    }
}
