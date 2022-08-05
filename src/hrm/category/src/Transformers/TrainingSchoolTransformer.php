<?php

namespace GGPHP\Category\Transformers;

use GGPHP\Category\Models\TrainingSchool;
use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class TrainingSchoolTransformer.
 *
 * @package namespace GGPHP\Category\Transformers;
 */
class TrainingSchoolTransformer extends BaseTransformer
{
    protected $availableIncludes = [];

    public function customAttributes($model): array
    {
        $category = null;

        foreach (TrainingSchool::CATEGORY as $key => $value) {
            if ($value == $model->Category) {
                $category = $key;
            }
        }
        
        return [
            'Category' => $category
        ];
    }
}
