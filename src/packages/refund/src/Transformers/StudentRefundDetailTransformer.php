<?php

namespace GGPHP\Refund\Transformers;

use GGPHP\Clover\Transformers\StudentTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Refund\Models\StudentRefundDetail;

/**
 * Class StudentRefundDetailTranformer.
 *
 * @package namespace GGPHP\Refund\Transformers;
 */
class StudentRefundDetailTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = ['student'];

    /**
     * Transform the custom field entity.
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }

    public function includeStudent(StudentRefundDetail $model)
    {
        if (empty($model->student)) {
            return null;
        }

        return $this->item($model->student, new StudentTransformer, 'Student');
    }
}
