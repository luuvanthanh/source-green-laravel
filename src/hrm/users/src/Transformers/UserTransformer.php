<?php

namespace GGPHP\Users\Transformers;

use GGPHP\Absent\Models\Absent;
use GGPHP\Absent\Transformers\AbsentTransformer;
use GGPHP\ActivityLog\Traits\ActivityLogTransformerTrait;
use GGPHP\BusinessCard\Transformers\BusinessCardTransformer;
use GGPHP\Category\Transformers\DegreeTransformer;
use GGPHP\Category\Transformers\TrainingMajorTransformer;
use GGPHP\Category\Transformers\TrainingSchoolTransformer;
use GGPHP\Clover\Transformers\ClassTeacherTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\EvaluateTeacher\Category\Transformers\TypeTeacherTransformer;
use GGPHP\ManualCalculation\Transformers\ManualCalculationTransformer;
use GGPHP\PositionLevel\Transformers\PositionLevelTransformer;
use GGPHP\Profile\Transformers\LabourContractTransformer;
use GGPHP\ShiftSchedule\Transformers\ScheduleTransformer;
use GGPHP\TeacherTimekeeping\Transformers\TeacherTimekeepingTransformer;
use GGPHP\Timekeeping\Transformers\TimekeepingTransformer;
use GGPHP\TrainingTeacher\TrainingSchedule\Transformers\TrainingScheduleDetailTransformer;
use GGPHP\TrainingTeacher\TrainingSchedule\Transformers\TrainingScheduleTransformer;
use GGPHP\Users\Models\User;

/**
 * Class UserTransformer.
 *
 * @package namespace App\Transformers;
 */
