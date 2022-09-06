<?php

namespace GGPHP\Attendance\Transformers;

use GGPHP\Attendance\Models\AttendanceLog;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Transformers\SchoolYearTransformer;
use GGPHP\Users\Transformers\UserTransformer;

/**
 * Class AttendanceLogTransformer.
 *
 * @package namespace GGPHP\Attendance\Transformers;
 */
class AttendanceLogTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = [];
    protected $availableIncludes = ['employee', 'attendance', 'schoolYear'];

    /**
     * Transform the custom field entity.
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        return [];
    }

    /**
     * Include attendanceReason
     * @param AttendanceLog $attendance
     * @return \League\Fractal\Resource\Item
     */
    public function includeEmployee(AttendanceLog $attendanceLog)
    {
        if (empty($attendanceLog->employee)) {
            return;
        }

        return $this->item($attendanceLog->employee, new UserTransformer, 'Employee');
    }

    /**
     * Include attendanceReason
     * @param AttendanceLog $attendance
     * @return \League\Fractal\Resource\Item
     */
    public function includeAttendance(AttendanceLog $attendanceLog)
    {
        if (empty($attendanceLog->attendance)) {
            return;
        }

        return $this->item($attendanceLog->attendance, new AttendanceTransformer, 'Attendance');
    }

    /**
     * Include AbsentType
     * @param Absent $absent
     * @return \League\Fractal\Resource\Item
     */
    public function includeSchoolYear(AttendanceLog $attendanceLog)
    {
        if (empty($attendanceLog->schoolYear)) {
            return null;
        }

        return $this->item($attendanceLog->schoolYear, new SchoolYearTransformer, 'SchoolYear');
    }
}
