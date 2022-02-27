<?php

namespace GGPHP\Crm\CallCenter\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\CallCenter\Repositories\Contracts\CallCenterRepository;

class CallCenterController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $callCenterRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(CallCenterRepository $callCenterRepository)
    {
        $this->callCenterRepository = $callCenterRepository;
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

        $callCenter = $this->callCenterRepository->getCallCenter($attributes);

        return $this->success($callCenter, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $attributes = $request->all();

        $callCenter = $this->callCenterRepository->create($attributes);

        return $this->success($callCenter, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $callCenter = $this->callCenterRepository->find($id);

        return $this->success($callCenter, trans('lang::messages.common.getInfoSuccess'));
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

        $callCenter = $this->callCenterRepository->update($attributes, $id);

        return $this->success($callCenter, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->callCenterRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
