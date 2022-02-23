<?php

namespace GGPHP\Crm\AdmissionRegister\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\AdmissionRegister\Http\Requests\CreateParentInfoRequest;
use GGPHP\Crm\AdmissionRegister\Http\Requests\UpdateParentInfoRequest;
use GGPHP\Crm\AdmissionRegister\Repositories\Contracts\ParentInfoRepository;

class ParentInfoController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $parentInfoRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(ParentInfoRepository $parentInfoRepository)
    {
        $this->parentInfoRepository = $parentInfoRepository;
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

        $parentInfo = $this->parentInfoRepository->getAll($attributes);

        return $this->success($parentInfo, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateParentInfoRequest $request)
    {
        $attributes = $request->all();

        $parentInfo = $this->parentInfoRepository->createOrUpdate($attributes);

        return $this->success($parentInfo, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $parentInfo = $this->parentInfoRepository->find($id);

        return $this->success($parentInfo, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateParentInfoRequest $request, $id)
    {
        $attributes = $request->all();

        $parentInfo = $this->parentInfoRepository->update($attributes, $id);

        return $this->success($parentInfo, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->parentInfoRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
