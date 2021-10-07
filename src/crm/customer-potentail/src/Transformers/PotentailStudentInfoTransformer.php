<?php

namespace GGPHP\Crm\CustomerPotentail\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\CustomerPotentail\Models\PotentailStudentInfo;

/**
 * Class CityTransformer.
 *
 * @package namespace App\Transformers;
 */
class PotentailStudentInfoTransformer extends BaseTransformer
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
     * Transform the CategoryDetail entity.
     *
     * @param  

     *
     * @return array
     */
    public function customAttributes($model): array
    {
        $relationship = null;

        foreach (PotentailStudentInfo::RELATIONSHIP as $key => $value) {

            if ($value == $model->relationship) {
                $relationship = $key;
            }
        }

        $sex = null;

        foreach (PotentailStudentInfo::SEX as $key => $value) {
            
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
