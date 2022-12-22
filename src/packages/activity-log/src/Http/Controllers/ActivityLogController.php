<?php

namespace GGPHP\ActivityLog\Http\Controllers;

use GGPHP\ActivityLog\Http\Requests\ActivityLogCreateRequest;
use GGPHP\ActivityLog\Http\Requests\ActivityLogUpdateRequest;
use GGPHP\ActivityLog\Http\Requests\ActivityLogDeleteRequest;
use GGPHP\ActivityLog\Http\Requests\ActivityLogReportRefundRequest;
use GGPHP\ActivityLog\Repositories\Contracts\ActivityLogRepository;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ActivityLogController extends Controller
{
    /**
     * @var $activityLogRepository
     */
    protected $activityLogRepository;

    /**
     * UserController constructor.
     * @param ActivityLogRepository $activityLogRepository
     */
    public function __construct(ActivityLogRepository $activityLogRepository)
    {
        $this->activityLogRepository = $activityLogRepository;
    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(ActivityLogCreateRequest $request)
    {
        $activityLog = $this->activityLogRepository->create($request->all());

        return $this->success([], trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED, 'isShowData' => false]);
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
        $activityLog = $this->activityLogRepository->find($id);

        return $this->success($activityLog, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $activityLog = $this->activityLogRepository->getActivityLog($request->all());

        return $this->success($activityLog, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(ActivityLogUpdateRequest $request, $id)
    {
        $activityLog = $this->activityLogRepository->update($request->all(), $id);

        return $this->success([], trans('lang::messages.common.modifySuccess'), ['isShowData' => false]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(ActivityLogDeleteRequest $request, $id)
    {
        $this->activityLogRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT, 'isShowData' => false]);
    }

    public function syncActivityLog()
    {
        $activityLog = $this->activityLogRepository->syncActivityLog();

        return $this->success($activityLog, trans('lang::messages.common.modifySuccess'));
    }

    public function reportRefund(ActivityLogReportRefundRequest $request)
    {
        $activityLog = $this->activityLogRepository->reportRefund($request->all());

        return $this->success($activityLog, trans('lang::messages.common.getListSuccess'));
    }
}
