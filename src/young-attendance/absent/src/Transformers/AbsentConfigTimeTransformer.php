<?php

namespace GGPHP\YoungAttendance\Absent\Transformers;

use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\YoungAttendance\Absent\Models\AbsentConfigTime;

/**
 * Class AbsentConfigTimeTransformer.
 *
 * @package namespace GGPHP\YoungAttendance\Absent\Transformers;
 */
class AbsentConfigTimeTransformer extends BaseTransformer
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
     * Transform the User entity.
     *
     * @param User $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }
}
