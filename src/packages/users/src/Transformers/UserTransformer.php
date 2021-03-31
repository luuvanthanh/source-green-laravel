<?php

namespace GGPHP\Users\Transformers;

use Carbon\Carbon;
use GGPHP\Absent\Models\Absent;
use GGPHP\Absent\Models\AbsentType;
use GGPHP\Absent\Transformers\AbsentTransformer;
use GGPHP\AdditionalTime\Transformers\AdditionalTimeTransformer;
use GGPHP\Core\Transformers\BaseTransformer;
use GGPHP\Division\Transformers\RankPositionInformationTransformer;
use GGPHP\Faults\Transformers\FaultTransformer;
use GGPHP\LateEarly\Transformers\LateEarlyTransformer;
use GGPHP\MilkProgram\Transformers\ChildrenTransformer;
use GGPHP\Profiles\Transformers\SabbaticalLeaveTransformer;
use GGPHP\Profiles\Transformers\SalaryInformationTransformer;
use GGPHP\Profiles\Transformers\WorkTimeTransformer;
use GGPHP\Review\Transformers\ReviewPersonalTargetTransformer;
use GGPHP\Review\Transformers\ReviewProductivityDetailTransformer;
use GGPHP\Reward\Transformers\RewardTransformer;
use GGPHP\ShiftSchedule\Repositories\Eloquent\ScheduleRepositoryEloquent;
use GGPHP\ShiftSchedule\Transformers\ScheduleTransformer;
use GGPHP\SubtractionTime\Transformers\SubtractionTimeTransformer;
use GGPHP\Suggest\Transformers\SuggestBringFoodDetailTransformer;
use GGPHP\Suggest\Transformers\SuggestSalaryIncreaseDetailTransformer;
use GGPHP\Suggest\Transformers\SuggestTransformer;
use GGPHP\Suggest\Transformers\SuggestUniformDetailTransformer;
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
        'timekeeping', 'absent', 'schedules', 'lateEarly',
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
        dd(1);
        $media = $model->getAvatar();
        $avatar = null;
        if (!is_null($media)) {
            $avatar = [
                "path" => $media->getPath(),
                "name" => $media->name,
            ];
        }

        $userHasWorkShift = [];

        //get shift
        if (!is_null(request()->start_date) && !is_null(request()->end_date) && !is_null(request()->shift_user)) {
            $start_date = Carbon::parse(request()->start_date)->format('Y-m-d');
            $end_date = Carbon::parse(request()->end_date)->format('Y-m-d');
            $userHasWorkShift = ScheduleRepositoryEloquent::getUserTimeWorkShift($model->id, $start_date, $end_date);
        }

        $attributes = [
            'totalRealTimekeeping' => $model->totalRealTimekeeping,
            'totalHourRedundantTimekeeping' => $model->totalHourRedundantTimekeeping,
            'totalAdditionalTimes' => $model->additionalTimes,
            'totalAdditionalHours' => $model->additionalHours,
            'totalSubtractionTimes' => $model->subtractionTimes,
            'totalSubtractionHours' => $model->subtractionHours,
            'timeKeepingReport' => $model->timeKeepingReport ? $model->timeKeepingReport : [],
            'hourOvertime' => $model->hourOvertime,
            'hourIncrease' => $model->hourIncrease,
            'workOverTime' => $model->workOverTime,
            'workHourRedundant' => $model->workHourRedundant,
            'avatar' => $avatar,
            'totalAnnualAbsent' => $model->totalAnnualAbsent,
            'totalUnpaidAbsent' => $model->totalUnpaidAbsent,
            'totalTimekeepingWork' => round($model->totalWorks, 2),
            'totalHourRedundantWorks' => $model->totalHourRedundantWorks,
            'totalHourRedundantWorksFormatDate' => $model->totalHourRedundantWorksFormatDate,
            'totalTimekeepingDate' => $model->totalTimekeepingDate,
            'totalTimekeepingByMonth' => $model->totalTimekeepingByMonth,
            'totalHourRedundantByMonth' => $model->totalHourRedundantByMonth,
            'lateEarlyConfig' => $model->lateEarlyConfig,
            'workBirthday' => $model->workBirthday,
            'totalOffAbsent' => $model->totalOffAbsent,
            'totalWorkDeclarations' => $model->totalWorkDeclarations,
            'totalWorkHourSupport' => $model->totalWorkHourSupport,
            'shift' => $userHasWorkShift,
        ];

        if (!is_null(\Request::route())) {
            // Absent calculator
            if (request()->type === 'month') {
                $countAnnualAbsentsByMonth = $model->calculatorAbsent(request()->start_date, request()->end_date, AbsentType::ANNUAL_LEAVE);
                $countUnpaidLeaveByMonth = $model->calculatorAbsent(request()->start_date, request()->end_date, AbsentType::UNPAID_LEAVE);
                $countAwolLeaveByMonth = $model->calculatorAbsent(request()->start_date, request()->end_date, AbsentType::AWOL);
                $attributes['annualAbsentsByMonth'] = $countAnnualAbsentsByMonth;
                $attributes['unpaidLeaveByMonth'] = $countUnpaidLeaveByMonth;
                $attributes['countAwolLeaveByMonth'] = $countAwolLeaveByMonth;
            } elseif (request()->type === 'year' || isset(request()->id) || \Request::route()->getName() == 'users.me.show') {

                $currentYear = Carbon::now()->format('Y-m-d');

                $attributes['absentYear'] = $model->countAbsents(request()->start_date ? request()->start_date : $currentYear, request()->end_date);
            }

            if (\Request::route()->getName() == 'reviews.user-review-productivity.show-mobile') {
                $attributes['reviewProductivityYear'] = $model->reviewProductivityYear;
            }

            if (\Request::route()->getName() == 'faults.summary') {
                $attributes['faults_count'] = $model->faults_count;
            }

        }

        return $attributes;
    }

    /**
     * Include Store
     * @param User $user
     * @return \League\Fractal\Resource\Collection
     */
    public function includeTimekeeping(User $user)
    {
        return $this->collection(empty($user->timekeeping) ? [] : $user->timekeeping, new TimekeepingTransformer(), 'Timekeeping');
    }

    /**
     * Include RankPositionInformation
     * @param User $user
     * @return \League\Fractal\Resource\Item
     */
    public function includeSabbaticalLeave(User $user)
    {
        if (empty($user->sabbaticalLeaves)) {
            return;
        }

        return $this->item($user->sabbaticalLeaves, new SabbaticalLeaveTransformer(), 'SabbaticalLeave');
    }

    /**
     * Include RankPositionInformation
     * @param User $user
     * @return \League\Fractal\Resource\Collection
     */
    public function includeAbsent(User $user)
    {
        if (empty($user->absent)) {
            return;
        }

        return $this->collection($user->absent, new AbsentTransformer(), 'Absent');
    }

    /**
     * Include RankPositionInformation
     * @param User $user
     * @return \League\Fractal\Resource\Collection
     */
    public function includeAbsentKiosk(User $user)
    {
        if (empty($user->absent)) {
            return;
        }
        $absents = Absent::where('end_date', '>=', date('Y-m-d'))
            ->where('user_id', $user->id)
            ->whereIn('status', [Absent::APPROVED, Absent::PENDING])
            ->get();

        return $this->collection($absents, new AbsentTransformer(), 'AbsentKiosk');
    }

    /**
     * Include suggest
     * @param User $user
     * @return \League\Fractal\Resource\Collection
     */
    public function includeSuggest(User $user)
    {
        return $this->collection(empty($user->suggest) ? [] : $user->suggest, new SuggestTransformer(), 'Suggest');
    }

    /**
     * Include listSuggestByCreate
     * @param User $user
     * @return \League\Fractal\Resource\Collection
     */
    public function includeListSuggestByCreate(User $user)
    {
        return $this->collection(empty($user->listSuggestByCreate) ? [] : $user->listSuggestByCreate, new SuggestTransformer(), 'SuggestByCreate');
    }

    /**
     * Include SuggestSalaryIncreaseDetails
     * @param User $user
     * @return \League\Fractal\Resource\Collection
     */
    public function includeSuggestSalaryIncreaseDetails(User $user)
    {
        return $this->collection(empty($user->suggestSalaryIncreaseDetail) ? [] : $user->suggestSalaryIncreaseDetail, new SuggestSalaryIncreaseDetailTransformer(), 'SuggestSalaryIncreaseDetail');
    }

    /**
     * Include SuggestSalaryIncreaseDetails
     * @param User $user
     * @return \League\Fractal\Resource\Collection
     */
    public function includeSuggestBringFoodDetail(User $user)
    {
        return $this->collection(empty($user->suggestBringFoodDetail) ? [] : $user->suggestBringFoodDetail, new SuggestBringFoodDetailTransformer(), 'SuggestBringFoodDetail');
    }

    /**
     * Include SuggestSalaryIncreaseDetails
     * @param User $user
     * @return \League\Fractal\Resource\Collection
     */
    public function includeSuggestUniformDetail(User $user)
    {
        return $this->collection(empty($user->suggestUniformDetail) ? [] : $user->suggestUniformDetail, new SuggestUniformDetailTransformer(), 'SuggestUniformDetail');
    }

    /**
     * Include SuggestSalaryIncreaseDetails
     * @param User $user
     * @return \League\Fractal\Resource\Collection
     */
    public function includeOvertimes(User $user)
    {
        return $this->collection(empty($user->overtime) ? [] : $user->overtime, new SuggestTransformer(), 'Overtime');
    }

    /**
     * Include SuggestSalaryIncreaseDetails
     * @param User $user
     * @return \League\Fractal\Resource\Collection
     */
    public function includeSalaryInformations(User $user)
    {
        return $this->collection(empty($user->salaryInformations) ? [] : $user->salaryInformations, new SalaryInformationTransformer(), 'SalaryInformation');
    }

    /**
     * Include AdditionalTime
     * @param User $user
     * @return \League\Fractal\Resource\Collection
     */
    public function includeAdditionalTime(User $user)
    {
        return $this->collection(empty($user->additionalTime) ? [] : $user->additionalTime, new AdditionalTimeTransformer(), 'AdditionalTime');
    }

    /**
     * Include SubtractionTime
     * @param User $user
     * @return \League\Fractal\Resource\Collection
     */
    public function includeSubtractionTime(User $user)
    {
        return $this->collection(empty($user->subtractionTime) ? [] : $user->subtractionTime, new SubtractionTimeTransformer(), 'SubtractionTime');
    }

    /**
     * Include schedules
     * @param User $user
     * @return \League\Fractal\Resource\Collection
     */
    public function includeSchedules(User $user)
    {
        return $this->collection(empty($user->schedules) ? [] : $user->schedules, new ScheduleTransformer(), 'Schedules');
    }

    /** Include SubtractionTime
     * @param User $user
     * @return \League\Fractal\Resource\Collection
     */
    public function includeLateEarly(User $user)
    {
        return $this->collection(empty($user->lateEarly) ? [] : $user->lateEarly, new LateEarlyTransformer(), 'LateEarly');
    }

    /** Include SubtractionTime
     * @param User $user
     * @return \League\Fractal\Resource\Collection
     */
    public function includeReview(User $user)
    {
        return $this->collection(empty($user->reviews) ? [] : $user->reviews, new ReviewProductivityDetailTransformer(), 'ReviewProductivityDetail');
    }

    /** Include WorkTime
     * @param User $user
     * @return \League\Fractal\Resource\Collection
     */
    public function includeWorkTime(User $user)
    {
        if (empty($user->workTime)) {
            return;
        }

        return $this->item($user->workTime, new WorkTimeTransformer(), 'WorkTime');
    }

    /** Include SubtractionTime
     * @param User $user
     * @return \League\Fractal\Resource\Collection
     */
    public function includePersonalTargets(User $user)
    {
        return $this->collection(empty($user->personalTargets) ? [] : $user->personalTargets, new ReviewPersonalTargetTransformer(), 'ReviewPersonalTarget');
    }

    /** Include Children
     * @param User $user
     * @return \League\Fractal\Resource\Collection
     */
    public function includeChildren(User $user)
    {
        return $this->collection(empty($user->children) ? [] : $user->children, new ChildrenTransformer(), 'Child');
    }

    /**
     * Include RankPositionInformation
     * @param User $user
     * @return \League\Fractal\Resource\Collection
     */
    public function includeRankPositionInformationHistory(User $user)
    {

        return $this->collection($user->rankPositionInformationHistory(), new RankPositionInformationTransformer, 'RankPositionInformationHistory');
    }

    /**
     * Include RankPositionInformation
     * @param User $user
     * @return \League\Fractal\Resource\Collection
     */
    public function includeListRankPositionInformationHistory(User $user)
    {

        return $this->collection($user->listRankPositionInformationHistory, new RankPositionInformationTransformer, 'ListRankPositionInformationHistory');
    }

    /**
     * Include RankPositionInformation
     * @param User $user
     * @return \League\Fractal\Resource\Collection
     */
    public function includeFaults(User $user)
    {
        return $this->collection(empty($user->faults) ? [] : $user->faults, new FaultTransformer(), 'Faults');

    }

    /**
     * @param User $user
     * @return \League\Fractal\Resource\Collection
     */
    public function includeReward(User $user)
    {
        return $this->collection(empty($user->reward) ? [] : $user->reward, new RewardTransformer(), 'Reward');
    }
}
