<?php

namespace GGPHP\Crm\CustomerPotential\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\CustomerLead\Http\Requests\CreateEmployeeAssignmentRequest;
use GGPHP\Crm\CustomerPotential\Http\Requests\CreateCustomerPotentialRequest;
use GGPHP\Crm\CustomerPotential\Http\Requests\UpdateCustomerPotentialRequest;
use GGPHP\Crm\CustomerPotential\Models\CustomerPotential;
use GGPHP\Crm\CustomerPotential\Repositories\Contracts\CustomerPotentialRepository;

class CustomerPotentialController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $customerPotentialRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(CustomerPotentialRepository $customerPotentialRepository)
    {
        $this->customerPotentialRepository = $customerPotentialRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $customerPotential = $this->customerPotentialRepository->getAll($request->all());

        return $this->success($customerPotential, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateCustomerPotentialRequest $request)
    {
        $attributes = $request->all();

        if (isset($attributes['employee_info'])) {
            $attributes['employee_info'] = json_encode($attributes['employee_info']);
        }

        if (isset($attributes['user_create_info'])) {
            $attributes['user_create_info'] = json_encode($attributes['user_create_info']);
        }

        if (!empty($attributes['sex'])) {
            $attributes['sex'] = CustomerPotential::SEX[$attributes['sex']];
        }

        $customerPotential = $this->customerPotentialRepository->create($attributes);

        return $this->success($customerPotential, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $customerPotential = $this->customerPotentialRepository->find($id);

        return $this->success($customerPotential, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateCustomerPotentialRequest $request, $id)
    {
        $credentials = $request->all();

        if (isset($credentials['employee_info'])) {
            $credentials['employee_info'] = json_encode($credentials['employee_info']);
        }

        if (isset($credentials['user_create_info'])) {
            $credentials['user_create_info'] = json_encode($credentials['user_create_info']);
        }

        $customerPotential = $this->customerPotentialRepository->update($credentials, $id);

        return $this->success($customerPotential, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->customerPotentialRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }

    public function storeEmployeeAssignment(CreateEmployeeAssignmentRequest $request)
    {
        $customerPotential = $this->customerPotentialRepository->createEmployeeAssignment($request->all());

        return $this->success($customerPotential, trans('lang::messages.common.modifySuccess'));
    }
}
