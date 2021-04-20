<?php

namespace GGPHP\Timekeeping\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Timekeeping\Http\Requests\CreatTimekeepingRequest;
use GGPHP\Timekeeping\Http\Requests\UpdateTimekeepingRequest;
use GGPHP\Timekeeping\Repositories\Contracts\TimekeepingRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TimekeepingController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $timekeepingRepository;

    /**
     * UserController constructor.
     * @param TimekeepingRepository $timekeepingRepository
     */
    public function __construct(TimekeepingRepository $timekeepingRepository)
    {
        $this->timekeepingRepository = $timekeepingRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $limit = config('constants.SEARCH_VALUES_DEFAULT.LIMIT');
        if ($request->has('limit')) {
            $limit = $request->limit;
        }

        $employees = $this->timekeepingRepository->filterTimekeeping($request->all());
        return $this->success($employees, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreatTimekeepingRequest $request)
    {
        $timekeepings = $this->timekeepingRepository->create($request->all());
        return $this->success($timekeepings, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Timekeeping  $timekeeping
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $timekeeping = $this->timekeepingRepository->find($id);

        if ($timekeeping) {
            return $this->success($timekeeping, trans('lang::messages.common.getInfoSuccess'));
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Timekeeping  $timekeeping
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateTimekeepingRequest $request, $id)
    {
        $credentials = $request->all();
        $timekeeping = $this->timekeepingRepository->update($credentials, $id);

        return $this->success($timekeeping, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Timekeeping  $timekeeping
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->timekeepingRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function getTimekeepingReport(Request $request, $forceReturn = false)
    {

        $limit = config('constants-timekeeping.SEARCH_VALUES_DEFAULT.LIMIT_ZERO');
        $is_shift = !is_null($request->is_shift) ? $request->is_shift : "true";

        if ($request->has('limit')) {
            $limit = $request->limit;
        }

        if ($year) {
            // get 12 month of year
            $months = [];
            for ($i = 1; $i <= 12; $i++) {
                $months[date("$year-m", strtotime(date("$year") . "-" . $i . "-01"))]['StartDate'] = date("$year-m-d", strtotime(date("$year") . "-" . $i . "-01"));
                $months[date("$year-m", strtotime(date("$year") . "-" . $i . "-01"))]['EndDate'] = date("$year-m-t", strtotime(date("$year") . "-" . $i));
            }

            $resultTimekeepingMonth = [];

            foreach ($months as $key => &$month) {

                $employeesByStore = $this->timekeepingRepository->timekeepingReport($employeeId, $position, $store, $month['StartDate'], $month['EndDate'], $limit, true, $type, $work_form_id, $isFilter, $full_name, $is_shift);

                foreach ($employeesByStore as &$value) {
                    $resultTimekeepingMonth[$value->Id][$key] = [
                        'hourRedundantMonth' => gmdate("H:i", $value->totalHourRedundantWorks),
                        'hourRedundantMonthFormat' => $value->totalHourRedundantWorks,
                        'timekeepingMonth' => $value->totalWorks,
                    ];
                }
            }

            foreach ($employeesByStore as &$item) {
                if (array_key_exists($item->Id, $resultTimekeepingMonth)) {
                    // Sum total timekeeping, hour redundant
                    $collection = collect($resultTimekeepingMonth[$item->Id]);

                    $totalTimekeeping = 0;
                    $totalHourRedundant = 0;

                    $totalTimekeeping += $collection->sum(function ($value) {
                        return !empty($value['timekeepingMonth']) ? $value['timekeepingMonth'] : 0;
                    });

                    $totalHourRedundant += $collection->sum(function ($value) {
                        return !empty($value['hourRedundantMonthFormat']) ? $value['hourRedundantMonthFormat'] : 0;
                    });

                    $item->timeKeepingReport = $resultTimekeepingMonth[$item->Id];
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

        } elseif ($StartDate && $EndDate) {

            $employeesByStore = $this->timekeepingRepository->timekeepingReport($employeeId, $position, $store, $StartDate, $EndDate, $limit, true, $type, $work_form_id, $isFilter, null, $full_name, $is_shift);
        }

        return $this->success($employeesByStore, trans('lang::messages.common.getInfoSuccess'));
    }
}
