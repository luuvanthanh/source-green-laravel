<?php

namespace GGPHP\ExpectedTime\Transformers;

use GGPHP\Arkki\Transformers\TeachingShiftTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\ExpectedTime\Models\ExpectedTime;
use GGPHP\ExpectedTime\Models\ExpectedTimeDetail;

/**
 * Class ExpectedTimeTransformer.
 *
 * @package namespace App\Transformers;
 */
class ExpectedTimeDetailTransformer extends BaseTransformer
{
    protected $availableIncludes = ['teachingShift'];

    protected $defaultIncludes = [];

    /**
     * Transform the Timekeeping entity.
     *
     * @param ExpectedTime $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [
            'Type' => array_search($model->Type, ExpectedTimeDetail::WEEK)
        ];
    }

    public function includeTeachingShift(ExpectedTimeDetail $expectedTimeDetail)
    {
        return $this->item($expectedTimeDetail->teachingShift, new TeachingShiftTransformer, 'TeachingShift');
    }
}
