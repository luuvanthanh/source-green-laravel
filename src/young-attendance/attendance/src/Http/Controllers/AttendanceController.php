<?php

namespace GGPHP\Attendance\Http\Controllers;

use GGPHP\Attendance\Http\Requests\AttendanceCreateRequest;
use GGPHP\Attendance\Http\Requests\AttendanceUpdateRequest;
use GGPHP\Attendance\Models\Attendance;
use GGPHP\Attendance\Repositories\Contracts\AttendanceRepository;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AttendanceController extends Controller
{
    protected $attendanceRepository;

    /**
     * AttendanceController constructor.
     * @param AttendanceRepository $attendanceRepository
     */
    public function __construct(AttendanceRepository $attendanceRepository)
    {
        $this->attendanceRepository = $attendanceRepository;
    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(AttendanceCreateRequest $request)
    {
        $attributes = $request->all();

        if (!empty($attributes['status'])) {
            $attributes['status'] = Attendance::STATUS[$attributes['status']];
        }

        $attendance = $this->attendanceRepository->create($attributes);

        return $this->success($attendance, trans('lang-program::messages.attendance.createSuccess'), ['code' => Response::HTTP_CREATED]);
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
        $child = $this->attendanceRepository->find($id);

        return $this->success($child, trans('lang-program::messages.attendance.getInfoSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $attendance = $this->attendanceRepository->getAttendance($request->all());

        return $this->success($attendance, trans('lang-program::messages.attendance.getListSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(AttendanceUpdateRequest $request, $id)
    {
        $child = $this->attendanceRepository->update($request->all(), $id);

        return $this->success($child, trans('lang-program::messages.attendance.updateSuccess'), ['isShowData' => false]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        $this->attendanceRepository->delete($id);

        return $this->success([], '', ['code' => Response::HTTP_NO_CONTENT, 'isShowData' => false]);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function attendancesSummary(Request $request)
    {
        $attendance = $this->attendanceRepository->attendanceCrontab($request->all());

        return $this->success([], trans('lang-program::messages.attendance.getListSuccess'));
    }
}
