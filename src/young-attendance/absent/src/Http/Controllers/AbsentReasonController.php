<?php

namespace GGPHP\YoungAttendance\Absent\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\YoungAttendance\Absent\Http\Requests\AbsentReasonCreateRequest;
use GGPHP\YoungAttendance\Absent\Http\Requests\AbsentReasonUpdateRequest;
use GGPHP\YoungAttendance\Absent\Repositories\Absent\AbsentReasonRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AbsentReasonController extends Controller
{
    /**
     * @var $parentRepository
     */
    protected $absentReasonRepository;

    /**
     * UserController constructor.
     * @param AbsentReasonRepository $absentReasonRepository
     */
    public function __construct(AbsentReasonRepository $absentReasonRepository)
    {
        $this->absentReasonRepository = $absentReasonRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $absentReasons = $this->absentReasonRepository->getAll($request->all());

        return $this->success($absentReasons, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(AbsentReasonCreateRequest $request)
    {
        $credentials = $request->all();
        $absentReason = $this->absentReasonRepository->create($credentials);
        return $this->success($absentReason, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $absentReason = $this->absentReasonRepository->find($id);
        return $this->success($absentReason, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param AbsentReasonUpdateRequest $request
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function update(AbsentReasonUpdateRequest $request, $id)
    {
        $credentials = $request->all();
        $absentReason = $this->absentReasonRepository->update($credentials, $id);
        return $this->success($absentReason, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->absentReasonRepository->delete($id);
        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }
}
