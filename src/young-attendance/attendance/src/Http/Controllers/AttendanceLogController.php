<?php

namespace GGPHP\Attendance\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Attendance\Http\Requests\AttendanceLogCreateRequest;
use GGPHP\Attendance\Http\Requests\AttendanceLogUpdateRequest;
use GGPHP\Attendance\Models\AttendanceLog;
use GGPHP\Attendance\Repositories\Contracts\AttendanceLogRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AttendanceLogController extends Controller
{
    /**
     * @var $parentRepository
     */
    protected $attendanceLogRepository;

    /**
     * UserController constructor.
     * @param AttendanceLogRepository $attendanceLogRepository
     */
    public function __construct(AttendanceLogRepository $attendanceLogRepository)
    {
        $this->attendanceLogRepository = $attendanceLogRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $attendanceLogs = $this->attendanceLogRepository->filterAttendanceLog($request->all());

        return $this->success($attendanceLogs, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param AttendanceLogCreateRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(AttendanceLogCreateRequest $request)
    {
        $attendanceLog = $this->attendanceLogRepository->create($request->all());

        return $this->success($attendanceLog, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $attendanceLog = $this->attendanceLogRepository->find($id);

        return $this->success($attendanceLog, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param AttendanceLogUpdateRequest $request
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function update(AttendanceLogUpdateRequest $request, $id)
    {
        $credentials = $request->all();
        $attendanceLog = $this->attendanceLogRepository->update($credentials, $id);

        return $this->success($attendanceLog, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->attendanceLogRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }

    /**
     * Get AttendanceLog by parent
     * @param Request $request
     * @return Response
     */
    public function attendanceLogByUser(Request $request)
    {
        $attendanceLogs = $this->attendanceLogRepository->getAttendanceLog($data);

        return $this->success($attendanceLogs, trans('lang::messages.common.getListSuccess'));
    }

}
