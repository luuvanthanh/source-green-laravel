<?php

namespace GGPHP\TrainingTeacher\TrainingModuleBoard\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\TrainingTeacher\TrainingModuleBoard\Http\Requests\TeacherTrainingBoardCreateRequest;
use GGPHP\TrainingTeacher\TrainingModuleBoard\Http\Requests\teacherTrainingBoardUpdateRequest;
use GGPHP\TrainingTeacher\TrainingModuleBoard\Repositories\Contracts\TeacherTrainingBoardRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TeacherTrainingBoardController extends Controller
{
    /**
     * @var $teacherTrainingBoardRepository
     */
    protected $teacherTrainingBoardRepository;

    /**
     * UserController constructor.
     * @param TypeTeacherRepository $typeTeacherRepository
     */
    public function __construct(TeacherTrainingBoardRepository $teacherTrainingBoardRepository)
    {
        $this->teacherTrainingBoardRepository = $teacherTrainingBoardRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $teacherTrainingBoard = $this->teacherTrainingBoardRepository->getAll($request->all());

        return $this->success($teacherTrainingBoard, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(TeacherTrainingBoardCreateRequest $request)
    {
        $teacherTrainingBoard = $this->teacherTrainingBoardRepository->createAll($request->all());

        return $this->success($teacherTrainingBoard, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $teacherTrainingBoard = $this->teacherTrainingBoardRepository->find($id);

        return $this->success($teacherTrainingBoard, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param teacherTrainingBoardUpdateRequest $request
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $teacherTrainingBoard = $this->teacherTrainingBoardRepository->updateAll($request->all(), $id);

        return $this->success($teacherTrainingBoard, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        $this->teacherTrainingBoardRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
