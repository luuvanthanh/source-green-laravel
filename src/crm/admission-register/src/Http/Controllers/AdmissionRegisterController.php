<?php

namespace GGPHP\Crm\AdmissionRegister\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\AdmissionRegister\Http\Requests\CreateAdmissionRegisterRequest;
use GGPHP\Crm\AdmissionRegister\Http\Requests\UpdateAdmissionRegisterRequest;
use GGPHP\Crm\AdmissionRegister\Models\AdmissionRegister;
use GGPHP\Crm\AdmissionRegister\Models\ParentInfo;
use GGPHP\Crm\AdmissionRegister\Repositories\Contracts\AdmissionRegisterRepository;

class AdmissionRegisterController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $admissionRegisterRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(AdmissionRegisterRepository $admissionRegisterRepository)
    {
        $this->admissionRegisterRepository = $admissionRegisterRepository;
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

        $admissionRegister = $this->admissionRegisterRepository->getAll($attributes);

        return $this->success($admissionRegister, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateAdmissionRegisterRequest $request)
    {
        $attributes = $request->all();

        if (!empty($attributes['parent_info']) && !empty($attributes['parent_info']['sex'])) {
            $attributes['parent_info']['sex'] = ParentInfo::SEX[$attributes['parent_info']['sex']];
        }

        $admissionRegister = $this->admissionRegisterRepository->create($attributes);

        return $this->success($admissionRegister, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $admissionRegister = $this->admissionRegisterRepository->find($id);

        return $this->success($admissionRegister, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateAdmissionRegisterRequest $request, $id)
    {
        $attributes = $request->all();

        if (!empty($attributes['register_status'])) {
            $attributes['register_status'] = AdmissionRegister::REGISTER_STATUS[$attributes['register_status']];
        }

        if (!empty($attributes['parent_info']) && !empty($attributes['parent_info']['sex'])) {
            $attributes['parent_info']['sex'] = ParentInfo::SEX[$attributes['parent_info']['sex']];
        }

        $admissionRegister = $this->admissionRegisterRepository->update($attributes, $id);

        return $this->success($admissionRegister, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->admissionRegisterRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
