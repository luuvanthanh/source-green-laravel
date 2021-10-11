<?php

namespace GGPHP\Crm\CustomerPotential\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\CustomerPotential\Http\Requests\CustomerPotentialTagCreateRequest;
use GGPHP\Crm\CustomerPotential\Repositories\Contracts\CustomerPotentialTagRepository;
use Illuminate\Http\Response;

class CustomerPotentialTagController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $customerPotentialTagRepository;

    /**
     * UserController constructor.
     * @param PotentialStudentInfoRepository $inOutHistoriesRepository
     */
    public function __construct(CustomerPotentialTagRepository $customerPotentialTagRepository)
    {
        $this->customerPotentialTagRepository = $customerPotentialTagRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $customerPotentialTag = $this->customerPotentialTagRepository->getAll($request->all());

        return $this->success($customerPotentialTag, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CustomerPotentialTagCreateRequest $request)
    {
        $attributes = $request->all();

        $customerPotentialTag = $this->customerPotentialTagRepository->create($attributes);

        return $this->success($customerPotentialTag, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }
}
