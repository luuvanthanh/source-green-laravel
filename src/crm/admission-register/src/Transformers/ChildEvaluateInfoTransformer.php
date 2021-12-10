<?php

namespace GGPHP\Crm\AdmissionRegister\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\AdmissionRegister\Models\ChildEvaluateInfo;

/**
 * Class CityTransformer.
 *
 * @package namespace App\Transformers;
 */
class ChildEvaluateInfoTransformer extends BaseTransformer
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
    protected $availableIncludes = ['admissionRegister', 'childDescription', 'childIssue'];

    /**
     * Transform the CategoryDetail entity.
     *
     * @param  

     *
     * @return array
     */
    public function customAttributes($model): array
    {

        return [];
    }

    public function includeAdmissionRegister(ChildEvaluateInfo $childEvaluateInfo)
    {
        if (empty($childEvaluateInfo->admissionRegister)) {
            return;
        }

        return $this->item($childEvaluateInfo->admissionRegister, new AdmissionRegisterTransformer, 'AdmissionRegister');
    }

    public function includeChildDescription(ChildEvaluateInfo $childEvaluateInfo)
    {
        return $this->collection($childEvaluateInfo->childDescription, new ChildDescriptionTransformer, 'ChildDescription');
    }

    public function includeChildIssue(ChildEvaluateInfo $childEvaluateInfo)
    {
        return $this->collection($childEvaluateInfo->childIssue, new ChildIssueTransformer, 'ChildIssue');
    }
}
