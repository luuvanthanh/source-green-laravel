<?php

namespace GGPHP\Crm\CustomerPotential\Transformers;

use Carbon\Carbon;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\CustomerPotential\Models\PotentialStudentInfo;

/**
 * Class CityTransformer.
 *
 * @package namespace App\Transformers;
 */
class PotentialStudentInfoTransformer extends BaseTransformer
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
    protected $availableIncludes = ['customerPotential'];

    /**
     * Transform the CategoryDetail entity.
     *
     * @param  

     *
     * @return array
     */
    public function customAttributes($model): array
    {
        $now = Carbon::now('Asia/Ho_Chi_Minh');
        $birthday = Carbon::parse($model->birth_date);
        $today = Carbon::parse($now);
        $numberOfMonth = $birthday->diffInMonths($today);
        $relationship = null;

        foreach (PotentialStudentInfo::RELATIONSHIP as $key => $value) {

            if ($value == $model->relationship) {
                $relationship = $key;
            }
        }

        $sex = null;

        foreach (PotentialStudentInfo::SEX as $key => $value) {

            if ($value == $model->sex) {
                $sex = $key;
            }
        }

        return [
            'relationship' => $relationship,
            'sex' => $sex,
            'age_month' => $numberOfMonth
        ];
    }

    public function includeCustomerPotential(PotentialStudentInfo $potentialStudentInfo)
    {
        if (empty($potentialStudentInfo->customerPotential)) {
            return;
        }

        return $this->item($potentialStudentInfo->customerPotential, new CustomerPotentialTransformer, 'CustomerPotential');
    }
}
