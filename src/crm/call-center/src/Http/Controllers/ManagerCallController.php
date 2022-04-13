<?php

namespace GGPHP\Crm\CallCenter\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\CallCenter\Http\Requests\CreateManagerCallRequest;
use GGPHP\Crm\CallCenter\Repositories\Contracts\ManagerCallRepository;

class ManagerCallController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $managerCallRepository;

    /**
     * UserController constructor.
     * @param ManagerCallRepository $managerCallRepository
     */
    public function __construct(ManagerCallRepository $managerCallRepository)
    {
        $this->managerCallRepository = $managerCallRepository;
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

        $managerCall = $this->managerCallRepository->getManagerCall($attributes);

        return $this->success($managerCall, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateManagerCallRequest $request)
    {
        $attributes = $request->all();

        $managerCall = $this->managerCallRepository->create($attributes);

        return $this->success($managerCall, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $managerCall = $this->managerCallRepository->find($id);

        return $this->success($managerCall, trans('lang::messages.common.getInfoSuccess'));
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

        $managerCall = $this->managerCallRepository->update($attributes, $id);

        return $this->success($managerCall, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->managerCallRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }

    public function countCall(Request $request)
    {
        $count = $this->managerCallRepository->countCall($request->all());

        return $this->success($count, trans('lang::messages.common.getListSuccess'));
    }

    public function statisticCustomerLead(Request $request)
    {
        $statistics = $this->managerCallRepository->statisticCustomerLead($request->all());

        return $this->success($statistics, trans('lang::messages.common.getListSuccess'));
    }
}
