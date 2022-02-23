<?php

namespace GGPHP\Crm\CustomerPotential\Http\Controllers;

use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\CustomerPotential\Http\Requests\CreateCustomerPotentialReferenceRequest;
use GGPHP\Crm\CustomerPotential\Repositories\Contracts\CustomerPotentialReferenceRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CustomerPotentialReferenceController extends Controller
{
    protected $customerPotentialReferenceRepository;

    public function __construct(CustomerPotentialReferenceRepository $customerPotentialReferenceRepository)
    {
        $this->customerPotentialReferenceRepository = $customerPotentialReferenceRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $customerPotentialReference = $this->customerPotentialReferenceRepository->getAll($request->all());

        return $this->success($customerPotentialReference, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreateCustomerPotentialReferenceRequest $request)
    {
        try {
            $credentials = $request->all();
            $customerPotentialReference = $this->customerPotentialReferenceRepository->create($credentials);

            return $this->success($customerPotentialReference, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
        } catch (\Throwable $th) {
            return $this->error(trans('lang::messages.common.internalServerError'), $th->getMessage(), $th->getStatusCode());
        }
    }
}
