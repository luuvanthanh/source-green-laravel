<?php

namespace GGPHP\Crm\CustomerPotential\Http\Controllers;

use Illuminate\Http\Request;
use GGPHP\Core\Http\Controllers\Controller;
use GGPHP\Crm\CustomerPotential\Http\Requests\CreatePotentialStudentInfoRequest;
use GGPHP\Crm\CustomerPotential\Repositories\Contracts\PotentialStudentInfoRepository;
use Illuminate\Http\Response;

class PotentialStudentInfoController extends Controller
{
    /**
     * @var $employeeRepository
     */
    protected $potentialStudentInfoRepository;

    /**
     * UserController constructor.
     * @param PotentialStudentInfoRepository $inOutHistoriesRepository
     */
    public function __construct(PotentialStudentInfoRepository $potentialStudentInfoRepository)
    {
        $this->potentialStudentInfoRepository = $potentialStudentInfoRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $customerPotential = $this->potentialStudentInfoRepository->getPotentailStudentInfo($request->all());

        return $this->success($customerPotential, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CreatePotentialStudentInfoRequest $request)
    {
        $attributes = $request->all();

        $potentialStudentInfo = $this->potentialStudentInfoRepository->create($attributes);

        return $this->success($potentialStudentInfo, trans('lang::messages.common.createSuccess'),['code' => Response::HTTP_CREATED]);
    }
}
