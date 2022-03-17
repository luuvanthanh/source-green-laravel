<?php

namespace GGPHP\EvaluateTeacher\EvaluateTeacher\Http\Controllers;

use GGPHP\EvaluateTeacher\EvaluateTeacher\Http\Requests\EvaluateTeacherCreateRequest;
use GGPHP\EvaluateTeacher\EvaluateTeacher\Http\Requests\EvaluateTeacherDeleteRequest;
use GGPHP\EvaluateTeacher\EvaluateTeacher\Http\Requests\EvaluateTeacherUpdateRequest;
use GGPHP\EvaluateTeacher\EvaluateTeacher\Repositories\Contracts\EvaluateTeacherRepository;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class EvaluateTeacherController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $evaluateTeacherRepository;

    /**
     * UserController constructor.
     * @param EvaluateTeacherRepository $evaluateTeacherRepository
     */
    public function __construct(EvaluateTeacherRepository $evaluateTeacherRepository)
    {
        $this->evaluateTeacherRepository = $evaluateTeacherRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $evaluateTeachers = $this->evaluateTeacherRepository->getEvaluateTeacher($request->all());

        return $this->success($evaluateTeachers, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(EvaluateTeacherCreateRequest $request)
    {
        $credentials = $request->all();
        $evaluateTeacher = $this->evaluateTeacherRepository->create($credentials);
        return $this->success($evaluateTeacher, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $evaluateTeacher = $this->evaluateTeacherRepository->find($id);
        return $this->success($evaluateTeacher, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param EvaluateTeacherUpdateRequest $request
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function update(EvaluateTeacherUpdateRequest $request, $id)
    {
        $credentials = $request->all();
        $evaluateTeacher = $this->evaluateTeacherRepository->update($credentials, $id);
        return $this->success($evaluateTeacher, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(EvaluateTeacherDeleteRequest $request, $id)
    {
        $this->evaluateTeacherRepository->delete($id);
        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }
}
