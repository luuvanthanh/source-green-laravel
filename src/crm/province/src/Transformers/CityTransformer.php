<?php

namespace GGPHP\Crm\Province\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\Province\Models\City;

/**
 * Class CityTransformer.
 *
 * @package namespace App\Transformers;
 */
class CityTransformer extends BaseTransformer
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
    protected $availableIncludes = ['district'];

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

    public function includeDistrict(City $city)
    {
        return $this->collection($city->district, new DistrictTransformer, 'District');
    }
}
