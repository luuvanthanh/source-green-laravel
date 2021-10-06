<?php

namespace GGPHP\Crm\Province\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\Province\Models\District;

/**
 * Class DistrictTransformer.
 *
 * @package namespace App\Transformers;
 */
class DistrictTransformer extends BaseTransformer
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
    protected $availableIncludes = ['townward', 'city'];

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


    public function includeTownWard(District $district)
    {
        return $this->collection($district->townward, new TownWardTransformer, 'TownWard');
    }

    public function includeCity(District $district)
    {
        if (empty($district->city)) {
            return;
        }
        return $this->item($district->city, new CityTransformer, 'City');
    }
}
