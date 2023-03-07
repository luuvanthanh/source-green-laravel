<?php

namespace GGPHP\Crm\Clover\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Crm\Clover\Models\EmployeeHrm;

/**
 * Class CategoryDetailTransformer.
 *
 * @package namespace App\Transformers;
 */
class EmployeeHrmTransformer extends BaseTransformer
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
     * @param EmployeeHrm 

     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }
}
