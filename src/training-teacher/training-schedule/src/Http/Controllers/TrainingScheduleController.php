<?php

namespace GGPHP\TrainingTeacher\TrainingSchedule\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\TrainingTeacher\Category\Repositories\Contracts\TrainingModuleRepository;
use GGPHP\TrainingTeacher\TrainingSchedule\Http\Requests\teacherTrainingBoardUpdateRequest;
use GGPHP\TrainingTeacher\TrainingSchedule\Repositories\Contracts\TrainingScheduleRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TrainingScheduleController extends Controller
{
    /**
     * @var $teacherTrainingBoardRepository
     */
    protected $trainingScheduleRepository;

    protected $trainingModuleRepository;

    /**
     * UserController constructor.
     * @param TypeTeacherRepository $typeTeacherRepository
     */
    public function __construct(TrainingScheduleRepository $trainingScheduleRepository, TrainingModuleRepository $trainingModuleRepository)
    {
        $this->trainingScheduleRepository = $trainingScheduleRepository;
        $this->trainingModuleRepository = $trainingModuleRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $trainingSchedule = $this->trainingScheduleRepository->getAll($request->all());

        return $this->success($trainingSchedule, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $trainingSchedule = $this->trainingScheduleRepository->createAll($request->all());

        return $this->success($trainingSchedule, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $trainingSchedule = $this->trainingScheduleRepository->find($id);

        return $this->success($trainingSchedule, trans('lang::messages.common.getInfoSuccess'));
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
        $trainingSchedule = $this->trainingScheduleRepository->updateAll($request->all(), $id);

        return $this->success($trainingSchedule, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        $this->trainingScheduleRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }

    public function updateTrainingModule(Request $request, $id)
    {
        $trainingmodule = $this->trainingScheduleRepository->updateTrainingModule($request->all(), $id);

        return $this->success($trainingmodule, trans('lang::messages.common.modifySuccess'));
    }
}
