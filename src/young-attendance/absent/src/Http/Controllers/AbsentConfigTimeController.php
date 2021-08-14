<?php

namespace GGPHP\YoungAttendance\Absent\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\YoungAttendance\Absent\Http\Requests\AbsentConfigTimeCreateOrUpdateRequest;
use GGPHP\YoungAttendance\Absent\Http\Requests\GetStartDateByExpectedDateRequest;
use GGPHP\YoungAttendance\Absent\Repositories\Absent\AbsentConfigTimeRepository;
use Illuminate\Http\Response;
use Illuminate\Http\Request;

class AbsentConfigTimeController extends Controller
{
    protected $absentConfigTimeRepository;

    public function __construct(AbsentConfigTimeRepository $absentConfigTimeRepository)
    {
        $this->absentConfigTimeRepository = $absentConfigTimeRepository;
    }

    public function index(Request $request)
    {
        $absentConfigTime = $this->absentConfigTimeRepository->all();

        return $this->success($absentConfigTime, trans('lang::messages.common.getListSuccess'));
    }

    public function store(AbsentConfigTimeCreateOrUpdateRequest $request)
    {
        $absentConfigTime = $this->absentConfigTimeRepository->createOrUpdate($request->all());

        return $this->success($absentConfigTime, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Get Absent by parent
     * @param Request $request
     * @return Response
     */
    public function getStartDateByExpectedDate(GetStartDateByExpectedDateRequest $request)
    {
        $startDate = $this->absentConfigTimeRepository->getStartDateByExpectedDate($request->all());

        return $this->success($startDate, trans('lang::messages.common.getListSuccess'));
    }
}
