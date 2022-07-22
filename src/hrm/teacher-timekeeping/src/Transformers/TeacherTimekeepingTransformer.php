<?php

namespace GGPHP\TeacherTimekeeping\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\TeacherTimekeeping\Models\TeacherTimekeeping;

/**
 * Class TeacherTimekeepingTransformer.
 *
 * @package namespace App\Transformers;
 */
class TeacherTimekeepingTransformer extends BaseTransformer
{
    protected $availableIncludes = [];
    protected $defaultIncludes = [];

    /**
     * Transform the Timekeeping entity.
     *
     * @param TeacherTimekeeping $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [
            'Status' => array_search($model->Status, TeacherTimekeeping::STATUS),
            'Type' => array_search($model->Type, TeacherTimekeeping::TYPE)
        ];
    }
}
