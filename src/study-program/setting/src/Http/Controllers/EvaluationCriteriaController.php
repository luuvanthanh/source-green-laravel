<?php

namespace GGPHP\StudyProgram\Setting\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\StudyProgram\Setting\Http\Requests\EvaluationCriteriaCreateRequest;
use GGPHP\StudyProgram\Setting\Http\Requests\EvaluationCriteriaDeleteRequest;
use GGPHP\StudyProgram\Setting\Http\Requests\EvaluationCriteriaUpdateRequest;
use GGPHP\StudyProgram\Setting\Repositories\Contracts\EvaluationCriteriaRepository;
use Illuminate\Http\Response;

class EvaluationCriteriaController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $evaluationCriteriaRepository;

    /**
     * UserController constructor.
     * @param evaluationCriteriaRepository $evaluationCriteriaRepository
     */
    public function __construct(EvaluationCriteriaRepository $evaluationCriteriaRepository)
    {
        $this->evaluationCriteriaRepository = $evaluationCriteriaRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $attributes = $request->all();
        $evaluationCriteria = $this->evaluationCriteriaRepository->getAll($attributes);

        return $this->success($evaluationCriteria, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(EvaluationCriteriaCreateRequest $request)
    {
        $attributes = $request->all();
        $evaluationCriteria = $this->evaluationCriteriaRepository->createAll($attributes);

        return $this->success($evaluationCriteria, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $evaluationCriteria = $this->evaluationCriteriaRepository->find($id);

        return $this->success($evaluationCriteria, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(EvaluationCriteriaUpdateRequest $request, $id)
    {
        $attributes = $request->all();
        $evaluationCriteria = $this->evaluationCriteriaRepository->updateAll($attributes, $id);

        return $this->success($evaluationCriteria, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(EvaluationCriteriaDeleteRequest $request, $id)
    {
        $this->evaluationCriteriaRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }
}
