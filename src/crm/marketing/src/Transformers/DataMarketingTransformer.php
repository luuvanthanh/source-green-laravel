<?php

namespace GGPHP\Crm\Marketing\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\Category\Transformers\SearchSourceTransformer;
use GGPHP\Crm\Marketing\Models\DataMarketing;
use GGPHP\Crm\Province\Transformers\CityTransformer;
use GGPHP\Crm\Province\Transformers\DistrictTransformer;
use GGPHP\Crm\Marketing\Transformers\MarketingProgramTransformer;

/**
 * Class CityTransformer.
 *
 * @package namespace App\Transformers;
 */
class DataMarketingTransformer extends BaseTransformer
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
    protected $availableIncludes = ['studentInfo', 'city', 'district', 'searchSource','marketingProgram','studentInfo'];

    /**
     * Transform the CategoryDetail entity.
     *
     * @param  

     *
     * @return array
     */
    public function customAttributes($model): array
    {
        $sex = null;

        foreach (DataMarketing::SEX as $key => $value) {

            if ($value == $model->sex) {
                $sex = $key;
            }
        }

        $status = null;

        foreach (DataMarketing::STATUS as $key => $value) {

            if ($value == $model->status) {
                $status = $key;
            }
        }

        return [
            'sex' => $sex,
            'status' => $status,
            'user_create_info' => json_decode($model->user_create_info),
        ];
    }

    public function includeCity(DataMarketing $dataMarketing)
    {
        if (empty($dataMarketing->city)) {
            return;
        }

        return $this->item($dataMarketing->city, new CityTransformer, 'City');
    }

    public function includeDistrict(DataMarketing $dataMarketing)
    {
        if (empty($dataMarketing->district)) {
            return;
        }

        return $this->item($dataMarketing->district, new DistrictTransformer, 'District');
    }

    public function includeSearchSource(DataMarketing $dataMarketing)
    {
        if (empty($dataMarketing->searchSource)) {
            return;
        }

        return $this->item($dataMarketing->searchSource, new SearchSourceTransformer, 'SearchSource');
    }

    public function includeMarketingProgram(DataMarketing $dataMarketing)
    {
        return $this->collection($dataMarketing->marketingProgram, new MarketingProgramTransformer, 'MarketingProgram');
    }

    public function includeStudentInfo(DataMarketing $dataMarketing)
    {
        return $this->collection($dataMarketing->studentInfo, new DataMarketingStudentInfoTransformer, 'StudentInfo');
    }
}
