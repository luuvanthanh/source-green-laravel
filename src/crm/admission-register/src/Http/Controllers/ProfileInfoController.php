<?php

namespace GGPHP\Crm\AdmissionRegister\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\AdmissionRegister\Http\Requests\CreateProfileInfoRequest;
use GGPHP\Crm\AdmissionRegister\Repositories\Contracts\ProfileInfoRepository;

class ProfileInfoController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $profileInfoRepository;

    /**
     * UserController constructor.
     * @param StatusParentLeadRepository $inOutHistoriesRepository
     */
    public function __construct(ProfileInfoRepository $profileInfoRepository)
    {
        $this->profileInfoRepository = $profileInfoRepository;
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

        $profileInfo = $this->profileInfoRepository->getAll($attributes);

        return $this->success($profileInfo, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateProfileInfoRequest $request)
    {
        $attributes = $request->all();

        $profileInfo = $this->profileInfoRepository->createOrUpdate($attributes);

        return $this->success($profileInfo, trans('lang::messages.common.createSuccess'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $profileInfo = $this->profileInfoRepository->find($id);

        return $this->success($profileInfo, trans('lang::messages.common.getInfoSuccess'));
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

        $profileInfo = $this->profileInfoRepository->update($attributes, $id);

        return $this->success($profileInfo, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->profileInfoRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
