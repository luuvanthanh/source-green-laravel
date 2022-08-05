<?php

namespace GGPHP\EvaluateTeacher\Category\Http\Controllers;

use GGPHP\EvaluateTeacher\Category\Http\Requests\TypeTeacherCreateRequest;
use GGPHP\EvaluateTeacher\Category\Http\Requests\TypeTeacherDeleteRequest;
use GGPHP\EvaluateTeacher\Category\Http\Requests\TypeTeacherUpdateRequest;
use GGPHP\EvaluateTeacher\Category\Repositories\Contracts\TypeTeacherRepository;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TypeTeacherController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $typeTeacherRepository;

    /**
     * UserController constructor.
     * @param TypeTeacherRepository $typeTeacherRepository
     */
    public function __construct(TypeTeacherRepository $typeTeacherRepository)
    {
        $this->typeTeacherRepository = $typeTeacherRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $typeTeachers = $this->typeTeacherRepository->getTypeTeacher($request->all());

        return $this->success($typeTeachers, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(TypeTeacherCreateRequest $request)
    {
        $credentials = $request->all();
        $typeTeacher = $this->typeTeacherRepository->create($credentials);
        return $this->success($typeTeacher, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $typeTeacher = $this->typeTeacherRepository->find($id);
        return $this->success($typeTeacher, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param TypeTeacherUpdateRequest $request
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function update(TypeTeacherUpdateRequest $request, $id)
    {
        $credentials = $request->all();
        $typeTeacher = $this->typeTeacherRepository->update($credentials, $id);
        return $this->success($typeTeacher, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(TypeTeacherDeleteRequest $request, $id)
    {
        $this->typeTeacherRepository->delete($id);
        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function loadCategory(Request $request)
    {
        $credentials = $request->all();
        $typeTeacher = $this->typeTeacherRepository->loadCategory($credentials);

        return $this->success($typeTeacher, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }
}
