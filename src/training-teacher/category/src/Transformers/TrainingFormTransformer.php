<?php

namespace GGPHP\TrainingTeacher\Category\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\TrainingTeacher\Category\Models\TrainingForm;

/**
 * Class TrainingFormTransformer.
 *
 * @package namespace GGPHP\ TrainingTeacher\Category\Transformers;
 */
class TrainingFormTransformer extends BaseTransformer
{
    protected $availableIncludes = [];

    public function customAttributes($model): array
    {
        return [
            'Type' => array_search($model->Type, TrainingForm::TYPE_TRAINING)
        ];
    }
}
