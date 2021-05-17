<?php

namespace GGPHP\ShiftSchedule\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\ShiftSchedule\Http\Requests\DivisionShiftCreateRequest;
use GGPHP\ShiftSchedule\Http\Requests\DivisionShiftDeleteRequest;
use GGPHP\ShiftSchedule\Http\Requests\DivisionShiftUpdateRequest;
use GGPHP\ShiftSchedule\Repositories\Contracts\DivisionShiftRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class DivisionShiftController extends Controller
{
    /**
     * @var $divisionShiftRepository
     */
    protected $divisionShiftRepository;

    /**
     * DivisionShiftController constructor.
     * @param DivisionShiftRepository $divisionShiftRepository
     */
    public function __construct(DivisionShiftRepository $divisionShiftRepository)
    {
        $this->divisionShiftRepository = $divisionShiftRepository;
    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(DivisionShiftCreateRequest $request)
    {
        $divisionShift = $this->divisionShiftRepository->create($request->all());

        return $this->success($divisionShift, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
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
        $divisionShift = $this->divisionShiftRepository->find($id);

        return $this->success($divisionShift, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        $divisionShift = $this->divisionShiftRepository->getDivisionShift($request->all());

        return $this->success($divisionShift, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(DivisionShiftUpdateRequest $request, $id)
    {
        $divisionShift = $this->divisionShiftRepository->update($request->all(), $id);

        return $this->success([], trans('lang::messages.common.modifySuccess'), ['isShowData' => false]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(DivisionShiftDeleteRequest $request, $id)
    {
        $this->divisionShiftRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT, 'isShowData' => false]);
    }

}
