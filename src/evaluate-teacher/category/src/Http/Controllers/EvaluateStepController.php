<?php

namespace GGPHP\EvaluateTeacher\Category\Http\Controllers;

use GGPHP\EvaluateTeacher\Category\Http\Requests\EvaluateStepCreateRequest;
use GGPHP\EvaluateTeacher\Category\Http\Requests\EvaluateStepDeleteRequest;
use GGPHP\EvaluateTeacher\Category\Http\Requests\EvaluateStepUpdateRequest;
use GGPHP\EvaluateTeacher\Category\Repositories\Contracts\EvaluateStepRepository;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class EvaluateStepController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $evaluateStepRepository;

    /**
     * UserController constructor.
     * @param EvaluateStepRepository $evaluateStepRepository
     */
    public function __construct(EvaluateStepRepository $evaluateStepRepository)
    {
        $this->evaluateStepRepository = $evaluateStepRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $evaluateSteps = $this->evaluateStepRepository->getEvaluateStep($request->all());

        return $this->success($evaluateSteps, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(EvaluateStepCreateRequest $request)
    {
        $credentials = $request->all();
        $evaluateStep = $this->evaluateStepRepository->create($credentials);
        return $this->success($evaluateStep, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $evaluateStep = $this->evaluateStepRepository->find($id);
        return $this->success($evaluateStep, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param EvaluateStepUpdateRequest $request
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function update(EvaluateStepUpdateRequest $request, $id)
    {
        $credentials = $request->all();
        $evaluateStep = $this->evaluateStepRepository->update($credentials, $id);
        return $this->success($evaluateStep, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(EvaluateStepDeleteRequest $request, $id)
    {
        $this->evaluateStepRepository->delete($id);
        return $this->success([], trans('lang::messages.common.deleteSuccess'), ['code' => Response::HTTP_NO_CONTENT]);
    }
}
