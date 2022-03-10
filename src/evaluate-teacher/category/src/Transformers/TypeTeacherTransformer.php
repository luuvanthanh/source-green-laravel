<?php

namespace GGPHP\EvaluateTeacher\Category\Transformers;

use GGPHP\Category\Transformers\TypeOfContractTransformer;
use GGPHP\EvaluateTeacher\Category\Models\TypeTeacher;
use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class TypeTeacherTransformer.
 *
 * @package namespace GGPHP\EvaluateTeacher\Category\Transformers;
 */
class TypeTeacherTransformer extends BaseTransformer
{
    protected $availableIncludes = ['typeOfContract', 'ratingLevelFrom', 'ratingLevelTo'];

    public function includeTypeOfContract(TypeTeacher $typeTeacher)
    {
        if (empty($typeTeacher->typeOfContract)) {
            return;
        }

        return $this->item($typeTeacher->typeOfContract, new TypeOfContractTransformer, 'TypeOfContract');
    }

    public function includeRatingLevelFrom(TypeTeacher $typeTeacher)
    {
        if (empty($typeTeacher->ratingLevelFrom)) {
            return;
        }

        return $this->item($typeTeacher->ratingLevelFrom, new RatingLevelTransformer(), 'RatingLevelFrom');
    }

    public function includeRatingLevelto(TypeTeacher $typeTeacher)
    {
        if (empty($typeTeacher->ratingLevelto)) {
            return;
        }

        return $this->item($typeTeacher->ratingLevelto, new RatingLevelTransformer(), 'RatingLevelto');
    }
}
