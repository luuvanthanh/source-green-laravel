<?php

namespace GGPHP\WorkHour\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\WorkHour\Http\Requests\CreatWorkHourRequest;
use GGPHP\WorkHour\Http\Requests\UpdateWorkHourRequest;
use GGPHP\WorkHour\Repositories\Contracts\WorkHourRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class WorkHourController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $workHourRepository;

    /**
     * UserController constructor.
     * @param WorkHourRepository $workHourRepository
     */
    public function __construct(WorkHourRepository $workHourRepository)
    {
        $this->workHourRepository = $workHourRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $employees = $this->workHourRepository->filterWorkHour($request->all());

        return $this->success($employees, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreatWorkHourRequest $request)
    {
        $workHours = $this->workHourRepository->create($request->all());
        return $this->success($workHours, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\WorkHour  $workHour
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $workHour = $this->workHourRepository->find($id);
        if ($workHour) {
            return $this->success($workHour, trans('lang::messages.common.getInfoSuccess'));
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\WorkHour  $workHour
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateWorkHourRequest $request, $id)
    {
        $credentials = $request->all();
        $workHour = $this->workHourRepository->update($credentials, $id);
        return $this->success($workHour, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\WorkHour  $workHour
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->workHourRepository->delete($id);
        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function workHourSummary(Request $request)
    {
        $request->isWorkHourSummary = true;

        $employees = $this->workHourRepository->workHourSummary($request->all());

        return $this->success($employees, trans('lang::messages.common.getListSuccess'));
    }
}
