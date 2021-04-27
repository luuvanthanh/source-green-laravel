<?php

namespace GGPHP\Clover\Transformers;

use GGPHP\Category\Transformers\BranchTransformer;
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
    protected $defaultIncludes = ['branch'];

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
     * Transform the Classes entity.
     *
     * @param Classes $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {

        return [];
    }

    /**
     * Include schedules
     * @param Student $classes
     * @return \League\Fractal\Resource\Collection
     */
    public function includeBranch(Classes $classes)
    {
        if (empty($classes->branch)) {
            return;
        }

        return $this->item($classes->branch, new BranchTransformer, 'Branch');
    }
}
