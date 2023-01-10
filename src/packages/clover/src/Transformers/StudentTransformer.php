<?php

namespace GGPHP\Clover\Transformers;

use Carbon\Carbon;
use GGPHP\Attendance\Transformers\AttendanceTransformer;
use GGPHP\Category\Transformers\BranchTransformer;
use GGPHP\ChildDevelop\TestSemester\Transformers\TestSemesterTransformer;
use GGPHP\Clover\Models\Student;
use GGPHP\Clover\Transformers\ParentsTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\InOutHistories\Transformers\InOutHistoriesTransformer;
use GGPHP\StudyProgram\AttendancePhysical\Transformers\AttendancePhysicalTransformer;
use GGPHP\StudyProgram\MonthlyComment\Transformers\MonthlyCommentTransformer;
use GGPHP\StudyProgram\QuarterReport\Transformers\QuarterReportTransformer;
use GGPHP\YoungAttendance\Absent\Transformers\AbsentTransformer;
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
    protected $availableIncludes = [
        'schedules', 'inOutHistory', 'classStudent', 'attendance', 'absent', 'parent',
        'studentTransporter', 'testSemester', 'classes', 'quarterReport', 'monthlyComment', 'branch', 'attendancePhysical'
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
        $now = Carbon::parse($model->DayOfBirth);
        $ageMonth = ((now()->format('Y') - $now->format('Y')) * 12) + (now()->format('m') - $now->format('m'));

        return [
            'age_month' => (int) Carbon::parse($model->DayOfBirth)->floatDiffInRealMonths(now()),
            'refund' => $model->refund,
            'dateOff' => $model->dateOff,
            'numberDayOff' => $model->numberDayOff,
            'age' => (int) $ageMonth,
        ];
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
        $newColection = [];

        if ($student->attendance->isNotEmpty()) {
            $newColection =  $student->attendance->filter(function ($value, $key) {
                return $value->Date->dayOfWeek != Carbon::SUNDAY;
            });
        }

        return $this->collection($newColection, new AttendanceTransformer, 'Attendance');
    }

    /**
     * Include Absent
     * @param Student $student
     * @return \League\Fractal\Resource\Collection
     */
    public function includeAbsent(Student $student)
    {

        return $this->collection($student->absent, new AbsentTransformer, 'Absent');
    }

    /**
     * Include Parent
     * @param Student $student
     * @return \League\Fractal\Resource\Collection
     */
    public function includeParent(Student $student)
    {
        return $this->collection($student->parent, new ParentsTransformer, 'Parent');
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

    /**
     * Include StudentTransporter
     * @param Student $student
     * @return \League\Fractal\Resource\Collection
     */
    public function includeStudentTransporter(Student $student)
    {
        return $this->collection($student->studentTransporter, new StudentTransporterTransformer, 'StudentTransporter');
    }

    /**
     * Include StudentTransporter
     * @param Student $student
     * @return \League\Fractal\Resource\Collection
     */
    public function includeTestSemester(Student $student)
    {
        return $this->collection($student->testSemester, new TestSemesterTransformer, 'TestSemester');
    }

    public function includeClasses(Student $student)
    {
        if (empty($student->classes)) {
            return;
        }

        return $this->item($student->classes, new ClassesTransformer, 'Classes');
    }

    public function includeQuarterReport(Student $student)
    {
        return $this->collection($student->quarterReport, new QuarterReportTransformer, 'QuarterReport');
    }

    public function includeMonthLyComment(Student $student)
    {
        return $this->collection($student->monthlyComment, new MonthlyCommentTransformer, 'MonthlyComment');
    }

    public function includeBranch(Student $student)
    {
        if (empty($student->branch)) {
            return;
        }
        return $this->item($student->branch, new BranchTransformer, 'Branch');
    }

    public function includeAttendancePhysical(Student $student)
    {
        return $this->collection($student->attendancePhysical, new AttendancePhysicalTransformer, 'AttendancePhysical');
    }
}
