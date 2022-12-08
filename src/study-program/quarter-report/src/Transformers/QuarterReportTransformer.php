<?php

namespace GGPHP\StudyProgram\QuarterReport\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\StudyProgram\QuarterReport\Models\QuarterReport;
use GGPHP\StudyProgram\ScriptReview\Transformers\ScriptReviewTransformer;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class ReviewDetailTransformer.
 *
 * @package namespace App\Transformers;
 */
class QuarterReportTransformer extends BaseTransformer
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
    protected $availableIncludes = ['quarterReportDetail', 'scriptReview', 'teacher', 'teacherManagement'];

    /**
     * Transform the ReviewDetail entity.
     *
     * @param ReviewChildTeacher 

     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return ['Status' => array_search($model->Status, QuarterReport::STATUS)];
    }

    public function includeQuarterReportDetail(QuarterReport $quarterReport)
    {
        return $this->collection($quarterReport->quarterReportDetail, new QuarterReportDetailTransformer, 'QuarterReportDetail');
    }

    public function includeScriptReview(QuarterReport $quarterReport)
    {
        return $this->item($quarterReport->scriptReview, new ScriptReviewTransformer, 'ScriptReview');
    }

    public function includeTeacher(QuarterReport $quarterReport)
    {
        return $this->item($quarterReport->teacher, new UserTransformer, 'Teacher');
    }

    public function includeTeacherManagement(QuarterReport $quarterReport)
    {
        return $this->item($quarterReport->teacherManagement, new UserTransformer, 'TeacherManagement');
    }
}
