<?php

namespace GGPHP\YoungAttendance\Absent\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\YoungAttendance\Absent\Http\Requests\AbsentCreateRequest;
use GGPHP\YoungAttendance\Absent\Http\Requests\AbsentUpdateRequest;
use GGPHP\YoungAttendance\Absent\Models\Absent;
use GGPHP\YoungAttendance\Absent\Repositories\Absent\AbsentRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AbsentController extends Controller
{
    /**
     * @var $parentRepository
     */
    protected $absentRepository;

    /**
     * UserController constructor.
     * @param AbsentRepository $absentRepository
     */
    public function __construct(AbsentRepository $absentRepository)
    {
        $this->absentRepository = $absentRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $absents = $this->absentRepository->filterAbsent($request->all());

        return $this->success($absents, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param AbsentCreateRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(AbsentCreateRequest $request)
    {
        $absent = $this->absentRepository->create($request->all());

        return $this->success($absent, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $absent = $this->absentRepository->find($id);

        return $this->success($absent, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param AbsentUpdateRequest $request
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function update(AbsentUpdateRequest $request, $id)
    {
        $credentials = $request->all();
        $absent = $this->absentRepository->update($credentials, $id);

        return $this->success($absent, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->absentRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }

    /**
     * Get Absent by parent
     * @param Request $request
     * @return Response
     */
    public function absentByUser(Request $request)
    {
        $absents = $this->absentRepository->getAbsent($data);

        return $this->success($absents, trans('lang::messages.common.getListSuccess'));
    }

}
