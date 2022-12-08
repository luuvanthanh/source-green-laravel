<?php

namespace GGPHP\DecisionNumberSample\Http\Controllers;

use GGPHP\DecisionNumberSample\Http\Requests\DecisionNumberSampleCreateRequest;
use GGPHP\DecisionNumberSample\Http\Requests\DecisionNumberSampleUpdateRequest;
use GGPHP\DecisionNumberSample\Http\Requests\DecisionNumberSampleDeleteRequest;
use GGPHP\DecisionNumberSample\Http\Requests\DecisionNumberSampleReportRefundRequest;
use GGPHP\DecisionNumberSample\Repositories\Contracts\DecisionNumberSampleRepository;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\DecisionNumberSample\Models\DecisionNumberSample;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class DecisionNumberSampleController extends Controller
{
    /**
     * @var $decisionNumberSampleRepository
     */
    protected $decisionNumberSampleRepository;

    /**
     * UserController constructor.
     * @param DecisionNumberSampleRepository $decisionNumberSampleRepository
     */
    public function __construct(DecisionNumberSampleRepository $decisionNumberSampleRepository)
    {
        $this->decisionNumberSampleRepository = $decisionNumberSampleRepository;
    }

    /**
     * Store a newly created resoucre in storage
     * @param  Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(DecisionNumberSampleCreateRequest $request)
    {
        $decisionNumberSample = $this->decisionNumberSampleRepository->create($request->all());

        return $this->success([], trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED, 'isShowData' => false]);
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
        $decisionNumberSample = $this->decisionNumberSampleRepository->find($id);

        return $this->success($decisionNumberSample, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $attributes = $request->all();

        if (!empty($attributes['type'])) {
            $attributes['type'] = array_key_exists($attributes['type'], DecisionNumberSample::TYPE) ? DecisionNumberSample::TYPE[$attributes['type']] : 'Empty';
        }
        
        $decisionNumberSample = $this->decisionNumberSampleRepository->getDecisionNumberSample($attributes);

        return $this->success($decisionNumberSample, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request $request
     * @param  string $id
     *
     * @return Response
     */
    public function update(DecisionNumberSampleUpdateRequest $request, $id)
    {
        $decisionNumberSample = $this->decisionNumberSampleRepository->update($request->all(), $id);

        return $this->success([], trans('lang::messages.common.modifySuccess'), ['isShowData' => false]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->decisionNumberSampleRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT, 'isShowData' => false]);
    }
}
