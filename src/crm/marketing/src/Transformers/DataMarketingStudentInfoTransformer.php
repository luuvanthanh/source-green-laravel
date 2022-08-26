<?php

namespace GGPHP\Crm\Marketing\Transformers;

use Carbon\Carbon;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\Category\Transformers\CategoryRelationshipTransformer;
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
    protected $availableIncludes = ['categoryRelationship'];

    /**
     * Transform the User entity.
     *
     * @param User $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        $now = Carbon::now('Asia/Ho_Chi_Minh');
        $birthday = Carbon::parse($model->birth_date);
        $today = Carbon::parse($now);
        $numberOfMonth = $birthday->diffInMonths($today);
        
        return [
            'sex' => is_null($model->sex) ? null : array_search($model->sex, DataMarketingStudentInfo::SEX),
            'month_age' => $numberOfMonth
        ];
    }

    public function includeCategoryRelationship(DataMarketingStudentInfo $dataMarketingStudentInfo)
    {
        if (empty($dataMarketingStudentInfo->categoryRelationship)) {
            return;
        }

        return $this->item($dataMarketingStudentInfo->categoryRelationship, new CategoryRelationshipTransformer, 'CategoryRelationship');
    }
}
