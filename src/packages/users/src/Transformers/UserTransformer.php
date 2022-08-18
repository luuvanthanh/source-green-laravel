<?php

namespace GGPHP\Users\Transformers;

use GGPHP\Absent\Models\Absent;
use GGPHP\Absent\Transformers\AbsentTransformer;
use GGPHP\BusinessCard\Transformers\BusinessCardTransformer;
use GGPHP\Category\Transformers\DegreeTransformer;
use GGPHP\Category\Transformers\TrainingMajorTransformer;
use GGPHP\Category\Transformers\TrainingSchoolTransformer;
use GGPHP\Clover\Transformers\ClassTeacherTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\LateEarly\Transformers\LateEarlyTransformer;
use GGPHP\ManualCalculation\Models\ManualCalculation;
use GGPHP\ManualCalculation\Transformers\ManualCalculationTransformer;
use GGPHP\PositionLevel\Transformers\PositionLevelTransformer;
use GGPHP\Profile\Transformers\AuthorizedPersonTransformer;
use GGPHP\Profile\Transformers\LabourContractTransformer;
use GGPHP\Profile\Transformers\ProbationaryContractTransformer;
use GGPHP\ResignationDecision\Transformers\ResignationDecisionTransformer;
use GGPHP\ShiftSchedule\Transformers\ScheduleTransformer;
use GGPHP\Timekeeping\Transformers\TimekeepingTransformer;
use GGPHP\Users\Models\User;

/**
 * Class UserTransformer.
 *
 * @package namespace App\Transformers;
 */
class UserTransformer extends BaseTransformer
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
        'timekeeping', 'absent', 'schedules', 'lateEarly', 'positionLevel',
        'classTeacher', 'positionLevelNow', 'businessCard', 'degree',
        'trainingMajor', 'trainingSchool', 'labourContract', 'manualCalculation', 'branchDefault', 'probationaryContract',
        'resignationDecision', 'authorizedPersion','authorizedPersonEffectIn'
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
        $status = null;

        foreach (User::STATUS as $key => $value) {
            if ($value == $model->Status) {
                $status = $key;
            }
        }

        $attributes = [
            'timeKeepingReport' => $model->timeKeepingReport ? $model->timeKeepingReport : [],
            'totalWorks' => $model->totalWorks,
            'responseInvalid' => $model->responseInvalid,
            'Status' => $status,
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

    /** Include SubtractionTime
     * @param User $employee
     * @return \League\Fractal\Resource\Collection
     */
    public function includeLateEarly(User $employee)
    {
        return $this->collection(empty($employee->lateEarly) ? [] : $employee->lateEarly, new LateEarlyTransformer(), 'LateEarly');
    }

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

    public function includeBranchDefault(User $employee)
    {
        return $this->collection($employee->branchDefault, new PositionLevelTransformer, 'PositionLevel');
    }

    public function includeProbationaryContract(User $employee)
    {
        return $this->collection($employee->probationaryContract, new ProbationaryContractTransformer, 'ProbationaryContract');
    }

    public function includeResignationDecision(User $employee)
    {
        if (empty($employee->resignationDecision)) {
            return null;
        }

        return $this->item($employee->resignationDecision, new ResignationDecisionTransformer, 'ResignationDecision');
    }

    public function includeAuthorizedPersion(User $employee)
    {
        return $this->collection($employee->authorizedPerson, new AuthorizedPersonTransformer, 'AuthorizedPersion');
    }

    public function includeAuthorizedPersonEffectIn(User $employee)
    {
        return $this->collection($employee->authorizedPersonEffectIn, new AuthorizedPersonTransformer, 'AuthorizedPersion');
    }
}
