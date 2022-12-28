<?php

namespace GGPHP\StudyProgram\MonthlyComment\Transformers;

use CreateMonthlyCommentDetailsTable;
use GGPHP\Clover\Transformers\StudentTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Transformers\SchoolYearTransformer;
use GGPHP\StudyProgram\MonthlyComment\Models\MonthlyComment;
use GGPHP\StudyProgram\ScriptReview\Transformers\ScriptReviewTransformer;
use GGPHP\StudyProgram\Setting\Transformers\SampleCommentTransformer;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class ReviewDetailTransformer.
 *
 * @package namespace App\Transformers;
 */
class MonthlyCommentTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [
        'teacher', 'teacherManagement', 'student',
        'monthlyCommentDetail', 'scriptReview', 'teacherSent'
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
    protected $availableIncludes = ['schoolYear'];

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
            'Status' => array_search($model->Status, MonthlyComment::STATUS),
            'Type' => array_search($model->Type, MonthlyComment::TYPE)
        ];
    }

    public function includeTeacher(MonthlyComment $monthlyComment)
    {
        if (is_null($monthlyComment->teacher)) {
            return null;
        }

        return $this->item($monthlyComment->teacher, new UserTransformer, 'Teacher');
    }

    public function includeTeacherManagement(MonthlyComment $monthlyComment)
    {
        if (is_null($monthlyComment->teacherManagement)) {
            return null;
        }

        return $this->item($monthlyComment->teacherManagement, new UserTransformer, 'TeacherManagement');
    }

    public function includeStudent(MonthlyComment $monthlyComment)
    {
        if (is_null($monthlyComment->student)) {
            return null;
        }

        return $this->item($monthlyComment->student, new StudentTransformer, 'Student');
    }

    public function includeSchoolYear(MonthlyComment $monthlyComment)
    {
        if (is_null($monthlyComment->schoolYear)) {
            return null;
        }

        return $this->item($monthlyComment->schoolYear, new SchoolYearTransformer, 'SchoolYear');
    }

    public function includeMonthlyCommentDetail(MonthlyComment $monthlyComment)
    {
        return $this->collection($monthlyComment->monthlyCommentDetail, new MonthlyCommentDetailTransformer, 'MonthlyCommentDetail');
    }

    public function includeScriptReview(MonthlyComment $monthlyComment)
    {
        if (is_null($monthlyComment->scriptReview)) {
            return null;
        }

        return $this->item($monthlyComment->scriptReview, new ScriptReviewTransformer, 'ScriptReview');
    }

    public function includeTeacherSent(MonthlyComment $monthlyComment)
    {
        if (is_null($monthlyComment->teacherSent)) {
            return null;
        }

        return $this->item($monthlyComment->teacherSent, new UserTransformer, 'TeacherSent');
    }
}
