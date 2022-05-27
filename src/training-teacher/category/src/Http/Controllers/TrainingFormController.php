<?php

namespace GGPHP\TrainingTeacher\Category\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\TrainingTeacher\Category\Http\Requests\TrainingFormCreateRequest;
use GGPHP\TrainingTeacher\Category\Http\Requests\TrainingFormDeleteRequest;
use GGPHP\TrainingTeacher\Category\Http\Requests\TrainingFormUpdateRequest;
use GGPHP\TrainingTeacher\Category\Models\TrainingForm;
use GGPHP\TrainingTeacher\Category\Repositories\Contracts\TrainingFormRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TrainingFormController extends Controller
{
    /**
     * @var $trainingFormRepository
     */
    protected $trainingFormRepository;

    /**
     * UserController constructor.
     * @param TypeTeacherRepository $typeTeacherRepository
     */
    public function __construct(TrainingFormRepository $trainingFormRepository)
    {
        $this->trainingFormRepository = $trainingFormRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $trainingForm = $this->trainingFormRepository->getAll($request->all());

        return $this->success($trainingForm, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(TrainingFormCreateRequest $request)
    {
        $attributes = $request->all();
        $attributes['type'] = TrainingForm::TYPE_TRAINING[$attributes['type']];
        $trainingForm = $this->trainingFormRepository->create($attributes);

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
        $trainingForm = $this->trainingFormRepository->find($id);

        return $this->success($trainingForm, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param trainingFormUpdateRequest $request
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function update(TrainingFormUpdateRequest $request, $id)
    {
        $trainingForm = $this->trainingFormRepository->update($request->all(), $id);

        return $this->success($trainingForm, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(TrainingFormDeleteRequest $request, $id)
    {
        $this->trainingFormRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
