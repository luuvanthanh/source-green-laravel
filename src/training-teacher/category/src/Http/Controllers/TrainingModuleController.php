<?php

namespace GGPHP\TrainingTeacher\Category\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\TrainingTeacher\Category\Http\Requests\TrainingModuleCreateRequest;
use GGPHP\TrainingTeacher\Category\Http\Requests\TrainingModuleUpdateRequest;
use GGPHP\TrainingTeacher\Category\Repositories\Contracts\TrainingModuleRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TrainingModuleController extends Controller
{
    /**
     * @var $trainingModuleRepository
     */
    protected $trainingModuleRepository;

    /**
     * UserController constructor.
     * @param TrainingModuleRepository $typeTeacherRepository
     */
    public function __construct(TrainingModuleRepository $trainingModuleRepository)
    {
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
        $trainingModule = $this->trainingModuleRepository->getAll($request->all());

        return $this->success($trainingModule, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(TrainingModuleCreateRequest $request)
    {
        $trainingModule = $this->trainingModuleRepository->create($request->all());

        return $this->success($trainingModule, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $trainingModule = $this->trainingModuleRepository->find($id);

        return $this->success($trainingModule, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param trainingModuleUpdateRequest $request
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function update(TrainingModuleUpdateRequest $request, $id)
    {
        $trainingModule = $this->trainingModuleRepository->update($request->all(), $id);

        return $this->success($trainingModule, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        $this->trainingModuleRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }

    public function sortTrainingModule(Request $request)
    {
        $trainingModule = $this->trainingModuleRepository->sortTrainingModule($request->all());

        return $this->success($trainingModule, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }
}
