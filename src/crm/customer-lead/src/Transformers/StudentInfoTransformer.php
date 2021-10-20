<?php

namespace GGPHP\Crm\CustomerLead\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
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
    protected $availableIncludes = ['customerLead'];

    /**
     * Transform the User entity.
     *
     * @param User $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        $relationship = null;

        foreach (StudentInfo::RELATIONSHIP as $key => $value) {

            if ($value == $model->relationship) {
                $relationship = $key;
            }
        }

        $sex = null;

        foreach (StudentInfo::SEX as $key => $value) {
            
            if ($value == $model->sex) {
                $sex = $key;
            }
        }

        return [
            'relationship' => $relationship,
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
}
