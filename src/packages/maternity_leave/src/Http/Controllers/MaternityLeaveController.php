<?php

namespace GGPHP\MaternityLeave\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\MaternityLeave\Http\Requests\CreatMaternityLeaveRequest;
use GGPHP\MaternityLeave\Http\Requests\UpdateMaternityLeaveRequest;
use GGPHP\MaternityLeave\Repositories\Contracts\MaternityLeaveRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class MaternityLeaveController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $maternityLeaveRepository;

    /**
     * UserController constructor.
     * @param MaternityLeaveRepository $maternityLeaveRepository
     */
    public function __construct(MaternityLeaveRepository $maternityLeaveRepository)
    {
        $this->maternityLeaveRepository = $maternityLeaveRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $employees = $this->maternityLeaveRepository->filterMaternityLeave($request->all());

        return $this->success($employees, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreatMaternityLeaveRequest $request)
    {
        $maternityLeaves = $this->maternityLeaveRepository->create($request->all());
        return $this->success($maternityLeaves, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\MaternityLeave  $maternityLeave
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $maternityLeave = $this->maternityLeaveRepository->find($id);
        if ($maternityLeave) {
            return $this->success($maternityLeave, trans('lang::messages.common.getInfoSuccess'));
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\MaternityLeave  $maternityLeave
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateMaternityLeaveRequest $request, $id)
    {
        $credentials = $request->all();
        $maternityLeave = $this->maternityLeaveRepository->update($credentials, $id);
        return $this->success($maternityLeave, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\MaternityLeave  $maternityLeave
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->maternityLeaveRepository->delete($id);
        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function maternityLeaveSummary(Request $request)
    {
        $request->isMaternityLeaveSummary = true;

        $employees = $this->maternityLeaveRepository->maternityLeaveSummary($request->all());

        return $this->success($employees, trans('lang::messages.common.getListSuccess'));
    }
}
