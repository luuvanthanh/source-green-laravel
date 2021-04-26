<?php

namespace GGPHP\Clover\Transformers;

use GGPHP\Clover\Models\Student;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\ShiftSchedule\Transformers\ScheduleTransformer;

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
    protected $availableIncludes = ['schedules'];

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

    /**
     * Include schedules
     * @param Student $student
     * @return \League\Fractal\Resource\Collection
     */
    public function includeSchedules(Student $student)
    {
        return $this->collection($student->schedules, new ScheduleTransformer, 'Schedules');
    }

}
