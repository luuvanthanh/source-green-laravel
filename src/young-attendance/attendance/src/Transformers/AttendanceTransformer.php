<?php

namespace GGPHP\Attendance\Transformers;

use GGPHP\Attendance\Models\Attendance;
use GGPHP\Clover\Transformers\StudentTransporterTransformer;
use GGPHP\Core\Transformers\BaseTransformer;

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
    protected $defaultIncludes = ['attendanceReason', 'attendanceLog', 'studentTransporter'];
    protected $availableIncludes = [];

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

}
