<?php

namespace GGPHP\Crm\CustomerLead\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Crm\CustomerLead\Http\Requests\CreateCustomerLeadAccountRequest;
use GGPHP\Crm\CustomerLead\Http\Requests\CreateCustomerLeadRequest;
use GGPHP\Crm\CustomerLead\Http\Requests\CreateEmployeeAssignmentRequest;
use GGPHP\Crm\CustomerLead\Http\Requests\UpdateCustomerLeadRequest;
use GGPHP\Crm\CustomerLead\Imports\CustomerLeadImport;
use GGPHP\Crm\CustomerLead\Models\CustomerLead;
use GGPHP\Crm\CustomerLead\Models\StatusLead;
use GGPHP\Crm\CustomerLead\Repositories\Contracts\CustomerLeadRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Storage;

class CustomerLeadController extends Controller
{
    /**
     * 
     * @var $employeeRepository
     */
    protected $customerLeadRepository;

    /**
     * UserController constructor.
     * @param ReviewRepository $inOutHistoriesRepository
     */
    public function __construct(CustomerLeadRepository $customerLeadRepository)
    {
        $this->customerLeadRepository = $customerLeadRepository;
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
        if (!empty($attributes['status_lead'])) {
            $attributes['status_lead'] = StatusLead::STATUS_LEAD[$attributes['status_lead']];
        }

        $customerLead = $this->customerLeadRepository->getCustomerLead($attributes);

        return $this->success($customerLead, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateCustomerLeadRequest $request)
    {
        $attributes = $request->all();

        if (isset($attributes['employee_info'])) {
            $attributes['employee_info'] = json_encode($attributes['employee_info']);
        }

        if (isset($attributes['user_create_info'])) {
            $attributes['user_create_info'] = json_encode($attributes['user_create_info']);
        }

        if (!empty($attributes['sex'])) {
            $attributes['sex'] = CustomerLead::SEX[$attributes['sex']];
        }

        $customerLead = $this->customerLeadRepository->create($attributes);

        return $this->success($customerLead, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\news  $news
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $customerLead = $this->customerLeadRepository->find($id);

        return $this->success($customerLead, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\news  $news
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateCustomerLeadRequest $request, $id)
    {
        $credentials = $request->all();

        if (isset($credentials['employee_info'])) {
            $credentials['employee_info'] = json_encode($credentials['employee_info']);
        }

        if (isset($credentials['user_create_info'])) {
            $credentials['user_create_info'] = json_encode($credentials['user_create_info']);
        }

        if (!empty($credentials['sex'])) {
            $credentials['sex'] = CustomerLead::SEX[$credentials['sex']];
        }

        $customerLead = $this->customerLeadRepository->update($credentials, $id);

        return $this->success($customerLead, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\news  $CustomerLead
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->customerLeadRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }

    public function storeEmployeeAssignment(CreateEmployeeAssignmentRequest $request)
    {
        $customerLead = $this->customerLeadRepository->createEmployeeAssignment($request->all());

        return $this->success($customerLead, trans('lang::messages.common.modifySuccess'));
    }

    public function mergeCustomerLead(Request $request)
    {
        $attributes = $request->all();

        if (!empty($attributes['sex'])) {
            $attributes['sex'] = CustomerLead::SEX[$attributes['sex']];
        }
        $customerLead = $this->customerLeadRepository->mergeCustomerLead($attributes);

        return $this->success($customerLead, trans('lang::messages.common.modifySuccess'));
    }

    public function moveToCustomerPotential(Request $request)
    {
        $this->customerLeadRepository->moveToCustomerPotential($request->all());

        return $this->success([], trans('lang::messages.common.movedSuccess'));
    }

    public function storeCareProgram(Request $request)
    {
        $customerLead = $this->customerLeadRepository->storeCareProgram($request->all());

        return $this->success($customerLead, trans('lang::messages.common.modifySuccess'));
    }

    public function customerLeadAccount(CreateCustomerLeadAccountRequest $request)
    {
        $customerLead = $this->customerLeadRepository->customerLeadAccount($request->all());

        return $this->success($customerLead, trans('lang::messages.common.modifySuccess'));
    }

    public function getCustomerLead($id)
    {
        $customerLead = $this->customerLeadRepository->findCustomerLead($id);

        return $this->success($customerLead, trans('lang::messages.common.getInfoSuccess'));
    }

    public function customerByPhone($phone)
    {
        $customerLead = $this->customerLeadRepository->customerByPhone($phone);

        return $this->success($customerLead, trans('lang::messages.common.getInfoSuccess'));
    }

    public function importExcelCustomerLead()
    {
        Excel::import(new CustomerLeadImport(), request()->file('file'));

        return $this->success(['data' =>  'Import thành công'], trans('lang::messages.common.createSuccess'));
    }

    public function templateExcelCustomerLead()
    {
        return Storage::disk('local')->download('excel-exporter/templates' . '/' . 'template-customer-lead.xlsx');
    }
}
