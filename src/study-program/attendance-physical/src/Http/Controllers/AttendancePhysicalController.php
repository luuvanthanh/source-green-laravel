<?php

namespace GGPHP\StudyProgram\AttendancePhysical\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\StudyProgram\AttendancePhysical\Http\Requests\AttendancePhysicalCreateRequest;
use GGPHP\StudyProgram\AttendancePhysical\Http\Requests\AttendancePhysicalUpdateAllStatusRequest;
use GGPHP\StudyProgram\AttendancePhysical\Http\Requests\AttendancePhysicalUpdateRequest;
use GGPHP\StudyProgram\AttendancePhysical\Http\Requests\AttendancePhysicalUpdateStatusRequest;
use GGPHP\StudyProgram\AttendancePhysical\Models\AttendancePhysical;
use GGPHP\StudyProgram\AttendancePhysical\Repositories\Contracts\AttendancePhysicalRepository;
use Illuminate\Http\Response;

class AttendancePhysicalController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $attendancePhysicalRepository;

    /**
     * UserController constructor.
     * @param AttendancePhysicalRepository $AttendancePhysicalRepository
     */
    public function __construct(AttendancePhysicalRepository $attendancePhysicalRepository)
    {
        $this->attendancePhysicalRepository = $attendancePhysicalRepository;
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

        if (!empty($attributes['status'])) {
            $attributes['status'] = AttendancePhysical::STATUS[$attributes['status']];
        }

        $result = $this->attendancePhysicalRepository->getAll($attributes);

        return $this->success($result, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(AttendancePhysicalCreateRequest $request)
    {
        $attributes = $request->all();
        $result = $this->attendancePhysicalRepository->createAttendancePhysical($attributes);

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
        $result = $this->attendancePhysicalRepository->find($id);

        return $this->success($result, trans('lang::messages.common.getInfoSuccess'));
    }
}
