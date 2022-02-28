<?php

namespace GGPHP\ChildDevelop\Category\Transformers;

use GGPHP\Category\Transformers\BranchTransformer;
use GGPHP\ChildDevelop\Category\Models\AssessmentPeriod;
use GGPHP\Clover\Transformers\ClassesTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Transformers\SchoolYearTransformer;

/**
 * Class CategoryDetailTransformer.
 *
 * @package namespace App\Transformers;
 */
class AssessmentPeriodTransformer extends BaseTransformer
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
    protected $availableIncludes = ['classes', 'branch', 'schoolYear', 'nameAssessmentPeriod'];

    /**
     * Transform the CategoryDetail entity.
     *
     * @param CategoryIssue

     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }

    public function includeClasses(AssessmentPeriod $assessmentPeriod)
    {
        return $this->collection($assessmentPeriod->classes, new ClassesTransformer, 'Classes');
    }

    public function includeBranch(AssessmentPeriod $assessmentPeriod)
    {
        return $this->collection($assessmentPeriod->branch, new BranchTransformer, 'Branch');
    }

    public function includeSchoolYear(AssessmentPeriod $assessmentPeriod)
    {
        if (empty($assessmentPeriod->schoolYear)) {
            return;
        }
        return $this->item($assessmentPeriod->schoolYear, new SchoolYearTransformer, 'SchoolYear');
    }

    public function includeNameAssessmentPeriod(AssessmentPeriod $assessmentPeriod)
    {
        if (empty($assessmentPeriod->nameAssessmentPeriod)) {
            return;
        }
        return $this->item($assessmentPeriod->nameAssessmentPeriod, new NameAssessmentPeriodTransformer, 'NameAssessmentPeriod');
    }
}
