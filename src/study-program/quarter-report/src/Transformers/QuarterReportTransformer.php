<?php

namespace GGPHP\StudyProgram\QuarterReport\Transformers;

use GGPHP\Clover\Transformers\StudentTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Transformers\SchoolYearTransformer;
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
    protected $defaultIncludes = [
        'quarterReportDetail', 'teacher', 'teacherManagement',
        'student', 'schoolYear', 'scriptReview', 'teacherSent'
    ];

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
        return [
            'Type' => array_search($model->Type, QuarterReport::TYPE),
            'Status' => array_search($model->Status, QuarterReport::STATUS)
        ];
    }

    public function includeQuarterReportDetail(QuarterReport $quarterReport)
    {
        return $this->collection($quarterReport->quarterReportDetail, new QuarterReportDetailTransformer, 'QuarterReportDetail');
    }

    public function includeScriptReview(QuarterReport $quarterReport)
    {
        if (is_null($quarterReport->scriptReview)) {
            return null;
        }
        return $this->item($quarterReport->scriptReview, new ScriptReviewTransformer, 'ScriptReview');
    }

    public function includeTeacher(QuarterReport $quarterReport)
    {
        if (is_null($quarterReport->teacher)) {
            return null;
        }
        return $this->item($quarterReport->teacher, new UserTransformer, 'Teacher');
    }

    public function includeTeacherManagement(QuarterReport $quarterReport)
    {
        if (is_null($quarterReport->teacherManagement)) {
            return null;
        }

        return $this->item($quarterReport->teacherManagement, new UserTransformer, 'TeacherManagement');
    }

    public function includeStudent(QuarterReport $quarterReport)
    {
        if (is_null($quarterReport->student)) {
            return null;
        }

        return $this->item($quarterReport->student, new StudentTransformer, 'Student');
    }

    public function includeSchoolYear(QuarterReport $quarterReport)
    {
        if (is_null($quarterReport->schoolYear)) {
            return null;
        }
        return $this->item($quarterReport->schoolYear, new SchoolYearTransformer, 'SchoolYear');
    }

    public function includeTeacherSent(QuarterReport $quarterReport)
    {
        if (is_null($quarterReport->teacherSent)) {
            return null;
        }

        return $this->item($quarterReport->teacherSent, new UserTransformer, 'TeacherSent');
    }
}
