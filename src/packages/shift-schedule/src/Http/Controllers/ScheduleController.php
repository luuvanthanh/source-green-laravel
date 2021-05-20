<?php

namespace GGPHP\ShiftSchedule\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\ShiftSchedule\Http\Requests\GetShiftUserRequest;
use GGPHP\ShiftSchedule\Http\Requests\ScheduleCreateRequest;
use GGPHP\ShiftSchedule\Http\Requests\ScheduleUpdateRequest;
use GGPHP\ShiftSchedule\Repositories\Contracts\ScheduleRepository;
use GGPHP\ShiftSchedule\Repositories\Contracts\ShiftRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ScheduleController extends Controller
{
    /**
     * @var $scheduleRepository
     */
    protected $scheduleRepository;
    protected $shiftRepository;

    /**
     * ScheduleController constructor.
     * @param scheduleRepository $ScheduleRepository
     */
    public function __construct(ScheduleRepository $scheduleRepository, ShiftRepository $shiftRepository)
    {
        $this->scheduleRepository = $scheduleRepository;
        $this->shiftRepository = $shiftRepository;

    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(ScheduleCreateRequest $request)
    {
        $schedule = $this->scheduleRepository->createOrUpdate($request->all());

        return $this->success($schedule, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $schedule = $this->scheduleRepository->find($id);

        return $this->success($schedule, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $limit = config('constants.SEARCH_VALUES_DEFAULT.LIMIT');
        if ($request->has('limit')) {
            $limit = $request->limit;
        }

        if ($limit == config('constants.SEARCH_VALUES_DEFAULT.LIMIT_ZERO')) {
            $schedule = $this->scheduleRepository->all();
        } else {
            $schedule = $this->scheduleRepository->paginate($limit);
        }

        return $this->success($schedule, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(ScheduleUpdateRequest $request, $id)
    {
        $schedule = $this->scheduleRepository->update($request->all(), $id);

        return $this->success([], trans('lang::messages.common.updateSuccess'), ['isShowData' => false]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy($id, Request $request)
    {
        $this->scheduleRepository->deleteAll($id, $request->all());

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT, 'isShowData' => false]);
    }

    /**
     * Get list schedule employee.
     *
     * @param  Request $request
     *
     * @return \Illuminate\Http\Response
     */
    public function scheduleUser(Request $request)
    {
        $schedule = $this->scheduleRepository->scheduleUser($request->all());

        return $this->success($schedule, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Delete schedule repeat
     *
     * @param  Request $request
     *
     * @return \Illuminate\Http\Response
     */
    public function deleteScheduleRepeat($id, Request $request)
    {
        $schedule = $this->scheduleRepository->deleteScheduleRepeat($id, $request->all());

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }

    /**
     * Delete schedule repeat
     *
     * @param  Request $request
     *
     * @return \Illuminate\Http\Response
     */
    public function getShiftUser($id, GetShiftUserRequest $request)
    {
        $user = $this->scheduleRepository->getShiftUser($id, $request->all());

        return $this->success(["data" => $user], trans('lang::messages.common.getListSuccess'));
    }
}
