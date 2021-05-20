<?php

namespace GGPHP\Reward\Repositories\Eloquent;

use Carbon\Carbon;
use GGPHP\Core\Repositories\Eloquent\CoreRepositoryEloquent;
use GGPHP\Reward\Models\DecisionReward;
use GGPHP\Reward\Presenters\DecisionRewardPresenter;
use GGPHP\Reward\Repositories\Contracts\DecisionRewardRepository;
use GGPHP\Reward\Services\DecisionRewardDetailServices;
use GGPHP\WordExporter\Services\WordExporterServices;
use Illuminate\Container\Container as Application;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class DecisionRewardRepositoryEloquent.
 *
 * @package namespace App\Repositories\Eloquent;
 */
class DecisionRewardRepositoryEloquent extends CoreRepositoryEloquent implements DecisionRewardRepository
{
    protected $fieldSearchable = [
        'Id',
        'CreationTime',
    ];

    public function __construct(
        WordExporterServices $wordExporterServices,
        Application $app
    ) {
        parent::__construct($app);
        $this->wordExporterServices = $wordExporterServices;
    }

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return DecisionReward::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    /**
     * Specify Presenter class name
     *
     * @return string
     */
    public function presenter()
    {
        return DecisionRewardPresenter::class;
    }

    public function create(array $attributes)
    {
        \DB::beginTransaction();
        try {
            $decisionReward = DecisionReward::create($attributes);
            DecisionRewardDetailServices::add($decisionReward->Id, $attributes['data']);

            \DB::commit();
        } catch (\Exception $e) {

            \DB::rollback();
        }

        return parent::find($decisionReward->Id);

    }

    public function update(array $attributes, $id)
    {
        $decisionReward = DecisionReward::findOrFail($id);
        \DB::beginTransaction();
        try {
            $decisionReward->update($attributes);
            $decisionReward->decisionRewardDetails()->delete();
            DecisionRewardDetailServices::add($decisionReward->Id, $attributes['data']);

            \DB::commit();
        } catch (\Exception $e) {

            \DB::rollback();
        }

        return parent::find($decisionReward->Id);
    }

    public function getDecisionReward(array $attributes)
    {
        if (!empty($attributes['startDate']) && !empty($attributes['endDate'])) {
            $this->model = $this->model->whereDate('DecisionDate', '>=', $attributes['startDate'])->whereDate('DecisionDate', '<=', $attributes['endDate']);
        }

        if (!empty($attributes['employeeId'])) {
            $this->model = $this->model->whereHas('decisionRewardDetails', function ($query) use ($attributes) {
                $employeeId = explode(',', $attributes['employeeId']);
                $query->whereIn('EmployeeId', $employeeId);
            });
        }

        if (!empty($attributes['limit'])) {
            $decisionReward = $this->paginate($attributes['limit']);
        } else {
            $decisionReward = $this->get();
        }

        return $decisionReward;
    }

