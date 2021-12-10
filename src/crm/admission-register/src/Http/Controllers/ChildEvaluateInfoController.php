<?php

namespace GGPHP\Crm\AdmissionRegister\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\AdmissionRegister\Http\Requests\CreateChildEvaluateInfoRequest;
use GGPHP\Crm\AdmissionRegister\Repositories\Contracts\ChildEvaluateInfoRepository;

class ChildEvaluateInfoController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $childEvaluateInfoRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(ChildEvaluateInfoRepository $childEvaluateInfoRepository)
    {
        $this->childEvaluateInfoRepository = $childEvaluateInfoRepository;
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

        $childEvaluateInfo = $this->childEvaluateInfoRepository->getAll($attributes);

        return $this->success($childEvaluateInfo, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateChildEvaluateInfoRequest $request)
    {
        $attributes = $request->all();

        $childEvaluateInfo = $this->childEvaluateInfoRepository->create($attributes);

        return $this->success($childEvaluateInfo, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $childEvaluateInfo = $this->childEvaluateInfoRepository->find($id);

        return $this->success($childEvaluateInfo, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $attributes = $request->all();

        $childEvaluateInfo = $this->childEvaluateInfoRepository->update($attributes, $id);

        return $this->success($childEvaluateInfo, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->childEvaluateInfoRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
