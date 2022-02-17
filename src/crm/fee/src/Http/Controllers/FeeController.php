<?php

namespace GGPHP\Crm\Fee\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Crm\Fee\Repositories\Contracts\FeeRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class FeeController extends Controller
{
    /**
     * 
     * @var $employeeRepository
     */
    protected $feeRepository;

    /**
     * UserController constructor.
     * @param ReviewRepository $inOutHistoriesRepository
     */
    public function __construct(FeeRepository $feeRepository)
    {
        $this->feeRepository = $feeRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $fee = $this->feeRepository->getFee($request->all());

        return $this->success($fee, trans('lang::messages.common.getListSuccess'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $attributes = $request->all();
        $fee = $this->feeRepository->create($attributes);

        return $this->success($fee, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\news  $news
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $fee = $this->feeRepository->find($id);

        return $this->success($fee, trans('lang::messages.common.getInfoSuccess'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\news  $news
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $credentials = $request->all();

        $fee = $this->feeRepository->update($credentials, $id);

        return $this->success($fee, trans('lang::messages.common.modifySuccess'));
    }

    public function getFeeClover()
    {
        $this->feeRepository->getFeeClover();

        return $this->success([], trans('lang::messages.common.getListSuccess'));
    }
}
