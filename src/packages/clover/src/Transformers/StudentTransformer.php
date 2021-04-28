<?php

namespace GGPHP\Clover\Transformers;

use GGPHP\Attendance\Transformers\AttendanceTransformer;
use GGPHP\Clover\Models\Student;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\InOutHistories\Transformers\InOutHistoriesTransformer;
use GGPHP\YoungAttendance\ShiftSchedule\Transformers\ScheduleTransformer;

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
    protected $availableIncludes = ['schedules', 'inOutHistory', 'classStudent', 'attendance'];

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
        return $this->collection($student->schedules, new ScheduleTransformer, 'Schedule');
    }

    /**
     * Include schedules
     * @param Student $student
     * @return \League\Fractal\Resource\Collection
     */
    public function includeInOutHistory(Student $student)
    {
        return $this->collection($student->inOutHistory, new InOutHistoriesTransformer, 'InOutHistory');
    }

    /**
     * Include Attendance
     * @param Student $student
     * @return \League\Fractal\Resource\Collection
     */
    public function includeAttendance(Student $student)
    {
        return $this->collection($student->attendance, new AttendanceTransformer, 'Attendance');
    }

    /**
     * Include RankPositionInformation
     * @param Student $student
     * @return \League\Fractal\Resource\Collection
     */
    public function includeClassStudent(Student $student)
    {
        if (empty($student->classStudent)) {
            return;
        }

        return $this->item($student->classStudent, new ClassStudentTransformer, 'ClassStudent');
    }
}
