<?php

namespace GGPHP\EvaluateTeacher\EvaluateTeacher\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\EvaluateTeacher\Category\Transformers\SkillGroupDetailTransformer;
use GGPHP\EvaluateTeacher\EvaluateTeacher\Models\EvaluateTeacherDetail;

/**
 * Class EvaluateTeacherDetailTransformer.
 *
 * @package namespace GGPHP\EvaluateTeacher\EvaluateTeacher\Transformers;
 */
class EvaluateTeacherDetailTransformer extends BaseTransformer
{
    protected $availableIncludes = ['skillGroupDetail'];

    public function includeSkillGroupDetail(EvaluateTeacherDetail $evaluateTeacherDetail)
    {
        if (empty($evaluateTeacherDetail->skillGroupDetail)) {
            return;
        }

        return $this->item($evaluateTeacherDetail->skillGroupDetail, new SkillGroupDetailTransformer, 'SkillGroupDetail');
    }
}
