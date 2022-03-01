<?php

namespace GGPHP\Crm\Employee\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\Employee\Http\Requests\CreateEmployeeRequest;
use GGPHP\Crm\Employee\Http\Requests\UpdateEmployeeRequest;
use GGPHP\Crm\Employee\Models\Employee;
use GGPHP\Crm\Employee\Repositories\Contracts\EmployeeRepository;

class EmployeeController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $employeeRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(EmployeeRepository $employeeRepository)
    {
        $this->employeeRepository = $employeeRepository;
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

        $employee = $this->employeeRepository->getAll($attributes);

        return $this->success($employee, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateEmployeeRequest $request)
    {
        $attributes = $request->all();

        $employee = $this->employeeRepository->create($attributes);

        return $this->success($employee, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $employee = $this->employeeRepository->find($id);

        return $this->success($employee, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateEmployeeRequest $request, $id)
    {
        $attributes = $request->all();

        $employee = $this->employeeRepository->update($attributes, $id);

        return $this->success($employee, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->employeeRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }

    public function syncEmployee(Request $request)
    {
        $employee = $this->employeeRepository->syncEmployee($request->all());

        return $this->success($employee, trans('lang::messages.common.modifySuccess'));
    }
}
