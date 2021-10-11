<?php

namespace GGPHP\Crm\CustomerPotentail\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\CustomerPotentail\Http\Requests\CreateCustomerPotentailRequest;
use GGPHP\Crm\CustomerPotentail\Http\Requests\UpdateCustomerPotentailRequest;
use GGPHP\Crm\CustomerPotentail\Models\CustomerPotentail;
use GGPHP\Crm\CustomerPotentail\Repositories\Contracts\CustomerPotentailRepository;

class CustomerPotentailController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $customerPotentailRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(CustomerPotentailRepository $customerPotentailRepository)
    {
        $this->customerPotentailRepository = $customerPotentailRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $customerPotentail = $this->customerPotentailRepository->getAll($request->all());

        return $this->success($customerPotentail, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateCustomerPotentailRequest $request)
    {
        $attributes = $request->all();

        if (isset($attributes['employee_info'])) {
            $attributes['employee_info'] = json_encode($attributes['employee_info']);
        }

        if (isset($attributes['user_create_info'])) {
            $attributes['user_create_info'] = json_encode($attributes['user_create_info']);
        }

        if (!empty($attributes['sex'])) {
            $attributes['sex'] = CustomerPotentail::SEX[$attributes['sex']];
        }

        $customerPotentail = $this->customerPotentailRepository->create($attributes);

        return $this->success($customerPotentail, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $customerPotentail = $this->customerPotentailRepository->find($id);

        return $this->success($customerPotentail, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateCustomerPotentailRequest $request, $id)
    {
        $credentials = $request->all();

        if (isset($credentials['employee_info'])) {
            $credentials['employee_info'] = json_encode($credentials['employee_info']);
        }

        if (isset($credentials['user_create_info'])) {
            $credentials['user_create_info'] = json_encode($credentials['user_create_info']);
        }

        $customerPotentail = $this->customerPotentailRepository->update($credentials, $id);

        return $this->success($customerPotentail, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->customerPotentailRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
