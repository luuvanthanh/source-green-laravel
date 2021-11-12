<?php

namespace GGPHP\Crm\CustomerLead\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\Category\Transformers\CategoryRelationshipTransformer;
use GGPHP\Crm\CustomerLead\Models\StudentInfo;

/**
 * Class EventInfoTransformer.
 *
 * @package namespace App\Transformers;
 */
class StudentInfoTransformer extends BaseTransformer
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
    protected $availableIncludes = ['customerLead', 'categoryRelationship'];

    /**
     * Transform the User entity.
     *
     * @param User $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        $sex = null;

        foreach (StudentInfo::SEX as $key => $value) {

            if (!is_null($model->sex)) {
                if ($value == $model->sex) {
                    $sex = $key;
                }
            }
        }

        return [
            'sex' => $sex,
        ];
    }

    public function includeCustomerLead(StudentInfo $studentInfo)
    {
        if (empty($studentInfo->customerLead)) {
            return;
        }

        return $this->item($studentInfo->customerLead, new CustomerLeadTransformer, 'CustomerLead');
    }

    public function includeCategoryRelationship(StudentInfo $studentInfo)
    {
        if (empty($studentInfo->categoryRelationship)) {
            return;
        }

        return $this->item($studentInfo->categoryRelationship, new CategoryRelationshipTransformer, 'CategoryRelationship');
    }
}
