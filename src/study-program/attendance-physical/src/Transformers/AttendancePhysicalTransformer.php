<?php

namespace GGPHP\StudyProgram\AttendancePhysical\Transformers;

use CreateAttendancePhysicalDetailsTable;
use GGPHP\Clover\Transformers\StudentTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Transformers\SchoolYearTransformer;
use GGPHP\StudyProgram\AttendancePhysical\Models\AttendancePhysical;
use GGPHP\StudyProgram\ScriptReview\Transformers\ScriptReviewTransformer;
use GGPHP\StudyProgram\Setting\Transformers\SampleCommentTransformer;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class ReviewDetailTransformer.
 *
 * @package namespace App\Transformers;
 */
class AttendancePhysicalTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [];

    /**
     * Array attribute doesn't parse.
     */
    public $ignoreAttributes = [];

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = [];

    /**
     * Transform the ReviewDetail entity.
     *
     * @param ReviewChildTeacher 

     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }
}