class UserTransformer extends BaseTransformer
{
    use ActivityLogTransformerTrait;

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
        'timekeeping', 'absent', 'schedules', 'lateEarly', 'positionLevel', 'classTeacher',
        'positionLevelNow', 'businessCard', 'degree', 'trainingMajor', 'trainingSchool',
        'labourContract', 'manualCalculation', 'trainingSchedule', 'trainingScheduleDetail',
        'typeTeacher', 'TeacherTimekeeping', 'logActivity', 'typeTeacherRelation'
    ];

    /**
     * Transform the User entity.
     *
     * @param User $model
     *
     * @return array
     */
    public function customAttributes($model): array
    {
        $employeeTeacherPivot = [];
        $employeeTeacher = $model->typeTeacher;

        foreach ($employeeTeacher as $key => $value) {
            foreach ($value as $keyItem => $item) {
                $newKeyItem = dashesToCamelCase($keyItem, false);

                if ($keyItem != $newKeyItem) {
                    $value[$newKeyItem] = $value[$keyItem];
                    unset($value[$keyItem]);
                }

                if ($keyItem === 'pivot') {
                    foreach ($item as $keyPivot => $itemPivot) {
                        $newKeyPivot = dashesToCamelCase($keyPivot, false);

                        if ($keyPivot != $newKeyPivot) {
                            $item[$newKeyPivot] = $item[$keyPivot];
                            unset($item[$keyPivot]);
                        }
                    }
                    $value[$keyItem] = $item;
                }
            }

            $employeeTeacherPivot[$key] = $value;
        }

        $attributes = [
            'employeeTeacherPivot' => $employeeTeacherPivot,
            'timeKeepingReport' => $model->timeKeepingReport ? $model->timeKeepingReport : [],
            'totalWorks' => $model->totalWorks,
            'responseInvalid' => $model->responseInvalid,
            'Status' => array_search($model->Status, User::STATUS) ? array_search($model->Status, User::STATUS) : null,
            'Category' => array_search($model->Category, User::CATEGORY) ? array_search($model->Category, User::CATEGORY) : null,
            'workHourSummary' => $model->workHourSummary,
            'totalWorkHourSummary' => $model->totalWorkHourSummary,
            'totalWorkWeekday' => $model->totalWorkWeekday,
            'totalWorkWeekend' => $model->totalWorkWeekend,
            'totalWorkHoliday' => $model->totalWorkHoliday,
            'busRegistrationSummary' => $model->busRegistrationSummary,
            'totalBusRegistration' => $model->totalBusRegistration,
        ];

        return $attributes;
    }

    /**
     * Include timekeeping
     * @param User $employee
     * @return \League\Fractal\Resource\Collection
     */
    public function includeTimekeeping(User $employee)
    {
        return $this->collection(empty($employee->timekeeping) ? [] : $employee->timekeeping, new TimekeepingTransformer, 'Timekeeping');
    }

    /**
     * Include Absent
     * @param User $employee
     * @return \League\Fractal\Resource\Collection
     */
    public function includeAbsent(User $employee)
    {
        return $this->collection($employee->absent, new AbsentTransformer, 'Absent');
    }

    /**
     * Include BusinessCard
     * @param User $employee
     * @return \League\Fractal\Resource\Collection
     */
    public function includeBusinessCard(User $employee)
    {
        return $this->collection($employee->businessCard, new BusinessCardTransformer, 'BusinessCard');
    }

    /**
     * Include ClassTeacher
     * @param User $employee
     * @return \League\Fractal\Resource\Collection
     */
    public function includeClassTeacher(User $employee)
    {
        if (empty($employee->classTeacher)) {
            return;
        }

        return $this->item($employee->classTeacher, new ClassTeacherTransformer, 'ClassTeacher');
    }

    /**
     * Include PositionLevelNow
     * @param User $employee
     * @return \League\Fractal\Resource\Collection
     */
    public function includePositionLevelNow(User $employee)
    {
        if (empty($employee->positionLevelNow)) {
            return;
        }

        return $this->item($employee->positionLevelNow, new PositionLevelTransformer, 'PositionLevelNow');
    }

    /**
     * Include Schedules
     * @param User $employee
     * @return \League\Fractal\Resource\Collection
     */
    public function includeSchedules(User $employee)
    {
        return $this->collection(empty($employee->schedules) ? [] : $employee->schedules, new ScheduleTransformer, 'Schedules');
    }

    // /** Include SubtractionTime
    //  * @param User $employee
    //  * @return \League\Fractal\Resource\Collection
    //  */
    // public function includeLateEarly(User $employee)
    // {
    //     return $this->collection($employee->lateEarly, new LateEarlyTransformer(), 'LateEarly');
    // }

    /** Include SubtractionTime
     * @param User $employee
     * @return \League\Fractal\Resource\Collection
     */
    public function includePositionLevel(User $employee)
    {
        return $this->collection(empty($employee->positionLevel) ? [] : $employee->positionLevel, new PositionLevelTransformer, 'PositionLevel');
    }

    public function includeDegree(User $employee)
    {
        if (empty($employee->degree)) {
            return;
        }

        return $this->item($employee->degree, new DegreeTransformer, 'Degree');
    }

    public function includeTrainingMajor(User $employee)
    {
        if (empty($employee->trainingMajor)) {
            return;
        }

        return $this->item($employee->trainingMajor, new TrainingMajorTransformer, 'TrainingMajor');
    }

    public function includetrainingSchool(User $employee)
    {
        if (empty($employee->trainingSchool)) {
            return;
        }

        return $this->item($employee->trainingSchool, new TrainingSchoolTransformer, 'TrainingSchool');
    }

    public function includeLabourContract(User $employee)
    {
        return $this->collection($employee->labourContract, new LabourContractTransformer, 'LabourContract');
    }

    public function includeManualCalculation(User $employee)
    {
        return $this->collection($employee->manualCalculation, new ManualCalculationTransformer, 'ManualCalculation');
    }

    public function includeTrainingSchedule(User $employee)
    {
        return $this->collection($employee->trainingSchedule, new TrainingScheduleTransformer, 'TrainingSchedule');
    }

    public function includeTrainingScheduleDetail(User $employee)
    {
        return $this->collection($employee->trainingScheduleDetail, new TrainingScheduleDetailTransformer, 'TrainingScheduleDetail');
    }

    public function includeTypeTeacher(User $employee)
    {
        return $this->collection($employee->typeTeacher, new TypeTeacherTransformer, 'TypeTeacher');
    }

    /**
     * Include timekeeping
     * @param User $employee
     * @return \League\Fractal\Resource\Collection
     */
    public function includeTeacherTimekeeping(User $employee)
    {
        return $this->collection(empty($employee->teacherTimekeeping) ? [] : $employee->teacherTimekeeping, new TeacherTimekeepingTransformer, 'TeacherTimekeeping');
    }

    public function includeTypeTeacherRelation(User $user)
    {
        if (!is_null($user->TypeTeacherId)) {
            return $this->item($user->typeTeacherRelation, new TypeTeacherTransformer, 'TypeTeacherRelation');
        } else {
            return null;
        }
    }
}
