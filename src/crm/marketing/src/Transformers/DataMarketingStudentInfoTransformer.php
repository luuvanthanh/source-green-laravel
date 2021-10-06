<?php

namespace GGPHP\Crm\Marketing\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\Marketing\Models\DataMarketingStudentInfo;

/**
 * Class EventInfoTransformer.
 *
 * @package namespace App\Transformers;
 */
class DataMarketingStudentInfoTransformer extends BaseTransformer
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
    protected $availableIncludes = [];

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

        foreach (DataMarketingStudentInfo::RELATIONSHIP as $key => $value) {

            if ($value == $model->relationship) {
                $relationship = $key;
            }
        }

        $sex = null;

        foreach (DataMarketingStudentInfo::SEX as $key => $value) {
            
            if ($value == $model->sex) {
                $sex = $key;
            }
        }

        return [
            'relationship' => $relationship,
            'sex' => $sex,
        ];
    }
}
