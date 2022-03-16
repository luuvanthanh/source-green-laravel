<?php

namespace GGPHP\EvaluateTeacher\Category\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\EvaluateTeacher\Category\Contracts\EvaluateTypeRepository;
use GGPHP\EvaluateTeacher\Category\Http\Requests\EvaluateTypeCreateRequest;
use GGPHP\EvaluateTeacher\Category\Http\Requests\EvaluateTypeDeleteRequest;
use GGPHP\EvaluateTeacher\Category\Http\Requests\EvaluateTypeUpdateRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class EvaluateTypeController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $evaluateTypeRepository;

    /**
     * UserController constructor.
     * @param evaluateTypeRepository $evaluateTypeRepository
     */
    public function __construct(EvaluateTypeRepository $evaluateTypeRepository)
    {
        $this->evaluateTypeRepository = $evaluateTypeRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $evaluateType = $this->evaluateTypeRepository->getAll($request->all());

        return $this->success($evaluateType, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(EvaluateTypeCreateRequest $request)
    {
        $credentials = $request->all();
        $evaluateType = $this->evaluateTypeRepository->create($credentials);

        return $this->success($evaluateType, trans('lang::messages.auth.registerSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $evaluateType = $this->evaluateTypeRepository->find($id);

        return $this->success($evaluateType, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param evaluateTypeUpdateRequest $request
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function update(EvaluateTypeUpdateRequest $request, $id)
    {
        $credentials = $request->all();
        $evaluateType = $this->evaluateTypeRepository->update($credentials, $id);

        return $this->success($evaluateType, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(EvaluateTypeDeleteRequest $request, $id)
    {
        $this->evaluateTypeRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
