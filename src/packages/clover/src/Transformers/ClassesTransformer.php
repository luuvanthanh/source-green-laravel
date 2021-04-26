<?php

namespace GGPHP\Clover\Transformers;

use GGPHP\Clover\Models\Classes;
use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class ClassesTransformer.
 *
 * @package namespace App\Transformers;
 */
class ClassesTransformer extends BaseTransformer
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
     * Transform the Student entity.
     *
     * @param Classes $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {

        return [];
    }

}
