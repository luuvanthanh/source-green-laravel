<?php

namespace GGPHP\InOutHistories\Transformers;

use GGPHP\Clover\Transformers\StudentTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\InOutHistories\Models\InOutHistories;

/**
 * Class InOutHistoriesTransformer.
 *
 * @package namespace GGPHP\InOutHistories\Transformers;
 */
class InOutHistoriesTransformer extends BaseTransformer
{

    protected $availableIncludes = ['student'];
    protected $defaultIncludes = [];

    public function customAttributes($model): array
    {
        return [];
    }

    /**
     * Include Student
     * @param  InOutHistories $inOutHistories
     */
    public function includeStudent(InOutHistories $inOutHistories)
    {
        if (empty($inOutHistories->student)) {
            return;
        }

        return $this->item($inOutHistories->student, new StudentTransformer, 'Student');
    }
}
