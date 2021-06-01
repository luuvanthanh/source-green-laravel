<?php

namespace GGPHP\Attendance\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Attendance\Http\Requests\AttendanceReasonCreateRequest;
use GGPHP\Attendance\Http\Requests\AttendanceReasonUpdateRequest;
use GGPHP\Attendance\Models\AttendanceReason;
use GGPHP\Attendance\Repositories\Contracts\AttendanceReasonRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AttendanceReasonController extends Controller
{
    /**
     * @var $parentRepository
     */
    protected $attendanceReasonRepository;

    /**
     * UserController constructor.
     * @param AttendanceReasonRepository $attendanceReasonRepository
     */
    public function __construct(AttendanceReasonRepository $attendanceReasonRepository)
    {
        $this->attendanceReasonRepository = $attendanceReasonRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $attendanceReasons = $this->attendanceReasonRepository->filterAttendanceReason($request->all());

        return $this->success($attendanceReasons, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param AttendanceReasonCreateRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(AttendanceReasonCreateRequest $request)
    {
        $attendanceReason = $this->attendanceReasonRepository->create($request->all());

        return $this->success($attendanceReason, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $attendanceReason = $this->attendanceReasonRepository->find($id);

        return $this->success($attendanceReason, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param AttendanceReasonUpdateRequest $request
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function update(AttendanceReasonUpdateRequest $request, $id)
    {
        $credentials = $request->all();
        $attendanceReason = $this->attendanceReasonRepository->update($credentials, $id);

        return $this->success($attendanceReason, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->attendanceReasonRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }

    /**
     * Get AttendanceReason by parent
     * @param Request $request
     * @return Response
     */
    public function attendanceReasonByUser(Request $request)
    {
        $attendanceReasons = $this->attendanceReasonRepository->getAttendanceReason($data);

        return $this->success($attendanceReasons, trans('lang::messages.common.getListSuccess'));
    }

}
