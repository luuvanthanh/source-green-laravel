<?php

namespace GGPHP\Attendance\Transformers;

use GGPHP\Attendance\Models\Attendance;
use GGPHP\Clover\Transformers\StudentTransformer;
use GGPHP\Clover\Transformers\StudentTransporterTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Fee\Transformers\SchoolYearTransformer;

/**
 * Class AttendanceTransformer.
 *
 * @package namespace GGPHP\Attendance\Transformers;
 */
class AttendanceTransformer extends BaseTransformer
{
    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $defaultIncludes = ['attendanceReason', 'attendanceLog', 'studentTransporter', 'student'];
    protected $availableIncludes = ['schoolYear'];

    /**
     * Transform the custom field entity.
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        $status = null;

        foreach (Attendance::STATUS as $key => $value) {
            if ($value == $model->Status) {
                $status = $key;
            }
        }

        return [
            'Status' => $status,
        ];
    }

    /**
     * Include attendanceReason
     * @param Attendance $attendance
     * @return \League\Fractal\Resource\Item
     */
    public function includeAttendanceReason(Attendance $attendance)
    {
        if (empty($attendance->attendanceReason)) {
            return;
        }

        return $this->item($attendance->attendanceReason, new AttendanceReasonTransformer, 'AttendanceReason');
    }

    /**
     * Include attendanceReason
     * @param Attendance $attendance
     * @return \League\Fractal\Resource\Item
     */
    public function includeStudentTransporter(Attendance $attendance)
    {
        if (empty($attendance->studentTransporter)) {
            return;
        }

        return $this->item($attendance->studentTransporter, new StudentTransporterTransformer, 'StudentTransporter');
    }

    /**
     * Include attendanceLog
     * @param Attendance $attendance
     * @return \League\Fractal\Resource\Item
     */
    public function includeAttendanceLog(Attendance $attendance)
    {

        return $this->collection($attendance->attendanceLog, new AttendanceLogTransformer, 'AttendanceLog');
    }

    public function includeStudent(Attendance $attendance)
    {
        if (empty($attendance->student)) {
            return;
        }

        return $this->item($attendance->student, new StudentTransformer, 'Student');
    }

    /**
     * Include AbsentType
     * @param Absent $absent
     * @return \League\Fractal\Resource\Item
     */
    public function includeSchoolYear(Attendance $attendance)
    {
        if (empty($attendance->schoolYear)) {
            return null;
        }

        return $this->item($attendance->schoolYear, new SchoolYearTransformer, 'SchoolYear');
    }
}
