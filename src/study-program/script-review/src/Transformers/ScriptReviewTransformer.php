<?php

namespace GGPHP\StudyProgram\ScriptReview\Transformers;

use GGPHP\Category\Transformers\BranchTransformer;
use GGPHP\Clover\Transformers\ClassesTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
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
    protected $availableIncludes = ['scriptReviewSubject', 'scriptReviewComment', 'branch', 'classes'];

    /**
     * Transform the ReviewDetail entity.
     *
     * @param ReviewChildTeacher 

     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return ['Type' => array_search($model->Type, ScriptReview::TYPE)];
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
}
