<?php

namespace GGPHP\Crm\Fee\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\Category\Transformers\BranchTransformer;
use GGPHP\Crm\Fee\Models\FeePolicie;

/**
 * Class CityTransformer.
 *
 * @package namespace App\Transformers;
 */
class FeePolicieTransformer extends BaseTransformer
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
    protected $availableIncludes = ['schoolYear', 'branch'];

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

    public function includeSchoolYear(FeePolicie $feePolicie)
    {
        if ($feePolicie->loadCount('schoolYear')->school_year_count < 1) {
            return null;
        }

        return $this->item($feePolicie->schoolYear, new SchoolYearTransformer, 'SchoolYear');
    }

    public function includeBranch(FeePolicie $feePolicie)
    {
        if ($feePolicie->loadCount('branch')->branch_count < 1) {
            return null;
        }

        return $this->item($feePolicie->branch, new BranchTransformer, 'Branch');
    }
}
