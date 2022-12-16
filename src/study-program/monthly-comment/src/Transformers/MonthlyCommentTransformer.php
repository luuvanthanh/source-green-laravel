<?php

namespace GGPHP\StudyProgram\MonthlyComment\Transformers;

use CreateMonthlyCommentDetailsTable;
use GGPHP\Clover\Transformers\StudentTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Transformers\SchoolYearTransformer;
use GGPHP\StudyProgram\MonthlyComment\Models\MonthlyComment;
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
    protected $defaultIncludes = ['teacher', 'teacherManagement', 'student', 'schoolYear', 'monthlyCommentDetail'];

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
            'Status' => array_search($model->Status, MonthlyComment::STATUS)
        ];
    }

    public function includeTeacher(MonthlyComment $monthlyComment)
    {
        return $this->item($monthlyComment->teacher, new UserTransformer, 'Teacher');
    }

    public function includeTeacherManagement(MonthlyComment $monthlyComment)
    {
        return $this->item($monthlyComment->teacherManagement, new UserTransformer, 'TeacherManagement');
    }

    public function includeStudent(MonthlyComment $monthlyComment)
    {
        return $this->item($monthlyComment->student, new StudentTransformer, 'Student');
    }

    public function includeSchoolYear(MonthlyComment $monthlyComment)
    {
        if (!is_null($monthlyComment->SchoolYearId)) {
            return $this->item($monthlyComment->schoolYear, new SchoolYearTransformer, 'SchoolYear');
        } else {
            return null;
        }
    }

    public function includeMonthlyCommentDetail(MonthlyComment $monthlyComment)
    {
        return $this->collection($monthlyComment->monthlyCommentDetail, new MonthlyCommentDetailTransformer, 'MonthlyCommentDetail');
    }
}
