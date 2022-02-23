<?php

namespace GGPHP\Crm\CustomerPotential\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\CustomerPotential\Http\Requests\CustomerPotentialStatusCareRequest;
use GGPHP\Crm\CustomerPotential\Repositories\Contracts\CustomerPotentialStatusCareRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CustomerPotentialStatusCareController extends Controller
{

    protected $customerPotentialStatusCareRepository;

    public function __construct(CustomerPotentialStatusCareRepository $customerPotentialStatusCareRepository)
    {
        $this->customerPotentialStatusCareRepository = $customerPotentialStatusCareRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $statusCare = $this->customerPotentialStatusCareRepository->getAll($request->all());

        return $this->success($statusCare, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CustomerPotentialStatusCareRequest $request)
    {
        $attributes = $request->all();

        if (isset($attributes['user_update_info'])) {
            $attributes['user_update_info'] = json_encode($attributes['user_update_info']);
        }

        $statusCare = $this->customerPotentialStatusCareRepository->create($attributes);

        return $this->success($statusCare, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->customerPotentialStatusCareRepository->delete($id);

        return $this->success([], trans('lang::messages.common.deleteSuccess'));
    }
}
