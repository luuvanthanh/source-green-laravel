<?php

namespace GGPHP\Crm\CustomerPotential\Http\Controllers;

use GGPHP\Crm\CustomerPotential\Http\Requests\CustomerPotentialEventInfoCreateRequest;
use GGPHP\Crm\CustomerPotential\Http\Requests\CustomerPotentialEventInfoDeleteRequest;
use GGPHP\Crm\CustomerPotential\Http\Requests\CustomerPotentialEventInfoUpdateRequest;
use GGPHP\Crm\CustomerPotential\Repositories\Contracts\CustomerPotentialEventInfoRepository;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CustomerPotentialEventInfoController extends Controller
{

    protected $customerPotentialEventInfoRepository;

    public function __construct(CustomerPotentialEventInfoRepository $customerPotentialEventInfoRepository)
    {
        $this->customerPotentialEventInfoRepository = $customerPotentialEventInfoRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $customerPotentialEventInfo = $this->customerPotentialEventInfoRepository->getCustomerPotentialEventInfo($request->all());

        return $this->success($customerPotentialEventInfo, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CustomerPotentialEventInfoCreateRequest $request)
    {
        $credentials = $request->all();

        $customerPotentialEventInfo = $this->customerPotentialEventInfoRepository->create($credentials);

        return $this->success($customerPotentialEventInfo, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $customerPotentialEventInfo = $this->customerPotentialEventInfoRepository->find($id);

        return $this->success($customerPotentialEventInfo, trans('lang::messages.common.getInfoSuccess'));
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(CustomerPotentialEventInfoUpdateRequest $request, $id)
    {
        $credentials = $request->all();

        $customerPotentialEventInfo = $this->customerPotentialEventInfoRepository->update($credentials, $id);

        return $this->success($customerPotentialEventInfo, trans('lang::messages.common.modifySuccess'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(CustomerPotentialEventInfoDeleteRequest $request, $id)
    {
        $this->customerPotentialEventInfoRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