    public function translateToWords($number)
    {
        // zero is a special case, it cause problems even with typecasting if we don't deal with it here
        $max_size = pow(10, 18);
        if (!$number) {
            return "zero";
        }

        if (is_int($number) && $number < abs($max_size)) {
            switch ($number) {
                // set up some rules for converting digits to words
                case $number < 0:
                    $prefix = "negative";
                    $suffix = $this->translateToWords(-1 * $number);
                    $string = $prefix . " " . $suffix;
                    break;
                case 1:
                    $string = "một";
                    break;
                case 2:
                    $string = "hai";
                    break;
                case 3:
                    $string = "ba";
                    break;
                case 4:
                    $string = "bốn";
                    break;
                case 5:
                    $string = "năm";
                    break;
                case 6:
                    $string = "sáu";
                    break;
                case 7:
                    $string = "bảy";
                    break;
                case 8:
                    $string = "tám";
                    break;
                case 9:
                    $string = "chín";
                    break;
                case 10:
                    $string = "mười";
                    break;
                case 11:
                    $string = "mười một";
                    break;
                case 12:
                    $string = "mười hai";
                    break;
                case 13:
                    $string = "mười ba";
                    break;
                // fourteen handled later
                case 15:
                    $string = "mười năm";
                    break;
                case $number < 20:
                    $string = $this->translateToWords($number % 10);
                    $string .= $suffix;
                    break;
                case 20:
                    $string = "hai mươi";
                    break;
                case 30:
                    $string = "ba mươi";
                    break;
                case 40:
                    $string = "bốn mươi";
                    break;
                case 50:
                    $string = "năm mươi";
                    break;
                case 60:
                    $string = "sáu mươi";
                    break;
                case 70:
                    $string = "bảy mươi";
                    break;
                case 80:
                    $string = "tắm mươi";
                    break;
                case 90:
                    $string = "chín mươi";
                    break;
                case $number < 100:
                    $prefix = $this->translateToWords($number - $number % 10);
                    $suffix = $this->translateToWords($number % 10);
                    $string = $prefix . " " . $suffix;
                    break;
                // handles all number 100 to 999
                case $number < pow(10, 3):

                    // floor return a float not an integer
                    $prefix = $this->translateToWords(intval(floor($number / pow(10, 2)))) . " trăm";
                    if ($number % pow(10, 2)) {
                        $suffix = " " . $this->translateToWords($number % pow(10, 2));
                    }

                    if (isset($suffix)) {
                        $string = $prefix . $suffix;
                    } else {
                        $string = $prefix;
                    }

                    break;
                case $number < pow(10, 6):
                    // floor return a float not an integer
                    $prefix = $this->translateToWords(intval(floor($number / pow(10, 3)))) . " nghìn";
                    if ($number % pow(10, 3)) {
                        $suffix = $this->translateToWords($number % pow(10, 3));
                    }

                    if (isset($suffix)) {
                        $string = $prefix . " " . $suffix;
                    } else {
                        $string = $prefix;
                    }

                    break;
                case $number < pow(10, 9):

                    // floor return a float not an integer
                    $prefix = $this->translateToWords(intval(floor($number / pow(10, 6)))) . " triệu";
                    if ($number % pow(10, 6)) {

                        $suffix = $this->translateToWords($number % pow(10, 6));
                    }

                    if (isset($suffix)) {
                        $string = $prefix . " " . $suffix;
                    } else {
                        $string = $prefix;
                    }

                    break;
                case $number < pow(10, 12):
                    // floor return a float not an integer
                    $prefix = $this->translateToWords(intval(floor($number / pow(10, 9)))) . " tỷ";
                    if ($number % pow(10, 9)) {
                        $suffix = $this->translateToWords($number % pow(10, 9));
                    }

                    if (isset($suffix)) {
                        $string = $prefix . " " . $suffix;
                    } else {
                        $string = $prefix;
                    }

                    break;
                case $number < pow(10, 15):
                    // floor return a float not an integer
                    $prefix = $this->translateToWords(intval(floor($number / pow(10, 12)))) . " nghìn tỷ";
                    if ($number % pow(10, 12)) {
                        $suffix = $this->translateToWords($number % pow(10, 12));
                    }

                    if (isset($suffix)) {
                        $string = $prefix . " " . $suffix;
                    } else {
                        $string = $prefix;
                    }

                    break;
                // Be careful not to pass default formatted numbers in the quadrillions+ into this function
                // Default formatting is float and causes errors
                case $number < pow(10, 18):
                    // floor return a float not an integer
                    $prefix = $this->translateToWords(intval(floor($number / pow(10, 15)))) . " triệu tỷ";
                    if ($number % pow(10, 15)) {
                        $suffix = $this->translateToWords($number % pow(10, 15));
                    }

                    if (isset($suffix)) {
                        $string = $prefix . " " . $suffix;
                    } else {
                        $string = $prefix;
                    }

                    break;
            }
        } else {
            echo "ERROR with - $number<br/> Number must be an integer between -" . number_format($max_size, 0, ".", ",") . " and " . number_format($max_size, 0, ".", ",") . " exclussive.";
        }

        return $string;
    }

    public function exportWord($id)
    {
        $decisionReward = DecisionReward::findOrFail($id);
        $now = Carbon::now();

        $detail = $decisionReward->decisionRewardDetails->first();
        $employee = $detail->employee;
        $params = [
            'decisionNumber' => $decisionReward->DecisionNumber,
            'dateNow' => $decisionReward->DecisionDate->format('d'),
            'monthNow' => $decisionReward->DecisionDate->format('m'),
            'yearNow' => $decisionReward->DecisionDate->format('Y'),
            'position' => $employee->positionLevelNow ? $employee->positionLevelNow->position->Name : '       ',
            'branchWord' => $employee->positionLevelNow ? $employee->positionLevelNow->branch->Name : '       ',
            'reason' => $decisionReward->Reason ? $decisionReward->Reason : '       ',
            'timeApply' => $detail->TimeApply ? $detail->TimeApply->format('m-Y') : '       ',
            'money' => $detail->Money ? number_format($detail->Money) : '       ',
            'moneyWord' => $detail->Money ? $this->translateToWords($detail->Money) : '       ',
            'fullName' => $employee->FullName ? $employee->FullName : '       ',
        ];

        return $this->wordExporterServices->exportWord('decision_reward', $params);
    }
}
