<?php

namespace GGPHP\ChildDevelop\ChildEvaluate\Http\Controllers;

use GGPHP\ChildDevelop\ChildEvaluate\Http\Requests\ChildEvaluateCreateRequest;
use GGPHP\ChildDevelop\ChildEvaluate\Http\Requests\ChildEvaluateUpdateRequest;
use GGPHP\ChildDevelop\ChildEvaluate\Models\ChildEvaluate;
use GGPHP\ChildDevelop\ChildEvaluate\Repositories\Contracts\ChildEvaluateRepository;
use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;

class ChildEvaluateController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $ChildEvaluateRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(ChildEvaluateRepository $ChildEvaluateRepository)
    {
        $this->ChildEvaluateRepository = $ChildEvaluateRepository;
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
        $ChildEvaluate = $this->ChildEvaluateRepository->getAll($attributes);

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

        $ChildEvaluate = $this->ChildEvaluateRepository->create($attributes);

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
        $ChildEvaluate = $this->ChildEvaluateRepository->find($id);

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

        $ChildEvaluate = $this->ChildEvaluateRepository->update($attributes, $id);

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
        $this->ChildEvaluateRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }

    public function updateIsUse(Request $request, $id)
    {
        $attributes = $request->all();

        $ChildEvaluate = $this->ChildEvaluateRepository->updateIsUse($attributes, $id);

        return $this->success($ChildEvaluate, trans('lang::messages.common.modifySuccess'));
    }
}
