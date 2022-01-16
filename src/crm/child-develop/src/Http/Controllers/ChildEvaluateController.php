<?php

namespace GGPHP\Crm\ChildDevelop\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\ChildDevelop\Http\Requests\ChildEvaluateCreateRequest;
use GGPHP\Crm\ChildDevelop\Http\Requests\ChildEvaluateUpdateRequest;
use GGPHP\Crm\ChildDevelop\Models\ChildEvaluate;
use GGPHP\Crm\ChildDevelop\Repositories\Contracts\ChildEvaluateRepository;

class ChildEvaluateController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $childEvaluateRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(ChildEvaluateRepository $childEvaluateRepository)
    {
        $this->childEvaluateRepository = $childEvaluateRepository;
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

        if (!empty($attributes['age'])) {
            $attributes['age'] = ChildEvaluate::MONTH[$attributes['age']];
        }
        $ChildEvaluate = $this->childEvaluateRepository->getAll($attributes);

        return $this->success($ChildEvaluate, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ChildEvaluateCreateRequest $request)
    {
        $attributes = $request->all();

        $ChildEvaluate = $this->childEvaluateRepository->create($attributes);

        return $this->success($ChildEvaluate, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $ChildEvaluate = $this->childEvaluateRepository->find($id);

        return $this->success($ChildEvaluate, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(ChildEvaluateUpdateRequest $request, $id)
    {
        $attributes = $request->all();

        $ChildEvaluate = $this->childEvaluateRepository->update($attributes, $id);

        return $this->success($ChildEvaluate, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->childEvaluateRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
