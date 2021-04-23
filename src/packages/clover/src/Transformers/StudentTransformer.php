<?php

namespace GGPHP\Clover\Transformers;

use GGPHP\Clover\Models\Student;
use GGPHP\Core\Transformers\BaseTransformer;

/**
 * Class StudentTransformer.
 *
 * @package namespace App\Transformers;
 */
class StudentTransformer extends BaseTransformer
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
     * @param Student $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {

        return [];
    }

}
