<?php

namespace GGPHP\Timekeeping\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Timekeeping\Models\Timekeeping;
use GGPHP\Timekeeping\Repositories\Contracts\TimekeepingRepository;
use GGPHP\Users\Repositories\Contracts\UserRepository;
use Illuminate\Http\Request;

class ReportTimekeepingController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $timekeepingRepository;
    protected $employeeRepository;

    /**
     * UserController constructor.
     * @param TimekeepingRepository $timekeepingRepository
     * @param UserRepository $employeeRepository
     */
    public function __construct(
        TimekeepingRepository $timekeepingRepository,
        UserRepository $employeeRepository
    ) {
        $this->timekeepingRepository = $timekeepingRepository;
        $this->employeeRepository = $employeeRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function getTimekeepingReport(Request $request, $forceReturn = false)
    {
        $isFilter = $request->is_filter;
        $store = $request->store_id;
        $position = $request->position_id;
        $work_form_id = $request->work_form_id;
        $start_date = $request->start_date;
        $end_date = $request->end_date;
        $employeeId = $request->employee_id;
        $type = $request->type;
        $year = $request->year;
        $employeesByStore = [];
        $full_name = $request->full_name;
        $limit = config('constants-timekeeping.SEARCH_VALUES_DEFAULT.LIMIT_ZERO');
        $is_shift = !is_null($request->is_shift) ? $request->is_shift : "true";

        if ($request->has('limit')) {
            $limit = $request->limit;
        }

        if ($year) {
            // get 12 month of year
            $months = [];
            for ($i = 1; $i <= 12; $i++) {
                $months[date("$year-m", strtotime(date("$year") . "-" . $i . "-01"))]['start_date'] = date("$year-m-d", strtotime(date("$year") . "-" . $i . "-01"));
                $months[date("$year-m", strtotime(date("$year") . "-" . $i . "-01"))]['end_date'] = date("$year-m-t", strtotime(date("$year") . "-" . $i));
            }

            $resultTimekeepingMonth = [];

            foreach ($months as $key => &$month) {

                $employeesByStore = $this->timekeepingRepository->timekeepingReport($employeeId, $position, $store, $month['start_date'], $month['end_date'], $limit, true, $type, $work_form_id, $isFilter, $full_name, $is_shift);

                foreach ($employeesByStore as &$value) {
                    $resultTimekeepingMonth[$value->id][$key] = [
                        'hourRedundantMonth' => gmdate("H:i", $value->totalHourRedundantWorks),
                        'hourRedundantMonthFormat' => $value->totalHourRedundantWorks,
                        'timekeepingMonth' => $value->totalWorks,
                    ];
                }
            }

            foreach ($employeesByStore as &$item) {
                if (array_key_exists($item->id, $resultTimekeepingMonth)) {
                    // Sum total timekeeping, hour redundant
                    $collection = collect($resultTimekeepingMonth[$item->id]);

                    $totalTimekeeping = 0;
                    $totalHourRedundant = 0;

                    $totalTimekeeping += $collection->sum(function ($value) {
                        return !empty($value['timekeepingMonth']) ? $value['timekeepingMonth'] : 0;
                    });

                    $totalHourRedundant += $collection->sum(function ($value) {
                        return !empty($value['hourRedundantMonthFormat']) ? $value['hourRedundantMonthFormat'] : 0;
                    });

                    $item->timeKeepingReport = $resultTimekeepingMonth[$item->id];
                    $item->totalTimekeepingByMonth = $totalTimekeeping;
                    $item->totalHourRedundantByMonth = gmdate("H:i", $totalHourRedundant);
                }
            }

            // used to return results for excel export
            if ($forceReturn) {
                return $employeesByStore;
            }

            $response = $limit == config('constants-timekeeping.SEARCH_VALUES_DEFAULT.LIMIT_ZERO') ? $employeesByStore : $this->timekeepingRepository->paginateCollection($employeesByStore, $limit);

            $employeesByStore = $this->employeeRepository->parserResult($response);

        } elseif ($start_date && $end_date) {

            $employeesByStore = $this->timekeepingRepository->timekeepingReport($employeeId, $position, $store, $start_date, $end_date, $limit, true, $type, $work_form_id, $isFilter, null, $full_name, $is_shift);
        }

        return $this->success($employeesByStore, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function export(Request $request)
    {
        if ($request->type == Timekeeping::MONTH && $request->year) {
            $results = $this->getTimekeepingReport($request, true);
        }
        $result = $this->timekeepingRepository->export($request, $results ?? []);

        if (is_string($result)) {
            return $this->error('Export failed', trans('Template not found'), 400);
        }

        return $result;
    }
}
