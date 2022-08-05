<?php

namespace GGPHP\TrainingTeacher\Category\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\TrainingTeacher\Category\Http\Requests\TrainingSkillCreateRequest;
use GGPHP\TrainingTeacher\Category\Http\Requests\TrainingSkillDeleteRequest;
use GGPHP\TrainingTeacher\Category\Http\Requests\TrainingSkillUpdateRequest;
use GGPHP\TrainingTeacher\Category\Repositories\Contracts\TrainingFormRepository;
use GGPHP\TrainingTeacher\Category\Repositories\Contracts\TrainingSkillRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TrainingSkillController extends Controller
{
    /**
     * @var $trainingSkillRepository
     */
    protected $trainingSkillRepository;

    /**
     * UserController constructor.
     * @param TypeTeacherRepository $typeTeacherRepository
     */
    public function __construct(TrainingSkillRepository $trainingSkillRepository)
    {
        $this->trainingSkillRepository = $trainingSkillRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $trainingForm = $this->trainingSkillRepository->getAll($request->all());

        return $this->success($trainingForm, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(TrainingSkillCreateRequest $request)
    {
        $trainingForm = $this->trainingSkillRepository->create($request->all());

        return $this->success($trainingForm, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $trainingForm = $this->trainingSkillRepository->find($id);

        return $this->success($trainingForm, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param trainingFormUpdateRequest $request
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function update(TrainingSkillUpdateRequest $request, $id)
    {
        $trainingForm = $this->trainingSkillRepository->update($request->all(), $id);

        return $this->success($trainingForm, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(TrainingSkillDeleteRequest $request, $id)
    {
        $this->trainingSkillRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
