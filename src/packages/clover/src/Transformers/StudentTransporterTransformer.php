<?php

namespace GGPHP\Clover\Transformers;

use GGPHP\Clover\Models\StudentTransporter;
use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class StudentTransporterTransformer.
 *
 * @package namespace App\Transformers;
 */
class StudentTransporterTransformer extends BaseTransformer
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
    protected $availableIncludes = [
    ];

    /**
     * Transform the Parents entity.
     *
     * @param Parents $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {

        return [];
    }

}
