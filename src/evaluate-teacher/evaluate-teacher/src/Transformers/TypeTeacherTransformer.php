<?php

namespace GGPHP\EvaluateTeacher\EvaluateTeacher\Transformers;

use GGPHP\Category\Transformers\TypeOfContractTransformer;
use GGPHP\EvaluateTeacher\EvaluateTeacher\Models\EvaluateTeacher;
use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class EvaluateTeacherTransformer.
 *
 * @package namespace GGPHP\EvaluateTeacher\EvaluateTeacher\Transformers;
 */
class EvaluateTeacherTransformer extends BaseTransformer
{
    protected $availableIncludes = ['typeOfContract', 'ratingLevelFrom', 'ratingLevelTo'];

    public function includeTypeOfContract(EvaluateTeacher $evaluateTeacher)
    {
        if (empty($evaluateTeacher->typeOfContract)) {
            return;
        }

        return $this->item($evaluateTeacher->typeOfContract, new TypeOfContractTransformer, 'TypeOfContract');
    }

    public function includeRatingLevelFrom(EvaluateTeacher $evaluateTeacher)
    {
        if (empty($evaluateTeacher->ratingLevelFrom)) {
            return;
        }

        return $this->item($evaluateTeacher->ratingLevelFrom, new RatingLevelTransformer(), 'RatingLevelFrom');
    }

    public function includeRatingLevelto(EvaluateTeacher $evaluateTeacher)
    {
        if (empty($evaluateTeacher->ratingLevelto)) {
            return;
        }

        return $this->item($evaluateTeacher->ratingLevelto, new RatingLevelTransformer(), 'RatingLevelto');
    }
}
