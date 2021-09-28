<?php

namespace GGPHP\Crm\CustomerLead\Http\Controllers;

use GGPHP\Crm\CustomerLead\Http\Requests\CustomerTagCreateRequest;
use GGPHP\Crm\CustomerLead\Repositories\Contracts\CustomerTagRepository;
use GGPHP\Core\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CustomerTagController extends Controller
{

    protected $customerTagRepository;

    public function __construct(CustomerTagRepository $customerTagRepository)
    {
        $this->customerTagRepository = $customerTagRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $customerTag = $this->customerTagRepository->getCustomerTag($request->all());

        return $this->success($customerTag, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CustomerTagCreateRequest $request)
    {
        $credentials = $request->all();

        $customerTag = $this->customerTagRepository->create($credentials);

        return $this->success($customerTag, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }
}
