<?php

namespace GGPHP\Crm\Clover\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\Clover\Http\Requests\CreateEmployeeHrmRequest;
use GGPHP\Crm\Clover\Http\Requests\UpdateEmployeeHrmRequest;
use GGPHP\Crm\Clover\Repositories\Contracts\EmployeeHrmRepository;

class EmployeeHrmController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $employeeHrmRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(EmployeeHrmRepository $employeeHrmRepository)
    {
        $this->employeeHrmRepository = $employeeHrmRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $EmployeeHrm = $this->employeeHrmRepository->getAll($request->all());

        return $this->success($EmployeeHrm, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $credentials = $request->all();

        $EmployeeHrm = $this->employeeHrmRepository->create($credentials);

        return $this->success($EmployeeHrm, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $EmployeeHrm = $this->employeeHrmRepository->find($id);

        return $this->success($EmployeeHrm, trans('lang::messages.common.getInfoSuccess'));
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
        $credentials = $request->all();

        $EmployeeHrm = $this->employeeHrmRepository->update($credentials, $id);

        return $this->success($EmployeeHrm, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->employeeHrmRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
