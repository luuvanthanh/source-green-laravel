<?php

namespace GGPHP\Crm\Fee\Http\Controllers;

use App\Http\Controllers\Controller;
use GGPHP\Crm\Fee\Repositories\Contracts\FeePolicieRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class FeePolicieController extends Controller
{
    /**
     * 
     * @var $employeeRepository
     */
    protected $feePolicieRepository;

    /**
     * UserController constructor.
     * @param ReviewRepository $inOutHistoriesRepository
     */
    public function __construct(FeePolicieRepository $feePolicieRepository)
    {
        $this->feePolicieRepository = $feePolicieRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $feePolicie = $this->feePolicieRepository->getFeePolicie($request->all());

        return $this->success($feePolicie, trans('lang::messages.common.getListSuccess'));
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
        $feePolicie = $this->feePolicieRepository->create($attributes);

        return $this->success($feePolicie, trans('lang::messages.common.createSuccess'), ['code' => Response::HTTP_CREATED]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\news  $news
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $feePolicie = $this->feePolicieRepository->find($id);

        return $this->success($feePolicie, trans('lang::messages.common.getInfoSuccess'));
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

        $feePolicie = $this->feePolicieRepository->update($credentials, $id);

        return $this->success($feePolicie, trans('lang::messages.common.modifySuccess'));
    }

    public function getFeePolicieClover()
    {
        $this->feePolicieRepository->getFeePolicieClover();

        return $this->success([], trans('lang::messages.common.getListSuccess'));
    }
}
