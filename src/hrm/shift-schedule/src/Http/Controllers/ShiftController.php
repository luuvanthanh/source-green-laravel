<?php

namespace GGPHP\ShiftSchedule\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\ShiftSchedule\Http\Requests\ActiveStatusShiftRequest;
use GGPHP\ShiftSchedule\Http\Requests\ShiftCreateRequest;
use GGPHP\ShiftSchedule\Http\Requests\ShiftDeleteRequest;
use GGPHP\ShiftSchedule\Http\Requests\ShiftUpdateRequest;
use GGPHP\ShiftSchedule\Repositories\Contracts\ShiftRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ShiftController extends Controller
{
    /**
     * @var $shiftRepository
     */
    protected $shiftRepository;

    /**
     * ShiftController constructor.
     * @param ShiftRepository $shiftRepository
     */
    public function __construct(ShiftRepository $shiftRepository)
    {
        $this->shiftRepository = $shiftRepository;
    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(ShiftCreateRequest $request)
    {
        $shift = $this->shiftRepository->create($request->all());

        return $this->success($shift, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
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
        $shift = $this->shiftRepository->find($id);

        return $this->success($shift, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        $shift = $this->shiftRepository->getShift($request->all());

        return $this->success($shift, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(ShiftUpdateRequest $request, $id)
    {
        $shift = $this->shiftRepository->update($request->all(), $id);

        return $this->success([], trans('lang::messages.common.modifySuccess'), ['isShowData' => false]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(ShiftDeleteRequest $request, $id)
    {
        $this->shiftRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT, 'isShowData' => false]);
    }

    /**
     * Active Status Shift.
     *
     * @param  Request $request
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function activeStatusShift(ActiveStatusShiftRequest $request, $id)
    {
        $shifts = $this->shiftRepository->activeStatusShift($request->all(), $id);

        return $this->success($shifts, trans('lang::messages.common.getListSuccess'));
    }
}
