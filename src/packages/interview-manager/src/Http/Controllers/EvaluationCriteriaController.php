<?php

namespace GGPHP\InterviewManager\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\InterviewManager\Http\Requests\EvaluationCriteriaCreateRequest;
use GGPHP\InterviewManager\Http\Requests\EvaluationCriteriaUpdateRequest;
use GGPHP\InterviewManager\Repositories\Contracts\EvaluationCriteriaRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class EvaluationCriteriaController extends Controller
{
    protected $evaluationCriteriaRepository;

    /**
     * RefundController constructor.
     * @param RefundRepository $refundRepository
     */
    public function __construct(EvaluationCriteriaRepository $evaluationCriteriaRepository)
    {
        $this->evaluationCriteriaRepository = $evaluationCriteriaRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $evaluationCriteria = $this->evaluationCriteriaRepository->index($request->all());

        return $this->success($evaluationCriteria, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(EvaluationCriteriaCreateRequest $request)
    {
        $evaluationCriteria = $this->evaluationCriteriaRepository->create($request->all());

        return $this->success($evaluationCriteria, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     *
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
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(EvaluationCriteriaUpdateRequest $request, $id)
    {
        $evaluationCriteria = $this->evaluationCriteriaRepository->update($request->all(), $id);

        return $this->success($evaluationCriteria, trans('lang::messages.common.modifySuccess'), ['isShowData' => false]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        $this->evaluationCriteriaRepository->delete($id);

        return $this->success([], '', ['code' => Response::HTTP_NO_CONTENT, 'isShowData' => false]);
    }
}
