<?php

namespace GGPHP\StudyProgram\QuarterReport\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\StudyProgram\QuarterReport\Criteria\QuarterReportCriteriaCriteria;
use GGPHP\StudyProgram\QuarterReport\Http\Requests\QuarterReportCreateRequest;
use GGPHP\StudyProgram\QuarterReport\Http\Requests\QuarterReportUpdateRequest;
use GGPHP\StudyProgram\QuarterReport\Http\Requests\QuarterReportUpdateStatusRequest;
use GGPHP\StudyProgram\QuarterReport\Repositories\Contracts\QuarterReportRepository;
use Illuminate\Http\Response;

class QuarterReportController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $quarterReportRepository;

    /**
     * UserController constructor.
     * @param QuarterReportRepository $quarterReportRepository;
     */
    public function __construct(QuarterReportRepository $quarterReportRepository)
    {
        $this->quarterReportRepository = $quarterReportRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $attributes = $request->all();
        $result = $this->quarterReportRepository->getAll($attributes);

        return $this->success($result, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(QuarterReportCreateRequest $request)
    {
        $attributes = $request->all();
        $result = $this->quarterReportRepository->createAll($attributes);

        return $this->success($result, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $result = $this->quarterReportRepository->find($id);

        return $this->success($result, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(QuarterReportUpdateRequest $request, $id)
    {
        $attributes = $request->all();
        $result = $this->quarterReportRepository->updateAll($attributes, $id);

        return $this->success($result, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->quarterReportRepository->deleteAll($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }

    public function updateStatus(QuarterReportUpdateStatusRequest $request)
    {
        $attributes = $request->all();
        $result = $this->quarterReportRepository->updateStatus($attributes);

        return $this->success($result, trans('lang::messages.common.modifySuccess'));
    }

    public function notificationQuarterReport(QuarterReportUpdateStatusRequest $request)
    {
        $attributes = $request->all();
        $result = $this->quarterReportRepository->notificationQuarterReport($attributes);

        return $this->success($result, trans('lang::messages.common.modifySuccess'));
    }
}
