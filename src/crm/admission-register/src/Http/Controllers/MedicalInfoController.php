<?php

namespace GGPHP\Crm\AdmissionRegister\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\AdmissionRegister\Http\Requests\MedicalInfoCreateRequest;
use GGPHP\Crm\AdmissionRegister\Repositories\Contracts\MedicalInfoRepository;

class MedicalInfoController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $medicalInfoRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(MedicalInfoRepository $medicalInfoRepository)
    {
        $this->medicalInfoRepository = $medicalInfoRepository;
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

        $medicalInfo = $this->medicalInfoRepository->getAll($attributes);

        return $this->success($medicalInfo, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(MedicalInfoCreateRequest $request)
    {
        $attributes = $request->all();

        $medicalInfo = $this->medicalInfoRepository->create($attributes);

        return $this->success($medicalInfo, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $medicalInfo = $this->medicalInfoRepository->find($id);

        return $this->success($medicalInfo, trans('lang::messages.common.getInfoSuccess'));
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

        $medicalInfo = $this->medicalInfoRepository->update($attributes, $id);

        return $this->success($medicalInfo, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->medicalInfoRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
