<?php

namespace GGPHP\StudyProgram\ScriptReview\Transformers;

use GGPHP\Category\Transformers\BranchTransformer;
use GGPHP\ChildDevelop\Category\Transformers\NameAssessmentPeriodTransformer;
use GGPHP\Clover\Transformers\ClassesTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Transformers\SchoolYearTransformer;
use GGPHP\StudyProgram\ScriptReview\Models\ScriptReview;

/**
 * Class ReviewDetailTransformer.
 *
 * @package namespace App\Transformers;
 */
class ScriptReviewTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [
        'scriptReviewSubject', 'scriptReviewComment', 'branch', 'classes', 'nameAssessmentPeriod', 'schoolYear'
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
            'Type' => array_search($model->Type, ScriptReview::TYPE)
        ];
    }

    public function includeScriptReviewSubject(ScriptReview $scriptReview)
    {
        return $this->collection($scriptReview->scriptReviewSubject, new ScriptReviewSubjectTransformer, 'ScriptReviewSubject');
    }

    public function includeScriptReviewComment(ScriptReview $scriptReview)
    {
        return $this->collection($scriptReview->scriptReviewComment, new ScriptReviewCommentTransformer, 'ScriptReviewComment');
    }

    public function includeBranch(ScriptReview $scriptReview)
    {
        return $this->collection($scriptReview->branch, new BranchTransformer, 'Branch');
    }

    public function includeClasses(ScriptReview $scriptReview)
    {
        return $this->collection($scriptReview->classes, new ClassesTransformer, 'Classes');
    }

    public function includeNameAssessmentPeriod(ScriptReview $scriptReview)
    {
        if (!is_null($scriptReview->NameAssessmentPeriodId)) {
            return $this->item($scriptReview->nameAssessmentPeriod, new NameAssessmentPeriodTransformer, 'NameAssessmentPeriod');
        } else {
            return null;
        }
    }

    public function includeSchoolYear(ScriptReview $scriptReview)
    {
        if (is_null($scriptReview->schoolYear)) {
            return null;
        }
        return $this->item($scriptReview->schoolYear, new SchoolYearTransformer, 'SchoolYear');
    }
}
