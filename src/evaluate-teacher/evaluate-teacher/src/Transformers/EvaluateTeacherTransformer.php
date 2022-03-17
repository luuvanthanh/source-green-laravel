<?php

namespace GGPHP\EvaluateTeacher\EvaluateTeacher\Transformers;

use GGPHP\Category\Transformers\TypeOfContractTransformer;
use GGPHP\EvaluateTeacher\EvaluateTeacher\Models\EvaluateTeacher;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\EvaluateTeacher\Category\Transformers\EvaluateStepTransformer;
use GGPHP\EvaluateTeacher\Category\Transformers\EvaluateTypeTransformer;
use GGPHP\EvaluateTeacher\Category\Transformers\RatingLevelTransformer;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class EvaluateTeacherTransformer.
 *
 * @package namespace GGPHP\EvaluateTeacher\EvaluateTeacher\Transformers;
 */
class EvaluateTeacherTransformer extends BaseTransformer
{
    protected $availableIncludes = [
        'evaluateStep', 'evaluateType', 'teacherEvaluate',
        'teacherAreEvaluate', 'evaluateTeacherDetail', 'ratingLevel'
    ];

    public function includeEvaluateStep(EvaluateTeacher $evaluateTeacher)
    {
        if (empty($evaluateTeacher->evaluateStep)) {
            return;
        }

        return $this->item($evaluateTeacher->evaluateStep, new EvaluateStepTransformer, 'EvaluateStep');
    }

    public function includeEvaluateType(EvaluateTeacher $evaluateTeacher)
    {
        if (empty($evaluateTeacher->evaluateType)) {
            return;
        }

        return $this->item($evaluateTeacher->evaluateType, new EvaluateTypeTransformer, 'EvaluateType');
    }

    public function includeTeacherEvaluate(EvaluateTeacher $evaluateTeacher)
    {
        if (empty($evaluateTeacher->teacherEvaluate)) {
            return;
        }

        return $this->item($evaluateTeacher->teacherEvaluate, new UserTransformer, 'TeacherEvaluate');
    }

    public function includeTeacherAreEvaluate(EvaluateTeacher $evaluateTeacher)
    {
        if (empty($evaluateTeacher->teacherEvaluate)) {
            return;
        }

        return $this->item($evaluateTeacher->teacherEvaluate, new UserTransformer, 'TeacherAreEvaluate');
    }

    public function includeEvaluateTeacherDetail(EvaluateTeacher $evaluateTeacher)
    {
        return $this->collection($evaluateTeacher->evaluateTeacherDetail, new EvaluateTeacherDetailTransformer, 'EvaluateTeacherDetail');
    }

    public function includeRatingLevel(EvaluateTeacher $evaluateTeacher)
    {
        if (empty($evaluateTeacher->ratingLevel)) {
            return;
        }

        return $this->item($evaluateTeacher->ratingLevel, new RatingLevelTransformer, 'RatingLevel');
    }
}
